import { Outlet, Link,useNavigate  } from "react-router-dom"
import { useState } from "react"
import { Menu, X, Home, Users, Calendar, Map, Layers, LogIn, Clock,LogOut } from "lucide-react"
import { supabase } from "./lib/supabaseClient"
import { useAuth } from "./context/AuthContext"

export default function Layout() {
  const [open, setOpen] = useState(true)
  //agregado para logOut
  const navigate = useNavigate()
  const { rol } = useAuth()  // 👈 traemos el rol
  console.log("rol",rol)
  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate("/") // vuelve al login
  }
 //Fin agregado para logOut
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div
        className={`bg-gray-800 text-white transition-all duration-300 
        ${open ? "w-64" : "w-16"}`}
      >
        {/* Header del sidebar */}
        <div className="flex items-center justify-between p-4">
          {open && <span className="font-bold text-lg">Turnero SAP</span>}
          <button
            onClick={() => setOpen(!open)}
            className="text-white focus:outline-none"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Links */}
        <nav className="flex flex-col gap-2 p-2">
          <SidebarLink to="/calendario" icon={<Calendar size={20} />} open={open} label="Planificación" />
          {/* <SidebarLink to="/" icon={<Home size={20} />} open={open} label="Inicio" /> */}
          {rol === "Admin" && (<SidebarLink to="/empleados" icon={<Users size={20} />} open={open} label="Empleados" />)}
          {rol === "Admin" && (<SidebarLink to="/turnos" icon={<Clock size={20} />} open={open} label="Turnos" />)}
          {rol === "Admin" && (<SidebarLink to="/localidades" icon={<Map size={20} />} open={open} label="Localidades" />)}
          {rol === "Admin" && (<SidebarLink to="/zonas" icon={<Layers size={20} />} open={open} label="Zonas" />)}
          {/* <SidebarLink to="/login" icon={<LogIn size={20} />} open={open} label="Login" /> */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2 rounded hover:bg-gray-700 transition text-left w-full"
          >
            <LogOut size={20} />
            {open && <span>Cerrar sesión</span>}
          </button>
        </nav>
      </div>

      {/* Contenido principal */}
      <main className="flex-1 bg-gray-100 p-8 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  )
}

/* 🔹 Componente auxiliar para los links */
function SidebarLink({ to, icon, label, open }) {
  return (
    <Link
      to={to}
      className="flex items-center gap-3 px-3 py-2 rounded hover:bg-gray-700 transition"
    >
      {icon}
      {open && <span>{label}</span>}
    </Link>
  )
}
