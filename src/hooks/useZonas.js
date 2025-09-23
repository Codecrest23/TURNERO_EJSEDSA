import { useState, useEffect } from "react"
import { supabase } from "../lib/supabaseClient"

export function useZonas() {
  const [zonas, setZonas] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchzonas()
  }, [])

  async function fetchzonas() {
    const { data, error } = await supabase
      .from("zonas")
      .select(`
        id_zona,
        zona_nombre
      `)

    if (error) {
      console.error("Error al obtener Zonas:", error.message)
    } else {
      setZonas(data)
    }
   setLoading(false)
  }

  async function agregarZonas(nuevaZona) {
    const { data, error } = await supabase
      .from("Zonas")
      .insert([nuevaZona])
      .select()

    if (error) {
      console.error("Error al insertar la Zona:", error.message)
    } else {
      setZonas((prev) => [...prev, ...data])
    }
  }

  return { zonas,loading, agregarZonas }
}
