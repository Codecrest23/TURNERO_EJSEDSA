import { useState, useEffect } from "react"
import { supabase } from "../lib/supabaseClient"

export function useZonas() {
  const [zonas, setZonas] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchzonas()
  }, [])
//Buscar Zona
  async function fetchzonas() {
    const { data, error } = await supabase
      .from("zonas")
      .select(`
        id_zona,
        zona_nombre,
        zona_cantidad_localidades,
        zona_cantidad_empleados
      `)

    if (error) {
      console.error("Error al obtener Zonas:", error.message)
    } else {
      setZonas(data)
    }
   setLoading(false)
  }
  //Agregar Zona
  async function agregarZonas(nuevaZona) {
    const { data, error } = await supabase
      .from("zonas")
      .insert([nuevaZona])
      .select()

    if (error) {
      console.error("Error al insertar la Zona:", error.message)
    } else {
      setZonas((prev) => [...prev, ...data])
    }
  }
  //Modificar una zona
  async function modificarZona(id_zona, camposActualizados) {
    const { data, error } = await supabase
      .from("zonas")
      .update(camposActualizados) // { zona_nombre: "...", zona_cantidad_empleados: ... }
      .eq("id_zona", id_zona)
      .select()

    if (error) {
      console.error("Error al modificar la Zona:", error.message)
    } else {
      setZonas((prev) =>
        prev.map((z) => (z.id_zona === id_zona ? { ...z, ...data[0] } : z))
      )
    }
  }

  //Eliminar una zona
  async function eliminarZona(id_zona) {
    const { error } = await supabase
      .from("zonas")
      .delete()
      .eq("id_zona", id_zona)

    if (error) {
      console.error("Error al eliminar la Zona:", error.message)
      return { error };
    } else {
      setZonas((prev) => prev.filter((z) => z.id_zona !== id_zona))
    }
  }
  return { zonas,loading, agregarZonas, modificarZona, eliminarZona }
}
