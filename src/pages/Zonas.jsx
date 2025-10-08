import { useState } from "react"
import { useZonas } from "../hooks/useZonas"
import Table from "../components/ui/Table"
import Button from "../components/ui/Button"
import Modal from "../components/ui/Modal"
import AddItem from "../components/ui/ModalAddItem"
import { Title, Subtitle } from "../components/ui/Typography"
import ConfirmModal from "../components/ui/ConfirmModal"
import {LayoutGrid,CirclePlus, PencilLine, Trash,CheckCircle2,ShieldCheck} from "lucide-react"

export default function Zonas() {
  const { zonas, loading, agregarZonas, modificarZona, eliminarZona } = useZonas()
  const [nuevaZona, setNuevaZona] = useState({
    zona_nombre: "",
    zona_cantidad_localidades: null,
    zona_cantidad_empleados: ""
  })

  const [zonaEditando, setZonaEditando] = useState(null)
  const [zonaEliminar, setZonaEliminar] = useState(null)
  const [confirmarEdicion, setConfirmarEdicion] = useState(false)

  if (loading) return <p>Cargando...</p>

  // 🔹 Agregar zona
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!nuevaZona.zona_nombre.trim()) return
    await agregarZonas(nuevaZona)
    setNuevaZona({ zona_nombre: "", zona_cantidad_localidades: "", zona_cantidad_empleados: "" })
  }

  // 🔹 Guardar edición
  const handleEditarSubmit = (e) => {
   e.preventDefault()
   setConfirmarEdicion(true)
  }


  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <Title>
      <div className="flex items-center gap-2">
        <LayoutGrid className="w-6 h-6 text-gray-700" />
        <span>Zonas</span>
      </div>
    </Title>

      <Subtitle>Listado de zonas</Subtitle>
      {/* Tabla con UI */}
      <Table headers={["N°", "Zona", "Localidades", "Empleados", "Acciones"]}>
        {zonas.map((zon, index) => (
          <tr key={zon.id_zona} className="border-b hover:bg-gray-50 transition">
            <td className="px-6 py-3">{index + 1}</td>
            <td className="px-6 py-3">{zon.zona_nombre}</td>
            <td className="px-6 py-3">{zon.zona_cantidad_localidades}</td>
            <td className="px-6 py-3">{zon.zona_cantidad_empleados}</td>
            <td className="px-6 py-3 flex gap-2">
              <Button variant="warning" onClick={() => setZonaEditando({ ...zon })}>
                Editar
              </Button>
              <Button variant="danger" onClick={() => setZonaEliminar(zon)}>
                Eliminar
              </Button>
            </td>
          </tr>
        ))}
      </Table>

      {/* Modal de agregar Zona */}
      <div className="flex justify-end">
        <AddItem title="Agregar Zona" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Nombre de Zona"
            value={nuevaZona.zona_nombre}
            onChange={(e) => setNuevaZona({ ...nuevaZona, zona_nombre: e.target.value })}
            className="border rounded px-3 py-2 w-full"
          />
          <input
            type="number"
            placeholder="Cant. Localidades"
            value={nuevaZona.zona_cantidad_localidades}
            onChange={(e) => setNuevaZona({ ...nuevaZona, zona_cantidad_localidades: e.target.value })}
            className="border rounded px-3 py-2 w-full"
          />
          <input
            type="text"
            placeholder="Cant. Empleados"
            value={nuevaZona.zona_cantidad_empleados}
            onChange={(e) => setNuevaZona({ ...nuevaZona, zona_cantidad_empleados: e.target.value })}
            className="border rounded px-3 py-2 w-full"
          />
        </AddItem>
      </div>

      {/* Modal editar */}
      {zonaEditando && (
        <Modal title="Editar Zona" onClose={() => setZonaEditando(null)}>
          <form onSubmit={handleEditarSubmit} className="space-y-4">
            <input
              type="text"
              value={zonaEditando.zona_nombre}
              onChange={(e) => setZonaEditando({ ...zonaEditando, zona_nombre: e.target.value })}
              className="border w-full px-3 py-2 rounded"
            />
            <input
              type="number"
              value={zonaEditando.zona_cantidad_localidades}
              onChange={(e) => setZonaEditando({ ...zonaEditando, zona_cantidad_localidades: e.target.value })}
              className="border w-full px-3 py-2 rounded"
            />
            <input
              type="text"
              value={zonaEditando.zona_cantidad_empleados}
              onChange={(e) => setZonaEditando({ ...zonaEditando, zona_cantidad_empleados: e.target.value })}
              className="border w-full px-3 py-2 rounded"
            />
            <div className="flex justify-end gap-2">
              <Button variant="gray" onClick={() => setZonaEditando(null)}>
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
      {zonaEliminar && (
        <Modal title="Eliminar Zona" onClose={() => setZonaEliminar(null)}>
          <p className="mb-6 text-center">
            ¿Seguro que deseas eliminar la zona <b>"{zonaEliminar.zona_nombre}"</b>?
          </p>
          <div className="flex justify-center gap-2">
            <Button variant="gray" onClick={() => setZonaEliminar(null)}>
              Cancelar
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                eliminarZona(zonaEliminar.id_zona)
                setZonaEliminar(null)
              }}
            >
              Sí, eliminar
            </Button>
          </div>
        </Modal>
      )}
      {confirmarEdicion && (
      <ConfirmModal
          title="Confirmar Cambios"
          message={`¿Seguro que deseas guardar los cambios en la zona "${zonaEditando.zona_nombre}"?`}
          variant="warning"
          onCancel={() => setConfirmarEdicion(false)}
          onConfirm={async () => {
        await modificarZona(zonaEditando.id_zona, zonaEditando)
        setConfirmarEdicion(false)
        setZonaEditando(null)
      }}/>
      )}

    </div>
  )
}
