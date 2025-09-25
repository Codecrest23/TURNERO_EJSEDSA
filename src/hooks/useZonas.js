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
    //para ver si estoy autenticado
//     const { data: { user }, error: authError } = await supabase.auth.getUser()
  
//   if (authError) {
//     console.error("Error de autenticación:", authError.message)
//     return
//   }
  
//   if (!user) {
//     console.error("Usuario no autenticado")
//     return
//   }
  
//   console.log("Usuario autenticado:", user.email)
    // fin para ver si estoy autenticado

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

  return { zonas,loading, agregarZonas }
}
