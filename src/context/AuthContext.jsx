import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [rol, setRol] = useState(null);
  const [loading, setLoading] = useState(true); // bandera para que ProtectedRoute/UI esperen mientras se resuelven sesión y rol.

  // helper para traer perfil
  const fetchPerfil = async (userId) => {
    try {
      const { data: perfil, error } = await supabase
        .from("perfiles")
        .select("perfil_rol")
        .eq("id_usuario", userId)
        .single();
      if (error) {
        //console.error("Error trayendo rol:", error.message);
        setRol(null);
      } else {
        setRol(perfil?.perfil_rol ?? null);
      }
    } catch (e) {
      //console.error("Excepción trayendo rol:", e);
      setRol(null);
    }
  };

useEffect(() => {
  const init = async () => {
    setLoading(true)
    const { data: { session } } = await supabase.auth.getSession()
    const newUser = session?.user ?? null
    setUser(newUser)
    if (newUser) {
      const { data: perfil } = await supabase
        .from("perfiles")
        .select("perfil_rol")
        .eq("id_usuario", newUser.id)
        .single()
      setRol(perfil?.perfil_rol ?? null)
    } else {
      setRol(null)
    }
    setLoading(false)
  }

  init()

  const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
    const newUser = session?.user ?? null
    setUser(newUser)
    if (newUser) {
      supabase.from("perfiles")
        .select("perfil_rol")
        .eq("id_usuario", newUser.id)
        .single()
        .then(({ data }) => setRol(data?.perfil_rol ?? null))
    } else {
      setRol(null)
    }
    setLoading(false)
  })

  return () => listener.subscription.unsubscribe()
}, [])


  return (
    <AuthContext.Provider value={{ user, rol, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
