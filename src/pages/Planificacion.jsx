import { useMemo, useState, useEffect } from "react";
import { useAsignaciones } from "../hooks/useAsignaciones";
import { useLocalidades } from "../hooks/useLocalidades";
import { useEmpleados } from "../hooks/useEmpleados";
import FiltroFecha from "../components/ui/Filtros/FiltroFecha";
import { Title, Subtitle } from "../components/ui/Typography"
import { Calendar } from "lucide-react"
import ReferenciaTurnos from "../components/ui/ReferenciasTurnos";
import ModalReferenciaTurnos from "../components/ui/ModalReferenciaTurnos";
import { useZonas } from "../hooks/useZonas";
import FiltroEmpleado from "../components/ui/Filtros/FiltroEmpleado";
import FiltroLocalidad from "../components/ui/Filtros/FiltroLocalidad";
import FiltroZona from "../components/ui/Filtros/FiltroZona";
import Button from "../components/ui/Button";
import { usePerfil } from "../hooks/usePerfil"
import PlanificacionTabla from "../components/ui/PlanificacionTabla";

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

// ====== Fechas helpers ======
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
  if ((asig.asignacion_estado || "").toUpperCase() === "EXCEDIDO") return "EXC";

  const motivo = (asig.turnos?.turno_motivo || "").toLowerCase();
  const turnoNombre = (asig.turnos?.turno_nombre || "").toLowerCase();
  const comentario = (asig.asignacion_comentario || "").toLowerCase();
  const txt = `${motivo} ${turnoNombre} ${comentario}`;
  const exced = (asig.asignacion_estado || "").toUpperCase();

  if (txt.includes("licen")) return "LIC";
  if (txt.includes("capaci") || txt.includes("curso") || txt.includes("inducc")) return "CAP";
  if (txt.includes("descans") || txt.includes("franco")) return "DES";

  // Trabajo normal (usina/atención/guardia/etc.)
  if (txt.includes("usina") || txt.includes("atenc") || txt.includes("guard") || txt.includes("trabaj")) return "TRAB";

  // fallback
  return "NOR";
}

function renderCellLines(arrAsignaciones) {
  if (!arrAsignaciones || arrAsignaciones.length === 0) {
    return { lines: ["", "", ""], tooltip: "", bgColor: null };
  }

  // ✅ como dijiste: NO puede haber más de 1 por día (pero por las dudas, soporta array)
  const labels = arrAsignaciones.map(abrev).filter(Boolean);

  // Prioridad para ordenar (si viniera más de una)
  const priority = { EXC: 1, LIC: 2, CAP: 3, FER: 4, DES: 5, TRAB: 6, NOR: 9 };
  labels.sort((a, b) => (priority[a] ?? 99) - (priority[b] ?? 99));

  const first2 = labels.slice(0, 2);
  const extra = labels.length - 2;

  const tooltip = arrAsignaciones
    .map((a) => {
      const code = abrev(a);
      const m = a.turnos?.turno_motivo || a.turnos?.turno_nombre || "";
      const c = a.asignacion_comentario ? ` — ${a.asignacion_comentario}` : "";
      return `${code} - ${m}${c}`;
    })
    .join("\n");

  // ✅ color de turno (tomamos el “principal”)
  const bgColor = arrAsignaciones[0]?.turnos?.turno_color || null;

  return {
    lines: [first2[0] || "", first2[1] || "", extra > 0 ? `+${extra}` : ""],
    tooltip,
    bgColor,
  };
}

export default function Planificacion() {
  const { asignaciones, loading } = useAsignaciones();
  const { localidades } = useLocalidades();
  const { empleados } = useEmpleados();
  const { zonas } = useZonas();
  // para perfil empleado no pueda acceder a otros empleados 
  const { perfil, loadingPerfil } = usePerfil()
  const isEmpleado = perfil?.perfil_rol === "Empleado"
  const empleadoIdPerfil = perfil?.perfil_id_empleado ? Number(perfil.perfil_id_empleado) : null
  // para perfil empleado no pueda acceder a otros empleados 
  useEffect(() => {
    if (loadingPerfil) return
    if (!perfil) return

    if (isEmpleado) {
      const emp = empleados.find(e => Number(e.id_empleado) === empleadoIdPerfil)
      setFiltroEmpleados([{
        value: empleadoIdPerfil,
        label: emp?.empleado_nombre_apellido || "Mi usuario"
      }])
    }
  }, [loadingPerfil, perfil, isEmpleado, empleadoIdPerfil, empleados])

  // ✅ default: 3 meses hacia atrás hasta hoy (como querías antes)
  // Si querés “hoy a 3 meses atrás” y listo, uso eso:
  const [fechaDesde, setFechaDesde] = useState(() => startOfDay(addDays(new Date(), -30)));
  const [fechaHasta, setFechaHasta] = useState(() => startOfDay(new Date(), +30));
  //Filtros
  const [filtroEmpleados, setFiltroEmpleados] = useState([]);   // array de options
  const [filtroLocalidades, setFiltroLocalidades] = useState([]); // array de options
  const [filtroZonas, setFiltroZonas] = useState([]); // array de options


  // PAra el modal de referencias
  const [openRef, setOpenRef] = useState(false);
  const turnosLegend = useMemo(() => {
    const map = new Map(); // key = color|nombre
    for (const a of asignaciones) {
      const nombre = a.turnos?.turno_nombre;
      const color = a.turnos?.turno_color;
      if (!nombre || !color) continue;
      const key = `${color}|${nombre}`;
      if (!map.has(key)) map.set(key, { nombre, color });
    }
    return [...map.values()].sort((x, y) => (x.nombre ?? "").localeCompare(y.nombre ?? ""));
  }, [asignaciones]);


  // Días visibles en columnas
  const days = useMemo(() => {
    const out = [];
    if (!fechaDesde || !fechaHasta) return out;

    const start = new Date(fechaDesde);
    const end = new Date(fechaHasta);
    start.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);

    if (end < start) return out;

    const diff = Math.round((end - start) / (1000 * 60 * 60 * 24));
    for (let i = 0; i <= diff; i++) out.push(addDays(start, i));
    return out;
  }, [fechaDesde, fechaHasta]);

  // grid: Map(locId -> Map(empId -> Map(dateYMD -> arrayAsignaciones[] )))
  const grid = useMemo(() => {
    const idx = new Map();

    for (const a of asignaciones) {
      const locId = Number(a.asignacion_localidad_id);
      const empId = Number(a.asignacion_empleado_id);

      const aStart = new Date(a.asignacion_fecha_desde);
      const aEnd = new Date(a.asignacion_fecha_hasta);
      aStart.setHours(0, 0, 0, 0);
      aEnd.setHours(0, 0, 0, 0);

      const locMap = idx.get(locId) ?? new Map();
      const empMap = locMap.get(empId) ?? new Map();

      const totalDays = Math.round((aEnd - aStart) / (1000 * 60 * 60 * 24));
      for (let i = 0; i <= totalDays; i++) {
        const d = addDays(aStart, i);
        const key = toYMD(d);

        // por robustez: acumulamos (aunque vos ya garantizás 1 por día)
        const arr = empMap.get(key) ?? [];
        arr.push(a);
        empMap.set(key, arr);
      }

      locMap.set(empId, empMap);
      idx.set(locId, locMap);
    }

    return idx;
  }, [asignaciones]);

  // Empleados por localidad según asignaciones que se superponen al rango visible
  const empIdsPorLocalidad = useMemo(() => {
    const map = new Map();

    const start = new Date(fechaDesde);
    const end = new Date(fechaHasta);
    start.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);

    for (const a of asignaciones) {
      const locId = Number(a.asignacion_localidad_id);
      const empId = Number(a.asignacion_empleado_id);

      const aStart = new Date(a.asignacion_fecha_desde);
      const aEnd = new Date(a.asignacion_fecha_hasta);
      aStart.setHours(0, 0, 0, 0);
      aEnd.setHours(0, 0, 0, 0);

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
  // Para los filtros 
  const zonaIds = useMemo(() => new Set((filtroZonas || []).map(o => Number(o.value))), [filtroZonas]);
  const locIds = useMemo(() => new Set((filtroLocalidades || []).map(o => Number(o.value))), [filtroLocalidades]);
  const empIds = useMemo(() => new Set((filtroEmpleados || []).map(o => Number(o.value))), [filtroEmpleados]);

  const tieneFiltroZona = zonaIds.size > 0;
  const tieneFiltroLoc = locIds.size > 0;
  const tieneFiltroEmp = empIds.size > 0;
  // Armamos groups para una sola tabla
  const groups = useMemo(() => {
    const out = [];

    for (const loc of localidadesOrdenadas) {
      const locId = Number(loc.id_localidad);
      const locGrid = grid.get(locId) ?? new Map();
      // Filtro por localidad
      if (tieneFiltroLoc && !locIds.has(locId)) continue;

      // Filtro por zona (localidad tiene que tener zona_id)
      const zonaIdLoc = Number(loc?.zonas?.id_zona);
      if (tieneFiltroZona && !zonaIds.has(zonaIdLoc)) continue;

      const empSetLocalidad = empIdsPorLocalidad.get(locId) ?? new Set();
      const emps = empleados
        .filter((e) => empSetLocalidad.has(Number(e.id_empleado)))
        .filter((e) => !tieneFiltroEmp || empIds.has(Number(e.id_empleado)))
        .sort((a, b) => (a.empleado_nombre_apellido ?? "").localeCompare(b.empleado_nombre_apellido ?? ""));

      // si no querés mostrar vacías:
      if (emps.length === 0) continue;

      out.push({
        locId,
        locNombre: loc.localidad_nombre,
        empleados: emps,
        empMapByEmpId: locGrid,
      });
    }

    return out;
  }, [localidadesOrdenadas, grid, empIdsPorLocalidad, empleados, tieneFiltroLoc, tieneFiltroZona, tieneFiltroEmp, locIds, zonaIds, empIds,]);

  if (loading) return <p className="p-4">Cargando...</p>;

  return (
    <div className="max-w-8xl mx-auto space-y-2">

      <Title>
        <div className="flex items-center gap-z">
          <Calendar className="w-6 h-6 text-gray-700" />
          Planificación
        </div>
      </Title>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-4 mb-4">
        <FiltroZona
          zonas={zonas}
          value={filtroZonas}
          onChange={(v) => setFiltroZonas(v || [])}
        />

        <FiltroLocalidad
          localidades={localidades}
          value={filtroLocalidades}
          onChange={(v) => setFiltroLocalidades(v || [])}
        />

        <FiltroEmpleado
          empleados={empleados}
          value={filtroEmpleados}
          onChange={(v) => {
            if (isEmpleado) return  // 👈 bloquea cambios
            setFiltroEmpleados(v || [])
          }}
          isDisabled={isEmpleado}   // 👈 si tu componente lo soporta
        />

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
      <Button variant="gray"
        onClick={() => {
          setFiltroZonas([]);
          setFiltroLocalidades([]);
          if (!isEmpleado) setFiltroEmpleados([]);
        }}
        className="text-xs text-gray-600 hover:underline"
      >
        Limpiar filtros
      </Button>

      <PlanificacionTabla
        days={days}
        groups={groups}
        dayLabel={dayLabel}
        toYMD={toYMD}
        renderCellLines={renderCellLines}
      />
      <ReferenciaTurnos onOpenModal={() => setOpenRef(true)} />

      {openRef && (
        <ModalReferenciaTurnos onClose={() => setOpenRef(false)} turnosLegend={turnosLegend} />
      )}
    </div>
  );
}

