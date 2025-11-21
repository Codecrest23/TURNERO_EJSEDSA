import { useState } from "react"
import { useLocalidades } from "../hooks/useLocalidades"
import Table from "../components/ui/Table"
import Button from "../components/ui/Button"
import ModalAddItem from "../components/ui/ModalAddItem"
import Modal from "../components/ui/Modal"
import { Title, Subtitle } from "../components/ui/Typography"
import {Map, CirclePlus } from "lucide-react"
import ModalFKError from "../components/ui/ModalFKError";
import ModalPKError from "../components/ui/ModalPKError"

export default function Localidades() {
  const {
    localidades,
    zonas,
    loading,
    agregarLocalidad,
    modificarLocalidad,
    eliminarLocalidad,
  } = useLocalidades()

  const [nuevaLocalidad, setNuevaLocalidad] = useState({localidad_nombre: "",localidad_id_zona: "",})
  const [localidadEditando, setLocalidadEditando] = useState(null)
  const [localidadEliminar, setLocalidadEliminar] = useState(null)
  const [localidadSeleccionada, setLocalidadSeleccionada] = useState(null)
  const [errorFK, setErrorFK] = useState(false);
  const [errorPK, setErrorPK] = useState(false);
  if (loading) return <p>Cargando...</p>

  //  Agregar
  const handleAgregar = async (e) => {
    e.preventDefault()
    const resultado=await agregarLocalidad(nuevaLocalidad)
    if (resultado?.error?.code === "23505") {
    setErrorPK(true);       // Mostrar modal “Nombre duplicado”
    return false;                 // NO cerrar modal de edición
  }
    setNuevaLocalidad({ localidad_nombre: "", localidad_id_zona: "" })
  }

  //  Editar
  const handleEditarSubmit = async (e) => {
    e.preventDefault()
    const resultado=await modificarLocalidad(localidadEditando.id_localidad, {
      localidad_nombre: localidadEditando.localidad_nombre,
      localidad_id_zona: localidadEditando.localidad_id_zona,
    })
    if (resultado?.error?.code === "23505") {
    setErrorPK(true);       // Mostrar modal “Nombre duplicado”
    return;                 // NO cerrar modal de edición
  }
    setLocalidadEditando(null)
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <Title>
        <div className="flex items-center gap-2">
          <Map className="w-6 h-6 text-gray-700" />
          Localidades
        </div>
      </Title>
      <Subtitle>Listado de localidades con su zona asignada</Subtitle>

      {/* 🧾 Tabla */}
      <Table headers={["N°", "Localidad", "Zona"]}>
          {localidades.map((loc, index) => (
            <tr
              key={loc.id_localidad}
              onClick={() => setLocalidadSeleccionada(localidadSeleccionada?.id_localidad === loc.id_localidad ? null : loc)}
              className={`border-b hover:bg-gray-100 transition cursor-pointer ${
                localidadSeleccionada?.id_localidad === loc.id_localidad
                  ? "bg-blue-100"
                  : ""
              }`}
            >
              <td className="px-6 py-3">{index + 1}</td>
              <td className="px-6 py-3">{loc.localidad_nombre}</td>
              <td className="px-6 py-3">{loc.zonas?.zona_nombre || "Sin zona"}</td>
            </tr>
          ))}
      </Table>


      {/* Modal agregar y botonoes */}
      <div className="flex justify-end gap-2 mt-4">
        <Button
          variant="warning"
          onClick={() => setLocalidadEditando({...localidadSeleccionada, localidad_id_zona: localidadSeleccionada?.zonas?.id_zona || "",})}
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
        </Button>

        <ModalAddItem
          title="Agregar Localidad"
          buttonLabel={
            <span className="flex items-center gap-1">
              <CirclePlus className="w-5 h-5 text-white-700" /> Agregar
            </span>
          }
          onSubmit={handleAgregar}
        >
          <input
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
            <option value=""  disabled hidden>Seleccionar zona</option>
            {zonas.map((z) => (
              <option key={z.id_zona} value={z.id_zona}>
                {z.zona_nombre}
              </option>
            ))}
          </select>
        </ModalAddItem>
        
      </div>

      {/* Modal editar */}
      {localidadEditando && (
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
      )}

      {/* Modal eliminar */}
      {localidadEliminar && (
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
              onClick={async() => {
                const resultado = await eliminarLocalidad(localidadEliminar.id_localidad)
                if (resultado?.error?.code==="23503")
                  {setErrorFK(true)
                  setLocalidadEliminar(null)
                  return;
                  }
                setLocalidadEliminar(null)
              }}
            >
              Sí, eliminar
            </Button>
          </div>
        </Modal>
      )}
        {/* 🛑 Modal de Error por FK y PK*/}
      {errorFK && (
              <ModalFKError onClose={() => setErrorFK(false)} />
       )}
      {errorPK && (
              <ModalPKError onClose={() => setErrorPK(false)} />
            )}
    </div>
  )
}
