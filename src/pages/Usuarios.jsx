import { useState } from "react"
import { useUsers } from "../hooks/useUsers"
import Table from "../components/ui/Table"
import Button from "../components/ui/Button"
import ModalAddItem from "../components/ui/ModalAddItem"
import Modal from "../components/ui/Modal"
import { Title, Subtitle } from "../components/ui/Typography"
import {Users, CirclePlus } from "lucide-react"

export default function Usuarios() {
  const { users, loading, createUser, updateUser, deleteUser } = useUsers()
  const [form, setForm] = useState({ email: "", password: "", perfil_nombre: "", perfil_rol: "Empleado" })
  const [editing, setEditing] = useState(null)

  if (loading) return <p>Cargando...</p>

  const handleCreate = async (e) => {
    e.preventDefault()
    await createUser(form)
    setForm({ email: "", password: "", perfil_nombre: "", perfil_rol: "Empleado" })
  }

  const handleUpdate = async (e) => {
    e.preventDefault()
    await updateUser(editing)
    setEditing(null)
  }
  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <Title> <div className="flex items-center gap-2">
          <Users className="w-6 h-6 text-gray-700" />
          Usuarios
        </div></Title>
      <Subtitle>Listado de Usuarios</Subtitle>
      {/* Lista */}
      <Table headers={["Nombre", "Perfil", "Email", "Acción"]}>
          {users.map(u => (
            <tr key={u.id_usuario} className="border-t">
              <td className="p-2">{u.perfil_nombre}</td>
              <td className="p-2">{u.perfil_rol}</td>
              <td className="p-2 text-xs text-gray-500">{u.email}</td>
              <td className="p-2 flex gap-2">
                <button className="px-3 py-1 rounded bg-yellow-500 text-white"
                  onClick={()=> setEditing({ id: u.id_usuario, perfil_nombre: u.perfil_nombre, perfil_rol: u.perfil_rol,email: u.email })}>
                  Editar
                </button>
                <button className="px-3 py-1 rounded bg-red-600 text-white"
                  onClick={()=> deleteUser(u.id_usuario)}>
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
      </Table>

     {/*Botón AGREGaR y Modal agregar*/}
      <div className="flex justify-end gap-2 mt-4">
        <ModalAddItem
            title="Agregar Usuario"
            buttonLabel={
             <span className="flex items-center gap-1">
               <CirclePlus className="w-5 h-5 text-white-700" /> Agregar
              </span>}
                onSubmit={handleCreate}>
            <input type="text" placeholder="Email" value={form.email} onChange={(e)=>setForm({...form, email: e.target.value})}
            className="border rounded px-3 py-2 w-full"
            required/>
            <input placeholder="Password" type="password"
              value={form.password} onChange={(e)=>setForm({...form, password: e.target.value})} 
              className="border rounded px-3 py-2 w-full"
              required />
            <input placeholder="Nombre"
              value={form.perfil_nombre} onChange={(e)=>setForm({...form, perfil_nombre: e.target.value.toUpperCase()})} 
              className="border rounded px-3 py-2 w-full"
              required />
            <select className="border rounded px-3 py-2 w-full" value={form.perfil_rol} onChange={(e)=>setForm({...form, perfil_rol: e.target.value})}>
              <option>Admin</option>
              <option>Supervisor</option>
              <option>Empleado</option>
            </select>
              </ModalAddItem>
      </div>
       {/* Edición (usuario) - Modal editar */}
             {editing && (
               <Modal title="Editar Usuario" onClose={() => setEditing(null)}>
                 <form onSubmit={handleUpdate} className="space-y-4">
                   <input
                     type="text"
                     value={editing.perfil_nombre}
                     onChange={(e) => setEditing({...editing,perfil_nombre: e.target.value,})}
                     className="border w-full px-3 py-2 rounded"
                     required
                   />
                   <select className="border w-full px-3 py-2 rounded"
                    value={editing.perfil_rol}
                    onChange={(e)=>setEditing({...editing, perfil_rol: e.target.value})}>
                    <option>Admin</option>
                    <option>Supervisor</option>
                    <option>Empleado</option>
                  </select>
                  {/* Si quisieras actualizar email/password del auth: */}
                  <input  className="border w-full px-3 py-2 rounded" placeholder="Nuevo email (opcional)"
                    value={editing.email || ""} 
                    onChange={(e)=>setEditing({...editing, email: e.target.value})} /> 
                  <input className="border w-full px-3 py-2 rounded" placeholder="Nueva password (opcional)" 
                    type="password"
                    value={editing.password || ""} 
                    onChange={(e)=>setEditing({...editing, password: e.target.value})} /> 
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

    </div>
  )
}
