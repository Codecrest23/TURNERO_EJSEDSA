import { useState, useEffect } from "react"
import { supabase } from "../lib/supabaseClient"

export function useFuncionesSectores() {
  const [funciones, setFunciones] = useState([])
  const [sectores, setSectores] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchFunciones()
    fetchSectores()
  }, [])

  // 🧱 FUNCIONES -----------------------
  async function fetchFunciones() {
    const { data, error } = await supabase
      .from("funciones_empleados")
      .select("funcion_empleado_id, funcion_empleado_nombre")
      .order("funcion_empleado_id", { ascending: true })

    if (error) console.error("Error al obtener funciones:", error.message)
    else setFunciones(data)
    setLoading(false)
  }

  async function agregarFuncion(nuevaFuncion) {
    const { data, error } = await supabase
      .from("funciones_empleados")
      .insert([nuevaFuncion])
      .select()

    if (error) console.error("Error al agregar función:", error.message)
    else setFunciones((prev) => [...prev, ...data])
  }

  async function modificarFuncion(id, dataEditada) {
    const { error } = await supabase
      .from("funciones_empleados")
      .update(dataEditada)
      .eq("funcion_empleado_id", id)

    if (error) console.error("Error al modificar función:", error.message)
    else fetchFunciones()
  }

  async function eliminarFuncion(id) {
    const { error } = await supabase
      .from("funciones_empleados")
      .delete()
      .eq("funcion_empleado_id", id)

    if (error) {console.error("Error al eliminar función:", error.message)
      return{error};
    }
    else {fetchFunciones()}
  }

  // 🧱 SECTORES -----------------------
  async function fetchSectores() {
    const { data, error } = await supabase
      .from("sectores_empleados")
      .select("id_sector_empleado, sector_empleado_nombre")
      .order("id_sector_empleado", { ascending: true })

    if (error) console.error("Error al obtener sectores:", error.message)
    else setSectores(data)
  }

  async function agregarSector(nuevoSector) {
    const { data, error } = await supabase
      .from("sectores_empleados")
      .insert([nuevoSector])
      .select()

    if (error) console.error("Error al agregar sector:", error.message)
    else setSectores((prev) => [...prev, ...data])
  }

  async function modificarSector(id, dataEditada) {
    const { error } = await supabase
      .from("sectores_empleados")
      .update(dataEditada)
      .eq("id_sector_empleado", id)

    if (error) console.error("Error al modificar sector:", error.message)
    else fetchSectores()
  }

  async function eliminarSector(id) {
    const { error } = await supabase
      .from("sectores_empleados")
      .delete()
      .eq("id_sector_empleado", id)

    if (error) {console.error("Error al eliminar sector:", error.message)
      return { error };
    }
    else {fetchSectores()}
  }

  return {
    funciones,
    sectores,
    loading,
    agregarFuncion,
    modificarFuncion,
    eliminarFuncion,
    agregarSector,
    modificarSector,
    eliminarSector,
  }
}
