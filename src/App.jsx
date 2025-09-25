import { BrowserRouter, Routes, Route } from "react-router-dom"
import Empleados from "./pages/Empleados"
import Turnos from "./pages/Turnos"
import Login from "./pages/Login"
import Localidades from "./pages/Localidades"
import Zonas from "./pages/Zonas"
import Layout from "./Layout"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas dentro del layout con sidebar */}
        <Route element={<Layout />}>
          <Route path="/" element={<h1>Bienvenido al Turnero</h1>} />
          <Route path="/empleados" element={<Empleados />} />
          <Route path="/turnos" element={<Turnos />} />
          <Route path="/localidades" element={<Localidades />} />
          <Route path="/zonas" element={<Zonas />} />
          <Route path="/login" element={<Login />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App




