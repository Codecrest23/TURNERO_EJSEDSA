import { useEffect, useState } from "react"
import { supabase } from "../lib/supabaseClient"

export default function Empleados() {
  const [empleados, setEmpleados] = useState([])
  const [nuevoEmpleado, setNuevoEmpleado] = useState({
    empleado_nombre_apellido: "",
    empleado_id_funcion: "",
    empleado_id_sector: "",
  })

  useEffect(() => {
    fetchEmpleados()
  }, [])

  async function fetchEmpleados() {
    const { data, error } = await supabase
      .from("empleados")
      .select("id_empleado, empleado_nombre_apellido, empleado_id_funcion, empleado_id_sector")

    if (error) {
      console.error("Error al obtener empleados:", error.message)
    } else {
      setEmpleados(data)
    }
  }

  async function agregarEmpleado(e) {
    e.preventDefault()
    const { data, error } = await supabase
      .from("empleados")
      .insert([nuevoEmpleado])
      .select()

    if (error) {
      console.error("Error al insertar empleado:", error.message)
    } else {
      setEmpleados([...empleados, ...data])
      setNuevoEmpleado({
        empleado_nombre_apellido: "",
        empleado_id_funcion: "",
        empleado_id_sector: "",
      })
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-6">Empleados</h1>
        <h2 className="text-3xl font-bold mb-6">Listado</h2>
      {/* Tabla de empleados */}
      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="min-w-full text-sm text-left text-gray-600">
          <thead className="bg-gray-200 text-xs uppercase text-gray-700">
            <tr>
              <th className="px-6 py-3">ID</th>
              <th className="px-6 py-3">Nombre y Apellido</th>
              <th className="px-6 py-3">Función</th>
              <th className="px-6 py-3">Sector</th>
            </tr>
          </thead>
          <tbody>
            {empleados.map((emp) => (
              <tr key={emp.id_empleado} className="border-b hover:bg-gray-50 transition">
                <td className="px-6 py-3">{emp.id_empleado}</td>
                <td className="px-6 py-3">{emp.empleado_nombre_apellido}</td>
                <td className="px-6 py-3">{emp.empleado_id_funcion}</td>
                <td className="px-6 py-3">{emp.empleado_id_sector}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Formulario agregar */}
      <div className="mt-8 bg-white p-6 shadow-md rounded-lg">
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
      </div>
    </div>
  )
}