import { createContext, useContext, useEffect, useState } from "react"
import { supabase } from "../lib/supabaseClient"

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [rol, setRol] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)

        if (user) {
        const { data: perfil, error } = await supabase
        .from("perfiles")
        .select("perfil_rol")
        .eq("id_usuario", user.id)
        .single()
            if (error) {
             console.error("Error trayendo rol:", error.message)
         }
        setRol(perfil?.perfil_rol || null)
        }
      setLoading(false)
    }

    getUser()

    // Escuchar cambios de sesión
    // const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
    //   setUser(session?.user ?? null)
    // })
    // Escuchar cambios de sesión
        const { data: listener } = supabase.auth.onAuthStateChange(async (_event, session) => {
            console.log("Cambio de sesión:", _event, session)  // PARA REVISAR
        setLoading(true)   // 👈 importante
        const newUser = session?.user ?? null
        setUser(newUser)

        if (newUser) {
            const { data: perfil, error } = await supabase
            .from("perfiles")
            .select("perfil_rol")
            .eq("id_usuario", newUser.id)
            .single()

            if (error) {
            console.error("Error trayendo rol:", error.message)
            }
            setRol(perfil?.perfil_rol || null)
        } else {
            setRol(null) // 👈 limpiar rol si se desloguea
        }
        setLoading(false)   // 👈 cerrar loading siempre
        })


    return () => {
      listener.subscription.unsubscribe()
    }
  }, [])

  return (
    <AuthContext.Provider value={{ user, rol, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
