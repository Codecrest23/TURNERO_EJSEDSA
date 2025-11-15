import Modal from "./ModalXL"
import Button from "./Button"
import { icons, FileText} from "lucide-react"
export default function ModalDetalleAsignacion({ asignacion, onClose }) {
  if (!asignacion) return null;

  const empleado = asignacion.empleados;
  const turno = asignacion.turnos;
  const localidad = asignacion.localidades;

  return (
    <Modal
      title= {
    <div className="flex items-center gap-2">
      <FileText className=" text-gray-700" />
      <span>Detalle de Asignación</span>
    </div>
  }
      onClose={onClose}
    >
      <div className="space-y-6 p-3 text-gray-800 ">

        {/* GRID PRINCIPAL */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-5">

          <Detail label="Empleado" value={empleado?.empleado_nombre_apellido} />
          <Detail label="Localidad" value={localidad?.localidad_nombre} />

          <Detail label="Función" value={empleado?.empleado_funcion || "-"} />
          <Detail label="Sector" value={empleado?.empleado_sector || "-"} />

          <Detail label="Turno" value={turno?.turno_nombre} />
          <Detail label="Motivo del turno" value={turno?.turno_motivo || "-"} />

          <Detail
            label="Desde"
            value={new Date(asignacion.asignacion_fecha_desde).toLocaleDateString("es-AR")}
          />

          <Detail
            label="Hasta"
            value={new Date(asignacion.asignacion_fecha_hasta).toLocaleDateString("es-AR")}
          />
        </div>

        {/* COMENTARIOS DEL TURNO */}
        <Section label="Comentarios del turno">
          <ScrollableBox>
            {turno?.turno_comentarios || "Sin comentarios"}
            
          </ScrollableBox>
        </Section>

        {/* COMENTARIO DE ASIGNACIÓN */}
        <Section label="Comentario de la asignación">
          <ScrollableBox>
            {asignacion.asignacion_comentario || "Sin comentarios"}
        </ScrollableBox>
        </Section>

        <div className="flex justify-end pt-5 border-t">
          <Button variant="gray" onClick={onClose}>Cerrar</Button>
        </div>

      </div>
    </Modal>
  );
}


function Detail({ label, value }) {
  return (
    <div className="flex flex-col">
      <span className="text-[18px] font-semibold text-gray-700">{label}</span>
      <span className="text-[19px] text-gray-800">{value}</span>
    </div>
  );
}

function Section({ label, children }) {
  return (
    <div  className="flex flex-col">
      <span className="text-[15px] font-semibold text-gray-700">{label}</span>
      {children}
    </div>
  );
}

function ScrollableBox({ children }) {
  return (
       <div className="mt-2 max-h-40 overflow-y-auto border rounded bg-gray-50 p-3 shadow-inner">
      {children}
    </div>
  );
}
