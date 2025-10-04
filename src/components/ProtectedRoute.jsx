import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children, allowedRoles }) {
  const { user, rol, loading } = useAuth();

  if (loading) return <p className="p-8">Cargando...</p>;
  if (!user) return <Navigate to="/" replace />;

  if (allowedRoles && (!rol || !allowedRoles.includes(rol))) {
    // siempre a una ruta pública para evitar loops
    return <Navigate to="/calendario" replace />;
  }

  return children;
}
