import { Outlet, Link } from "react-router-dom"
import { useState } from "react"
import { Menu, X } from "lucide-react" // iconos (npm i lucide-react)

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
          <span className={`${!open && "hidden"} font-bold text-lg`}>
            Turnero SAP
          </span>
          <button
            onClick={() => setOpen(!open)}
            className="text-white focus:outline-none"
          >
            {open ? <X size={30} /> : <Menu size={30} />}
          </button>
        </div>

        {/* Links */}
        <nav className="flex flex-col gap-2 p-2">
          <Link
            to="/"
            className="px-3 py-2 rounded hover:bg-gray-700 transition"
          >
            Inicio
          </Link>
          <Link
            to="/empleados"
            className="px-3 py-2 rounded hover:bg-gray-700 transition"
          >
            Empleados
          </Link>
          <Link
            to="/turnos"
            className="px-3 py-2 rounded hover:bg-gray-700 transition"
          >
            Turnos
          </Link>
          <Link
            to="/localidades"
            className="px-3 py-2 rounded hover:bg-gray-700 transition"
          >
            Localidades
          </Link>
          <Link
            to="/zonas"
            className="px-3 py-2 rounded hover:bg-gray-700 transition"
          >
            Zonas
          </Link>
          <Link
            to="/login"
            className="px-3 py-2 rounded hover:bg-gray-700 transition"
          >
            Login
          </Link>
        </nav>
      </div>

      {/* Contenido principal */}
      <main className="flex-1 bg-gray-100 p-8 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  )
}
