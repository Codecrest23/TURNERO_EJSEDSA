import Modal from "./Modal"
import Button from "./Button"

export default function ConfirmModal({ title, message, variant = "primary", onConfirm, onCancel }) {
  return (
    <Modal title={title} onClose={onCancel}>
      <p className="mb-6 text-center">{message}</p>
      <div className="flex justify-center gap-2">
        <Button variant="gray" onClick={onCancel}>
          Cancelar
        </Button>
        <Button variant={variant} onClick={onConfirm}>
          Confirmar
        </Button>
      </div>
    </Modal>
  )
}
