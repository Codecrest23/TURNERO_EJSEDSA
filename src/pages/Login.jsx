import { useState, useEffect } from "react"
import { supabase } from "../lib/supabaseClient"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState(null)
  const navigate = useNavigate()
  const { user, loading } = useAuth()   // 👈 traemos user del contexto

  const handleLogin = async (e) => {
    e.preventDefault()
    console.log("handleLogin ejecutado con:", email, password)  // PARA REVISAR
    setError(null)

    const { data,error:loginError  } = await supabase.auth.signInWithPassword({
      email,
      password,
    })     

  console.log("Resultado login:", data, loginError)  // PARA REVISAR

    if (loginError) {
      setError(loginError.message)
    } else {
      console.log("Login correcto, esperando contexto...")
      // 👈 no navegues acá
    }
  }

  // 👇 Cuando user se setea en el contexto y ya no está cargando → navegar
  useEffect(() => {
    if (user && !loading) {
      console.log("Navegando a /calendario") 
      navigate("/calendario")
    }
  }, [user, loading, navigate])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleLogin}
        className="bg-white p-6 rounded-lg shadow-md w-96"
      >
        <h2 className="text-2xl font-bold mb-4">Login</h2>
        {error && <p className="text-red-500 mb-2">{error}</p>}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border rounded w-full px-3 py-2 mb-3"
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border rounded w-full px-3 py-2 mb-3"
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white rounded py-2 hover:bg-blue-700 transition"
        >
          Ingresar
        </button>
      </form>
    </div>
  )
}
