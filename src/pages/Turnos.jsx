import { useState } from "react"
import { useTurnos } from "../hooks/useTurnos"
import Table from "../components/ui/Table"
import Button from "../components/ui/Button"
import ModalAddItem from "../components/ui/ModalAddItem"
import Modal from "../components/ui/Modal"
import { Title, Subtitle } from "../components/ui/Typography"
import {Clock, CirclePlus } from "lucide-react"
import { useLocalidades } from "../hooks/useLocalidades"
import TurnoForm from "../components/ui/TurnoForm"

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

  const [nuevoTurno, setNuevoTurno] = useState({turno_nombre: "", turno_cantidad_dias: null,turno_cantidad_dias_descanso: null,turno_tiene_guardia_pasiva: 0,
        turno_es_laboral:"",turno_comentarios: "",turno_color: "#000000"})
  const [TurnoEditando, setTurnoEditando] = useState(null)
  const [TurnoEliminar, setTurnoEliminar] = useState(null)
  const [TurnoSeleccionado, setTurnoSeleccionado] = useState(null)
  const { localidades } = useLocalidades()


  if (loading) return <p>Cargando...</p>

  //  Agregar
  const handleAgregar = async (e) => {
    e.preventDefault()
    await agregarTurno(nuevoTurno)
    setNuevoTurno({ turno_nombre: "", turno_cantidad_dias: 0,turno_cantidad_dias_descanso: "",turno_tiene_guardia_pasiva: 0,
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
    <div className="max-w-7xl mx-auto space-y-8">
      <Title>
        <div className="flex items-center gap-2">
          <Clock className="w-6 h-6 text-gray-700" />
          Turnos
        </div>
      </Title>
      <Subtitle>Listado de Turnos y Licencias</Subtitle>

      {/* 🧾 Tabla */}
      <Table headers={[ "N°", "Turno","Localidad", "Cantidad de días", "Días de descanso", "Guardia Pasiva?", "Es Laboral?", "Notas", "Color"]}>
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
              <td className="px-6 py-3">{tur.localidades?.localidad_nombre|| "Sin Localidad" }</td>
              <td className="px-6 py-3">{tur.turno_cantidad_dias }</td>
              <td className="px-6 py-3">{tur.turno_cantidad_dias_descanso }</td>
              <td className="px-6 py-3">{tur.turno_tiene_guardia_pasiva === 1 ? "Sí" : "No"}</td>
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
        <Button
           variant="warning"
           onClick={() => {
           if (!TurnoSeleccionado) return
            setTurnoEditando({
                        ...TurnoSeleccionado,
                        // Aseguramos que existan los IDs crudos para selects:
                        // empleado_id_funcion: empleadoSeleccionado.empleado_id_funcion ?? "",
                        // empleado_id_sector: empleadoSeleccionado.empleado_id_sector ?? "",
                        // empleado_id_turno: empleadoSeleccionado.empleado_id_turno ?? "",
                        turno_id_localidad: TurnoSeleccionado.turno_id_localidad ?? TurnoSeleccionado.localidades?.id_localidad ?? "",
                      })
                    }}
                    disabled={!TurnoSeleccionado}
                    className={!TurnoSeleccionado ? "opacity-50 cursor-not-allowed" : ""}
                >
                  Modificar
                </Button>

        <Button
          variant="danger"
          onClick={() => setTurnoEliminar(TurnoSeleccionado)}
          disabled={!TurnoSeleccionado}
          className={!TurnoSeleccionado ? "opacity-50 cursor-not-allowed" : ""}
        >
          Eliminar
        </Button>

<ModalAddItem title="Agregar Turno" buttonLabel="Agregar" onSubmit={handleAgregar}>
      <TurnoForm turno={nuevoTurno} setTurno={setNuevoTurno} localidades={localidades} />
    </ModalAddItem>
        
      </div>

      {/* Modal editar */}
      {TurnoEditando && (<Modal title="Editar Turno" onClose={() => setTurnoEditando(null)}>
      <form onSubmit={handleEditarSubmit} className="space-y-4 max-h-[80vh] overflow-y-auto pr-2">
        <TurnoForm turno={TurnoEditando} setTurno={setTurnoEditando} localidades={localidades} />
        <div className="flex justify-end gap-2 pt-2 sticky bottom-0 bg-white border-t">
          <Button variant="gray"onClick={() => setTurnoEditando(null)}>Cancelar</Button>
          <Button type="submit" variant="warning">Guardar</Button>
        </div>
      </form>
    </Modal>
    )}
      {/* Modal eliminar */}
      {TurnoEliminar && (
        <Modal title="Eliminar Turno" onClose={() => setTurnoEliminar(null)}>
          <p className="mb-6 text-center">
            ¿Seguro que deseas eliminar el Turno{" "}
            <b>"{TurnoEliminar.turno_nombre}"</b>?
          </p>
          <div className="flex justify-center gap-2">
            <Button variant="gray" onClick={() => setTurnoEliminar(null)}>
              Cancelar
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                eliminarTurno(TurnoEliminar.id_turno)
                setTurnoEliminar(null)
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
