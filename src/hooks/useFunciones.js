import { useState, useEffect } from "react"
import { supabase } from "../lib/supabaseClient"

export function useFunciones() {
  const [funciones, setFunciones] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchFunciones()
  }, [])

  // 🔹 Obtener funciones
  async function fetchFunciones() {
    const { data, error } = await supabase
      .from("funciones_empleados")
      .select("funcion_empleado_id, funcion_empleado_nombre")
      .order("funcion_empleado_nombre", { ascending: true })

    if (error) {
      console.error("Error al obtener funciones:", error.message)
    } else {
      setFunciones(data)
    }
    setLoading(false)
  }

  // 🔹 Agregar función
  async function agregarFuncion(nuevaFuncion) {
    const { data, error } = await supabase
      .from("funciones_empleados")
      .insert([nuevaFuncion])
      .select("funcion_empleado_id, funcion_empleado_nombre")

    if (error) {
      console.error("Error al agregar función:", error.message)
    } else {
      setFunciones((prev) => [...prev, ...data])
    }
  }

  // 🔹 Modificar función
  async function modificarFuncion(id, camposActualizados) {
    const { data, error } = await supabase
      .from("funciones_empleados")
      .update(camposActualizados)
      .eq("funcion_empleado_id", id)
      .select("funcion_empleado_id, funcion_empleado_nombre")

    if (error) {
      console.error("Error al modificar función:", error.message)
    } else {
      setFunciones((prev) =>
        prev.map((f) => (f.funcion_empleado_id === id ? data[0] : f))
      )
    }
  }

  // 🔹 Eliminar función
  async function eliminarFuncion(id) {
    const { error } = await supabase
      .from("funciones_empleados")
      .delete()
      .eq("funcion_empleado_id", id)

    if (error) {
      console.error("Error al eliminar función:", error.message)
    } else {
      setFunciones((prev) => prev.filter((f) => f.funcion_empleado_id !== id))
    }
  }

  return { funciones, loading, agregarFuncion, modificarFuncion, eliminarFuncion }
}
