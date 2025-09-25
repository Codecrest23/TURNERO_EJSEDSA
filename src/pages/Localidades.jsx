import { useEffect, useState } from "react"
import { useLocalidades } from "../hooks/useLocalidades"

export default function Localidades() {
  const { localidades,loading, agregarLocalidad } = useLocalidades()
  const [nuevalocalidad, setNuevaLocalidad] = useState({
    localidad_nombre: "",
    localidad_id_zona: ""
  })

  if (loading) return <p>Cargando...</p>

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-6">Localidades</h1>
        <h2 className="text-3xl font-bold mb-6">Listado</h2>
      {/* Tabla de empleados */}
      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="min-w-full text-sm text-left text-gray-600">
          <thead className="bg-gray-200 text-xs uppercase text-gray-700">
            <tr>
              <th className="px-6 py-3">Numero de Orden</th>
              <th className="px-6 py-3">Localidad</th>
              <th className="px-6 py-3">Zona</th>
            </tr>
          </thead>
          <tbody>
            {localidades.map((loc,index) => (
              <tr key={loc.id_localidad} className="border-b hover:bg-gray-50 transition">
                <td className="px-6 py-3">{index+1}</td>{/*Número de orden */}
                <td className="px-6 py-3">{loc.localidad_nombre}</td>
                <td className="px-6 py-3">{loc.zonas.zona_nombre}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Formulario agregar */}
      {/* <div className="mt-8 bg-white p-6 shadow-md rounded-lg">
        <h2 className="text-xl font-semibold mb-4">➕ Agregar Empleado</h2>
        <form onSubmit={agregarEmpleado} className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input
            type="text"
            placeholder="Nombre y Apellido"
            value={nuevoEmpleado.empleado_nombre_apellido}
            onChange={(e) => setNuevoEmpleado({ ...nuevoEmpleado, empleado_nombre_apellido: e.target.value })}
            required
            className="border rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
          />
          <input
            type="number"
            placeholder="ID Función"
            value={nuevoEmpleado.empleado_id_funcion}
            onChange={(e) => setNuevoEmpleado({ ...nuevoEmpleado, empleado_id_funcion: e.target.value })}
            required
            className="border rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
          />
          <input
            type="number"
            placeholder="ID Sector"
            value={nuevoEmpleado.empleado_id_sector}
            onChange={(e) => setNuevoEmpleado({ ...nuevoEmpleado, empleado_id_sector: e.target.value })}
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
      </div> */}
    </div>
  )
}