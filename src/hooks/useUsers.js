import { useEffect, useState } from "react"
import { supabase } from "../lib/supabaseClient"

export function useUsers() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchUsers()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function callManageUser(payload) {
    // invoke manda el JWT automáticamente si hay sesión
    const { data, error } = await supabase.functions.invoke("manage-user", {
      body: payload,
    })

    if (error) {
      // error.message suele ser lo más útil
      throw new Error(error.message || "Error llamando a manage-user")
    }

    // Si tu función devuelve { error: "..." } con status 200, lo atrapamos igual
    if (data?.error) {
      throw new Error(data.error)
    }

    return data
  }

  async function fetchUsers() {
    setLoading(true)
    setError(null)
    try {
      const out = await callManageUser({ action: "list" })
      setUsers(out?.users || [])
    } catch (e) {
      console.error(e)
      setUsers([])
      setError(e.message || "Error obteniendo usuarios")
    } finally {
      setLoading(false)
    }
  }

  async function createUser({ email, password, perfil_nombre, perfil_rol, perfil_id_empleado }) {
    setError(null)
    try {
      const out = await callManageUser({
        action: "create",
        userData: { email, password, perfil_nombre, perfil_rol, perfil_id_empleado },
      })
      await fetchUsers()
      return { data: out }
    } catch (e) {
      console.error(e)
      return { error: e.message || "Error creando usuario" }
    }
  }

  async function updateUser({ id, email, password, perfil_nombre, perfil_rol, perfil_id_empleado }) {
    setError(null)
    try {
      const out = await callManageUser({
        action: "update",
        userData: { id, email, password, perfil_nombre, perfil_rol, perfil_id_empleado },
      })
      await fetchUsers()
      return out
    } catch (e) {
      console.error(e)
      throw new Error(e.message || "Error actualizando usuario")
    }
  }

  async function deleteUser(id) {
    setError(null)
    try {
      const out = await callManageUser({
        action: "delete",
        userData: { id },
      })
      await fetchUsers()
      return out
    } catch (e) {
      console.error(e)
      throw new Error(e.message || "Error eliminando usuario")
    }
  }

  return { users, loading, error, fetchUsers, createUser, updateUser, deleteUser }
}
