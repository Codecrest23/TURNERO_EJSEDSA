import { BrowserRouter, Routes, Route } from "react-router-dom"
import Empleados from "./pages/Empleados"
import Turnos from "./pages/Turnos"
import Login from "./pages/Login"
import Localidades from "./pages/Localidades"
import Zonas from "./pages/Zonas"
import Calendario from "./pages/Calendario"
import Usuarios from "./pages/Usuarios"
import Layout from "./Layout"
import ProtectedRoute from "./components/ProtectedRoute"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        {/* Rutas dentro del layout con sidebar */}
        <Route element={<Layout />}>
          {/* <Route path="/" element={<ProtectedRoute><h1>Bienvenido al Turnero</h1></ProtectedRoute>} /> */}
          <Route path="/empleados" element={<ProtectedRoute allowedRoles={["Supervisor", "Admin"]}><Empleados /></ProtectedRoute>} />
          <Route path="/turnos" element={<ProtectedRoute allowedRoles={["Supervisor", "Admin"]}><Turnos /></ProtectedRoute>} />
          <Route path="/localidades" element={<ProtectedRoute allowedRoles={[ "Admin"]}><Localidades /></ProtectedRoute>} />
          <Route path="/zonas" element={<ProtectedRoute allowedRoles={["Admin"]}><Zonas /></ProtectedRoute>} />
          <Route path="/calendario" element={<ProtectedRoute><Calendario /></ProtectedRoute>} />
          <Route path="/usuarios" element={<ProtectedRoute><Usuarios/></ProtectedRoute>} />
          {/* <Route path="/login" element={<Login />} /> */}
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App




