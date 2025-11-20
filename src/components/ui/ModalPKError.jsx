// ModalPKError.jsx
import { AlertOctagon } from "lucide-react";
import Modal from "./Modal";

export default function ModalPKError({ onClose }) {
  return (
    <Modal title="Registro duplicado" onClose={onClose}>
      <div className="flex flex-col items-center text-center gap-4 px-4 py-2">

        <AlertOctagon className="w-12 h-12 text-red-500" />

        <p className="text-lg font-semibold text-gray-800">
          El registro ya existe
        </p>

        <p className="text-sm text-gray-600">
          No se puede agregar o modificar porque ya existe un registro con los mismos datos.
        </p>

        <div className="flex justify-center mt-2">
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
