import { useState, useEffect } from "react"
import { supabase } from "../lib/supabaseClient"

export function useLocalidades() {
  const [localidades, setLocalidades] = useState([])
  const [zonas, setZonas] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchLocalidades()
    fetchZonas()
  }, [])

  async function fetchLocalidades() {
    const { data, error } = await supabase
      .from("localidades")
      .select(`
        id_localidad,
        localidad_nombre,
        zonas (id_zona, zona_nombre)
      `)
      .order("id_localidad", { ascending: true })

    if (error) {
      console.error("Error al obtener Localidades:", error.message)
    } else {
      setLocalidades(data)
    }
    setLoading(false)
  }

  async function fetchZonas() {
    const { data, error } = await supabase
      .from("zonas")
      .select("id_zona, zona_nombre")
      .order("zona_nombre", { ascending: true })

    if (error) {
      console.error("Error al obtener Zonas:", error.message)
    } else {
      setZonas(data)
    }
  }

  async function agregarLocalidad(nuevaLocalidad) {
    const { data, error } = await supabase
      .from("localidades")
      .insert([nuevaLocalidad])
      .select("id_localidad, localidad_nombre, zonas (id_zona, zona_nombre)")

    if (error) {
      console.error("Error al insertar la Localidad:", error.message)
      return{error};
    } else {
      setLocalidades((prev) => [...prev, ...data])
    }
  }

  async function modificarLocalidad(id_localidad, dataEditada) {
    const { error } = await supabase
      .from("localidades")
      .update(dataEditada)
      .eq("id_localidad", id_localidad)

    if (error) {console.error("Error al modificar:", error.message)
      return{error};
    }
    else fetchLocalidades()
  }

  async function eliminarLocalidad(id_localidad) {
    const { error } = await supabase
      .from("localidades")
      .delete()
      .eq("id_localidad", id_localidad)

    if (error) {console.error("Error al eliminar:", error.message)
      return {error};
    }else {fetchLocalidades()}
  }

  return {
    localidades, zonas, loading, agregarLocalidad, modificarLocalidad, eliminarLocalidad}}
