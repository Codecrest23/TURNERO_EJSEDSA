import Modal from "./Modal"
import Button from "./Button"

export default function ModalDetalleTurno({ turno, onClose }) {
  if (!turno) return null

  const {
    turno_nombre,
    localidades,
    turno_cantidad_dias,
    turno_cantidad_dias_descanso,
    turno_tiene_guardia_pasiva,
    turno_es_laboral,
    turno_color,
    turno_comentarios,
  } = turno

  return (
    <Modal title={`🕒 ${turno_nombre}`} onClose={onClose}>
      <div className="space-y-6 p-3 text-gray-800">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
          <Detail label="Localidad" value={localidades?.localidad_nombre || "Sin Localidad"} />
          <Detail label="Cantidad de días" value={turno_cantidad_dias ?? "-"} />
          <Detail label="Días de descanso" value={turno_cantidad_dias_descanso ?? "-"} />
          <Detail
            label="Guardia Pasiva"
            value={turno_tiene_guardia_pasiva === 1 ? "Sí" : "No"}
          />
          <Detail label="Es laboral" value={turno_es_laboral || "-"} />
          <div className="flex flex-col gap-2">
            <span className="text-[15px] font-semibold text-gray-700">
              Color del turno
            </span>
            <div className="flex items-center gap-3">
              <div
                className="w-9 h-9 rounded-full border border-gray-300 shadow-sm"
                style={{ backgroundColor: turno_color }}
                title={turno_color}
              ></div>
              <span className="text-base font-mono text-gray-600">{turno_color}</span>
            </div>
          </div>
        </div>

        <div>
          <span className="text-[15px] font-semibold text-gray-700">
            Notas / Comentarios
          </span>
          <p className="border rounded bg-gray-50 p-4 mt-2 whitespace-pre-wrap text-gray-700 text-base leading-relaxed shadow-sm">
            {turno_comentarios || "Sin comentarios"}
          </p>
        </div>

        <div className="flex justify-end pt-5 border-t">
          <Button variant="gray" onClick={onClose} className="text-[15px] px-6 py-2">
            Cerrar
          </Button>
        </div>
      </div>
    </Modal>
  )
}

function Detail({ label, value }) {
  return (
    <div className="flex flex-col">
      <span className="text-[15px] font-semibold text-gray-700">{label}</span>
      <span className="text-base text-gray-800 mt-0.5">{value}</span>
    </div>
  )
}
