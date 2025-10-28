import { useState } from "react"
import Modal from "./Modal"
import Button from "./Button"
import { LayoutGrid, PencilLine, Trash, CirclePlus } from "lucide-react"

export default function AddItem({ title = "Agregar", children, onSubmit }) {
  const [open, setOpen] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    await onSubmit(e)
    setOpen(false)
  }

  return (
    <>
      <Button variant="primary" onClick={() => setOpen(true)}>
               <span className="flex items-center gap-1">
          <CirclePlus className="w-5 h-5 text-white-700" />
          Agregar
        </span>
      </Button>

      {open && (
        <Modal title={title} onClose={() => setOpen(false)}>
          <form onSubmit={handleSubmit} className="flex flex-col max-h-[85vh]">
            {/* Contenido con scroll */}
            <div className="space-y-4 overflow-y-auto pr-2 flex-1">
              {children}
            </div>

            {/* Botones fijos al final */}
            <div className="flex justify-end gap-2 pt-3  sticky bottom-0">
              <Button variant="gray" onClick={() => setOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" variant="primary">
                Guardar
              </Button>
            </div>
          </form>

        </Modal>
      )}
    </>
  )
}
