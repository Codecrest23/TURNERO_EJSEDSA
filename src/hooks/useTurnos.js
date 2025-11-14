import { useState, useEffect } from "react"
import { supabase } from "../lib/supabaseClient"

export function useTurnos() {
  const [turnos, setTurnos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // ────────────────────────────────
  // CARGA INICIAL
  // ────────────────────────────────
  useEffect(() => {
    fetchTurnos()
  }, [])

  // ────────────────────────────────
  // 🔹 OBTENER turnos con horarios
  // ────────────────────────────────
  async function fetchTurnos() {
    setLoading(true)
    const { data, error } = await supabase
      .from("turnos")
      .select(`
        id_turno,
        turno_nombre,
        turno_cantidad_dias,
        turno_cantidad_dias_descanso,
        turno_tiene_guardia_pasiva,
        turno_es_laboral,
        turno_comentarios,
        turno_color,
        turno_motivo,
        turnos_horarios!turnos_horarios_id_turno_fkey (
          id_turno_horario,
          turno_horario_tipo,
          turno_horario_entrada,
          turno_horario_salida
        ),
        localidades (id_localidad,localidad_nombre)
      `)
      .order("id_turno", { ascending: true })

    if (error) {
      console.error("Error al obtener turnos:", error.message)
      setError(error)
    } else {
      setTurnos(data)
    }
    setLoading(false)
  }

  // ────────────────────────────────
  // ✅ AGREGAR turno (con o sin horarios)
  // ────────────────────────────────
  async function agregarTurno(nuevoTurno, horarios = []) {
    // 1. Insertar turno principal
    const { data: turnoData, error: turnoError } = await supabase
      .from("turnos")
      .insert([nuevoTurno])
      .select(`
        id_turno,
        turno_nombre,
        turno_cantidad_dias,
        turno_cantidad_dias_descanso,
        turno_tiene_guardia_pasiva,
        turno_es_laboral,
        turno_comentarios,
        turno_color,
        turno_motivo,
        turno_id_localidad
      `)
      .single()

    if (turnoError) {
      console.error("Error al insertar turno:", turnoError.message)
      setError(turnoError)
      return
    }

    // 2. Si hay horarios, insertarlos
    if (horarios.length > 0) {
      const horariosConId = horarios.map((h) => ({
        ...h,
        id_turno: turnoData.id_turno,
      }))
      const { error: horariosError } = await supabase
        .from("turnos_horarios")
        .insert(horariosConId)

      if (horariosError) console.error("Error al insertar horarios:", horariosError.message)
    }

    // 3. Recargar lista
    //fetchTurnos()
  }

  // ────────────────────────────────
  // ✏️ MODIFICAR turno
  // ────────────────────────────────
  async function modificarTurno(id_turno, camposActualizados) {
    const { error } = await supabase
      .from("turnos")
      .update(camposActualizados)
      .eq("id_turno", id_turno)

    if (error) {
      console.error("Error al modificar turno:", error.message)
      setError(error)
    } //else {      fetchTurnos()    }
  }

  // ────────────────────────────────
  // 🗑️ ELIMINAR turno (y sus horarios)
  // ────────────────────────────────
  async function eliminarTurno(id_turno) {
    // Primero eliminar horarios asociados (por las FK restrict)
    const { error: horariosError } = await supabase
      .from("turnos_horarios")
      .delete()
      .eq("id_turno", id_turno)

    if (horariosError) {
      console.error("Error al eliminar horarios:", horariosError.message)
    }

    const { error } = await supabase.from("turnos").delete().eq("id_turno", id_turno)

    if (error) {
      console.error("Error al eliminar turno:", error.message)
      setError(error)
    } else {
      setTurnos((prev) => prev.filter((t) => t.id_turno !== id_turno))
    }
  }

  // ────────────────────────────────
  // ⏰ AGREGAR horario a un turno existente
  // ────────────────────────────────
  async function agregarHorario(id_turno, nuevoHorario) {
    const { data, error } = await supabase
      .from("turnos_horarios")
      .insert([{ ...nuevoHorario, id_turno }])
      .select("id_turno_horario, turno_horario_tipo, turno_horario_entrada, turno_horario_salida")

    if (error) {
      console.error("Error al agregar horario:", error.message)
    } else {
      // Actualiza localmente el estado
      setTurnos((prev) =>
        prev.map((t) =>
          t.id_turno === id_turno
            ? { ...t, turnos_horarios: [...(t.turnos_horarios || []), ...data] }
            : t
        )
      )
    }
  }

  // ────────────────────────────────
  // ⏳ MODIFICAR horario
  // ────────────────────────────────
  async function modificarHorario(id_turno_horario, dataEditada) {
    const { error } = await supabase
      .from("turnos_horarios")
      .update(dataEditada)
      .eq("id_turno_horario", id_turno_horario)

    if (error) console.error("Error al modificar horario:", error.message)
    //else fetchTurnos()
  }

  // ────────────────────────────────
  // ❌ ELIMINAR horario
  // ────────────────────────────────
  async function eliminarHorario(id_turno_horario) {
    const { error } = await supabase
      .from("turnos_horarios")
      .delete()
      .eq("id_turno_horario", id_turno_horario)

    if (error) {
      console.error("Error al eliminar horario:", error.message)
    } else {
      // Actualiza localmente el estado
      setTurnos((prev) =>
        prev.map((t) => ({
          ...t,
          turnos_horarios: t.turnos_horarios?.filter(
            (h) => h.id_turno_horario !== id_turno_horario
          ),
        }))
      )
    }
  }

  return {
    turnos,
    loading,
    error,
    fetchTurnos,
    agregarTurno,
    modificarTurno,
    eliminarTurno,
    agregarHorario,
    modificarHorario,
    eliminarHorario,
  }
}

