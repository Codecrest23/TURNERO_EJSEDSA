import { useState } from "react"
import { useTurnos } from "../hooks/useTurnos"
import Table from "../components/ui/Table"
import Button from "../components/ui/Button"
import ModalAddItem from "../components/ui/ModalAddItem"
import Modal from "../components/ui/Modal"
import { Title, Subtitle } from "../components/ui/Typography"
import {Clock, CirclePlus } from "lucide-react"
import { useLocalidades } from "../hooks/useLocalidades"

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

        {/*<Button
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
          <input
            type="text"
            placeholder="Nombre del Turno"
            value={nuevoTurno.turno_nombre}
            onChange={(e) =>
              setNuevoTurno({ ...nuevoTurno, turno_nombre: e.target.value })
            }
            className="border rounded px-3 py-2 w-full"
            required
          />
          <select
            value={nuevoTurno.turno_id_localidad}
            onChange={(e) =>
              setNuevoTurno({ ...nuevoTurno, turno_id_localidad: e.target.value })
            }
            className="border rounded px-3 py-2 w-full"
            required
          >
            <option value="" >Seleccionar Localidad</option>
            {localidades.map((loc) => (
              <option key={loc.id_localidad} value={loc.id_localidad}>
                {loc.localidad_nombre}
              </option>
            ))}
          </select>
          <input
            type="number"
            placeholder="Cantidad de Días"
            value={nuevoTurno.turno_cantidad_dias}
            onChange={(e) =>
              setNuevoTurno({ ...nuevoTurno, turno_cantidad_dias: e.target.value })
            }
            className="border rounded px-3 py-2 w-full"
            required
          />
          <input
            type="number"
            placeholder="Días de descanso"
            value={nuevoTurno.turno_cantidad_dias_descanso}
            onChange={(e) =>
              setNuevoTurno({ ...nuevoTurno, turno_cantidad_dias_descanso: e.target.value })
            }
            className="border rounded px-3 py-2 w-full"
            required
          />
{/*TOGLE de guardia pasiva si o no*/ }
<div className="flex items-center justify-between px-1 py-2">
  <span className="text-gray-700 font-medium">¿Tiene guardia pasiva?</span>

  <div className="flex items-center gap-3">
    <span
      className={`text-sm font-medium transition-colors ${
        nuevoTurno.turno_tiene_guardia_pasiva === 1
          ? "text-gray-400"
          : "text-gray-800"
      }`}
    >
      No
    </span>

    <label className="relative inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        checked={nuevoTurno.turno_tiene_guardia_pasiva === 1}
        onChange={(e) =>
          setNuevoTurno({
            ...nuevoTurno,
            turno_tiene_guardia_pasiva: e.target.checked ? 1 : 0,
          })
        }
        className="sr-only peer"
      />
      <div className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:bg-blue-600 peer-focus:ring-2 peer-focus:ring-blue-300 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></div>
    </label>

    <span
      className={`text-sm font-medium transition-colors ${
        nuevoTurno.turno_tiene_guardia_pasiva === 1
          ? "text-blue-600"
          : "text-gray-400"
      }`}
    >
      Sí
    </span>
  </div>
</div>

{/*FIN de TOGLE de guardia pasiva si o no*/ }
          <select 
            value={nuevoTurno.turno_es_laboral}
            onChange={(e) =>
              setNuevoTurno({ ...nuevoTurno, turno_es_laboral: e.target.value })
            }
            className="border rounded px-3 py-2 w-full"
            required
          >
            <option value="" disabled hidden>
             Es laboral?
            </option>
            <option>Si</option>
            <option>No</option>
            
          </select>

{/* 📝 Comentarios */}
<div className="flex flex-col gap-1">
  <label htmlFor="comentarios" className="text-gray-700 font-medium">
    Comentarios
  </label>
  <textarea
    id="comentarios"
    placeholder="Notas o detalles sobre el turno..."
    value={nuevoTurno.turno_comentarios}
    onChange={(e) =>
      setNuevoTurno({
        ...nuevoTurno,
        turno_comentarios: e.target.value,
      })
    }
    className="border rounded px-3 py-2 w-full min-h-[80px] resize-y focus:ring-2 focus:ring-blue-500 focus:outline-none"
  ></textarea>
</div>

{/* 🎨 Selector de color */}
<div className="flex flex-col gap-1 mt-3 ">
  <label htmlFor="color" className="text-gray-700 font-medium">
    Color del turno
  </label>
  <div className="flex items-center gap-3">
    <input
      id="color"
      type="color"
      value={nuevoTurno.turno_color || "#000000"}
      onChange={(e) =>
        setNuevoTurno({
          ...nuevoTurno,
          turno_color: e.target.value,
        })
      }
      className="w-10 h-10 border border-gray-300 rounded-md cursor-pointer shadow-sm transition-transform hover:scale-105"
    />
    <span className="text-gray-600 font-mono">{nuevoTurno.turno_color}</span>
  </div>
</div>

        </ModalAddItem>
        
      </div>

      {/* Modal editar */}
      {TurnoEditando && (
  <Modal title="Editar Turno" onClose={() => setTurnoEditando(null)}>
    <form onSubmit={handleEditarSubmit} className="space-y-4">
      {/* 🏷️ Nombre del turno */}
      <input
        type="text"
        value={TurnoEditando.turno_nombre}
        onChange={(e) =>
          setTurnoEditando({
            ...TurnoEditando,
            turno_nombre: e.target.value,
          })
        }
        placeholder="Nombre del Turno"
        className="border w-full px-3 py-2 rounded"
        required
      />

      {/* 📍 Localidad */}
      <select
        value={
          TurnoEditando.turno_id_localidad ??
          TurnoEditando.localidades?.id_localidad ??
          ""
        }
        onChange={(e) =>
          setTurnoEditando({
            ...TurnoEditando,
            turno_id_localidad: e.target.value,
          })
        }
        className="border rounded px-3 py-2 w-full"
      >
        <option value="">Seleccionar Localidad</option>
        {localidades.map((loc) => (
          <option key={loc.id_localidad} value={loc.id_localidad}>
            {loc.localidad_nombre}
          </option>
        ))}
      </select>

      {/* 📆 Cantidad de días */}
      <input
        type="number"
        placeholder="Cantidad de Días"
        value={TurnoEditando.turno_cantidad_dias || ""}
        onChange={(e) =>
          setTurnoEditando({
            ...TurnoEditando,
            turno_cantidad_dias: e.target.value,
          })
        }
        className="border rounded px-3 py-2 w-full"
        required
      />

      {/* 🌤️ Días de descanso */}
      <input
        type="number"
        placeholder="Días de descanso"
        value={TurnoEditando.turno_cantidad_dias_descanso || ""}
        onChange={(e) =>
          setTurnoEditando({
            ...TurnoEditando,
            turno_cantidad_dias_descanso: e.target.value,
          })
        }
        className="border rounded px-3 py-2 w-full"
        required
      />

      {/* 🟦 Guardia pasiva toggle */}
      <div className="flex items-center justify-between px-1 py-2">
        <span className="text-gray-700 font-medium">¿Tiene guardia pasiva?</span>

        <div className="flex items-center gap-3">
          <span
            className={`text-sm font-medium transition-colors ${
              TurnoEditando.turno_tiene_guardia_pasiva === 1
                ? "text-gray-400"
                : "text-gray-800"
            }`}
          >
            No
          </span>

          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={TurnoEditando.turno_tiene_guardia_pasiva === 1}
              onChange={(e) =>
                setTurnoEditando({
                  ...TurnoEditando,
                  turno_tiene_guardia_pasiva: e.target.checked ? 1 : 0,
                })
              }
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:bg-blue-600 peer-focus:ring-2 peer-focus:ring-blue-300 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></div>
          </label>

          <span
            className={`text-sm font-medium transition-colors ${
              TurnoEditando.turno_tiene_guardia_pasiva === 1
                ? "text-blue-600"
                : "text-gray-400"
            }`}
          >
            Sí
          </span>
        </div>
      </div>

      {/* 💼 Es laboral */}
      <select
        value={TurnoEditando.turno_es_laboral || ""}
        onChange={(e) =>
          setTurnoEditando({
            ...TurnoEditando,
            turno_es_laboral: e.target.value,
          })
        }
        className="border rounded px-3 py-2 w-full"
        required
      >
        <option value="" disabled hidden>
          Es laboral?
        </option>
        <option>Si</option>
        <option>No</option>
      </select>

      {/* 📝 Comentarios */}
      <div className="flex flex-col gap-1">
        <label htmlFor="comentarios" className="text-gray-700 font-medium">
          Comentarios
        </label>
        <textarea
          id="comentarios"
          placeholder="Notas o detalles sobre el turno..."
          value={TurnoEditando.turno_comentarios || ""}
          onChange={(e) =>
            setTurnoEditando({
              ...TurnoEditando,
              turno_comentarios: e.target.value,
            })
          }
          className="border rounded px-3 py-2 w-full min-h-[80px] resize-y focus:ring-2 focus:ring-blue-500 focus:outline-none"
        ></textarea>
      </div>

      {/* 🎨 Selector de color */}
      <div className="flex flex-col gap-1 mt-3">
        <label htmlFor="color" className="text-gray-700 font-medium">
          Color del turno
        </label>
        <div className="flex items-center gap-3">
          <input
            id="color"
            type="color"
            value={TurnoEditando.turno_color || "#000000"}
            onChange={(e) =>
              setTurnoEditando({
                ...TurnoEditando,
                turno_color: e.target.value,
              })
            }
            className="w-10 h-10 border border-gray-300 rounded-md cursor-pointer shadow-sm transition-transform hover:scale-105"
          />
          <span className="text-gray-600 font-mono">
            {TurnoEditando.turno_color}
          </span>
        </div>
      </div>

      {/* Botones */}
      <div className="flex justify-end gap-2 pt-2">
        <Button variant="gray" onClick={() => setTurnoEditando(null)}>
          Cancelar
        </Button>
        <Button type="submit" variant="warning">
          Guardar
        </Button>
      </div>
    </form>
  </Modal>
)}


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
