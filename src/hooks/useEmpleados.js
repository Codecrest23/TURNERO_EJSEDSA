import { useState, useEffect } from "react"
import { supabase } from "../lib/supabaseClient"

export function useEmpleados() {
  const [empleados, setEmpleados] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchEmpleados()
  }, [])

  async function fetchEmpleados() {
    const { data, error } = await supabase
      .from("empleados")
      .select(`
        id_empleado,
        empleado_nombre_apellido,
        funciones_empleados ( funcion_empleado_nombre ),
        sectores_empleados ( sector_empleado_nombre ),
        localidades ( localidad_nombre )
      `)

    if (error) {
      console.error("Error al obtener empleados:", error.message)
    } else {
      setEmpleados(data)
    }
    setLoading(false)
  }

  async function agregarEmpleado(nuevoEmpleado) {
    const { data, error } = await supabase
      .from("empleados")
      .insert([nuevoEmpleado])
      .select()

    if (error) {
      console.error("Error al insertar empleado:", error.message)
    } else {
      setEmpleados((prev) => [...prev, ...data])
    }
  }

  return { empleados, loading, agregarEmpleado }
}
