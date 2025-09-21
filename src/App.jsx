import { BrowserRouter, Routes, Route, Link } from "react-router-dom"
import Empleados from "./pages/Empleados"
import Turnos from "./pages/Turnos"
import Login from "./pages/Login"

function App() {
  return (
    <BrowserRouter>
      <nav style={{ padding: "1rem", background: "#f0f0f0" }}>
        <Link to="/">Inicio</Link> |{" "}
        <Link to="/empleados">Empleados</Link> |{" "}
        <Link to="/turnos">Turnos</Link> |{" "}
        <Link to="/login">Login</Link>
      </nav>

      <Routes>
        <Route path="/" element={<h1>Bienvenido al Turnero EJSEDSA</h1>} />
        <Route path="/empleados" element={<Empleados />} />
        <Route path="/turnos" element={<Turnos />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
