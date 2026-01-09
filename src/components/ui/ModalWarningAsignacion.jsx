// ModalWarningAsignacion.jsx
import { AlertTriangle } from "lucide-react";
import Modal from "./Modal";

export default function ModalWarningAsignacion({ onClose,onConfirm=() => {}, empleadoNombre, conflictos = [] }) {
  return (
    <Modal title="Asignación duplicada" onClose={onClose}>
      <div className="flex flex-col items-center text-center gap-4 px-4 py-2">
        <AlertTriangle className="w-12 h-12 text-yellow-500" />

        <p className="text-lg font-semibold text-gray-800">
          Este empleado ya tiene una asignación en esas fechas
        </p>

        {empleadoNombre && (
          <p className="text-sm text-gray-700">
            Empleado: <b>{empleadoNombre}</b>
          </p>
        )}

        <div className="w-full text-left bg-yellow-50 border border-yellow-200 rounded p-3">
          <p className="text-sm font-semibold text-gray-800 mb-2">Conflictos encontrados:</p>

          <ul className="text-sm text-gray-700 space-y-2">
            {conflictos.map((c) => (
              <li key={c.id_asignacion} className="border-b last:border-b-0 pb-2 last:pb-0">
                <div>
                  <b>Localidad:</b> {c.localidad || "-"}
                </div>
                <div>
                  <b>Turno:</b> {c.turno || "-"}
                </div>
                <div>
                  <b>Desde:</b> {c.desde} &nbsp; <b>Hasta:</b> {c.hasta}
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex justify-center gap-3 mt-2">
         <button
            className="px-4 py-2 rounded bg-gray-200 text-gray-800 hover:bg-gray-300 transition"
            onClick={onClose}
          >
            Cancelar
          </button>

          <button
            className="px-4 py-2 rounded bg-yellow-500 text-white hover:bg-yellow-600 transition"
            onClick={onConfirm}
          >
            Continuar y guardar
          </button>
        </div>
      </div>
    </Modal>
  );
}
