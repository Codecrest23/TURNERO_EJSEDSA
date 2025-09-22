import { BrowserRouter, Routes, Route, Link } from "react-router-dom"
import Empleados from "./pages/Empleados"
import Turnos from "./pages/Turnos";
import Login from "./pages/Login";

function App() {
  return (
    <BrowserRouter>
      <nav className="bg-gray-200 p-4 flex gap-4">
        <Link to="/" className="text-blue-600">Inicio</Link>
        <Link to="/empleados" className="text-blue-600">Empleados</Link>
        <Link to="/turnos" className="text-blue-600">Turnos</Link>
        <Link to="/login" className="text-blue-600">Login</Link>
      </nav>

      <Routes>
        <Route path="/" element={<h1 className="p-8">Bienvenido al Turnero</h1>} />
        <Route path="/empleados" element={<Empleados />} />
        <Route path="/turnos" element={<Turnos />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;


