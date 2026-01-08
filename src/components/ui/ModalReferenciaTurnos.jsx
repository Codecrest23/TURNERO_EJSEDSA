import Button from "./Button";
import { Info, Palette } from "lucide-react";

function withAlpha(hex, alpha = "30") {
  if (!hex) return hex;
  return hex.length === 7 ? `${hex}${alpha}` : hex;
}

export default function ModalReferenciaTurnos({ onClose, turnosLegend = [] }) {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[80vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between gap-3 px-6 py-4 border-b">
          <div className="flex items-center gap-2">
            <Info className="text-gray-700" size={18} />
            <h2 className="text-lg font-bold">Referencias</h2>
          </div>

          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800 font-bold text-lg"
            aria-label="Cerrar"
            title="Cerrar"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-4 space-y-6 text-gray-800">
          <div className="text-sm text-gray-600">
            Abreviaturas usadas en la grilla y colores asociados a cada turno.
          </div>

          {/* Abreviaturas */}
          <section className="space-y-2">
            <div className="text-xs font-semibold text-gray-600">Abreviaturas</div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
              <AbrevCard code="EXC" label="Excedido " desc="Días de trabajo excedidos." />
              <AbrevCard code="LIC" label="Licencia" desc="Detectado por motivo/nombre/comentario." />
              <AbrevCard code="CAP" label="Capacitación" desc="Curso / Capacitación." />
              <AbrevCard code="DES" label="Descanso" desc="Franco / Descanso." />
              <AbrevCard code="TRAB" label="Trabajo" desc="Usina / Atención / Guardia / Trabajo." />
            </div>
          </section>

          {/* Colores por turno */}
          <section className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-gray-600">
              <Palette size={14} />
              Colores por turno
            </div>

            {turnosLegend.length === 0 ? (
              <div className="text-xs text-gray-500">
                No se detectaron turnos con color en el rango actual.
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
                {turnosLegend.map((t) => (
                  <TurnoCard
                    key={`${t.color}|${t.nombre}`}
                    nombre={t.nombre}
                    color={t.color}
                  />
                ))}
              </div>
            )}

            <div className="text-[11px] text-gray-500">
              * El color de fondo en la celda depende del <b>turno</b> asignado.
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 px-6 py-4 border-t bg-white">
          <Button variant="gray" onClick={onClose}>
            Cerrar
          </Button>
        </div>
      </div>
    </div>
  );
}

function AbrevCard({ code, label, desc }) {
  return (
    <div className="border rounded-xl p-3 bg-gray-50">
      <div className="flex items-start gap-3">
        <div className="min-w-[52px] font-mono font-semibold text-gray-800">{code}</div>
        <div className="flex-1">
          <div className="font-semibold text-gray-800 leading-tight">{label}</div>
          {desc ? <div className="text-xs text-gray-600 mt-1">{desc}</div> : null}
        </div>
      </div>
    </div>
  );
}

function TurnoCard({ nombre, color }) {
  return (
    <div className="border rounded-xl p-3 bg-white">
      <div className="flex items-center gap-3">
        <span className="w-4 h-4 rounded-sm border" style={{ backgroundColor: withAlpha(color, "50") }} />
        <div className="flex-1 text-gray-800">{nombre}</div>
        <div className="text-[11px] font-mono text-gray-500">{color}</div>
      </div>
    </div>
  );
}
