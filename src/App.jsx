import { useEffect, useState } from "react"
import { supabase } from "./supabaseClient"

function App() {
  const [empleados, setEmpleados] = useState([])
  const [nuevoEmpleado, setNuevoEmpleado] = useState({ nombre: "", apellido: "", puesto: "" })

  useEffect(() => {
    fetchEmpleados()
  }, [])

  async function fetchEmpleados() {
    const { data, error } = await supabase.from("empleados").select("*")
    if (error) console.error(error)
    else setEmpleados(data)
  }

  async function agregarEmpleado(e) {
    e.preventDefault()
    const { data, error } = await supabase
      .from("empleados")
      .insert([nuevoEmpleado])
      .select()
    if (error) console.error(error)
    else {
      setEmpleados([...empleados, ...data])
      setNuevoEmpleado({ nombre: "", apellido: "", puesto: "" })
    }
  }

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Listado de Empleados</h1>
      <ul>
        {empleados.map((emp) => (
          <li key={emp.id}>
            {emp.nombre} {emp.apellido} – {emp.puesto}
          </li>
        ))}
      </ul>

      <h2>Agregar Empleado</h2>
      <form onSubmit={agregarEmpleado}>
        <input
          type="text"
          placeholder="Nombre"
          value={nuevoEmpleado.nombre}
          onChange={(e) => setNuevoEmpleado({ ...nuevoEmpleado, nombre: e.target.value })}
        />
        <input
          type="text"
          placeholder="Apellido"
          value={nuevoEmpleado.apellido}
          onChange={(e) => setNuevoEmpleado({ ...nuevoEmpleado, apellido: e.target.value })}
        />
        <input
          type="text"
          placeholder="Puesto"
          value={nuevoEmpleado.puesto}
          onChange={(e) => setNuevoEmpleado({ ...nuevoEmpleado, puesto: e.target.value })}
        />
        <button type="submit">Agregar</button>
      </form>
    </div>
  )
}

export default App