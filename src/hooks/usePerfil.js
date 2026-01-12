import { useEffect, useState } from "react"
import { supabase } from "../lib/supabaseClient"

export function usePerfil() {
  const [perfil, setPerfil] = useState(null)
  const [loadingPerfil, setLoadingPerfil] = useState(true)
  const [errorPerfil, setErrorPerfil] = useState(null)

  useEffect(() => {
    let alive = true

    async function loadPerfil() {
      setLoadingPerfil(true)
      setErrorPerfil(null)

      const { data: { user }, error: userErr } = await supabase.auth.getUser()
      if (userErr) {
        if (alive) {
          setErrorPerfil(userErr.message)
          setPerfil(null)
          setLoadingPerfil(false)
        }
        return
      }
      if (!user) {
        if (alive) {
          setPerfil(null)
          setLoadingPerfil(false)
        }
        return
      }

      const { data, error } = await supabase
        .from("perfiles")
        .select("perfil_nombre, perfil_rol, perfil_id_empleado")
        .eq("id_usuario", user.id)
        .single()

      if (alive) {
        if (error) {
          setErrorPerfil(error.message)
          setPerfil(null)
        } else {
          setPerfil(data)
        }
        setLoadingPerfil(false)
      }
    }

    loadPerfil()
    return () => { alive = false }
  }, [])

  return { perfil, loadingPerfil, errorPerfil }
}
