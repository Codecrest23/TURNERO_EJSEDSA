import { useState } from "react"
import Modal from "./Modal"
import Button from "./Button"

export default function AddItem({ title = "Agregar", buttonLabel = "Agregar", children, onSubmit }) {
  const [open, setOpen] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    await onSubmit(e)
    setOpen(false)
  }

  return (
    <>
      <Button variant="primary" onClick={() => setOpen(true)}>
        {buttonLabel}
      </Button>

      {open && (
        <Modal title={title} onClose={() => setOpen(false)}>
          <form onSubmit={handleSubmit} className="space-y-4">
            {children}

            <div className="flex justify-end gap-2 pt-2">
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
