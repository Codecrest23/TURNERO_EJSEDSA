import { Outlet, Link } from "react-router-dom"
import { useState } from "react"
import { Menu, X, Home, Users, Calendar, Map, Layers, LogIn } from "lucide-react"

export default function Layout() {
  const [open, setOpen] = useState(true)

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
          <SidebarLink to="/" icon={<Home size={20} />} open={open} label="Inicio" />
          <SidebarLink to="/empleados" icon={<Users size={20} />} open={open} label="Empleados" />
          <SidebarLink to="/turnos" icon={<Calendar size={20} />} open={open} label="Turnos" />
          <SidebarLink to="/localidades" icon={<Map size={20} />} open={open} label="Localidades" />
          <SidebarLink to="/zonas" icon={<Layers size={20} />} open={open} label="Zonas" />
          <SidebarLink to="/login" icon={<LogIn size={20} />} open={open} label="Login" />
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
