import { useState } from "react"
import { useEmpleados } from "../hooks/useEmpleados"
import { useLocalidades } from "../hooks/useLocalidades"
import { useZonas } from "../hooks/useZonas"
import { useFunciones } from "../hooks/useFunciones"
import { useSectores } from "../hooks/useSectores"
import { useTurnos } from "../hooks/useTurnos"
import Table from "../components/ui/Table"
import Button from "../components/ui/Button"
import ModalAddItem from "../components/ui/ModalAddItem"
import Modal from "../components/ui/Modal"
import { Title, Subtitle } from "../components/ui/Typography"
import { IdCardLanyard, CirclePlus } from "lucide-react"

export default function Empleados() {
  const {
    empleados,
    agregarEmpleado,
    modificarEmpleado,
    eliminarEmpleado,
    loading,
  } = useEmpleados()

  const { localidades } = useLocalidades()
  const { funciones } = useFunciones()
  const { sectores } = useSectores()
  const { turnos } = useTurnos()

  const [nuevoEmpleado, setNuevoEmpleado] = useState({
    empleado_nombre_apellido: "",
    empleado_id_funcion: "",
    empleado_id_sector: "",
    empleado_id_localidad: null,
    empleado_id_turno: null,
    empleado_color: "",
  })

  const [empleadoSeleccionado, setEmpleadoSeleccionado] = useState(null)
  const [empleadoEditando, setEmpleadoEditando] = useState(null)
  const [empleadoEliminar, setEmpleadoEliminar] = useState(null)

  if (loading) return <p>Cargando...</p>
  // Agregar
  const handleAgregar = async (e) => {
    e.preventDefault()
    await agregarEmpleado(nuevoEmpleado)
    setNuevoEmpleado({
      empleado_nombre_apellido: "",
      empleado_id_funcion: "",
      empleado_id_sector: "",
      empleado_id_localidad: "",
      empleado_id_turno: "",
      empleado_color: "",
    })
  }

  // 🟠 Editar
  const handleEditarSubmit = async (e) => {
    e.preventDefault()
    await modificarEmpleado(empleadoEditando.id_empleado, empleadoEditando)
    setEmpleadoEditando(null)
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <Title>
        <div className="flex items-center gap-2">
          <IdCardLanyard className="w-6 h-6 text-gray-700" />
          Empleados
        </div>
      </Title>
      <Subtitle>Listado de empleados</Subtitle>

      {/* 🧾 Tabla */}
      <Table headers={["N°", "Nombre", "Función", "Sector", "Turno", "Localidad","Zona"]}>
        {empleados.map((emp, index) => (
          <tr
            key={emp.id_empleado}
            onClick={() =>
              setEmpleadoSeleccionado(
                empleadoSeleccionado?.id_empleado === emp.id_empleado ? null : emp
              )
            }
            className={`border-b hover:bg-gray-100 transition cursor-pointer ${
              empleadoSeleccionado?.id_empleado === emp.id_empleado
                ? "bg-blue-100"
                : ""
            }`}
          >
            <td className="px-6 py-3">{index + 1}</td>
            <td className="px-6 py-3">{emp.empleado_nombre_apellido}</td>
            <td className="px-6 py-3">
              {emp.funciones_empleados?.funcion_empleado_nombre || "—"}
            </td>
            <td className="px-6 py-3">
              {emp.sectores_empleados?.sector_empleado_nombre || "—"}
            </td>
            <td className="px-6 py-3">{emp.turnos?.turno_nombre || "—"}</td>
            <td className="px-6 py-3">
              {emp.localidades?.localidad_nombre || "Sin localidad"}
            </td>
              <td className="px-6 py-3">
              {emp.localidades?.zonas?.zona_nombre || "Sin zona"}
            </td>
          </tr>
        ))}
      </Table>

      {/* 🔘 Botones y Modal agregar */}
      <div className="flex justify-end gap-2 mt-4">
        <Button
          variant="warning"
          onClick={() => {
              if (!empleadoSeleccionado) return
              setEmpleadoEditando({
                ...empleadoSeleccionado,
                // Aseguramos que existan los IDs crudos para selects:
                empleado_id_funcion: empleadoSeleccionado.empleado_id_funcion ?? "",
                empleado_id_sector: empleadoSeleccionado.empleado_id_sector ?? "",
                empleado_id_turno: empleadoSeleccionado.empleado_id_turno ?? "",
                empleado_id_localidad: empleadoSeleccionado.empleado_id_localidad ?? "",
              })
            }}
            disabled={!empleadoSeleccionado}
            className={!empleadoSeleccionado ? "opacity-50 cursor-not-allowed" : ""}
        >
          Modificar
        </Button>

        <Button
          variant="danger"
          onClick={() => setEmpleadoEliminar(empleadoSeleccionado)}
          disabled={!empleadoSeleccionado}
          className={!empleadoSeleccionado ? "opacity-50 cursor-not-allowed" : ""}
        >
          Eliminar
        </Button>

        <ModalAddItem
          title="Agregar Empleado"
          buttonLabel={
            <span className="flex items-center gap-1">
              <CirclePlus className="w-5 h-5 text-white-700" /> Agregar
            </span>
          }
          onSubmit={handleAgregar}
        >
          {/* Campos del modal */}
          <input
            type="text"
            placeholder="Nombre y apellido"
            value={nuevoEmpleado.empleado_nombre_apellido}
            onChange={(e) =>
              setNuevoEmpleado({
                ...nuevoEmpleado,
                empleado_nombre_apellido: e.target.value.toUpperCase(),
              })
            }
            className="border rounded px-3 py-2 w-full"
            required
          />

          {/* Dropdowns */}
          <select
            value={nuevoEmpleado.empleado_id_funcion}
            onChange={(e) =>
              setNuevoEmpleado({
                ...nuevoEmpleado,
                empleado_id_funcion: e.target.value,
              })
            }
            className="border rounded px-3 py-2 w-full"
            required
          >
            <option value="">Seleccionar función</option>
            {funciones.map((f) => (
              <option key={f.funcion_empleado_id} value={f.funcion_empleado_id}>
                {f.funcion_empleado_nombre}
              </option>
            ))}
          </select>

          <select
            value={nuevoEmpleado.empleado_id_sector}
            onChange={(e) =>
              setNuevoEmpleado({
                ...nuevoEmpleado,
                empleado_id_sector: e.target.value,
              })
            }
            className="border rounded px-3 py-2 w-full"
            required
          >
            <option value="">Seleccionar sector</option>
            {sectores.map((s) => (
              <option key={s.id_sector_empleado} value={s.id_sector_empleado}>
                {s.sector_empleado_nombre}
              </option>
            ))}
          </select>

          <select
            value={nuevoEmpleado.empleado_id_turno}
            onChange={(e) =>
              setNuevoEmpleado({
                ...nuevoEmpleado,
                empleado_id_turno: e.target.value,
              })
            }
            className="border rounded px-3 py-2 w-full"
          >
            <option value="">Seleccionar turno</option>
            {turnos.map((t) => (
              <option key={t.id_turno} value={t.id_turno}>
                {t.turno_nombre}
              </option>
            ))}
          </select>

          <select
            value={nuevoEmpleado.empleado_id_localidad}
            onChange={(e) =>
              setNuevoEmpleado({
                ...nuevoEmpleado,
                empleado_id_localidad: e.target.value,
              })
            }
            className="border rounded px-3 py-2 w-full"
          >
            <option value="">Seleccionar localidad</option>
            {localidades.map((loc) => (
              <option key={loc.id_localidad} value={loc.id_localidad}>
                {loc.localidad_nombre}
              </option>
            ))}
          </select>
        </ModalAddItem>
      </div>

      {/* ✏️ Modal editar */}
      {empleadoEditando && (
        <Modal title="Editar Empleado" onClose={() => setEmpleadoEditando(null)}>
          <form onSubmit={handleEditarSubmit} className="space-y-4">
            <input
              type="text"
              value={empleadoEditando.empleado_nombre_apellido}
              onChange={(e) =>
                setEmpleadoEditando({
                  ...empleadoEditando,
                  empleado_nombre_apellido: e.target.value.toUpperCase(),
                })
              }
              className="border w-full px-3 py-2 rounded"
              required
            />
            {/* Función */}
            <select
              value={empleadoEditando.empleado_id_funcion || ""}
              onChange={(e) =>
                setEmpleadoEditando({
                  ...empleadoEditando,
                  empleado_id_funcion: e.target.value,
                })
              }
              className="border rounded px-3 py-2 w-full"
              required
            >
              <option value="">Seleccionar función</option>
              {funciones.map((f) => (
                <option key={f.funcion_empleado_id} value={f.funcion_empleado_id}>
                  {f.funcion_empleado_nombre}
                </option>
              ))}
            </select>

            {/* Sector */}
            <select
              value={empleadoEditando.empleado_id_sector || ""}
              onChange={(e) =>
                setEmpleadoEditando({
                  ...empleadoEditando,
                  empleado_id_sector: e.target.value,
                })
              }
              className="border rounded px-3 py-2 w-full"
              required
            >
              <option value="">Seleccionar sector</option>
              {sectores.map((s) => (
                <option key={s.id_sector_empleado} value={s.id_sector_empleado}>
                  {s.sector_empleado_nombre}
                </option>
              ))}
            </select>

            {/* Turno */}
            <select
              value={empleadoEditando.empleado_id_turno || ""}
              onChange={(e) =>
                setEmpleadoEditando({
                  ...empleadoEditando,
                  empleado_id_turno: e.target.value,
                })
              }
              className="border rounded px-3 py-2 w-full"
            >
              <option value="">Seleccionar turno</option>
              {turnos.map((t) => (
                <option key={t.id_turno} value={t.id_turno}>
                  {t.turno_nombre}
                </option>
              ))}
            </select>

            {/* Localidad */}
            <select
              value={empleadoEditando.empleado_id_localidad || ""}
              onChange={(e) =>
                setEmpleadoEditando({
                  ...empleadoEditando,
                  empleado_id_localidad: e.target.value,
                })
              }
              className="border rounded px-3 py-2 w-full"
            >
              <option value="">Seleccionar localidad</option>
              {localidades.map((loc) => (
                <option key={loc.id_localidad} value={loc.id_localidad}>
                  {loc.localidad_nombre}
                </option>
              ))}
            </select>
            <div className="flex justify-end gap-2">
              <Button variant="gray" onClick={() => setEmpleadoEditando(null)}>
                Cancelar
              </Button>
              <Button type="submit" variant="warning">
                Guardar
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* 🗑️ Modal eliminar */}
      {empleadoEliminar && (
        <Modal title="Eliminar Empleado" onClose={() => setEmpleadoEliminar(null)}>
          <p className="mb-6 text-center">
            ¿Seguro que deseas eliminar a{" "}
            <b>"{empleadoEliminar.empleado_nombre_apellido}"</b>?
          </p>
          <div className="flex justify-center gap-2">
            <Button variant="gray" onClick={() => setEmpleadoEliminar(null)}>
              Cancelar
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                eliminarEmpleado(empleadoEliminar.id_empleado)
                setEmpleadoEliminar(null)
              }}
            >
              Sí, eliminar
            </Button>
          </div>
        </Modal>
      )}
    </div>
  )
}
