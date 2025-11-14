import { useAsignaciones } from "../hooks/useAsignaciones"
import { useEmpleados } from "../hooks/useEmpleados"
import { useTurnos } from "../hooks/useTurnos"
import { useLocalidades } from "../hooks/useLocalidades"
import Table from "../components/ui/Table"
import Button from "../components/ui/Button"
import ModalAddItem from "../components/ui/ModalAddItem"
import Modal from "../components/ui/Modal"
import ModalDetalleAsignacion from "../components/ui/ModalDetalleAsignacion"
import { Title, Subtitle } from "../components/ui/Typography"
import { UserPlus } from "lucide-react"
import Select from "react-select"
import { useState, useEffect } from "react"
import ButtonSmall from "../components/ui/ButtonSmall"

export default function AsignacionTurnos() {
  const { asignaciones, loading, fetchAsignaciones, agregarAsignacion, eliminarAsignacion } =
    useAsignaciones()
  const { empleados } = useEmpleados()
  const { turnos } = useTurnos()
  const { localidades } = useLocalidades()
  const [motivoTurnoInfo, setMotivoTurnoInfo] = useState("");
  const [detalleAsignacion, setDetalleAsignacion] = useState(null);

  const [nuevaAsignacion, setNuevaAsignacion] = useState({
    asignacion_empleado_id: "",
    asignacion_turno_id: "",
    asignacion_localidad_id: "",
    asignacion_fecha_desde: "",
    asignacion_fecha_hasta: "",
    asignacion_comentario: "",
  })
  const [asignacionSeleccionada, setAsignacionSeleccionada] = useState(null)
    //agrgar para que automaticamente se coloque la localidad 

useEffect(() => {
  if (!nuevaAsignacion.asignacion_empleado_id) return;

  const empleado = empleados.find(
    (e) => e.id_empleado == nuevaAsignacion.asignacion_empleado_id
  );

  if (!empleado) return;

  setNuevaAsignacion((prev) => ({
    ...prev,
    asignacion_localidad_id: empleado.empleado_id_localidad || "",
    asignacion_turno_id: empleado.empleado_id_turno || "",
  }));
}, [nuevaAsignacion.asignacion_empleado_id, empleados]);

  if (loading) return <p>Cargando...</p>

  const handleAgregar = async (e) => {
    e.preventDefault()
    // if (
    //   !nuevaAsignacion.asignacion_empleado_id ||
    //   !nuevaAsignacion.asignacion_turno_id ||
    //   !nuevaAsignacion.asignacion_fecha_desde ||
    //   !nuevaAsignacion.asignacion_fecha_hasta
    // ) {
    //   alert("⚠️ Todos los campos obligatorios deben completarse.")
    //   return
    // }

    await agregarAsignacion({
      ...nuevaAsignacion,
      asignacion_empleado_id: Number(nuevaAsignacion.asignacion_empleado_id),
      asignacion_turno_id: Number(nuevaAsignacion.asignacion_turno_id),
      asignacion_localidad_id: Number(nuevaAsignacion.asignacion_localidad_id),
    })

    await fetchAsignaciones()
    setNuevaAsignacion({
      asignacion_empleado_id: "",
      asignacion_turno_id: "",
      asignacion_localidad_id: "",
      asignacion_fecha_desde: "",
      asignacion_fecha_hasta: "",
      asignacion_comentario: "",
    })
  }
  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <Title>
        <div className="flex items-center gap-2">
          <UserPlus className="w-6 h-6 text-gray-700" />
          Asignación de Turnos
        </div>
      </Title>
      <Subtitle>Asignar turnos a empleados</Subtitle>

      <Table
        headers={[
          "Empleado",
          "Turno",
          "Motivo",
          "Localidad",
          "Desde",
          "Hasta",
          "Comentario",
          "Detalles"
        ]}
      >
        {asignaciones.map((a) => (
          <tr
            key={a.id_asignacion}
            onClick={() =>
              setAsignacionSeleccionada(
                asignacionSeleccionada?.id_asignacion === a.id_asignacion
                  ? null
                  : a
              )
            }
            className={`border-b hover:bg-gray-100 cursor-pointer ${
              asignacionSeleccionada?.id_asignacion === a.id_asignacion
                ? "bg-blue-100"
                : ""
            }`}
          >
            <td className="px-6 py-3 ">
                  {a.empleados?.empleado_nombre_apellido}
            </td>
            <td className="px-6 py-3 flex items-center gap-2">
              <div className="line-clamp-2">
                {a.turnos?.turno_nombre}
              </div>
            </td>
            <td className="px-6 py-3">
              {a.turnos?.turno_motivo}
            </td>
            <td className="px-6 py-3">{a.localidades?.localidad_nombre}</td>
            <td className="px-6 py-3">{new Date(a.asignacion_fecha_desde).toLocaleDateString("es-AR")}</td>
            <td className="px-6 py-3">{new Date(a.asignacion_fecha_desde).toLocaleDateString("es-AR")}</td>
            <td className="px-6 py-3 max-w-xs"> <div className="line-clamp-2">{a.asignacion_comentario || "-"}</div></td>
            <td className="px-6 py-3 text-center">
              <ButtonSmall
                variant="primary"
                onClick={(e) => {
                  e.stopPropagation();
                  setDetalleAsignacion(a);
                }}
              >
                Ver detalle
              </ButtonSmall>
            </td>
          </tr>
        ))}
      </Table>

      {/* Botones */}
      <div className="flex justify-end gap-2 mt-4">
        <Button
          variant="danger"
          onClick={() => {
            if (asignacionSeleccionada)
              eliminarAsignacion(asignacionSeleccionada.id_asignacion)
          }}
          disabled={!asignacionSeleccionada}
        >
          Eliminar
        </Button>

        <ModalAddItem
          title="Nueva Asignación"
          buttonLabel="Agregar"
          onSubmit={handleAgregar}
        >
          

<Select
  options={empleados.map(e => ({
    value: e.id_empleado,
    label: e.empleado_nombre_apellido
  }))}
  onChange={(opt) =>
    setNuevaAsignacion({
      ...nuevaAsignacion,
      asignacion_empleado_id: opt?.value,
    })
  }
  placeholder="Seleccionar Empleado"
  isSearchable
/>

                  <Select
                    className="w-full"
                    placeholder="Seleccionar Localidad"
                    isSearchable={true}
                    value={
                      localidades
                        .map(l => ({
                          value: l.id_localidad,
                          label: l.localidad_nombre
                        }))
                        .find(opt => opt.value == nuevaAsignacion.asignacion_localidad_id) || null
                    }
                    onChange={(opt) =>
                      setNuevaAsignacion({
                        ...nuevaAsignacion,
                        asignacion_localidad_id: opt?.value || ""
                      })
                    }
                    options={localidades.map(l => ({
                      value: l.id_localidad,
                      label: l.localidad_nombre
                    }))}
                  />

                  <Select
                    className="w-full"
                    placeholder="Seleccionar Turno"
                    isSearchable={true}
                    value={
                      turnos
                        .map(t => ({
                          value: t.id_turno,
                          label: t.turno_nombre
                        }))
                        .find(opt => opt.value == nuevaAsignacion.asignacion_turno_id) || null
                    }
                  onChange={(opt) => {
                      const turno = turnos.find(t => t.id_turno == opt?.value);

                      // setear el turno elegido (esto ya lo tenías)
                      setNuevaAsignacion({
                        ...nuevaAsignacion,
                        asignacion_turno_id: opt?.value,
                      });

                      // setear motivo solo para mostrar
                      setMotivoTurnoInfo(turno?.turno_motivo || "");
                    }}
                    options={turnos.map(t => ({
                      value: t.id_turno,
                      label: t.turno_nombre
                    }))}
                  />
                  <label className="block text-sm font-medium text-gray-700 mt-2">
                    Motivo del turno
                  </label>
                  <input
                    type="text"
                    className="w-full border p-2 rounded bg-gray-100 text-gray-600"
                    value={motivoTurnoInfo}
                    disabled
                  />

            <input
              type="date"
              className="w-full border p-2 rounded"
              value={nuevaAsignacion.asignacion_fecha_desde}
              onChange={(e) =>
                setNuevaAsignacion({
                  ...nuevaAsignacion,
                  asignacion_fecha_desde: e.target.value,
                })
              }
            />
            <input
              type="date"
              className="w-full border p-2 rounded"
              value={nuevaAsignacion.asignacion_fecha_hasta}
              onChange={(e) =>
                setNuevaAsignacion({
                  ...nuevaAsignacion,
                  asignacion_fecha_hasta: e.target.value,
                })
              }
            />

            <textarea
              className="w-full border p-2 rounded"
              placeholder="Comentario"
              value={nuevaAsignacion.asignacion_comentario}
              onChange={(e) =>
                setNuevaAsignacion({
                  ...nuevaAsignacion,
                  asignacion_comentario: e.target.value,
                })
              }
            />
         
        </ModalAddItem>
      </div>
      {detalleAsignacion && (
          <ModalDetalleAsignacion
            asignacion={detalleAsignacion}
            onClose={() => setDetalleAsignacion(null)}
          />
        )}


    </div>
  )
}
