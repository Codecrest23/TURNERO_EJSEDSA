import { useState } from "react"
import { useTurnos } from "../hooks/useTurnos"
import Table from "../components/ui/Table"
import Button from "../components/ui/Button"
import ModalAddItem from "../components/ui/ModalAddItem"
import Modal from "../components/ui/Modal"
import { Title, Subtitle } from "../components/ui/Typography"
import {Clock, CirclePlus,Eye } from "lucide-react"
import { useLocalidades } from "../hooks/useLocalidades"
import TurnoForm from "../components/ui/TurnoForm"
import ButtonSmall from "../components/ui/ButtonSmall";
import ModalDetalleTurno from "../components/ui/ModalDetalleTurno"
import { supabase } from "../lib/supabaseClient";
import ModalFKError from "../components/ui/ModalFKError";
import ModalPKError from "../components/ui/ModalPKError"
//coment turno
export default function Turnos() {
  const {
    turnos,
    loading,
    error,
    fetchTurnos,
    agregarTurno,
    modificarTurno,
    eliminarTurno,
    agregarHorario,
    modificarHorario,
    eliminarHorario,
  } = useTurnos()

  const [nuevoTurno, setNuevoTurno] = useState({turno_nombre: "", turno_cantidad_dias: null,turno_cantidad_dias_descanso: null,turno_tiene_guardia_pasiva: 0,
        turno_es_laboral:"",turno_comentarios: "",turno_color: "#000000", turno_id_localidad:null, turno_motivo:null})
  const [TurnoEditando, setTurnoEditando] = useState(null)
  const [TurnoEliminar, setTurnoEliminar] = useState(null)
  const [TurnoSeleccionado, setTurnoSeleccionado] = useState(null)
  const { localidades } = useLocalidades()
  const [TurnoDetalle, setTurnoDetalle] = useState(null);
  const [errorFK, setErrorFK] = useState(false);
  const [errorPK, setErrorPK] = useState(false);


  if (loading) return <p>Cargando...</p>

const handleAgregar = async (e) => {
  e.preventDefault();

  // 1) separar campos de horario
  const {
    tieneHorarios,
    turno_horario_tipo,
    turno_horario_entrada,
    turno_horario_salida,
    turnos_horarios = [],
    ...turnoSinHorarios
  } = nuevoTurno;

  // 2) sanitizar localidad ("" -> null, string numérica -> number)
  if (turnoSinHorarios.turno_id_localidad === "" || turnoSinHorarios.turno_id_localidad == null) {
    turnoSinHorarios.turno_id_localidad = null;
  } else {
    turnoSinHorarios.turno_id_localidad = Number(turnoSinHorarios.turno_id_localidad);
  }

  // 2️⃣ Verificar si faltan horarios obligatorios
  if (tieneHorarios && turnos_horarios.length === 0) {
    alert("⚠️ Debes agregar al menos un horario antes de guardar el turnos.");
    return false;
  }

const horarios = nuevoTurno.tieneHorarios
  ? (nuevoTurno.turnos_horarios || []).filter(
      (h) => h.turno_horario_tipo && h.turno_horario_entrada && h.turno_horario_salida
    )
  : [];

  // 4) crear turno + (opcional) horarios
  const resultado = await agregarTurno(turnoSinHorarios, horarios); // ← el hook ya inserta y asocia por id_turno
  // Validación de PK/UNIQUE (nombre duplicado)
  if (resultado?.error?.code === "23505") {
    setErrorPK(true); // mostrar modal profesional
    return false;     // NO cerrar modal
  }
  await fetchTurnos(); 
  // 5) reset
  setNuevoTurno({
    turno_nombre: "",
    turno_cantidad_dias: null,
    turno_cantidad_dias_descanso: null,
    turno_tiene_guardia_pasiva: 0,
    turno_es_laboral: "",
    turno_comentarios: "",
    turno_color: "#000000",
    turno_id_localidad: null,
    tieneHorarios: false,
    turno_horario_tipo: "",
    turno_horario_entrada: "",
    turno_horario_salida: "",
    turnos_horarios : [],
    turno_motivo:"",
  });
};


  //  Editar
const handleEditarSubmit = async (e) => {
  e.preventDefault();

  // 1️⃣ Actualizar los datos base del turno
  const turnoActualizado = {
    turno_nombre: TurnoEditando.turno_nombre,
    turno_cantidad_dias: TurnoEditando.turno_cantidad_dias,
    turno_cantidad_dias_descanso: TurnoEditando.turno_cantidad_dias_descanso,
    turno_tiene_guardia_pasiva: TurnoEditando.turno_tiene_guardia_pasiva,
    turno_es_laboral: TurnoEditando.turno_es_laboral,
    turno_comentarios: TurnoEditando.turno_comentarios,
    turno_color: TurnoEditando.turno_color,
    turno_motivo: TurnoEditando.turno_motivo,
    turno_id_localidad:
      TurnoEditando.turno_id_localidad === "" ||
      TurnoEditando.turno_id_localidad === null ||
      isNaN(TurnoEditando.turno_id_localidad)
        ? null
        : Number(TurnoEditando.turno_id_localidad),
  };

try {
  const resultado = await modificarTurno(
    TurnoEditando.id_turno,
    turnoActualizado
  );
// 3️⃣ Error UNIQUE (nombre duplicado)
  if (resultado?.error?.code === "23505") {
    setErrorPK(true);       // Mostrar modal “Nombre duplicado”
    return;                 // NO cerrar modal de edición
  }
  if (resultado?.error) {
    console.error("❌ Error al modificar turno:", resultado.error);
    alert("Error al guardar el turno");
    return;
  }

  // ... resto del código (horarios, etc.)

} catch (err) {
  console.error("⚠️ Error inesperado al modificar turno:", err);
  alert("Ocurrió un error al modificar el turno.");
}

  // 2️⃣ Si tiene horarios, los procesamos
if (TurnoEditando.tieneHorarios) {
  const horariosValidos = (TurnoEditando.turnos_horarios || []).filter(
    (h) =>
      h.turno_horario_tipo &&
      h.turno_horario_entrada &&
      h.turno_horario_salida
  );
  if (horariosValidos && horariosValidos.length === 0) {
    alert("⚠️ Debes agregar al menos un horario antes de guardar el turnos.");
    return false;
  }
  // 🔹 Borrar horarios anteriores solo si hay nuevos para insertar
    if (horariosValidos.length > 0) {
      await supabase
        .from("turnos_horarios")
        .delete()
        .eq("id_turno", TurnoEditando.id_turno);

      const nuevosHorarios = horariosValidos.map((h) => ({
        id_turno: TurnoEditando.id_turno,
        turno_horario_tipo: h.turno_horario_tipo,
        turno_horario_entrada: h.turno_horario_entrada,
        turno_horario_salida: h.turno_horario_salida,
      }));

      const { error: errorInsert } = await supabase
        .from("turnos_horarios")
        .insert(nuevosHorarios);

      if (errorInsert) {
        console.error("❌ Error al insertar horarios:", errorInsert);
        alert("Error al insertar horarios.");
      }
    }
  } else {
    // Si el toggle está desactivado, borra todos los horarios
    await supabase
      .from("turnos_horarios")
      .delete()
      .eq("id_turno", TurnoEditando.id_turno);
  }

  // 3️⃣ Cerrar modal y refrescar lista
   setTurnoEditando(null);
   setTurnoSeleccionado(null); // 👈 evita que el modal se vuelva a abrir
  await fetchTurnos();
};


  return (
    <div className="max-w-8xl mx-auto space-y-2 px-1 sm:px-10">
      <Title>
        <div className="flex items-center gap-2">
          <Clock className="w-6 h-6 text-gray-700" />
          Turnos
        </div>
      </Title>
      <Subtitle>Listado de Turnos y Licencias</Subtitle>

      {/* 🧾 Tabla */}
      <Table headers={[ "N°", "Turno","Localidad", "Cantidad de días", "Días de descanso", "Turno Motivo", "Es Laboral?", 
                        "Notas", "Color","Detalles"]}>
          {turnos.map((tur, index) => (
            <tr
              key={tur.id_turno}
              onClick={() => setTurnoSeleccionado(TurnoSeleccionado?.id_turno === tur.id_turno ? null : tur)}
              className={`border-b hover:bg-gray-100 transition cursor-pointer ${
                TurnoSeleccionado?.id_turno === tur.id_turno
                  ? "bg-blue-100"
                  : ""
              }`}
            >
              <td className="px-6 py-3">{index + 1}</td>
              <td className="px-6 py-3"><div className="max-w-[250px] overflow-hidden text-ellipsis line-clamp-3">
                {tur.turno_nombre}</div></td>
              <td className="px-6 py-3">{tur.localidades?.localidad_nombre|| "Sin Localidad" }</td>
              <td className="px-6 py-3">{tur.turno_cantidad_dias }</td>
              <td className="px-6 py-3">{tur.turno_cantidad_dias_descanso }</td>
              <td className="px-6 py-3">{tur.turno_motivo }</td>
              {/* <td className="px-6 py-3">{tur.turno_tiene_guardia_pasiva === 1 ? "Sí" : "No"}</td> */}
              <td className="px-6 py-3">{tur.turno_es_laboral }</td>
              <td className="px-6 py-3"><div className="max-w-[250px] overflow-hidden text-ellipsis line-clamp-3">
                {tur.turno_comentarios}</div></td><td className="px-6 py-3"><div
                  className="w-5 h-5 rounded-full border border-gray-300 mx-auto"
                  style={{ backgroundColor: tur.turno_color }}
                  title={tur.turno_color} // tooltip al pasar el mouse
                ></div></td>
              <td className="px-6 py-3 text-center">
<ButtonSmall
  variant="primary"
  onClick={(e) => {
    e.stopPropagation();
    setTurnoDetalle(tur);
  }}
>
  Ver detalle
</ButtonSmall>

            </td>
            </tr>
          ))}
      </Table>


      {/* Modal agregar y botonoes */}
      <div className="flex justify-end gap-2 mt-4">
        <Button
           variant="warning"
           onClick={() => {
           if (!TurnoSeleccionado) return
           const h = TurnoSeleccionado.turnos_horarios?.[0] // primer horario (si usás 1 por turno)
            setTurnoEditando({
                        ...TurnoSeleccionado,
                        turno_id_localidad: TurnoSeleccionado.turno_id_localidad ?? TurnoSeleccionado.localidades?.id_localidad ?? null,
                        //agregado de horarios
                        tieneHorarios:
                        TurnoSeleccionado.turnos_horarios &&
                        TurnoSeleccionado.turnos_horarios.length > 0,
                        turnos_horarios: TurnoSeleccionado.turnos_horarios || [],
                      })
                    }}
                    disabled={!TurnoSeleccionado}
                    className={!TurnoSeleccionado ? "opacity-50 cursor-not-allowed" : ""}
                >
                  Modificar
                </Button>

        <Button
          variant="danger"
          onClick={() => setTurnoEliminar(TurnoSeleccionado)}
          disabled={!TurnoSeleccionado}
          className={!TurnoSeleccionado ? "opacity-50 cursor-not-allowed" : ""}
        >
          Eliminar
        </Button> 

<ModalAddItem title="Agregar Turno/Licencia" buttonLabel="Agregar" onSubmit={handleAgregar}>
      <TurnoForm turno={nuevoTurno} setTurno={setNuevoTurno} localidades={localidades} />
    </ModalAddItem>
        
      </div>

      {/* Modal editar */}
      {TurnoEditando && (<Modal title="Editar Turno/Licencia" onClose={() => setTurnoEditando(null)}>
      <form onSubmit={handleEditarSubmit} className="space-y-4 max-h-[80vh]  pr-2">
        <TurnoForm turno={TurnoEditando} setTurno={setTurnoEditando} localidades={localidades} />
        <div className="flex justify-end gap-2 pt-2  p-2 bottom-0 bg-white border-t">
          <Button variant="gray"onClick={() => setTurnoEditando(null)}>Cancelar</Button>
          <Button type="submit" variant="warning">Guardar</Button>
        </div>
      </form>
    </Modal>
    )}
      {/* Modal eliminar */}
      {TurnoEliminar && (
        <Modal title="Eliminar Turno" onClose={() => setTurnoEliminar(null)}>
          <p className="mb-6 text-center">
            ¿Seguro que deseas eliminar el Turno{" "}
            <b>"{TurnoEliminar.turno_nombre}"</b>?
          </p>
          <div className="flex justify-center gap-2">
            <Button variant="gray" onClick={() => setTurnoEliminar(null)}>
              Cancelar
            </Button>
<Button
  variant="danger"
  onClick={async () => {
    const resultado = await eliminarTurno(TurnoEliminar.id_turno);

    if (resultado?.error?.code === "23503") {
      setErrorFK(true);       // 🔥 mostramos modal FK
      setTurnoEliminar(null); // cerramos modal eliminar
      return;
    }

    setTurnoEliminar(null); // si eliminó OK
  }}
>
  Sí, eliminar
</Button>


          </div>
        </Modal>
      )}

{/* 🔍 Modal Detalle */}
      {TurnoDetalle && (
  <ModalDetalleTurno
    turno={TurnoDetalle}
    onClose={() => setTurnoDetalle(null)}
  />
)}

{/* 🛑 Modal de Error por FK y PK*/}
{errorFK && (
  <ModalFKError onClose={() => setErrorFK(false)} />
)}
{errorPK && (
        <ModalPKError onClose={() => setErrorPK(false)} />
      )}
    </div>
  )
}
