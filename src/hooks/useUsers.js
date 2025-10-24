import { useEffect, useState } from "react"
import { supabase } from "../lib/supabaseClient"

export function useUsers() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchUsers()
  }, [])

async function fetchUsers() {
  setLoading(true)
  const session = (await supabase.auth.getSession()).data.session
  const token = session?.access_token

  const res = await fetch(
    `${import.meta.env.VITE_SUPABASE_FUNCTIONS_URL}/manage-user`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ action: "list" }),
    }
  )

  const out = await res.json()
  if (!res.ok) {
    console.error(out)
    setError(out.error || "Error obteniendo usuarios")
    setLoading(false)
    return
  }

  setUsers(out.users || [])
  setLoading(false)
}



  async function createUser({ email, password, perfil_nombre, perfil_rol }) {
    const session = (await supabase.auth.getSession()).data.session
    const token = session?.access_token
    const res = await fetch(
      `${import.meta.env.VITE_SUPABASE_FUNCTIONS_URL}/manage-user`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          action: "create",
          userData: { email, password, perfil_nombre, perfil_rol },
        }),
      }
    )
    const out = await res.json()
    if (!res.ok) throw new Error(out.error || "Error creando usuario")
    await fetchUsers()
    return out
  }

  async function updateUser({ id, email, password, perfil_nombre, perfil_rol }) {
    const session = (await supabase.auth.getSession()).data.session
    const token = session?.access_token
    const res = await fetch(
      `${import.meta.env.VITE_SUPABASE_FUNCTIONS_URL}/manage-user`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          action: "update",
          userData: { id, email, password, perfil_nombre, perfil_rol },
        }),
      }
    )
    const out = await res.json()
    if (!res.ok) throw new Error(out.error || "Error actualizando usuario")
    await fetchUsers()
    return out
  }

  async function deleteUser(id) {
    const session = (await supabase.auth.getSession()).data.session
    const token = session?.access_token
    const res = await fetch(
      `${import.meta.env.VITE_SUPABASE_FUNCTIONS_URL}/manage-user`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ action: "delete", userData: { id } }),
      }
    )
    const out = await res.json()
    if (!res.ok) throw new Error(out.error || "Error eliminando usuario")
    await fetchUsers()
    return out
  }

  return { users, loading, error, fetchUsers, createUser, updateUser, deleteUser }
}
