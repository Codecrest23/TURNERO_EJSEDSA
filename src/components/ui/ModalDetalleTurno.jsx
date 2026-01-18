import Modal from "./Modal"
import Button from "./Button"
import { FileText } from "lucide-react"
export default function ModalDetalleTurno({ turno, onClose }) {
  if (!turno) return null

  const {
    turno_nombre,
    localidades,
    turno_cantidad_dias,
    turno_cantidad_dias_descanso,
    turno_es_laboral,
    turno_color,
    turno_comentarios,
    turnos_horarios, // viene del fetchTurnos en useTurnos
    turno_motivo
  } = turno

  return (
    <Modal title={<div className="flex items-center gap-2">
      <FileText className=" text-gray-700" />
      <span> {turno_nombre}</span> </div>
    } onClose={onClose}>
      <div className="space-y-4 p-3 text-gray-800 ">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
          <Detail label="Localidad" value={localidades?.localidad_nombre || "Sin Localidad"} />
          <Detail label="Cantidad de días" value={turno_cantidad_dias ?? "-"} />
          <Detail label="Días de descanso" value={turno_cantidad_dias_descanso ?? "-"} />
          <Detail label="Motivo" value={turno_motivo} />
                    <Detail label="Motivo" value={turno_motivo} />

          <Detail label="Motivo" value={turno_motivo} />

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
        {/* ─────────────── Horarios ─────────────── */}
        {turnos_horarios && turnos_horarios.length > 0 && (
          <div className="mt-4">
            <span className="text-[15px] font-semibold text-gray-700">Horarios</span>
            <div className="mt-2 border rounded-lg overflow-hidden shadow-sm">
              <table className="w-full text-left border-collapse">
                <thead className="bg-gray-100 text-gray-700 text-sm">
                  <tr>
                    <th className="px-4 py-2 border-b">Tipo</th>
                    <th className="px-4 py-2 border-b">Entrada</th>
                    <th className="px-4 py-2 border-b">Salida</th>
                  </tr>
                </thead>
                <tbody className="text-gray-800 text-sm">
                  {turnos_horarios.map((h) => (
                    <tr key={h.id_turno_horario} className="hover:bg-gray-50 transition">
                      <td className="px-4 py-2 border-b">{h.turno_horario_tipo}</td>
                      <td className="px-4 py-2 border-b">{h.turno_horario_entrada}</td>
                      <td className="px-4 py-2 border-b">{h.turno_horario_salida}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ─────────────── Comentarios ─────────────── */}
        <div>
          <span className="text-[15px] font-semibold text-gray-700">
            Notas / Comentarios
          </span>
          <p className="border rounded bg-gray-50 p-4 mt-2 whitespace-pre-wrap text-gray-700 text-base leading-relaxed shadow-sm break-words">
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
    <div className="flex flex-col ">
      <span className="text-[15px] font-semibold text-gray-700">{label}</span>
      <span className="text-base text-gray-800 mt-0.5">{value}</span>
    </div>
  )
}
