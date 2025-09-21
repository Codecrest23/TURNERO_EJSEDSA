import { useEffect, useState } from "react"
import { supabase } from "../lib/supabaseClient"

export default function Empleados() {
  const [empleados, setEmpleados] = useState([])
  const [nuevoEmpleado, setNuevoEmpleado] = useState({
    empleado_nombre_apellido: "",
    empleado_id_funcion: "",
    empleado_id_sector: "",
  })

  // 🔹 Cargar empleados al montar el componente
  useEffect(() => {
    fetchEmpleados()
  }, [])

  // Obtener empleados desde supabase
  async function fetchEmpleados() {
    const { data, error } = await supabase
      .from("empleados")
      .select("id_empleado, empleado_nombre_apellido, empleado_id_funcion, empleado_id_sector")

    if (error) {
      console.error("Error al obtener empleados:", error.message)
    } else {
      setEmpleados(data)
      console.log("Empleados obtenidos:", data)
    }
  }

  // Agregar nuevo empleado
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
    <div style={{ padding: "2rem" }}>
      <h1>📋 Listado de Empleados</h1>
      <ul>
        {empleados.map((emp) => (
          <li key={emp.id_empleado}>
            {emp.empleado_nombre_apellido} (Función: {emp.empleado_id_funcion}, Sector: {emp.empleado_id_sector})
          </li>
        ))}
      </ul>

      <h2>➕ Agregar Empleado</h2>
      <form onSubmit={agregarEmpleado}>
        <input
          type="text"
          placeholder="Nombre y Apellido"
          value={nuevoEmpleado.empleado_nombre_apellido}
          onChange={(e) =>
            setNuevoEmpleado({ ...nuevoEmpleado, empleado_nombre_apellido: e.target.value })
          }
          required
        />
        <input
          type="number"
          placeholder="ID Función"
          value={nuevoEmpleado.empleado_id_funcion}
          onChange={(e) =>
            setNuevoEmpleado({ ...nuevoEmpleado, empleado_id_funcion: e.target.value })
          }
          required
        />
        <input
          type="number"
          placeholder="ID Sector"
          value={nuevoEmpleado.empleado_id_sector}
          onChange={(e) =>
            setNuevoEmpleado({ ...nuevoEmpleado, empleado_id_sector: e.target.value })
          }
          required
        />
        <button type="submit">Agregar</button>
      </form>
    </div>
  )
}
