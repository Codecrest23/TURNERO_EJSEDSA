import { Outlet, Link,useNavigate  } from "react-router-dom"
import { useState } from "react"
import { Menu, X, User, Users,Calendar, CalendarClock, Map, Layers, LogIn,Clock9, Clock,LogOut,BriefcaseBusiness, IdCardLanyard,UserPlus} from "lucide-react"
import { supabase } from "./lib/supabaseClient"
import { useAuth } from "./context/AuthContext"

export function IconAsignarTurno() {
  return (
  <div className="flex items-center justify-center relative">
    <Clock9 className="w-6 h-6  text-white" />
    <UserPlus className="w-[15px] h-[15px] absolute bottom-[1px] right-[-8px] text-white"  strokeWidth={3}/>
  </div>
  )
}
export default function Layout() {
  const [open, setOpen] = useState(true)
  //agregado para logOut
  const navigate = useNavigate()
  const { rol, user } = useAuth()  //  rol
  //console.log("rol",rol)
  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate("/") // vuelve al login
  }
 //Fin agregado para logOut
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div
        className={`bg-gray-800 text-white transition-all duration-300 flex flex-col justify-between
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
          <SidebarLink to="/planificacion" icon={<Calendar size={20} />} open={open} label="Planificación" />
          {/* <SidebarLink to="/" icon={<Home size={20} />} open={open} label="Inicio" /> */}
          {(rol === "Admin" || rol === "Supervisor") && (<SidebarLink to="/asignacion" icon={<CalendarClock size={20} />} open={open} label="Asignacion de Turnos" />)}
          {(rol === "Admin" || rol === "Supervisor") && (<SidebarLink to="/turnos" icon={<Clock size={20} />} open={open} label="Turnos" />)}
          {(rol === "Admin" || rol === "Supervisor") && (<SidebarLink to="/empleados" icon={<IdCardLanyard size={20} />} open={open} label="Empleados" />)}
          {(rol === "Admin" || rol === "Supervisor") && (<SidebarLink to="/funciones-sectores" icon={<BriefcaseBusiness size={20} />} open={open} label="Funciones y Sectores" />)}
          {rol === "Admin" && (<SidebarLink to="/localidades" icon={<Map size={20} />} open={open} label="Localidades" />)}
          {rol === "Admin" && (<SidebarLink to="/zonas" icon={<Layers size={20} />} open={open} label="Zonas" />)}
          {rol === "Admin" && (<SidebarLink to="/usuarios" icon={<Users size={20} />} open={open} label="Usuarios" />)}
          {/* <SidebarLink to="/login" icon={<LogIn size={20} />} open={open} label="Login" /> */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2 rounded hover:bg-gray-700 transition text-left w-full"
          >
            <LogOut size={20} />
            {open && <span>Cerrar sesión</span>}
          </button>
        </nav>
{/* Usuario logueado (nombre y mail) */}
        {user && (
        <div className="mt-auto p-4 border-t border-gray-700 text-xs text-gray-300">
        <p className="font-semibold text-white">
          {user.user_metadata?.full_name || "Usuario"}
        </p>
        <p className="truncate text-gray-400">{user.email}</p>
        </div>)}
        </div>

      {/* Contenido principal */}
      <main className="flex-1 bg-gray-100 p-8 overflow-y-auto min-h-full">
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
