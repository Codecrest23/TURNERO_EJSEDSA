import { Info } from "lucide-react";

export default function ReferenciaTurnos({ onOpenModal, turnosLegend = [] }) {
  return (
    <div className="mt-4  pt-3 text-sm text-gray-700">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 font-semibold">
          <Info size={16} />
          Referencias
        
        <button
          onClick={onOpenModal}
          className="text-blue-600 hover:underline text-xs"
        >
          Ver completo
        </button>
        </div>
      </div>

      {/* Abreviaturas (SIN colores) */}
      <div className="mt-3">
        <div className="text-sm font-semibold text-gray-600 mb-2">Abreviaturas</div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
          <Abrev code="EXC" label="Excedido" />
          <Abrev code="LIC" label="Licencia" />
          <Abrev code="CAP" label="Capacitación / Curso" />
          <Abrev code="DES" label="Descanso / Franco" />
          <Abrev code="TRAB" label="Trabajo (usina/atención/guardia)" />
        </div>
      </div>

      {/* Colores por TURNO (dinámico) */}
      {/* <div className="mt-4">
        <div className="text-xs font-semibold text-gray-600 mb-2">Colores por turno</div>

        {turnosLegend.length === 0 ? (
          <div className="text-xs text-gray-500"></div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
            {turnosLegend.map((t) => (
              <TurnoColorItem
                key={`${t.color}-${t.nombre}`}
                nombre={t.nombre}
                color={t.color}
              />
            ))}
          </div>
        )}
      </div> */}
    </div>
  );
}

function Abrev({ code, label }) {
  return (
    <div className="flex items-center gap-2">
      <span className="min-w-[42px] font-mono font-semibold text-gray-800">{code}</span>
      <span className="text-gray-600">{label}</span>
    </div>
  );
}

function TurnoColorItem({ nombre, color }) {
  return (
    <div className="flex items-center gap-2">
      <span className="w-3 h-3 rounded-sm border" style={{ backgroundColor: color }} />
      <span className="text-gray-700">{nombre}</span>
    </div>
  );
}
