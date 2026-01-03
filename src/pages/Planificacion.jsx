import { useEffect, useMemo, useState } from "react";
import { useAsignaciones } from "../hooks/useAsignaciones";
import { useLocalidades } from "../hooks/useLocalidades";
import { useEmpleados } from "../hooks/useEmpleados";
import FiltroFecha from "../components/ui/Filtros/FiltroFecha"
// ✅ Ajustá este import según tu ruta real:
import PlanificacionTablaLocalidad from "../components/ui/PlanificacionTabla"; 
// (Tu componente export default function PlanificacionTablaLocalidad(...) )

function toYMD(date) {
  if (!date) return "";
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}


function dayLabel(date) {
  // Inicial del día: D L M M J V S
  const map = ["D", "L", "M", "M", "J", "V", "S"];
  const d = new Date(date);
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  return `${map[d.getDay()]} ${dd}/${mm}`;
}

// ====== para las fechas ======
const startOfDay = (d) => {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
};

const addDays = (date, n) => {
  const d = new Date(date);
  d.setDate(d.getDate() + n);
  return d;
};


// ====== Abreviaturas  ======
function abrev(asig) {
  if (!asig) return "";

  // Estado prioridad
  if ((asig.asignacion_estado || "").toUpperCase() === "Excedido") return "EXC";

  const motivo = (asig.turnos?.turno_motivo || "").toLowerCase();
  const turnoNombre = (asig.turnos?.turno_nombre || "").toLowerCase();
  const comentario = (asig.asignacion_comentario || "").toLowerCase();
  const txt = `${motivo} ${turnoNombre} ${comentario}`;

  if (txt.includes("licen")) return "LIC";
  if (txt.includes("capaci") || txt.includes("curso") || txt.includes("inducc")) return "CAP";
  if (txt.includes("feriad")) return "FER";
  if (txt.includes("descans") || txt.includes("franco")) return "DES";

  // Trabajo normal (usina/atención/guardia/etc.)
  if (asig.asignacion_estado!=="Excedido" && (txt.includes("usina") || txt.includes("atenc") || txt.includes("guard")|| txt.includes("trabaj"))) return "TRAB";

  // fallback
  return "NOR";
}

function renderCellLines(arrAsignaciones) {
  if (!arrAsignaciones || arrAsignaciones.length === 0) {
    return { lines: ["", "", ""], tooltip: "" };
  }

  // Generar labels
  const labels = arrAsignaciones
    .map(abrev)
    .filter(Boolean);

  // Prioridad para ordenar lo más importante arriba
  const priority = { EXC: 1, LIC: 2, CAP: 3, FER: 4, DES: 5, TRB: 6, NOR: 9 };
  labels.sort((a, b) => (priority[a] ?? 99) - (priority[b] ?? 99));

  const first2 = labels.slice(0, 2);
  const extra = labels.length - 2;
 // colores
  const mapped = arrAsignaciones.map((a) => {
    const code = abrev(a);
    return {
      a,
      code,
      p: priority[code] ?? 99,
      color: a.turnos?.turno_color || null,
    };
  });

  mapped.sort((x, y) => x.p - y.p);

  const top = mapped[0];
  const code = top.code;
  // Tooltip con detalle (abreviado + motivo + comentario)
  const tooltip = arrAsignaciones
    .map((a) => {
      const code = abrev(a);
      const m = a.turnos?.turno_motivo || a.turnos?.turno_nombre || "";
      const c = a.asignacion_comentario ? ` — ${a.asignacion_comentario}` : "";
      return `${code} - ${m}${c}`;
    })
    .join("\n");

  return {
    lines: [
      first2[0] || "",
      first2[1] || "",
      extra > 0 ? `+${extra}` : "",
    ],
    tooltip,
    bgColor: top.color,
  };
}

export default function Planificacion() {
  const { asignaciones, fetchAsignaciones, loading } = useAsignaciones();
  const { localidades } = useLocalidades();
  const { empleados } = useEmpleados();

  const [fechaDesde, setFechaDesde] = useState(() =>  startOfDay(addDays(new Date(), -30)));
  const [fechaHasta, setFechaHasta] = useState(() =>  startOfDay(addDays(new Date(), 30)));

  // Rango por defecto: 14 días desde hoy
  const [desde, setDesde] = useState(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return addDays(d, -60);
  });

  const [hasta, setHasta] = useState(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return addDays(d, 30);
  });

  // useEffect(() => {
  //   fetchAsignaciones();
  // }, []);

  // Días visibles en columnas
const days = useMemo(() => {
  const out = [];
  const start = new Date(fechaDesde); start.setHours(0, 0, 0, 0);
  const end = new Date(fechaHasta); end.setHours(0, 0, 0, 0);

  if (!fechaDesde || !fechaHasta) return out;
  if (end < start) return out;

  const diff = Math.round((end - start) / (1000 * 60 * 60 * 24));
  for (let i = 0; i <= diff; i++) out.push(addDays(start, i));
  return out;
}, [fechaDesde, fechaHasta]);

  // Índice principal:
  // grid: Map(locId -> Map(empId -> Map(dateYMD -> arrayAsignaciones[] )))
  const grid = useMemo(() => {
    const idx = new Map();

    for (const a of asignaciones) {
      const locId = Number(a.asignacion_localidad_id);
      const empId = Number(a.asignacion_empleado_id);

      const aStart = new Date(a.asignacion_fecha_desde); aStart.setHours(0,0,0,0);
      const aEnd = new Date(a.asignacion_fecha_hasta); aEnd.setHours(0,0,0,0);

      const locMap = idx.get(locId) ?? new Map();
      const empMap = locMap.get(empId) ?? new Map();

      const totalDays = Math.round((aEnd - aStart) / (1000 * 60 * 60 * 24));
      for (let i = 0; i <= totalDays; i++) {
        const d = addDays(aStart, i);
        const key = toYMD(d);

        // ✅ NO pisar: acumular arrays (porque puede haber 2 cosas el mismo día)
        const arr = empMap.get(key) ?? [];
        arr.push(a);
        empMap.set(key, arr);
      }

      locMap.set(empId, empMap);
      idx.set(locId, locMap);
    }

    return idx;
  }, [asignaciones]);

  // Empleados por localidad SEGÚN asignaciones en rango visible
  const empleadosPorLocalidadSegunAsignacion = useMemo(() => {
    const map = new Map();
    const start = new Date(desde); start.setHours(0,0,0,0);
    const end = new Date(hasta); end.setHours(0,0,0,0);

    for (const a of asignaciones) {
      const locId = Number(a.asignacion_localidad_id);
      const empId = Number(a.asignacion_empleado_id);

      const aStart = new Date(a.asignacion_fecha_desde); aStart.setHours(0,0,0,0);
      const aEnd = new Date(a.asignacion_fecha_hasta); aEnd.setHours(0,0,0,0);

      const seSuperpone = aEnd >= start && aStart <= end;
      if (!seSuperpone) continue;

      if (!map.has(locId)) map.set(locId, new Set());
      map.get(locId).add(empId);
    }

    return map; // locId -> Set(empId)
  }, [asignaciones, fechaDesde, fechaHasta]);

  const localidadesOrdenadas = useMemo(() => {
    return [...localidades].sort((a, b) =>
      (a.localidad_nombre ?? "").localeCompare(b.localidad_nombre ?? "")
    );
  }, [localidades]);

  if (loading) return <p className="p-4">Cargando...</p>;

  return (
    <div className="max-w-8xl mx-auto p-4 space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center">
        <h1 className="text-xl font-semibold">Planificación</h1>

        <div className="md:ml-auto flex flex-wrap items-center gap-2">
          <label className="text-sm text-gray-600">Desde</label>

            <FiltroFecha
              label="Desde"
              value={fechaDesde}
              onChange={(d) => setFechaDesde(d)}
              placeholder="Desde..."
            />

          <FiltroFecha
              label="Hasta"
              value={fechaHasta}
              onChange={(d) => setFechaHasta(d)}
              placeholder="Hasta..."
            />

        </div>
      </div>

      {/* Tablas por localidad */}
      <div className="space-y-6">
        {localidadesOrdenadas.map((loc) => {
          const locId = Number(loc.id_localidad);
          const locGrid = grid.get(locId) ?? new Map();

          const empIds = empleadosPorLocalidadSegunAsignacion.get(locId) ?? new Set();

          const emps = empleados
            .filter((e) => empIds.has(Number(e.id_empleado)))
            .sort((a, b) =>
              (a.empleado_nombre_apellido ?? "").localeCompare(b.empleado_nombre_apellido ?? "")
            );

          // si querés mostrar todas aunque estén vacías, sacá este if
          if (emps.length === 0) return null;
//nsole.log("render Planificacion", { loading, asignaciones: asignaciones?.length });

          return (
            <PlanificacionTablaLocalidad
              key={locId}
              localidadNombre={loc.localidad_nombre}
              days={days}
              empleados={emps}
              empMapByEmpId={locGrid}
              dayLabel={dayLabel}
              toYMD={toYMD}
              renderCellLines={renderCellLines}
            />
          );
        })}
      </div>
    </div>
  );
}
