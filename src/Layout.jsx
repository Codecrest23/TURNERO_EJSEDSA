import { Outlet, Link, useNavigate } from "react-router-dom"
import { useState } from "react"
import { Menu, X, Users, Calendar, CalendarClock, Map, Layers, Clock9, Clock, LogOut, BriefcaseBusiness, IdCardLanyard, UserPlus, SquareStack } from "lucide-react"
import { supabase } from "./lib/supabaseClient"
import { useAuth } from "./context/AuthContext"
import Modal from "./components/ui/Modal"
export function IconAsignarTurno() {
  return (
    <div className="flex items-center justify-center relative">
      <Clock9 className="w-6 h-6  text-white" />
      <UserPlus className="w-[15px] h-[15px] absolute bottom-[1px] right-[-8px] text-white" strokeWidth={3} />
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
  const [confirmLogout, setConfirmLogout] = useState(false)
  const [openMobile, setOpenMobile] = useState(false);

  //Fin agregado para logOut
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div
        className={`hidden sm:flex bg-gray-800 text-white transition-all duration-300 flex flex-col justify-between
        ${open ? "w-64" : "w-16"}`}
      >
        {/* Header del sidebar */}
        <div className="flex items-center justify-between p-4 ">
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
          {(rol === "Admin" || rol === "Supervisor") && (<SidebarLink to="/informe" icon={<SquareStack size={20} />} open={open} label="Informe Historico" />)}
          {(rol === "Admin" || rol === "Supervisor") && (<SidebarLink to="/asignacion" icon={<CalendarClock size={20} />} open={open} label="Asignacion de Turnos" />)}
          {(rol === "Admin" || rol === "Supervisor") && (<SidebarLink to="/empleados" icon={<IdCardLanyard size={20} />} open={open} label="Empleados" />)}
          {(rol === "Admin" || rol === "Supervisor") && (<SidebarLink to="/turnos" icon={<Clock size={20} />} open={open} label="Turnos" />)}
          {(rol === "Admin" || rol === "Supervisor") && (<SidebarLink to="/funciones-sectores" icon={<BriefcaseBusiness size={20} />} open={open} label="Funciones y Sectores" />)}
          {rol === "Admin" && (<SidebarLink to="/localidades" icon={<Map size={20} />} open={open} label="Localidades" />)}
          {rol === "Admin" && (<SidebarLink to="/zonas" icon={<Layers size={20} />} open={open} label="Zonas" />)}
          {rol === "Admin" && (<SidebarLink to="/usuarios" icon={<Users size={20} />} open={open} label="Usuarios" />)}
          {/* <SidebarLink to="/login" icon={<LogIn size={20} />} open={open} label="Login" /> */}
          <button
            onClick={() => setConfirmLogout(true)}
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
            <p className="font-semibold text-white">
              {rol}
            </p>
            <p className="truncate text-gray-400">{user.email}</p>
          </div>)}
      </div>
      {/* === TOPBAR MOBILE (solo <sm) === */}
      <div className="sm:hidden fixed top-0 left-0 right-0 h-12 bg-gray-800 text-white flex items-center justify-between px-3 z-40">
        <button onClick={() => setOpenMobile(true)} className="p-2">
          <Menu size={22} />
        </button>
        <div className="font-semibold text-sm truncate">Turnero SAP</div>
        <div className="w-10" /> {/* spacer */}
      </div>

      {/* === DRAWER MOBILE === */}
      {openMobile && (
        <div className="sm:hidden fixed inset-0 z-91">
          {/* backdrop */}
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setOpenMobile(false)}
          />
          {/* panel */}
          <div className="absolute left-0 top-0 bottom-0 w-72 max-w-[85%] bg-gray-800 text-white flex flex-col justify-between">
            <div className="flex items-center justify-between p-4 border-b border-gray-700">
              <span className="font-bold">Turnero SAP</span>
              <button onClick={() => setOpenMobile(false)} className="p-2">
                <X size={20} />
              </button>
            </div>

            <nav className="flex flex-col gap-2 p-2">
              <SidebarLink to="/planificacion" icon={<Calendar size={20} />} open={true} label="Planificación" />

              {(rol === "Admin" || rol === "Supervisor") && (
                <SidebarLink to="/informe" icon={<SquareStack size={20} />} open={true} label="Informe Historico" />
              )}

              {(rol === "Admin" || rol === "Supervisor") && (
                <SidebarLink to="/asignacion" icon={<CalendarClock size={20} />} open={true} label="Asignacion de Turnos" />
              )}

              {(rol === "Admin" || rol === "Supervisor") && (
                <SidebarLink to="/empleados" icon={<IdCardLanyard size={20} />} open={true} label="Empleados" />
              )}

              {(rol === "Admin" || rol === "Supervisor") && (
                <SidebarLink to="/turnos" icon={<Clock size={20} />} open={true} label="Turnos" />
              )}

              {(rol === "Admin" || rol === "Supervisor") && (
                <SidebarLink to="/funciones-sectores" icon={<BriefcaseBusiness size={20} />} open={true} label="Funciones y Sectores" />
              )}

              {rol === "Admin" && (
                <SidebarLink to="/localidades" icon={<Map size={20} />} open={true} label="Localidades" />
              )}

              {rol === "Admin" && (
                <SidebarLink to="/zonas" icon={<Layers size={20} />} open={true} label="Zonas" />
              )}

              {rol === "Admin" && (
                <SidebarLink to="/usuarios" icon={<Users size={20} />} open={true} label="Usuarios" />
              )}

              <button
                onClick={() => setConfirmLogout(true)}
                className="flex items-center gap-3 px-3 py-2 rounded hover:bg-gray-700 transition text-left w-full"
              >
                <LogOut size={20} />
                <span>Cerrar sesión</span>
              </button>
            </nav>

            {user && (
              <div className="mt-auto p-4 border-t border-gray-700 text-xs text-gray-300">
                <p className="font-semibold text-white">{user.user_metadata?.full_name || "Usuario"}</p>
                <p className="font-semibold text-white">{rol}</p>
                <p className="truncate text-gray-400">{user.email}</p>
              </div>
            )}
          </div>
        </div>
      )}
      {/* === DRAWER MOBILE === */}
      {/* Contenido principal */}
      <main className="flex-1 bg-gray-100 overflow-y-auto min-h-full pt-12 sm:pt-0 p-3 sm:p-8">
        <Outlet />
      </main>
      {/* MODAL DE CONFIRMACIÓN DE LOGOUT */}
      {confirmLogout && (
        <Modal
          title="Cerrar sesión"
          onClose={() => setConfirmLogout(false)}
        >
          <p className="mb-6 text-center">
            ¿Seguro que deseas cerrar sesión?
          </p>

          <div className="flex justify-center gap-2">
            <button
              className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 transition"
              onClick={() => setConfirmLogout(false)}
            >
              Cancelar
            </button>

            <button
              className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 transition"
              onClick={async () => {
                await supabase.auth.signOut();
                setConfirmLogout(false);
                navigate("/");
              }}
            >
              Sí, cerrar sesión
            </button>
          </div>
        </Modal>
      )}
    </div>
  )
}

/* 🔹 Componente auxiliar para los links */
function SidebarLink({ to, icon, label, open, onClick }) {
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

