import { useState, useEffect } from "react"
import { supabase } from "../lib/supabaseClient"

export function useSectores() {
  const [sectores, setSectores] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSectores()
  }, [])

  // 🔹 Obtener sectores
  async function fetchSectores() {
    const { data, error } = await supabase
      .from("sectores_empleados")
      .select("id_sector_empleado, sector_empleado_nombre")
      .order("sector_empleado_nombre", { ascending: true })

    if (error) {
      console.error("Error al obtener sectores:", error.message)
    } else {
      setSectores(data)
    }
    setLoading(false)
  }

  // 🔹 Agregar sector
  async function agregarSector(nuevoSector) {
    const { data, error } = await supabase
      .from("sectores_empleados")
      .insert([nuevoSector])
      .select("id_sector_empleado, sector_empleado_nombre")

    if (error) {
      console.error("Error al agregar sector:", error.message)
    } else {
      setSectores((prev) => [...prev, ...data])
    }
  }

  // 🔹 Modificar sector
  async function modificarSector(id, camposActualizados) {
    const { data, error } = await supabase
      .from("sectores_empleados")
      .update(camposActualizados)
      .eq("id_sector_empleado", id)
      .select("id_sector_empleado, sector_empleado_nombre")

    if (error) {
      console.error("Error al modificar sector:", error.message)
    } else {
      setSectores((prev) =>
        prev.map((s) => (s.id_sector_empleado === id ? data[0] : s))
      )
    }
  }

  // 🔹 Eliminar sector
  async function eliminarSector(id) {
    const { error } = await supabase
      .from("sectores_empleados")
      .delete()
      .eq("id_sector_empleado", id)

    if (error) {
      console.error("Error al eliminar sector:", error.message)
      return { error };
    } else {
      setSectores((prev) => prev.filter((s) => s.id_sector_empleado !== id))
    }
  }

  return { sectores, loading, agregarSector, modificarSector, eliminarSector }
}
