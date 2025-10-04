import { useState } from "react"
import { useZonas } from "../hooks/useZonas"

export default function Zonas() {
  const { zonas, loading, agregarZonas, modificarZona, eliminarZona } = useZonas()
  const [nuevaZona, setNuevaZona] = useState({
    zona_nombre: "",
    zona_cantidad_localidades:null,
    zona_cantidad_empleados:null
  })

  // manejar submit de AGREGAR
  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!nuevaZona.zona_nombre.trim()) {
      console.log("Campo vacío")
      return
    }
    try {
      await agregarZonas(nuevaZona)
      setNuevaZona({ zona_nombre: "",zona_cantidad_localidades:"",zona_cantidad_empleados:""}) // limpiar form

    } catch (error) {
      console.error("Error en handleSubmit:", error)
    }
  }
// manejar submit de EDITAR
  const [zonaEditando, setZonaEditando] = useState(null) 
  const handleEditarSubmit = async (e) => {
    e.preventDefault()
    const confirmar = window.confirm(
    `¿Seguro que deseas guardar los cambios en la zona "${zonaEditando.zona_nombre}"?`)
  if (!confirmar) return // si cancela, no hace nada
    try {
      await modificarZona(zonaEditando.id_zona, {
        zona_nombre: zonaEditando.zona_nombre,
        zona_cantidad_localidades: zonaEditando.zona_cantidad_localidades,
        zona_cantidad_empleados: zonaEditando.zona_cantidad_empleados
      })
      setZonaEditando(null) // cerrar modal
    } catch (error) {
      console.error("Error en editar:", error)
    }
  }

  if (loading) return <p>Cargando...</p>

return (
  <div className="max-w-5xl mx-auto space-y-8">
    <div>
      <h1 className="text-3xl font-bold mb-6">Zonas</h1>
      <h2 className="text-xl font-semibold mb-4">Listado</h2>

      {/* Tabla de zonas */}
      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="min-w-full text-sm text-left text-gray-600">
          <thead className="bg-gray-200 text-xs uppercase text-gray-700">
            <tr>
              <th className="px-6 py-3">N°</th>
              <th className="px-6 py-3">Zona</th>
              <th className="px-6 py-3">Cantidad Localidades</th>
              <th className="px-6 py-3">Cantidad de Empleados</th>
              <th className="px-6 py-3">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {zonas.map((zon, index) => (
              <tr
                key={zon.id_zona}
                className="border-b hover:bg-gray-50 transition"
              >
                <td className="px-6 py-3">{index + 1}</td>
                <td className="px-6 py-3">{zon.zona_nombre}</td>
                <td className="px-6 py-3">{zon.zona_cantidad_localidades}</td>
                <td className="px-6 py-3">{zon.zona_cantidad_empleados}</td>
                <td className="px-6 py-3 flex gap-2">
                  <button
                      onClick={() => setZonaEditando(zon)}
                      className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600">
                      Editar
                    </button>
                  <button
                  onClick={() => {if (window.confirm(`¿Seguro desea eliminar la Zona "${zon.zona_nombre}"?`)) { eliminarZona(zon.id_zona)}}}
                  className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700">
                    Eliminar
                    </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>

    {/* Formulario agregar */}
    <div className="bg-white p-6 shadow-md rounded-lg">
      <h2 className="text-xl font-semibold mb-4">➕ Agregar Zona</h2>
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-4 gap-4"
      >
        <input
          type="text"
          placeholder="Nombre de Zona"
          value={nuevaZona.zona_nombre}
          onChange={(e) =>
            setNuevaZona({ ...nuevaZona, zona_nombre: e.target.value })
          }
          required
          className="border rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
        />
         <input
          type="number"
          placeholder="Cant. de Localidades"
          value={nuevaZona.zona_cantidad_localidades}
          onChange={(e) =>
            setNuevaZona({ ...nuevaZona, zona_cantidad_localidades: e.target.value })
          }
          
          className="border rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
        />
        <input
          type="text"
          placeholder="Cant. de Empleados"
          value={nuevaZona.zona_cantidad_empleados}
          onChange={(e) =>setNuevaZona({ ...nuevaZona, zona_cantidad_empleados: e.target.value })
          }
          
          className="border rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white rounded px-4 py-2 hover:bg-blue-700 transition"
        >
          Agregar
        </button>
      </form>
    </div>
     {zonaEditando && (
  <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
   
    {/* Contenedor del modal EDITAR */}
    <div className="bg-white p-6 rounded-xl shadow-xl w-96 animate-scale-in">
      <h2 className="text-xl font-bold mb-4 text-center">Editar Zona</h2>

      <form onSubmit={handleEditarSubmit} className="space-y-4">
        <input
          type="text"
          value={zonaEditando.zona_nombre}
          onChange={(e) =>
            setZonaEditando({ ...zonaEditando, zona_nombre: e.target.value })
          }
          className="border w-full px-3 py-2 rounded focus:outline-none focus:ring focus:ring-yellow-300"
        />
        <input
          type="number"
          value={zonaEditando.zona_cantidad_localidades}
          onChange={(e) =>
            setZonaEditando({
              ...zonaEditando,
              zona_cantidad_localidades: e.target.value,
            })
          }
          className="border w-full px-3 py-2 rounded focus:outline-none focus:ring focus:ring-yellow-300"
        />
        <input
          type="text"
          value={zonaEditando.zona_cantidad_empleados}
          onChange={(e) =>
            setZonaEditando({
              ...zonaEditando,
              zona_cantidad_empleados: e.target.value,
            })
          }
          className="border w-full px-3 py-2 rounded focus:outline-none focus:ring focus:ring-yellow-300"
        />

        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={() => setZonaEditando(null)}
            className="px-4 py-2 rounded bg-gray-400 text-white hover:bg-gray-500"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-4 py-2 rounded bg-yellow-500 text-white hover:bg-yellow-600"
          >
            Guardar
          </button>
        </div>
      </form>
    </div>
  </div>
)}   
  </div>
)

}
