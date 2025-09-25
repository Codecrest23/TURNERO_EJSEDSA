import { useState } from "react"
import { useZonas } from "../hooks/useZonas"

export default function Zonas() {
  const { zonas, loading, agregarZonas } = useZonas()
  const [nuevaZona, setNuevaZona] = useState({
    zona_nombre: ""
  })

  // manejar submit
  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!nuevaZona.zona_nombre.trim()) {
      console.log("Campo vacío")
      return
    }
    try {
      await agregarZonas(nuevaZona)
      setNuevaZona({ zona_nombre: "" }) // limpiar form
    } catch (error) {
      console.error("Error en handleSubmit:", error)
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
        <button
          type="submit"
          className="bg-blue-600 text-white rounded px-4 py-2 hover:bg-blue-700 transition"
        >
          Agregar
        </button>
      </form>
    </div>
  </div>
)

}
