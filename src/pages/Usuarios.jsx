import { useState, useEffect } from "react"
import { useUsers } from "../hooks/useUsers"
import Table from "../components/ui/Table"
import Button from "../components/ui/Button"
import ModalAddItem from "../components/ui/ModalAddItem"
import Modal from "../components/ui/Modal"
import { Title, Subtitle } from "../components/ui/Typography"
import { Users, CirclePlus } from "lucide-react"
import ModalPKError from "../components/ui/ModalPKError"
import { useEmpleados } from "../hooks/useEmpleados"

export default function Usuarios() {
  const { users, loading, createUser, updateUser, deleteUser } = useUsers()
  const [form, setForm] = useState({ email: "", password: "", perfil_nombre: "", perfil_rol: "Empleado", perfil_id_empleado: null, })
  const [editing, setEditing] = useState(null)
  const [usuarioEliminar, setUsuarioEliminar] = useState(null)
  const [pkErrorMsg, setPkErrorMsg] = useState("")
  // Para perfil empleados ppoder elegir en el select
  const { empleados, loading: loadingEmpleados } = useEmpleados()
  const resetForm = () => {
    setForm({
      email: "",
      password: "",
      perfil_nombre: "",
      perfil_rol: "Empleado",
      perfil_id_empleado: null,
    })
  }

  if (loading) return <p>Cargando...</p>

  const handleCreate = async (e) => {
    e.preventDefault()

    const result = await createUser(form)
    console.log("FORM CREATE:", form, result)

    if (result?.error) {
      // Traducción “humana” de errores comunes
      const msg = parseUserError(result.error)
      setPkErrorMsg(msg)
      return // 👈 importante: no resetees el form si falló
    }

    setForm({ email: "", password: "", perfil_nombre: "", perfil_rol: "Empleado", perfil_id_empleado: null })
  }


  const handleUpdate = async (e) => {
    e.preventDefault()

    try {
      const result = await updateUser(editing)

      // si tu updateUser devuelve { error: ... }
      if (result?.error) {
        setPkErrorMsg(parseUserError(result.error))
        return
      }

      setEditing(null)
    } catch (err) {
      // si tu updateUser hace throw new Error(...)
      setPkErrorMsg(parseUserError(err?.message))
    }
  }

  function parseUserError(errMsg) {
    const msg = (errMsg || "").toLowerCase()

    // Supabase Auth suele tirar estos textos según el caso
    if (
      msg.includes("already") ||
      msg.includes("exists") ||
      msg.includes("duplicate") ||
      msg.includes("email") && msg.includes("registered")
    ) {
      return "Ese email ya está en uso. Probá con otro."
    }

    // Tu validación de empleado asociado (manage-user)
    if (msg.includes("debe seleccionar un empleado")) {
      return "Tenés que seleccionar un empleado asociado para el rol Empleado."
    }

    // fallback
    return errMsg || "Ocurrió un error al guardar."
  }

  return (
    <div className="max-w-8xl mx-auto space-y-2 px-1 sm:px-10">
      <Title> <div className="flex items-center gap-2">
        <Users className="w-6 h-6 text-gray-700" />
        Usuarios
      </div></Title>
      <Subtitle>Listado de Usuarios</Subtitle>
      {/* Lista */}
      <Table headers={["Nombre", "Perfil", "Empleado", "Email", "Acción"]}>
        {users.map(u => {
          const empleado = empleados.find(
            (e) => e.id_empleado === u.perfil_id_empleado
          )

          return (
            <tr key={u.id_usuario} className="border-t">
              <td className="p-2">{u.perfil_nombre}</td>
              <td className="p-2">{u.perfil_rol}</td>

              {/* 👉 NUEVA COLUMNA EMPLEADO */}
              <td className="p-2 text-sm">
                {empleado
                  ? empleado.empleado_nombre_apellido
                  : u.perfil_rol === "Empleado"
                    ? "—"
                    : ""}
              </td>

              <td className="p-2 text-xs text-gray-500">{u.email}</td>

              <td className="p-2 flex gap-2">
                <button
                  className="px-3 py-1 rounded bg-yellow-500 text-white"
                  onClick={() =>
                    setEditing({
                      id: u.id_usuario,
                      perfil_nombre: u.perfil_nombre,
                      perfil_rol: u.perfil_rol,
                      perfil_id_empleado: u.perfil_id_empleado ?? null,
                      email: u.email,
                    })
                  }
                >
                  Editar
                </button>
                <button
                  className="px-3 py-1 rounded bg-red-600 text-white"
                  onClick={() => setUsuarioEliminar(u)}
                >
                  Eliminar
                </button>
              </td>
            </tr>
          )
        })}

      </Table>

      {/*Botón AGREGaR y Modal agregar*/}
      <div className="flex justify-end gap-2 mt-4">
        <ModalAddItem
          title="Agregar Usuario"
          buttonLabel={
            <span className="flex items-center gap-1">
              <CirclePlus className="w-5 h-5 text-white-700" /> Agregar
            </span>}
          onSubmit={handleCreate}
          onClose={resetForm}>
          <input type="text" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="border rounded px-3 py-2 w-full"
            required />
          <input placeholder="Password" type="password"
            value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="border rounded px-3 py-2 w-full"
            required />
          <input placeholder="Nombre"
            value={form.perfil_nombre} onChange={(e) => setForm({ ...form, perfil_nombre: e.target.value.toUpperCase() })}
            className="border rounded px-3 py-2 w-full"
            required />
          <select className="border rounded px-3 py-2 w-full" value={form.perfil_rol} onChange={(e) => setForm({ ...form, perfil_rol: e.target.value })}>
            <option>Admin</option>
            <option>Supervisor</option>
            <option>Empleado</option>
          </select>
          {form.perfil_rol === "Empleado" && (
            <div className="space-y-1">
              <label className="text-xs text-gray-600">Empleado asociado</label>

              <select
                className="border rounded px-3 py-2 w-full"
                value={form.perfil_id_empleado ?? ""}
                onChange={(e) => {
                  const val = e.target.value
                  setForm((prev) => ({
                    ...prev,
                    perfil_id_empleado: val ? Number(val) : null,
                  }))
                }}
                required
              >
                <option value="">Seleccionar empleado...</option>

                {empleados.map((emp) => (
                  <option key={emp.id_empleado} value={emp.id_empleado}>
                    {emp.empleado_nombre_apellido}
                  </option>
                ))}
              </select>

              {/* debug 1 minuto */}
              <div className="text-[11px] text-gray-500">
                seleccionado: {String(form.perfil_id_empleado)}
              </div>
            </div>
          )}


        </ModalAddItem>
      </div>
      {/* Edición (usuario) - Modal editar */}
      {editing && (
        <Modal title="Editar Usuario" onClose={() => setEditing(null)}>
          <form onSubmit={handleUpdate} className="space-y-4">
            <input
              type="text"
              value={editing.perfil_nombre}
              onChange={(e) => setEditing({ ...editing, perfil_nombre: e.target.value, })}
              className="border w-full px-3 py-2 rounded"
              required
            />
            <select className="border w-full px-3 py-2 rounded"
              value={editing.perfil_rol}
              onChange={(e) => setEditing({ ...editing, perfil_rol: e.target.value })}>
              <option>Admin</option>
              <option>Supervisor</option>
              <option>Empleado</option>
            </select>

            {editing.perfil_rol === "Empleado" && (
              <div className="space-y-1">
                <label className="text-xs text-gray-600">Empleado asociado</label>

                <select
                  className="border rounded px-3 py-2 w-full"
                  value={editing.perfil_id_empleado ?? ""}
                  onChange={(e) => {
                    const val = e.target.value
                    setEditing((prev) => ({
                      ...prev,
                      perfil_id_empleado: val ? Number(val) : null,
                    }))
                  }}
                  required
                >
                  <option value="">Seleccionar empleado...</option>

                  {empleados.map((emp) => (
                    <option key={emp.id_empleado} value={emp.id_empleado}>
                      {emp.empleado_nombre_apellido}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Si quisieras actualizar email/password del auth: */}
            <input className="border w-full px-3 py-2 rounded" placeholder="Nuevo email (opcional)"
              value={editing.email || ""}
              onChange={(e) => setEditing({ ...editing, email: e.target.value })} />
            <input className="border w-full px-3 py-2 rounded" placeholder="Nueva password (opcional)"
              type="password"
              value={editing.password || ""}
              onChange={(e) => setEditing({ ...editing, password: e.target.value })} />
            <div className="flex justify-end gap-2">
              <Button variant="gray" onClick={() => setEditing(null)}>
                Cancelar
              </Button>
              <Button type="submit" variant="warning">
                Guardar
              </Button>
            </div>
          </form>
        </Modal>
      )}
      {usuarioEliminar && (
        <Modal title="Eliminar Usuario" onClose={() => setUsuarioEliminar(null)}>
          <p className="mb-6 text-center">
            ¿Seguro que deseas eliminar el usuario <b>{usuarioEliminar?.perfil_nombre}</b>?<br />
            Perfil: <b>{usuarioEliminar?.perfil_rol}</b><br />
            Email: <b>{usuarioEliminar?.email}</b>
          </p>

          <div className="flex justify-center gap-2">
            <Button variant="gray" onClick={() => setUsuarioEliminar(null)}>
              Cancelar
            </Button>

            <Button
              variant="danger"
              onClick={async () => {
                await deleteUser(usuarioEliminar.id_usuario)
                setUsuarioEliminar(null)
              }}
            >
              Sí, eliminar
            </Button>
          </div>
        </Modal>
      )}

      {pkErrorMsg && (
        <ModalPKError
          message={pkErrorMsg}
          onClose={() => setPkErrorMsg("")}
        />
      )}

    </div>
  )
}
