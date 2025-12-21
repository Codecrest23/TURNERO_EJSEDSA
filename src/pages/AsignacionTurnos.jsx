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
import { CalendarClock } from "lucide-react"
import Select from "react-select"
import { useState, useEffect } from "react"
import ButtonSmall from "../components/ui/ButtonSmall"
import FiltroEmpleado from "../components/ui/Filtros/FiltroEmpleado"
import FiltroLocalidad from "../components/ui/Filtros/FiltroLocalidad"
import FiltroTurno from "../components/ui/Filtros/FiltroTurno"
import FiltroZona from "../components/ui/Filtros/FiltroZona"
import Toggle from "../components/ui/Toggle"
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useZonas } from "../hooks/useZonas"


export default function AsignacionTurnos() {
  const { asignaciones, loading, fetchAsignaciones, agregarAsignacion, eliminarAsignacion,modificarAsignacion} =useAsignaciones()
  const [asignacionEliminar, setAsignacionEliminar] = useState(null)
  const { empleados } = useEmpleados()
  const { turnos } = useTurnos()
  const { localidades } = useLocalidades()
  const { zonas } = useZonas()
  const [motivoTurnoInfo, setMotivoTurnoInfo] = useState("");
  const [detalleAsignacion, setDetalleAsignacion] = useState(null);

  const [rangoFechas, setRangoFechas] = useState([null, null]); 
  const [fechaInicio, fechaFin] = rangoFechas;

// Formatea Date -> "YYYY-MM-DD" (sin problemas de zona horaria)
  const toYMD = (date) => {
    if (!date) return "";
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  };

  const [nuevaAsignacion, setNuevaAsignacion] = useState({
    asignacion_empleado_id: "",
    asignacion_turno_id: "",
    asignacion_localidad_id: "",
    asignacion_fecha_desde: "",
    asignacion_fecha_hasta: "",
    asignacion_comentario: "",
  })
  const [asignacionSeleccionada, setAsignacionSeleccionada] = useState(null)
  const [esLaboral, setEsLaboral] = useState(true); // true = laboral
  const limpiarFormulario = () => {
    setNuevaAsignacion({
      asignacion_empleado_id: "",
      asignacion_localidad_id: "",
      asignacion_turno_id: "",
      asignacion_fecha_desde: "",
      asignacion_fecha_hasta: "",
      asignacion_comentario: "",
    
      });

    setMotivoTurnoInfo("");  
    setEsLaboral(true);
    setRangoFechas([null, null]);
  };

const [filtroEmpleados, setFiltroEmpleados] = useState([]);
const [filtroLocalidades, setFiltroLocalidades] = useState([]);
const [filtroTurnos, setFiltroTurnos] = useState([]);
const [filtroZonas, setFiltroZonas] = useState([]);

//Editar ASIGNACIÓN

const [modalEditar, setModalEditar] = useState(false);

const [asignacionEdit, setAsignacionEdit] = useState({
  asignacion_empleado_id: "",
  asignacion_turno_id: "",
  asignacion_localidad_id: "",
  asignacion_fecha_desde: "",
  asignacion_fecha_hasta: "",
  asignacion_comentario: "",
});

// RangePicker EDITAR
const [rangoFechasEdit, setRangoFechasEdit] = useState([null, null]);
const [fechaInicioEdit, fechaFinEdit] = rangoFechasEdit;

// "YYYY-MM-DD" -> Date (sin corrimientos raros por timezone)
const ymdToDate = (ymd) => {
  if (!ymd) return null;
  const [y, m, d] = ymd.split("-").map(Number);
  return new Date(y, m - 1, d);
};
//FUNCIÓN PARA ABRIR EL MODAL DE EDITAR.
const abrirEditar = () => {
  if (!asignacionSeleccionada) return;

  // ojo: en tu tabla la asignación trae id_asignacion y los campos asignacion_* :contentReference[oaicite:3]{index=3}
  const a = asignacionSeleccionada;

  setAsignacionEdit({
    id_asignacion: a.id_asignacion,
    asignacion_empleado_id: a.asignacion_empleado_id ?? "",
    asignacion_turno_id: a.asignacion_turno_id ?? "",
    asignacion_localidad_id: a.asignacion_localidad_id ?? "",
    asignacion_fecha_desde: (a.asignacion_fecha_desde || "").slice(0, 10),
    asignacion_fecha_hasta: (a.asignacion_fecha_hasta || "").slice(0, 10),
    asignacion_comentario: a.asignacion_comentario || "",
  });

  setRangoFechasEdit([
    ymdToDate((a.asignacion_fecha_desde || "").slice(0, 10)),
    ymdToDate((a.asignacion_fecha_hasta || "").slice(0, 10)),
  ]);

  setModalEditar(true);
};

//HANDLER DE EDITAR CON VALIDACIÓN
const handleEditar = async (e) => {
  e.preventDefault();

  const { asignacion_fecha_desde: desde, asignacion_fecha_hasta: hasta } = asignacionEdit;

  if (!desde || !hasta) {
    alert("Seleccioná un rango completo (Desde y Hasta).");
    return;
  }
  if (hasta < desde) {
    alert("La fecha 'Hasta' no puede ser anterior a 'Desde'.");
    return;
  }

  const datosLimpios = {
    asignacion_empleado_id: Number(asignacionEdit.asignacion_empleado_id) || null,
    asignacion_turno_id: Number(asignacionEdit.asignacion_turno_id) || null,
    asignacion_localidad_id: Number(asignacionEdit.asignacion_localidad_id) || null,
    asignacion_fecha_desde: asignacionEdit.asignacion_fecha_desde,
    asignacion_fecha_hasta: asignacionEdit.asignacion_fecha_hasta,
    asignacion_comentario: asignacionEdit.asignacion_comentario || null,
    // NO mandes asignacion_fecha_Hora_modificacion si lo vas a hacer en DB
  };

  await modificarAsignacion(asignacionEdit.id_asignacion, datosLimpios);

  await fetchAsignaciones();
  setModalEditar(false);
  setAsignacionSeleccionada(null); 
};

//Fin Editar ASignación


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
    //Completar también el motivo solo informativo
      const turno = turnos.find(
    (t) => t.id_turno == empleado.empleado_id_turno
  );
  setMotivoTurnoInfo(turno?.turno_motivo || "");
}, [nuevaAsignacion.asignacion_empleado_id, empleados, turnos]);

  if (loading) return <p>Cargando...</p>

  const handleAgregar = async (e) => {
    e.preventDefault()
    await agregarAsignacion({
      ...nuevaAsignacion,
      asignacion_empleado_id: Number(nuevaAsignacion.asignacion_empleado_id),
      asignacion_turno_id: Number(nuevaAsignacion.asignacion_turno_id),
      asignacion_localidad_id: Number(nuevaAsignacion.asignacion_localidad_id),
    })

    await fetchAsignaciones()
    limpiarFormulario();
  }


// OPCIONES AGRUPADAS PARA EL SELECT DE TURNOS
const turnosFiltrados = turnos.filter((t) => {
  const coincideLaboral = esLaboral
    ? t.turno_es_laboral === "Si"
    : t.turno_es_laboral === "No";

  return coincideLaboral;
});

const locID = Number(nuevaAsignacion.asignacion_localidad_id);

// crudos
const turnosLocalidad = turnosFiltrados.filter(
  (t) => Number(t.turno_id_localidad) === locID
);

const otrosTurnos = turnosFiltrados.filter(
  (t) => Number(t.turno_id_localidad) !== locID
);

// 🔹 opciones formateadas para react-select
const turnosLocalidadOptions = turnosLocalidad.map((t) => ({
  value: t.id_turno,
  label: t.turno_nombre,
}));

const otrosTurnosOptions = otrosTurnos.map((t) => ({
  value: t.id_turno,
  label: t.turno_nombre,
}));

// 🔹 grupos
const opcionesTurnos = [
  ...(turnosLocalidadOptions.length > 0
    ? [
        {
          label: "Turnos de esta Localidad",
          options: turnosLocalidadOptions,
        },
      ]
    : []),
  ...(otrosTurnosOptions.length > 0
    ? [
        {
          label: "Otros Turnos",
          options: otrosTurnosOptions,
        },
      ]
    : []),
];

//  FILTRO VISUAL
const filteredAsignaciones = asignaciones.filter((a) => {
const empOk =
  filtroEmpleados.length === 0 ||
  filtroEmpleados.some((f) => Number(f.value) === Number(a.asignacion_empleado_id));

const locOk =
  filtroLocalidades.length === 0 ||
  filtroLocalidades.some((f) => Number(f.value) === Number(a.asignacion_localidad_id));

const turnoOk =
  filtroTurnos.length === 0 ||
  filtroTurnos.some((f) => Number(f.value) === Number(a.asignacion_turno_id));

const zonaOk =
  filtroZonas.length === 0 ||
  filtroZonas.some((f) => Number(f.value) === Number(a.localidades?.zonas?.id_zona));
  
  return empOk && locOk && turnoOk && zonaOk;
  
});

// OPCIONES AGRUPADAS PARA EL SELECT DE TURNOS

  return (
    <div className="max-w-8xl mx-auto space-y-2">
      <Title>
        <div className="flex items-center gap-z">
          <CalendarClock className="w-6 h-6 text-gray-700" />
          Asignación de Turnos
        </div>
      </Title>
     
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
{/* INICIO DE FILTROS */}
  <FiltroEmpleado
    empleados={empleados}
    value={filtroEmpleados}
    onChange={setFiltroEmpleados}
  />

  <FiltroLocalidad
    localidades={localidades}
    value={filtroLocalidades}
    onChange={setFiltroLocalidades}
  />

  <FiltroTurno
    turnos={turnos}
    value={filtroTurnos}
    onChange={setFiltroTurnos}
  />

  <FiltroZona
    zonas={zonas}
    value={filtroZonas}
    onChange={setFiltroZonas}
  />
</div>

{/* INICIO DE TABLA */}
      <Table
        headers={["Zona","Localidad","Empleado","Turno","Motivo","Desde","Hasta","Comentario","Detalles"]}>
        {filteredAsignaciones.map((a) => (
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
            <td className="px-6 py-3">{a.localidades?.zonas?.zona_nombre}</td>
            <td className="px-6 py-3">{a.localidades?.localidad_nombre}</td>
            <td className="px-6 py-3 ">{a.empleados?.empleado_nombre_apellido}</td>
            <td className="px-6 py-3 flex items-center gap-2"><div className="line-clamp-2">{a.turnos?.turno_nombre}</div></td>
            <td className="px-6 py-3">{a.turnos?.turno_motivo}</td>
            <td className="px-6 py-3">{new Date(a.asignacion_fecha_desde).toLocaleDateString("es-AR")}</td>
            <td className="px-6 py-3">{new Date(a.asignacion_fecha_hasta).toLocaleDateString("es-AR")}</td>
            <td className="px-6 py-3 max-w-xs"> <div className="line-clamp-2">{a.asignacion_comentario || "-"}</div></td>
            <td className="px-6 py-3 text-center">
              <ButtonSmall
                variant="primary"
                onClick={(e) => {
                  e.stopPropagation();
                  setDetalleAsignacion(a);
                }}>Ver detalle
              </ButtonSmall>
            </td>
          </tr>
        ))}
      </Table>

{/* INICIO BOTONES */}
      <div className="flex justify-end gap-2 mt-4">
        <Button
        variant="warning"
        onClick={abrirEditar}
        disabled={!asignacionSeleccionada}
        className={!asignacionSeleccionada ? "opacity-50 cursor-not-allowed" : ""}>
        Modificar
        </Button>
        <Button
          variant="danger"
          onClick={() => setAsignacionEliminar(asignacionSeleccionada)}
          disabled={!asignacionSeleccionada}
          className={!asignacionSeleccionada ? "opacity-50 cursor-not-allowed" : ""}>
          Eliminar
        </Button>
{/* INICIO DE AGREGAR */}
              <ModalAddItem
                title="Nueva Asignación"
                buttonLabel="Agregar"
                onSubmit={handleAgregar}
                onClose={limpiarFormulario}
              >
                <Toggle
                  label="Es laboral"
                  checked={esLaboral}
                  onChange={setEsLaboral}
                />

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
                    required
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
                    required

                  />
              <Select
                className="w-full"
                placeholder="Seleccionar Turno"
                isSearchable={true}
                value={(() => {
                  const allOptions = [...turnosLocalidadOptions, ...otrosTurnosOptions];
                  return (
                    allOptions.find(
                      (opt) => opt.value == nuevaAsignacion.asignacion_turno_id
                    ) || null
                  );
                })()}
                onChange={(opt) => {
                  const turno = turnos.find((t) => t.id_turno == opt?.value);

                  setNuevaAsignacion({
                    ...nuevaAsignacion,
                    asignacion_turno_id: opt?.value || "",
                  });

                  setMotivoTurnoInfo(turno?.turno_motivo || "");
                }}
                options={opcionesTurnos}
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

                  {/* <input
                    type="date"
                    className="w-full border p-2 rounded"
                    value={nuevaAsignacion.asignacion_fecha_desde}
                    onChange={(e) =>
                      setNuevaAsignacion({
                        ...nuevaAsignacion,
                        asignacion_fecha_desde: e.target.value,
                      })
                    }
                    required
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
                    required
                  /> */}
                  
<label className="block text-sm font-medium text-gray-700 mt-2">
  Rango de fechas (Desde - Hasta)
</label>

<DatePicker
  selectsRange
  startDate={fechaInicio}
  endDate={fechaFin}
  onChange={(update) => {
    setRangoFechas(update);

    const [start, end] = update;
    setNuevaAsignacion((prev) => ({
      ...prev,
      asignacion_fecha_desde: toYMD(start),
      asignacion_fecha_hasta: toYMD(end),
    }));
  }}
  dateFormat="dd/MM/yyyy"
  placeholderText="Seleccioná un rango"
  className="w-full border p-2 rounded"
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
{/* INICIO DETALLE */}
      {detalleAsignacion && (
          <ModalDetalleAsignacion
            asignacion={detalleAsignacion}
            onClose={() => setDetalleAsignacion(null)}
          />
        )}
  {/*INCIO ELIMINAR */}
      {asignacionEliminar && (  
         <>
    {console.log("OBJETO PARA ELIMINAR:", asignacionEliminar)}
        <Modal title="Eliminar Asignacion" onClose={() => setAsignacionEliminar(null)}>
          <p className="mb-6 text-center">
            ¿Seguro que deseas eliminar la asignación de {" "}
            <b>{asignacionEliminar?.empleados?.empleado_nombre_apellido}</b>?<br />
            Turno: <b>{asignacionEliminar?.turnos?.turno_nombre}</b><br />
            Desde: <b>{new Date(asignacionEliminar?.asignacion_fecha_desde).toLocaleDateString("es-AR")}</b><br />
            Hasta: <b>{new Date(asignacionEliminar?.asignacion_fecha_hasta).toLocaleDateString("es-AR")}</b>
          </p>
          <div className="flex justify-center gap-2">
            <Button variant="gray" onClick={() => setAsignacionEliminar(null)}>
              Cancelar
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                eliminarAsignacion(asignacionEliminar.id_asignacion)
                setAsignacionEliminar(null)
              }}
            >
              Sí, eliminar
            </Button>
          </div>
        </Modal>  </>
      )}
  {/*INCIO MODIFICAR */}
  {modalEditar && (
  <Modal title="Editar Asignación" onClose={() => {setModalEditar(false); setAsignacionSeleccionada(null); }}>
    <form
      onSubmit={handleEditar}
      className="space-y-3"
    >
      {/* Empleado */}
      <Select
        options={empleados.map(e => ({
          value: e.id_empleado,
          label: e.empleado_nombre_apellido
        }))}
        value={empleados
          .map(e => ({ value: e.id_empleado, label: e.empleado_nombre_apellido }))
          .find(opt => opt.value == asignacionEdit.asignacion_empleado_id) || null
        }
        onChange={(opt) =>
          setAsignacionEdit(prev => ({
            ...prev,
            asignacion_empleado_id: opt?.value || ""
          }))
        }
        placeholder="Seleccionar Empleado"
        isSearchable
        required
      />

      {/* Localidad */}
      <Select
        placeholder="Seleccionar Localidad"
        isSearchable
        value={localidades
          .map(l => ({ value: l.id_localidad, label: l.localidad_nombre }))
          .find(opt => opt.value == asignacionEdit.asignacion_localidad_id) || null
        }
        onChange={(opt) =>
          setAsignacionEdit(prev => ({
            ...prev,
            asignacion_localidad_id: opt?.value || ""
          }))
        }
        options={localidades.map(l => ({
          value: l.id_localidad,
          label: l.localidad_nombre
        }))}
        required
      />

      {/* Turno (podés reutilizar tus opciones agrupadas, pero ojo que hoy se calculan con nuevaAsignacion.asignacion_localidad_id) :contentReference[oaicite:6]{index=6} */}
      {/* Para mínimo cambio, lo dejamos sin agrupación: */}
      <Select
        placeholder="Seleccionar Turno"
        isSearchable
        value={turnos
          .map(t => ({ value: t.id_turno, label: t.turno_nombre }))
          .find(opt => opt.value == asignacionEdit.asignacion_turno_id) || null
        }
        onChange={(opt) =>
          setAsignacionEdit(prev => ({
            ...prev,
            asignacion_turno_id: opt?.value || ""
          }))
        }
        options={turnos.map(t => ({
          value: t.id_turno,
          label: t.turno_nombre
        }))}
        required
      />

      {/* Range Picker */}
      <label className="block text-sm font-medium text-gray-700">
        Rango de fechas (Desde - Hasta)
      </label>

      <DatePicker
        selectsRange
        startDate={fechaInicioEdit}
        endDate={fechaFinEdit}
        onChange={(update) => {
          setRangoFechasEdit(update);

          const [start, end] = update;
          setAsignacionEdit((prev) => ({
            ...prev,
            asignacion_fecha_desde: toYMD(start),
            asignacion_fecha_hasta: toYMD(end),
          }));
        }}
        dateFormat="dd/MM/yyyy"
        placeholderText="Seleccioná un rango"
        className="w-full border p-2 rounded"
      />

      <textarea
        className="w-full border p-2 rounded"
        placeholder="Comentario"
        value={asignacionEdit.asignacion_comentario}
        onChange={(e) =>
          setAsignacionEdit(prev => ({
            ...prev,
            asignacion_comentario: e.target.value
          }))
        }
      />

      <div className="flex justify-end gap-2 pt-2">
        <Button variant="gray" type="button" onClick={() => setModalEditar(false)}>
          Cancelar
        </Button>
        <Button variant="primary" type="submit">
          Guardar
        </Button>
      </div>
    </form>
  </Modal>
)}

    </div>
  )
}
