import { useState, useEffect } from "react"
import { supabase } from "../lib/supabaseClient"

export function useEmpleados() {
  const [empleados, setEmpleados] = useState([])
  const [localidades, setLocalidades] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchEmpleados()
    fetchLocalidades()
  }, [])

  async function fetchEmpleados() {
    const { data, error } = await supabase
      .from("empleados")
      .select(`
        id_empleado,
        empleado_nombre_apellido,
        empleado_id_funcion,
        empleado_id_sector,
        empleado_id_localidad,
        empleado_id_turno,
        empleado_color,        
        funciones_empleados ( funcion_empleado_id,funcion_empleado_nombre ),
        sectores_empleados ( id_sector_empleado, sector_empleado_nombre ),
        localidades (id_localidad, localidad_nombre, zonas (id_zona, zona_nombre)),
        turnos (id_turno, turno_nombre)
      `)

    if (error) {
      console.error("Error al obtener empleados:", error.message)
    } else {
      setEmpleados(data)
    }
    setLoading(false)
  }

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
//AGREGAR Empleados
  async function agregarEmpleado(nuevoEmpleado) {
    const { data, error } = await supabase
      .from("empleados")
      .insert([nuevoEmpleado])
      .select(`
        id_empleado,
        empleado_nombre_apellido,
        empleado_id_funcion,
        empleado_id_sector,
        empleado_id_localidad,
        empleado_id_turno,
        empleado_color,        
        funciones_empleados ( funcion_empleado_id,funcion_empleado_nombre ),
        sectores_empleados ( id_sector_empleado, sector_empleado_nombre ),
        localidades (id_localidad, localidad_nombre, zonas (id_zona, zona_nombre)),
        turnos (id_turno, turno_nombre)
      `)

    if (error) {
      console.error("Error al insertar empleado:", error.message)
    } else {
      setEmpleados((prev) => [...prev, ...data])
    }
  }

  // ────────────────────────────────
  // MODIFICAR empleado
  // ────────────────────────────────
async function modificarEmpleado(id, camposActualizados) {
  // Ver qué llega
  //console.log(" Datos completos recibidos:", camposActualizados)

  // Filtrar solo las columnas que existen en la tabla empleados
  const datosLimpios = {
    empleado_nombre_apellido: camposActualizados.empleado_nombre_apellido,
    empleado_id_funcion: Number(camposActualizados.empleado_id_funcion) || null,
    empleado_id_sector: Number(camposActualizados.empleado_id_sector) || null,
    empleado_id_localidad: Number(camposActualizados.empleado_id_localidad) || null,
    empleado_id_turno: Number(camposActualizados.empleado_id_turno) || null,
    empleado_color: camposActualizados.empleado_color || null,
  }
  //console.log("Datos filtrados que se envían al update:", datosLimpios)
  const { error } = await supabase
    .from("empleados")
    .update(datosLimpios)
    .eq("id_empleado", id)

  if (error) {
    console.error("Error al modificar empleado:", error.message)
  } else {
    fetchEmpleados()
  }
}



  // ────────────────────────────────
  // ELIMINAR empleado
  // ────────────────────────────────
  async function eliminarEmpleado(id) {
    const { error } = await supabase.from("empleados").delete().eq("id_empleado", id)

    if (error) {
      console.error("Error al eliminar empleado:", error.message)
    } else {
      setEmpleados((prev) => prev.filter((emp) => emp.id_empleado !== id))
    }
  }

  // ────────────────────────────────
  // Exportar todo
  // ────────────────────────────────
  return {
    empleados,
    localidades,
    loading,
    error,
    fetchEmpleados,
    agregarEmpleado,
    modificarEmpleado,
    eliminarEmpleado,
  }
}
