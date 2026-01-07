import Modal from "./Modal";
import Button from "./Button";
import { FileText } from "lucide-react";

export default function ModalDetalleAsignacionMini({ asignacion, onClose }) {
  if (!asignacion) return null;

  const empleado = asignacion.empleados;
  const turno = asignacion.turnos;
  const localidad = asignacion.localidades;

  const desde = asignacion.asignacion_fecha_desde
    ? new Date(asignacion.asignacion_fecha_desde).toLocaleDateString("es-AR")
    : "-";

  const hasta = asignacion.asignacion_fecha_hasta
    ? new Date(asignacion.asignacion_fecha_hasta).toLocaleDateString("es-AR")
    : "-";

  return (
    <Modal
      title={
        <div className="flex items-center gap-2">
          <FileText className="text-gray-700" size={18} />
          <span className="text-base">Detalle</span>
        </div>
      }
      onClose={onClose}
    >
      <div className="space-y-3 text-gray-800">
        {/* Datos principales */}
        <div className="grid grid-cols-1 gap-2">
          <DetailMini label="Empleado" value={empleado?.empleado_nombre_apellido || "-"} />
          <DetailMini label="Localidad" value={localidad?.localidad_nombre || "-"} />
          <DetailMini label="Turno" value={turno?.turno_nombre || "-"} />
          <DetailMini label="Motivo" value={turno?.turno_motivo || "-"} />

          <div className="grid grid-cols-2 gap-2">
            <DetailMini label="Desde" value={desde} />
            <DetailMini label="Hasta" value={hasta} />
          </div>

          <DetailMini label="Días Excedidos?" value={asignacion.asignacion_estado || "-"} />
        </div>

        {/* Comentarios (compactos) */}
        <SectionMini label="Comentario asignación">
          <BoxMini>{asignacion.asignacion_comentario || "Sin comentarios"}</BoxMini>
        </SectionMini>

        <div className="flex justify-end pt-2 border-t">
          <Button variant="gray" onClick={onClose}>
            Cerrar
          </Button>
        </div>
      </div>
    </Modal>
  );
}

function DetailMini({ label, value }) {
  return (
    <div className="flex flex-col leading-tight">
      <span className="text-[12px] font-semibold text-gray-600">{label}</span>
      <span className="text-[13px] text-gray-800">{value}</span>
    </div>
  );
}

function SectionMini({ label, children }) {
  return (
    <div className="flex flex-col">
      <span className="text-[12px] font-semibold text-gray-600">{label}</span>
      {children}
    </div>
  );
}

function BoxMini({ children }) {
  return (
    <div className="mt-1 max-h-20 overflow-y-auto border rounded bg-gray-50 p-2 text-[12px] shadow-inner">
      {children}
    </div>
  );
}
