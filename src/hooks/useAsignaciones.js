import { useState, useEffect } from "react"
import { supabase } from "../lib/supabaseClient"

export function useAsignaciones() {
  const [asignaciones, setAsignaciones] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchAsignaciones()
  }, [])

  // 🔹 Obtener asignaciones con joins
  async function fetchAsignaciones() {
    setLoading(true)
    const { data, error } = await supabase
      .from("asignaciones_empleados")
      .select(`
        id_asignacion,
        asignacion_fecha_desde,
        asignacion_fecha_hasta,
        asignacion_comentario,
        asignacion_fecha_hora_modificacion,
        asignacion_turno_id,
        asignacion_localidad_id,
        asignacion_empleado_id,
        empleados ( id_empleado, empleado_nombre_apellido ),
        turnos ( id_turno, turno_nombre, turno_color,turno_es_laboral, turno_motivo),
        localidades ( id_localidad, localidad_nombre, zonas(id_zona, zona_nombre) )
      `)
      .order("id_asignacion", { ascending: true })

    if (error) {
      console.error("Error al obtener asignaciones:", error.message)
      setError(error)
    } else {
      setAsignaciones(data)
    }
    setLoading(false)
  }

  // ✅ Agregar asignación
  async function agregarAsignacion(nuevaAsignacion) {
    const { data, error } = await supabase
      .from("asignaciones_empleados")
      .insert([nuevaAsignacion])
      .select(`
        id_asignacion,
        asignacion_empleado_id,
        asignacion_turno_id,
        asignacion_fecha_desde,
        asignacion_fecha_hasta,
        asignacion_comentario,
        asignacion_localidad_id
      `)
      .single()

    if (error) console.error("Error al agregar asignación:", error.message)
    else setAsignaciones((prev) => [...prev, data])
  }

  // ✏️ Modificar asignación
  async function modificarAsignacion(id_asignacion, camposActualizados) {
    const { error } = await supabase
      .from("asignaciones_empleados")
      .update(camposActualizados)
      .eq("id_asignacion", id_asignacion)
    if (error) console.error("Error al modificar asignación:", error.message)
  }

  // 🗑️ Eliminar asignación
  async function eliminarAsignacion(id_asignacion) {
    const { error } = await supabase
      .from("asignaciones_empleados")
      .delete()
      .eq("id_asignacion", id_asignacion)
    if (error) console.error("Error al eliminar asignación:", error.message)
    else setAsignaciones((prev) => prev.filter((a) => a.id_asignacion !== id_asignacion))
  }

  return {
    asignaciones,
    loading,
    error,
    fetchAsignaciones,
    agregarAsignacion,
    modificarAsignacion,
    eliminarAsignacion,
  }
}
