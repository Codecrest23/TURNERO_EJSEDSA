import { useState } from "react"
import { useFuncionesSectores } from "../hooks/useFuncionesSectores"
import Table from "../components/ui/Table"
import Button from "../components/ui/Button"
import ModalAddItem from "../components/ui/ModalAddItem"
import Modal from "../components/ui/Modal"
import { Title, Subtitle } from "../components/ui/Typography"
import { Briefcase, Building2, CirclePlus } from "lucide-react"
import ModalFKError from "../components/ui/ModalFKError"
import ModalPKError from "../components/ui/ModalPKError"

export default function FuncionesSectores() {
  const {
    funciones,
    sectores,
    loading,
    agregarFuncion,
    modificarFuncion,
    eliminarFuncion,
    agregarSector,
    modificarSector,
    eliminarSector,
  } = useFuncionesSectores()

  // FUNCIONES
  const [nuevaFuncion, setNuevaFuncion] = useState({ funcion_empleado_nombre: "" })
  const [funcionSeleccionada, setFuncionSeleccionada] = useState(null)
  const [funcionEditando, setFuncionEditando] = useState(null)
  const [funcionEliminar, setFuncionEliminar] = useState(null)

  const [errorFK, setErrorFK] = useState(false);
  const [errorPK, setErrorPK] = useState(false);
  // SECTORES
  const [nuevoSector, setNuevoSector] = useState({ sector_empleado_nombre: "" })
  const [sectorSeleccionado, setSectorSeleccionado] = useState(null)
  const [sectorEditando, setSectorEditando] = useState(null)
  const [sectorEliminar, setSectorEliminar] = useState(null)

  if (loading) return <p>Cargando...</p>

  // MANEJO FUNCIONES
  const handleAgregarFuncion = async (e) => {
    e.preventDefault()
    const resultado= await agregarFuncion(nuevaFuncion)
     if (resultado?.error?.code === "23505") {
    setErrorPK(true);       // Mostrar modal “Nombre duplicado”
    return false;                 // NO cerrar modal de edición
  }
    setNuevaFuncion({ funcion_empleado_nombre: "" })
  }

  const handleEditarFuncion = async (e) => {
    e.preventDefault()
    const resultado = await modificarFuncion(funcionEditando.funcion_empleado_id, {
      funcion_empleado_nombre: funcionEditando.funcion_empleado_nombre,
    })
    if (resultado?.error?.code === "23505") {
    setErrorPK(true);       // Mostrar modal “Nombre duplicado”
    return;                 // NO cerrar modal de edición
  }
    setFuncionEditando(null)
  }

  // 🧱 MANEJO SECTORES
  const handleAgregarSector = async (e) => {
    e.preventDefault()
    const resultado= await agregarSector(nuevoSector)
    if (resultado?.error?.code === "23505") {
    setErrorPK(true);       // Mostrar modal “Nombre duplicado”
    return false;                 // NO cerrar modal de edición
  }
    setNuevoSector({ sector_empleado_nombre: "" })
  }

  const handleEditarSector = async (e) => {
    e.preventDefault()
    const resultado= await modificarSector(sectorEditando.id_sector_empleado, {
      sector_empleado_nombre: sectorEditando.sector_empleado_nombre,
    })
    if (resultado?.error?.code === "23505") {
    setErrorPK(true);       // Mostrar modal “Nombre duplicado”
    return;                 // NO cerrar modal de edición
  }
    setSectorEditando(null)
  }

  return (
    <div className="max-w-8xl mx-auto space-y-2 px-1 sm:px-10">
      <Title>Funciones y Sectores</Title>
      <Subtitle>Gestión de funciones y sectores del personal</Subtitle>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* 🧩 FUNCIONES */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <Briefcase className="w-6 h-6 text-gray-700" />
            <h2 className="text-xl font-semibold">Funciones</h2>
          </div>

          <Table headers={["N°", "Función"]}>
            {funciones.map((f, i) => (
              <tr
                key={f.funcion_empleado_id}
                onClick={() =>
                  setFuncionSeleccionada(
                    funcionSeleccionada?.funcion_empleado_id === f.funcion_empleado_id
                      ? null
                      : f
                  )
                }
                className={`border-b hover:bg-gray-100 cursor-pointer transition ${
                  funcionSeleccionada?.funcion_empleado_id === f.funcion_empleado_id
                    ? "bg-blue-100"
                    : ""
                }`}
              >
                <td className="px-6 py-3">{i + 1}</td>
                <td className="px-6 py-3">{f.funcion_empleado_nombre}</td>
              </tr>
            ))}
          </Table>

          <div className="flex justify-end gap-2">
            <Button
              variant="warning"
              onClick={() => setFuncionEditando(funcionSeleccionada)}
              disabled={!funcionSeleccionada}
            >
              Modificar
            </Button>
            <Button
              variant="danger"
              onClick={() => setFuncionEliminar(funcionSeleccionada)}
              disabled={!funcionSeleccionada}
            >
              Eliminar
            </Button>
            <ModalAddItem
              title="Agregar Función"
              buttonLabel={
                <span className="flex items-center gap-1">
                  <CirclePlus className="w-5 h-5 text-white-700" /> Agregar
                </span>
              }
              onSubmit={handleAgregarFuncion}
            >
              <input
                type="text"
                placeholder="Nombre de función"
                value={nuevaFuncion.funcion_empleado_nombre}
                onChange={(e) =>
                  setNuevaFuncion({ funcion_empleado_nombre: e.target.value })
                }
                className="border rounded px-3 py-2 w-full"
                required
              />
            </ModalAddItem>
          </div>
        </section>

        {/* 🧩 SECTORES */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <Building2 className="w-6 h-6 text-gray-700" />
            <h2 className="text-xl font-semibold">Sectores</h2>
          </div>

          <Table headers={["N°", "Sector"]}>
            {sectores.map((s, i) => (
              <tr
                key={s.id_sector_empleado}
                onClick={() =>
                  setSectorSeleccionado(
                    sectorSeleccionado?.id_sector_empleado === s.id_sector_empleado
                      ? null
                      : s
                  )
                }
                className={`border-b hover:bg-gray-100 cursor-pointer transition ${
                  sectorSeleccionado?.id_sector_empleado === s.id_sector_empleado
                    ? "bg-blue-100"
                    : ""
                }`}
              >
                <td className="px-6 py-3">{i + 1}</td>
                <td className="px-6 py-3">{s.sector_empleado_nombre}</td>
              </tr>
            ))}
          </Table>

          <div className="flex justify-end gap-2">
            <Button
              variant="warning"
              onClick={() => setSectorEditando(sectorSeleccionado)}
              disabled={!sectorSeleccionado}
            >
              Modificar
            </Button>
            <Button
              variant="danger"
              onClick={() => setSectorEliminar(sectorSeleccionado)}
              disabled={!sectorSeleccionado}
            >
              Eliminar
            </Button>
            <ModalAddItem
              title="Agregar Sector"
              buttonLabel={
                <span className="flex items-center gap-1">
                  <CirclePlus className="w-5 h-5 text-white-700" /> Agregar
                </span>
              }
              onSubmit={handleAgregarSector}
            >
              <input
                type="text"
                placeholder="Nombre del sector"
                value={nuevoSector.sector_empleado_nombre}
                onChange={(e) =>
                  setNuevoSector({ sector_empleado_nombre: e.target.value })
                }
                className="border rounded px-3 py-2 w-full"
                required
              />
            </ModalAddItem>
          </div>
        </section>
      </div>

      {/* 🧱 Modales de edición / eliminación */}
      {funcionEditando && (
        <Modal title="Editar Función" onClose={() => setFuncionEditando(null)}>
          <form onSubmit={handleEditarFuncion} className="space-y-4">
            <input
              type="text"
              value={funcionEditando.funcion_empleado_nombre}
              onChange={(e) =>
                setFuncionEditando({
                  ...funcionEditando,
                  funcion_empleado_nombre: e.target.value,
                })
              }
              className="border w-full px-3 py-2 rounded"
              required
            />
            <div className="flex justify-end gap-2">
              <Button variant="gray" onClick={() => setFuncionEditando(null)}>
                Cancelar
              </Button>
              <Button type="submit" variant="warning">
                Guardar
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {funcionEliminar && (
        <Modal title="Eliminar Función" onClose={() => setFuncionEliminar(null)}>
          <p className="mb-6 text-center">
            ¿Seguro que deseas eliminar la función{" "}
            <b>"{funcionEliminar.funcion_empleado_nombre}"</b>?
          </p>
          <div className="flex justify-center gap-2">
            <Button variant="gray" onClick={() => setFuncionEliminar(null)}>
              Cancelar
            </Button>
            <Button
              variant="danger"
              onClick={async() => {
                const resultado = await eliminarFuncion(funcionEliminar.funcion_empleado_id)
                if (resultado?.error?.code === "23503"){
                  setErrorFK(true);
                  setFuncionEliminar(null);
                  return;
                }
                setFuncionEliminar(null)
              }}
            >
              Sí, eliminar
            </Button>
          </div>
        </Modal>
      )}

      {sectorEditando && (
        <Modal title="Editar Sector" onClose={() => setSectorEditando(null)}>
          <form onSubmit={handleEditarSector} className="space-y-4">
            <input
              type="text"
              value={sectorEditando.sector_empleado_nombre}
              onChange={(e) =>
                setSectorEditando({
                  ...sectorEditando,
                  sector_empleado_nombre: e.target.value,
                })
              }
              className="border w-full px-3 py-2 rounded"
              required
            />
            <div className="flex justify-end gap-2">
              <Button variant="gray" onClick={() => setSectorEditando(null)}>
                Cancelar
              </Button>
              <Button type="submit" variant="warning">
                Guardar
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {sectorEliminar && (
        <Modal title="Eliminar Sector" onClose={() => setSectorEliminar(null)}>
          <p className="mb-6 text-center">
            ¿Seguro que deseas eliminar el sector{" "}
            <b>"{sectorEliminar.sector_empleado_nombre}"</b>?
          </p>
          <div className="flex justify-center gap-2">
            <Button variant="gray" onClick={() => setSectorEliminar(null)}>
              Cancelar
            </Button>
            <Button
              variant="danger"
              onClick={ async() => {
                const resultado =await  eliminarSector(sectorEliminar.id_sector_empleado)
                if(resultado?.error?.code==="23503"){
                  setErrorFK(true);
                  setSectorEliminar (null)
                }
                setSectorEliminar(null)
              }}
            >
              Sí, eliminar
            </Button>
          </div>
        </Modal>
      )}
      {/* 🛑 Modal de Error por FK y PK */}
      {errorFK && (
        <ModalFKError onClose={() => setErrorFK(false)} />
      )}
      {errorPK && (
              <ModalPKError onClose={() => setErrorPK(false)} />
            )}
    </div>
  )
}
