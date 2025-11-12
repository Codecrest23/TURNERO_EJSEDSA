import { useState } from "react"
import { useAsignaciones } from "../hooks/useAsignaciones"
import { useEmpleados } from "../hooks/useEmpleados"
import { useTurnos } from "../hooks/useTurnos"
import { useLocalidades } from "../hooks/useLocalidades"
import Table from "../components/ui/Table"
import Button from "../components/ui/Button"
import ModalAddItem from "../components/ui/ModalAddItem"
import Modal from "../components/ui/Modal"
import { Title, Subtitle } from "../components/ui/Typography"
import { UserPlus } from "lucide-react"

export default function AsignacionTurnos() {
  const { asignaciones, loading, fetchAsignaciones, agregarAsignacion, eliminarAsignacion } =
    useAsignaciones()
  const { empleados } = useEmpleados()
  const { turnos } = useTurnos()
  const { localidades } = useLocalidades()

  const [nuevaAsignacion, setNuevaAsignacion] = useState({
    asignacion_empleado_id: "",
    asignacion_turno_id: "",
    asignacion_localidad_id: "",
    asignacion_fecha_desde: "",
    asignacion_fecha_hasta: "",
    asignacion_comentario: "",
  })
  const [asignacionSeleccionada, setAsignacionSeleccionada] = useState(null)

  if (loading) return <p>Cargando...</p>

  const handleAgregar = async (e) => {
    e.preventDefault()
    if (
      !nuevaAsignacion.asignacion_empleado_id ||
      !nuevaAsignacion.asignacion_turno_id ||
      !nuevaAsignacion.asignacion_fecha_desde ||
      !nuevaAsignacion.asignacion_fecha_hasta
    ) {
      alert("⚠️ Todos los campos obligatorios deben completarse.")
      return
    }

    await agregarAsignacion({
      ...nuevaAsignacion,
      asignacion_empleado_id: Number(nuevaAsignacion.asignacion_empleado_id),
      asignacion_turno_id: Number(nuevaAsignacion.asignacion_turno_id),
      asignacion_localidad_id: Number(nuevaAsignacion.asignacion_localidad_id),
    })

    await fetchAsignaciones()
    setNuevaAsignacion({
      asignacion_empleado_id: "",
      asignacion_turno_id: "",
      asignacion_localidad_id: "",
      asignacion_fecha_desde: "",
      asignacion_fecha_hasta: "",
      asignacion_comentario: "",
    })
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <Title>
        <div className="flex items-center gap-2">
          <UserPlus className="w-6 h-6 text-gray-700" />
          Asignación de Turnos
        </div>
      </Title>
      <Subtitle>Asignar turnos a empleados</Subtitle>

      <Table
        headers={[
          "Empleado",
          "Turno",
          "Localidad",
          "Desde",
          "Hasta",
          "Comentario",
        ]}
      >
        {asignaciones.map((a) => (
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
            <td className="px-6 py-3">
              {a.empleados?.empleado_nombre} {a.empleados?.empleado_apellido}
            </td>
            <td className="px-6 py-3 flex items-center gap-2">
              <div
                className="w-4 h-4 rounded-full border"
                style={{ backgroundColor: a.turnos?.turno_color }}
              ></div>
              {a.turnos?.turno_nombre}
            </td>
            <td className="px-6 py-3">{a.localidades?.localidad_nombre}</td>
            <td className="px-6 py-3">{a.asignacion_fecha_desde}</td>
            <td className="px-6 py-3">{a.asignacion_fecha_hasta}</td>
            <td className="px-6 py-3">{a.asignacion_comentario || "-"}</td>
          </tr>
        ))}
      </Table>

      {/* Botones */}
      <div className="flex justify-end gap-2 mt-4">
        <Button
          variant="danger"
          onClick={() => {
            if (asignacionSeleccionada)
              eliminarAsignacion(asignacionSeleccionada.id_asignacion)
          }}
          disabled={!asignacionSeleccionada}
        >
          Eliminar
        </Button>

        <ModalAddItem
          title="Nueva Asignación"
          buttonLabel="Agregar"
          onSubmit={handleAgregar}
        >
          <form className="space-y-3">
            <select
              className="w-full border p-2 rounded"
              value={nuevaAsignacion.asignacion_empleado_id}
              onChange={(e) =>
                setNuevaAsignacion({
                  ...nuevaAsignacion,
                  asignacion_empleado_id: e.target.value,
                })
              }
            >
              <option value="">Elegir empleado...</option>
              {empleados.map((emp) => (
                <option key={emp.id_empleado} value={emp.id_empleado}>
                  {emp.empleado_nombre} {emp.empleado_apellido}
                </option>
              ))}
            </select>

            <select
              className="w-full border p-2 rounded"
              value={nuevaAsignacion.asignacion_turno_id}
              onChange={(e) =>
                setNuevaAsignacion({
                  ...nuevaAsignacion,
                  asignacion_turno_id: e.target.value,
                })
              }
            >
              <option value="">Elegir turno...</option>
              {turnos.map((t) => (
                <option key={t.id_turno} value={t.id_turno}>
                  {t.turno_nombre}
                </option>
              ))}
            </select>

            <select
              className="w-full border p-2 rounded"
              value={nuevaAsignacion.asignacion_localidad_id}
              onChange={(e) =>
                setNuevaAsignacion({
                  ...nuevaAsignacion,
                  asignacion_localidad_id: e.target.value,
                })
              }
            >
              <option value="">Elegir localidad...</option>
              {localidades.map((l) => (
                <option key={l.id_localidad} value={l.id_localidad}>
                  {l.localidad_nombre}
                </option>
              ))}
            </select>

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
          </form>
        </ModalAddItem>
      </div>
    </div>
  )
}
