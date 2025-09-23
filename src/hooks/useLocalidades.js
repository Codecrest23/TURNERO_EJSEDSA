import { useState, useEffect } from "react"
import { supabase } from "../lib/supabaseClient"

export function useLocalidades() {
  const [localidades, setLocalidades] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchLocalidades()
  }, [])

  async function fetchLocalidades() {
    const { data, error } = await supabase
      .from("localidades")
      .select(`
        id_localidad,
        localidad_nombre,
        zonas (zona_nombre)
      `)

    if (error) {
      console.error("Error al obtener Localidaes:", error.message)
    } else {
      setLocalidades(data)
    }
   setLoading(false)
  }

  async function agregarLocalidades(nuevaLocalidad) {
    const { data, error } = await supabase
      .from("localidades")
      .insert([nuevaLocalidad])
      .select()

    if (error) {
      console.error("Error al insertar la Localidad:", error.message)
    } else {
      setLocalidades((prev) => [...prev, ...data])
    }
  }

  return { localidades,loading, agregarLocalidades }
}
