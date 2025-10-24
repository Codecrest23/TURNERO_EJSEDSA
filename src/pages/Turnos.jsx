import { useState } from "react"
import { useTurnos } from "../hooks/useTurnos"
import Table from "../components/ui/Table"
import Button from "../components/ui/Button"
import ModalAddItem from "../components/ui/ModalAddItem"
import Modal from "../components/ui/Modal"
import { Title, Subtitle } from "../components/ui/Typography"
import {Clock, CirclePlus } from "lucide-react"

export default function Turnos() {
  const {
    turnos,
    loading,
    error,
    fetchTurnos,
    agregarTurno,
    modificarTurno,
    eliminarTurno,
    agregarHorario,
    modificarHorario,
    eliminarHorario,
  } = useTurnos()

  const [nuevoTurno, setNuevoTurno] = useState({turno_nombre: "", turno_cantidad_dias: "",turno_cantidad_dias_descanso: "",turno_tiene_guardia_pasiva: "",
        turno_es_laboral:"",turno_comentarios: "",turno_color: ""})
  const [TurnoEditando, setTurnoEditando] = useState(null)
  const [TurnoEliminar, setTurnoEliminar] = useState(null)
  const [TurnoSeleccionado, setTurnoSeleccionado] = useState(null)

  if (loading) return <p>Cargando...</p>

  //  Agregar
  const handleAgregar = async (e) => {
    e.preventDefault()
    await agregarTurno(nuevoTurno)
    setNuevoTurno({ turno_nombre: "", turno_cantidad_dias: 0,turno_cantidad_dias_descanso: "",turno_tiene_guardia_pasiva: "",
        turno_es_laboral:"",turno_comentarios: "",turno_color: "" })
  }

  //  Editar
  const handleEditarSubmit = async (e) => {
    e.preventDefault()
    await modificarTurno(TurnoEditando.id_turno, {
      turno_nombre: TurnoEditando.turno_nombre,
      turno_cantidad_dias: TurnoEditando.turno_cantidad_dias,
      turno_cantidad_dias_descanso: TurnoEditando.turno_cantidad_dias_descanso,
      turno_tiene_guardia_pasiva: TurnoEditando.turno_tiene_guardia_pasiva,
      turno_es_laboral: TurnoEditando.turno_es_laboral,
      turno_comentarios: TurnoEditando.turno_comentarios,
      turno_color: TurnoEditando.turno_color,
    })
    setTurnoEditando(null)
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <Title>
        <div className="flex items-center gap-2">
          <Clock className="w-6 h-6 text-gray-700" />
          Turnos
        </div>
      </Title>
      <Subtitle>Listado de Turnos y Licencias</Subtitle>

      {/* 🧾 Tabla */}
      <Table headers={[ "N°", "Turno", "Cantidad de días", "Días de descanso", "Tiene guardia Pasiva?", "Es Laboral?", "Notas", "Color"]}>
          {turnos.map((tur, index) => (
            <tr
              key={tur.id_turno}
              onClick={() => setTurnoSeleccionado(TurnoSeleccionado?.id_turno === tur.id_turno ? null : tur)}
              className={`border-b hover:bg-gray-100 transition cursor-pointer ${
                TurnoSeleccionado?.id_turno === tur.id_turno
                  ? "bg-blue-100"
                  : ""
              }`}
            >
              <td className="px-6 py-3">{index + 1}</td>
              <td className="px-6 py-3">{tur.turno_nombre}</td>
              <td className="px-6 py-3">{tur.turno_cantidad_dias }</td>
              <td className="px-6 py-3">{tur.turno_cantidad_dias_descanso }</td>
              <td className="px-6 py-3">{tur.turno_tiene_guardia_pasiva }</td>
              <td className="px-6 py-3">{tur.turno_es_laboral }</td>
              <td className="px-6 py-3">{tur.turno_comentarios }</td>
              <td className="px-6 py-3"><div
                  className="w-5 h-5 rounded-full border border-gray-300 mx-auto"
                  style={{ backgroundColor: tur.turno_color }}
                  title={tur.turno_color} // tooltip al pasar el mouse
                ></div></td>
            </tr>
          ))}
      </Table>


      {/* Modal agregar y botonoes */}
      <div className="flex justify-end gap-2 mt-4">
        {/* <Button
          variant="warning"
          onClick={() => setNuevoTurno({...localidadSeleccionada, localidad_id_zona: localidadSeleccionada?.zonas?.id_zona || "",})}
          disabled={!localidadSeleccionada}
          className={!localidadSeleccionada ? "opacity-50 cursor-not-allowed" : ""}
        >
          Modificar
        </Button>

        <Button
          variant="danger"
          onClick={() => setLocalidadEliminar(localidadSeleccionada)}
          disabled={!localidadSeleccionada}
          className={!localidadSeleccionada ? "opacity-50 cursor-not-allowed" : ""}
        >
          Eliminar
        </Button> */}

        <ModalAddItem
          title="Agregar Turno"
          buttonLabel={
            <span className="flex items-center gap-1">
              <CirclePlus className="w-5 h-5 text-white-700" /> Agregar
            </span>
          }
          onSubmit={handleAgregar}
        >
          {/* <input
            type="text"
            placeholder="Nombre de Localidad"
            value={nuevaLocalidad.localidad_nombre}
            onChange={(e) =>
              setNuevaLocalidad({ ...nuevaLocalidad, localidad_nombre: e.target.value })
            }
            className="border rounded px-3 py-2 w-full"
            required
          />
          <select
            value={nuevaLocalidad.localidad_id_zona}
            onChange={(e) =>
              setNuevaLocalidad({ ...nuevaLocalidad, localidad_id_zona: e.target.value })
            }
            className="border rounded px-3 py-2 w-full"
            required
          >
            <option value="">Seleccionar zona</option>
            {zonas.map((z) => (
              <option key={z.id_zona} value={z.id_zona}>
                {z.zona_nombre}
              </option>
            ))}
          </select> */}
        </ModalAddItem>
        
      </div>

      {/* Modal editar */}
      {/* {localidadEditando && (
        <Modal title="Editar Localidad" onClose={() => setLocalidadEditando(null)}>
          <form onSubmit={handleEditarSubmit} className="space-y-4">
            <input
              type="text"
              value={localidadEditando.localidad_nombre}
              onChange={(e) =>
                setLocalidadEditando({
                  ...localidadEditando,
                  localidad_nombre: e.target.value,
                })
              }
              className="border w-full px-3 py-2 rounded"
              required
            />
            <select
              value={localidadEditando.localidad_id_zona}
              onChange={(e) =>
                setLocalidadEditando({
                  ...localidadEditando,
                  localidad_id_zona: e.target.value,
                })
              }
              className="border rounded px-3 py-2 w-full"
              required
            >
              <option value="">Seleccionar zona</option>
              {zonas.map((z) => (
                <option key={z.id_zona} value={z.id_zona}>
                  {z.zona_nombre}
                </option>
              ))} 
              
            </select>
            <div className="flex justify-end gap-2">
              <Button variant="gray" onClick={() => setLocalidadEditando(null)}>
                Cancelar
              </Button>
              <Button type="submit" variant="warning">
                Guardar
              </Button>
            </div>
          </form>
        </Modal>
      )} */}

      {/* Modal eliminar */}
      {/* {localidadEliminar && (
        <Modal title="Eliminar Localidad" onClose={() => setLocalidadEliminar(null)}>
          <p className="mb-6 text-center">
            ¿Seguro que deseas eliminar la localidad{" "}
            <b>"{localidadEliminar.localidad_nombre}"</b>?
          </p>
          <div className="flex justify-center gap-2">
            <Button variant="gray" onClick={() => setLocalidadEliminar(null)}>
              Cancelar
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                eliminarLocalidad(localidadEliminar.id_localidad)
                setLocalidadEliminar(null)
              }}
            >
              Sí, eliminar
            </Button>
          </div>
        </Modal>
      )} */}
    </div>
  )
}
