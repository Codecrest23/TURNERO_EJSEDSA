import { useAsignaciones } from "../hooks/useAsignaciones"
import { useEmpleados } from "../hooks/useEmpleados"
import { useTurnos } from "../hooks/useTurnos"
import { useLocalidades } from "../hooks/useLocalidades"
import Table from "../components/ui/Table"
import Button from "../components/ui/Button"
import ModalAddItem from "../components/ui/ModalAddItem"
import Modal from "../components/ui/Modal"
import ModalDetalleAsignacion from "../components/ui/ModalDetalleAsignacion"
import { Title, Subtitle } from "../components/ui/Typography"
import { CalendarClock } from "lucide-react"
import Select from "react-select"
import { useState, useEffect } from "react"
import ButtonSmall from "../components/ui/ButtonSmall"
import FiltroEmpleado from "../components/ui/Filtros/FiltroEmpleado"
import FiltroLocalidad from "../components/ui/Filtros/FiltroLocalidad"
import FiltroTurno from "../components/ui/Filtros/FiltroTurno"
import Toggle from "../components/ui/Toggle"

export default function AsignacionTurnos() {
  const { asignaciones, loading, fetchAsignaciones, agregarAsignacion, eliminarAsignacion } =useAsignaciones()
  const [asignacionEliminar, setAsignacionEliminar] = useState(null)
  const { empleados } = useEmpleados()
  const { turnos } = useTurnos()
  const { localidades } = useLocalidades()
  const [motivoTurnoInfo, setMotivoTurnoInfo] = useState("");
  const [detalleAsignacion, setDetalleAsignacion] = useState(null);

  const [nuevaAsignacion, setNuevaAsignacion] = useState({
    asignacion_empleado_id: "",
    asignacion_turno_id: "",
    asignacion_localidad_id: "",
    asignacion_fecha_desde: "",
    asignacion_fecha_hasta: "",
    asignacion_comentario: "",
  })
  const [asignacionSeleccionada, setAsignacionSeleccionada] = useState(null)
const limpiarFormulario = () => {
  setNuevaAsignacion({
    asignacion_empleado_id: "",
    asignacion_localidad_id: "",
    asignacion_turno_id: "",
    asignacion_fecha_desde: "",
    asignacion_fecha_hasta: "",
    asignacion_comentario: "",
  });

  setMotivoTurnoInfo("");  
};

const [filtroEmpleados, setFiltroEmpleados] = useState([]);
const [filtroLocalidades, setFiltroLocalidades] = useState([]);
const [filtroTurnos, setFiltroTurnos] = useState([]);
const [esLaboral, setEsLaboral] = useState(true); // true = laboral

//agrgar para que automaticamente se coloque la localidad 
useEffect(() => {
  if (!nuevaAsignacion.asignacion_empleado_id) return;

  const empleado = empleados.find(
    (e) => e.id_empleado == nuevaAsignacion.asignacion_empleado_id
  );

  if (!empleado) return;

  setNuevaAsignacion((prev) => ({
    ...prev,
    asignacion_localidad_id: empleado.empleado_id_localidad || "",
    asignacion_turno_id: empleado.empleado_id_turno || "",
  }));
    //Completar también el motivo solo informativo
      const turno = turnos.find(
    (t) => t.id_turno == empleado.empleado_id_turno
  );
  setMotivoTurnoInfo(turno?.turno_motivo || "");
}, [nuevaAsignacion.asignacion_empleado_id, empleados, turnos]);

  if (loading) return <p>Cargando...</p>

  const handleAgregar = async (e) => {
    e.preventDefault()
    await agregarAsignacion({
      ...nuevaAsignacion,
      asignacion_empleado_id: Number(nuevaAsignacion.asignacion_empleado_id),
      asignacion_turno_id: Number(nuevaAsignacion.asignacion_turno_id),
      asignacion_localidad_id: Number(nuevaAsignacion.asignacion_localidad_id),
    })

    await fetchAsignaciones()
    limpiarFormulario();
  }


// OPCIONES AGRUPADAS PARA EL SELECT DE TURNOS
const locID = Number(nuevaAsignacion.asignacion_localidad_id);
//console.log("🔎 locID normalizado:", locID, "typeof:", typeof locID);
// Turnos asociados
const turnosLocalidad = turnos
  .filter(t => Number(t.turno_id_localidad) === locID)
  .map(t => ({
    label: t.turno_nombre , //+ " 🟩"
    value: t.id_turno
  }));
//console.log("🎯 Turnos que matchean:", turnosLocalidad);
// Otros turnos
const otrosTurnos = turnos
  .filter(t => Number(t.turno_id_localidad) !== locID)
  .map(t => ({
    label: t.turno_nombre,
    value: t.id_turno
  }));

const opcionesTurnos = [
  ...(turnosLocalidad.length > 0
    ? [{ label: "Turnos de esta Localidad", options: turnosLocalidad }]
    : []),
  ...(otrosTurnos.length > 0
    ? [{ label: "Otros Turnos", options: otrosTurnos }]
    : [])
];


//  FILTRO VISUAL
const filteredAsignaciones = asignaciones.filter((a) => {
const empOk =
  filtroEmpleados.length === 0 ||
  filtroEmpleados.some((f) => Number(f.value) === Number(a.asignacion_empleado_id));

const locOk =
  filtroLocalidades.length === 0 ||
  filtroLocalidades.some((f) => Number(f.value) === Number(a.asignacion_localidad_id));

const turnoOk =
  filtroTurnos.length === 0 ||
  filtroTurnos.some((f) => Number(f.value) === Number(a.asignacion_turno_id));
  return empOk && locOk && turnoOk;
  
});

// OPCIONES AGRUPADAS PARA EL SELECT DE TURNOS

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <Title>
        <div className="flex items-center gap-2">
          <CalendarClock className="w-6 h-6 text-gray-700" />
          Asignación de Turnos
        </div>
      </Title>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">

{/* INICIO DE FILTROS */}
  <FiltroEmpleado
    empleados={empleados}
    value={filtroEmpleados}
    onChange={setFiltroEmpleados}
  />

  <FiltroLocalidad
    localidades={localidades}
    value={filtroLocalidades}
    onChange={setFiltroLocalidades}
  />

  <FiltroTurno
    turnos={turnos}
    value={filtroTurnos}
    onChange={setFiltroTurnos}
  />
</div>

{/* INICIO DE TABLA */}
      <Table
        headers={[
          "Empleado",
          "Turno",
          "Motivo",
          "Localidad",
          "Desde",
          "Hasta",
          "Comentario",
          "Detalles"
        ]}
      >
        {filteredAsignaciones.map((a) => (
          <tr
            key={a.id_asignacion}
            onClick={() =>
              setAsignacionSeleccionada(
                asignacionSeleccionada?.id_asignacion === a.id_asignacion
                  ? null
                  : a
              )
            }
            className={`border-b hover:bg-gray-100 cursor-pointer ${
              asignacionSeleccionada?.id_asignacion === a.id_asignacion
                ? "bg-blue-100"
                : ""
            }`}
          >
            <td className="px-6 py-3 ">
                  {a.empleados?.empleado_nombre_apellido}
            </td>
            <td className="px-6 py-3 flex items-center gap-2">
              <div className="line-clamp-2">
                {a.turnos?.turno_nombre}
              </div>
            </td>
            <td className="px-6 py-3">
              {a.turnos?.turno_motivo}
            </td>
            <td className="px-6 py-3">{a.localidades?.localidad_nombre}</td>
            <td className="px-6 py-3">{new Date(a.asignacion_fecha_desde).toLocaleDateString("es-AR")}</td>
            <td className="px-6 py-3">{new Date(a.asignacion_fecha_desde).toLocaleDateString("es-AR")}</td>
            <td className="px-6 py-3 max-w-xs"> <div className="line-clamp-2">{a.asignacion_comentario || "-"}</div></td>
            <td className="px-6 py-3 text-center">
              <ButtonSmall
                variant="primary"
                onClick={(e) => {
                  e.stopPropagation();
                  setDetalleAsignacion(a);
                }}
              >
                Ver detalle
              </ButtonSmall>
            </td>
          </tr>
        ))}
      </Table>

{/* INICIO BOTONES */}
      <div className="flex justify-end gap-2 mt-4">
        <Button
          variant="danger"
          onClick={() => setAsignacionEliminar(asignacionSeleccionada)}
          disabled={!asignacionSeleccionada}
          className={!asignacionSeleccionada ? "opacity-50 cursor-not-allowed" : ""}
        >
          Eliminar
        </Button>
{/* INICIO DE AGREGAR */}
              <ModalAddItem
                title="Nueva Asignación"
                buttonLabel="Agregar"
                onSubmit={handleAgregar}
                onClose={limpiarFormulario}
              >
                <Toggle
                  label="Es laboral"
                  checked={esLaboral}
                  onChange={setEsLaboral}
                />

                  <Select
                    options={empleados.map(e => ({
                      value: e.id_empleado,
                      label: e.empleado_nombre_apellido
                    }))}
                    onChange={(opt) =>
                      setNuevaAsignacion({
                        ...nuevaAsignacion,
                        asignacion_empleado_id: opt?.value,
                      })
                    }
                    placeholder="Seleccionar Empleado"
                    isSearchable
                    required
                  />

                  <Select
                    className="w-full"
                    placeholder="Seleccionar Localidad"
                    isSearchable={true}
                    value={
                      localidades
                        .map(l => ({
                          value: l.id_localidad,
                          label: l.localidad_nombre
                        }))
                        .find(opt => opt.value == nuevaAsignacion.asignacion_localidad_id) || null
                    }
                    onChange={(opt) =>
                      setNuevaAsignacion({
                        ...nuevaAsignacion,
                        asignacion_localidad_id: opt?.value || ""
                      })
                    }
                    options={localidades.map(l => ({
                      value: l.id_localidad,
                      label: l.localidad_nombre
                    }))}
                    required

                  />
                <Select
                  className="w-full"
                  placeholder="Seleccionar Turno"
                  isSearchable={true}
                  value={
                    turnos
                      .map(t => ({
                        value: t.id_turno,
                        label: t.turno_nombre
                      }))
                      .find(opt => opt.value == nuevaAsignacion.asignacion_turno_id) || null
                  }
                  onChange={(opt) => {
                    const turno = turnos.find(t => t.id_turno == opt?.value);

                    setNuevaAsignacion({
                      ...nuevaAsignacion,
                      asignacion_turno_id: opt?.value,
                    });

                    setMotivoTurnoInfo(turno?.turno_motivo || "");
                  }}
                  options={opcionesTurnos}
                />

                  <label className="block text-sm font-medium text-gray-700 mt-2">
                    Motivo del turno
                  </label>
                  <input
                    type="text"
                    className="w-full border p-2 rounded bg-gray-100 text-gray-600"
                    value={motivoTurnoInfo}
                    disabled
                  />

                  <input
                    type="date"
                    className="w-full border p-2 rounded"
                    value={nuevaAsignacion.asignacion_fecha_desde}
                    onChange={(e) =>
                      setNuevaAsignacion({
                        ...nuevaAsignacion,
                        asignacion_fecha_desde: e.target.value,
                      })
                    }
                    required
                  />
                  <input
                    type="date"
                    className="w-full border p-2 rounded"
                    value={nuevaAsignacion.asignacion_fecha_hasta}
                    onChange={(e) =>
                      setNuevaAsignacion({
                        ...nuevaAsignacion,
                        asignacion_fecha_hasta: e.target.value,
                      })
                    }
                    required
                  />

                  <textarea
                    className="w-full border p-2 rounded"
                    placeholder="Comentario"
                    value={nuevaAsignacion.asignacion_comentario}
                    onChange={(e) =>
                      setNuevaAsignacion({
                        ...nuevaAsignacion,
                        asignacion_comentario: e.target.value,
                      })
                    }
                  />
        </ModalAddItem>
      </div>
{/* INICIO DETALLE */}
      {detalleAsignacion && (
          <ModalDetalleAsignacion
            asignacion={detalleAsignacion}
            onClose={() => setDetalleAsignacion(null)}
          />
        )}
  {/*INCIO ELIMINAR */}
      {asignacionEliminar && (  
         <>
    {console.log("OBJETO PARA ELIMINAR:", asignacionEliminar)}
        <Modal title="Eliminar Asignacion" onClose={() => setAsignacionEliminar(null)}>
          <p className="mb-6 text-center">
            ¿Seguro que deseas eliminar la asignación de {" "}
            <b>{asignacionEliminar?.empleados?.empleado_nombre_apellido}</b>?<br />
            Turno: <b>{asignacionEliminar?.turnos?.turno_nombre}</b><br />
            Desde: <b>{new Date(asignacionEliminar?.asignacion_fecha_desde).toLocaleDateString("es-AR")}</b><br />
            Hasta: <b>{new Date(asignacionEliminar?.asignacion_fecha_hasta).toLocaleDateString("es-AR")}</b>
          </p>
          <div className="flex justify-center gap-2">
            <Button variant="gray" onClick={() => setAsignacionEliminar(null)}>
              Cancelar
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                eliminarAsignacion(asignacionEliminar.id_asignacion)
                setAsignacionEliminar(null)
              }}
            >
              Sí, eliminar
            </Button>
          </div>
        </Modal>  </>
      )}

    </div>
  )
}
