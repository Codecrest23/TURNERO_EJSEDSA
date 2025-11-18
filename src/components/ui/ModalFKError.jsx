// ModalFKError.jsx
import { ShieldAlert } from "lucide-react";
import Modal from "./Modal"; // ajustá la ruta si hace falta

export default function ModalFKError({ onClose }) {
  return (
    <Modal title="No se puede eliminar" onClose={onClose}>
      <div className="flex flex-col items-center text-center gap-4 px-4 py-2">

        <ShieldAlert className="w-12 h-12 text-red-500" />

        <p className="text-lg font-semibold text-gray-800">
          Este registro está siendo utilizado
        </p>

        <p className="text-sm text-gray-600">
          No se puede eliminar porque está vinculado a otros datos del sistema.
        </p>

        <div className="flex justify-center gap-3 mt-2">
          <button
            className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition"
            onClick={onClose}
          >
            Entendido
          </button>
        </div>
      </div>
    </Modal>
  );
}
