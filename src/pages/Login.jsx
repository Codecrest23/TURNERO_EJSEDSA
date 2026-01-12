import { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import logoEjsedsa from "../assets/ejsedsa.png"

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitError, setSubmitError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    //console.log("handleLogin ejecutado con:", email, password);
    setSubmitError(null);
    setSubmitting(true);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    //console.log("Resultado login:", data, error); // ← LOG #2

    if (error) {
      setSubmitError(error.message);
      setSubmitting(false);
      return;
    }
    setSubmitting(false)
    // No navegamos acá. Esperamos a que el contexto reciba la sesión.
    // (onAuthStateChange ya disparó y actualizará user/rol).
  };

  // Cuando el contexto ya tiene user y no está cargando → ir a /planificacion
  useEffect(() => {
    if (user && !loading) {
      //console.log("Navegando a /planificacion"); // ← LOG #4
      navigate("/planificacion", { replace: true });
    }
  }, [user, loading, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleLogin} className="bg-white p-6 rounded-lg shadow-md w-96">
        <img
          src={logoEjsedsa}
          alt="EJSEDSA"
          className="h-12 mx-auto mb-4"
        />

        <h2 className="text-2xl font-bold mb-4">Login</h2>

        {submitError && <p className="text-red-500 mb-2">{submitError}</p>}

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
          disabled={submitting}
          className="w-full bg-blue-600 text-white rounded py-2 hover:bg-blue-700 transition disabled:opacity-60"
        >
          {submitting ? "Ingresando..." : "Ingresar"}
        </button>
      </form>
    </div>
  );
}