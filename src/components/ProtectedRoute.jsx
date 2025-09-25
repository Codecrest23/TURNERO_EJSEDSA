import { Navigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

export default function ProtectedRoute({ children, allowedRoles }) {
  const { user, rol, loading } = useAuth()

  if (loading) return <p className="p-8">Cargando...</p>
  if (!user) return <Navigate to="/" replace /> // 👉 no logueado

  // 👉 si hay restricción de roles y el rol no está permitido
  if (allowedRoles && !allowedRoles.includes(rol)) {
    return <Navigate to="/calendario" replace />
  }

  return children
}
