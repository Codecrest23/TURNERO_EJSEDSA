import { useState } from "react";
import { useAsignaciones } from "../hooks/useAsignaciones";
import { useEmpleados } from "../hooks/useEmpleados";
import { useTurnos } from "../hooks/useTurnos";
import { useLocalidades } from "../hooks/useLocalidades";
import { useZonas } from "../hooks/useZonas";
import {SquareStack} from "lucide-react"

import Table from "../components/ui/Table";
import Button from "../components/ui/Button";
import { Title } from "../components/ui/Typography";
import { FileDown } from "lucide-react";

import FiltroEmpleado from "../components/ui/Filtros/FiltroEmpleado";
import FiltroLocalidad from "../components/ui/Filtros/FiltroLocalidad";
// import FiltroTurno from "../components/ui/Filtros/FiltroTurno";
import FiltroZona from "../components/ui/Filtros/FiltroZona";
import FiltroFecha from "../components/ui/Filtros/FiltroFecha";

import * as XLSX from "xlsx";

export default function InformeHistorico() {
  const { asignaciones, loading } = useAsignaciones();
  const { empleados } = useEmpleados();
  const { turnos } = useTurnos();
  const { localidades } = useLocalidades();
  const { zonas } = useZonas();

  const [filtroEmpleados, setFiltroEmpleados] = useState([]);
  const [filtroLocalidades, setFiltroLocalidades] = useState([]);
  // const [filtroTurnos, setFiltroTurnos] = useState([]);
  const [filtroZonas, setFiltroZonas] = useState([]);
  const [filtroFechaDesde, setFiltroFechaDesde] = useState(null);
  const [filtroFechaHasta, setFiltroFechaHasta] = useState(null);
  if (loading) return <p>Cargando...</p>;

  // ✅ mismo filtrado que ya usás
  const filteredAsignaciones = asignaciones.filter((a) => {
    const empOk =
      filtroEmpleados.length === 0 ||
      filtroEmpleados.some((f) => Number(f.value) === Number(a.asignacion_empleado_id));

    const locOk =
      filtroLocalidades.length === 0 ||
      filtroLocalidades.some((f) => Number(f.value) === Number(a.asignacion_localidad_id));

    // const turnoOk =
    //   filtroTurnos.length === 0 ||
    //   filtroTurnos.some((f) => Number(f.value) === Number(a.asignacion_turno_id));

    const zonaOk =
      filtroZonas.length === 0 ||
      filtroZonas.some((f) => Number(f.value) === Number(a.localidades?.zonas?.id_zona));
  // 🔹 Filtro por fechas
    const fechaDesdeAsignacion = new Date(a.asignacion_fecha_desde);
    const fechaHastaAsignacion = new Date(a.asignacion_fecha_hasta);

    const fechaDesdeOk =
      !filtroFechaDesde || fechaHastaAsignacion >= filtroFechaDesde;

    const fechaHastaOk =
      !filtroFechaHasta || fechaDesdeAsignacion <= filtroFechaHasta;

    return empOk && locOk && zonaOk && fechaDesdeOk && fechaHastaOk;
  });

  const exportarExcel = () => {
    const filas = filteredAsignaciones.map((a) => ({
      Zona: a.localidades?.zonas?.zona_nombre ?? "",
      Localidad: a.localidades?.localidad_nombre ?? "",
      Empleado: a.empleados?.empleado_nombre_apellido ?? "",
      Turno: a.turnos?.turno_nombre ?? "",
      Motivo: a.turnos?.turno_motivo ?? "",
      Desde: a.asignacion_fecha_desde ? new Date(a.asignacion_fecha_desde).toLocaleDateString("es-AR") : "",
      Hasta: a.asignacion_fecha_hasta ? new Date(a.asignacion_fecha_hasta).toLocaleDateString("es-AR") : "",
    }));

    const ws = XLSX.utils.json_to_sheet(filas);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Informe");

    const hoy = new Date();
    const yyyy = hoy.getFullYear();
    const mm = String(hoy.getMonth() + 1).padStart(2, "0");
    const dd = String(hoy.getDate()).padStart(2, "0");

    XLSX.writeFile(wb, `informe_historico_${yyyy}-${mm}-${dd}.xlsx`);
  };


  return (
    <div className="max-w-8xl mx-auto space-y-2">
      <Title>
        <div className="flex items-center gap-z">
          <SquareStack className="w-6 h-6 text-gray-700" />
          Informe Histórico
        </div>
      </Title>

      {/* ✅ grid responsive para 4 filtros */}
      <div className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-4 mb-4">
        <FiltroEmpleado empleados={empleados} value={filtroEmpleados} onChange={setFiltroEmpleados} />
        <FiltroLocalidad localidades={localidades} value={filtroLocalidades} onChange={setFiltroLocalidades} />
        {/* <FiltroTurno turnos={turnos} value={filtroTurnos} onChange={setFiltroTurnos} /> */}
        <FiltroZona zonas={zonas} value={filtroZonas} onChange={setFiltroZonas} />
         {/* 🟢 NUEVOS filtros de fecha */}
        <FiltroFecha label="Desde" value={filtroFechaDesde} onChange={setFiltroFechaDesde}placeholder="Fecha desde"/>
        <FiltroFecha label="Hasta" value={filtroFechaHasta} onChange={setFiltroFechaHasta} minDate={filtroFechaDesde} placeholder="Fecha hasta"/>
      </div> 
      
      <Button variant="gray" onClick={() => {setFiltroFechaDesde(null);setFiltroFechaHasta(null);}}>
        Limpiar fechas
      </Button>
       <div className="flex justify-end">
        <Button variant="excel" onClick={exportarExcel}>
          <span className="flex items-center gap-2">
            <FileDown className="w-4 h-4" />
            Exportar a Excel
          </span>
        </Button>
      </div>

      <Table
        headers={[
          "Zona","Localidad","Empleado","Turno","Motivo","Desde","Hasta","Tipo"
        ]}
      >
        {filteredAsignaciones.map((a) => (
          <tr key={a.id_asignacion} className="border-b">
            <td className="px-6 py-3">{a.localidades?.zonas?.zona_nombre}</td>
            <td className="px-6 py-3">{a.localidades?.localidad_nombre}</td>
            <td className="px-6 py-3">{a.empleados?.empleado_nombre_apellido}</td>
            <td className="px-6 py-3">{a.turnos?.turno_nombre}</td>
            <td className="px-6 py-3">{a.turnos?.turno_motivo}</td>
            <td className="px-6 py-3">{new Date(a.asignacion_fecha_desde).toLocaleDateString("es-AR")}</td>
            <td className="px-6 py-3">{new Date(a.asignacion_fecha_hasta).toLocaleDateString("es-AR")}</td>
            <td className="px-6 py-3">{a.asignacion_estado}</td>
          </tr>
        ))}
      </Table>
    </div>
  );
}
