import Toggle from "../ui/Toggle";
export default function TurnoForm({ turno, setTurno, localidades }) {
  return (
    <>
      <input
        type="text"
        placeholder="Nombre del Turno"
        value={turno.turno_nombre || ""}
        onChange={(e) => setTurno({ ...turno, turno_nombre: e.target.value })}
        className="border rounded px-3 py-2 w-full"
        required
      />

      <select
        value={
          turno.turno_id_localidad ??
          turno.localidades?.id_localidad ??  ""
         // : turno.turno_id_localidad
        }
        onChange={(e) => setTurno({ ...turno, turno_id_localidad: e.target.value === "" ? null : e.target.value})}
        className="border rounded px-3 py-2 w-full"
        
      >
        <option value="">Seleccionar Localidad</option>
        {localidades.map((loc) => (
          <option key={loc.id_localidad} value={loc.id_localidad}>
            {loc.localidad_nombre}
          </option>
        ))}
      </select>

      {/* Cantidad de días */}
      <input
        type="number"
        placeholder="Cantidad de Días"
        value={turno.turno_cantidad_dias || ""}
        onChange={(e) => setTurno({ ...turno, turno_cantidad_dias: e.target.value=== "" ? null : e.target.value, })}
        className="border rounded px-3 py-2 w-full"
      />

      {/* Días de descanso */}
      <input
        type="number"
        placeholder="Días de descanso"
        value={turno.turno_cantidad_dias_descanso || ""}
        onChange={(e) => setTurno({ ...turno, turno_cantidad_dias_descanso: e.target.value=== "" ? null : e.target.value, })}
        className="border rounded px-3 py-2 w-full"
      />

      {/* Guardia pasiva */}
      <div className="flex items-center justify-between px-1 py-2">
        <span className="text-gray-700 font-medium">¿Tiene guardia pasiva?</span>
        <div className="flex items-center gap-3">
          <span className={`text-sm font-medium ${turno.turno_tiene_guardia_pasiva === 1 ? "text-gray-400" : "text-gray-800"}`}>No</span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={turno.turno_tiene_guardia_pasiva === 1}
              onChange={(e) =>
                setTurno({
                  ...turno,
                  turno_tiene_guardia_pasiva: e.target.checked ? 1 : 0,
                })
              }
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:bg-blue-600 peer-focus:ring-2 peer-focus:ring-blue-300 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></div>
          </label>
          <span className={`text-sm font-medium ${turno.turno_tiene_guardia_pasiva === 1 ? "text-blue-600" : "text-gray-400"}`}>Sí</span>
        </div>
      </div>

      {/* Es laboral */}
      <select
        value={turno.turno_es_laboral || ""}
        onChange={(e) => setTurno({ ...turno, turno_es_laboral: e.target.value })}
        className="border rounded px-3 py-2 w-full"
        required
      >
        <option value="">Es laboral?</option>
        <option>Si</option>
        <option>No</option>
      </select>

      {/* Comentarios */}
      <textarea
        placeholder="Notas o detalles..."
        value={turno.turno_comentarios || ""}
        onChange={(e) => setTurno({ ...turno, turno_comentarios: e.target.value })}
        className="border rounded px-3 py-2 w-full min-h-[80px]"
      ></textarea>

      {/* Color */}
      <div className="flex flex-col gap-1 mt-3">
        <label className="text-gray-700 font-medium">Color del turno</label>
        <div className="flex items-center gap-3">
          <input
            type="color"
            value={turno.turno_color || "#000000"}
            onChange={(e) => setTurno({ ...turno, turno_color: e.target.value === "" ? "#FFFFFF" : e.target.value, })}
            className="w-10 h-10 border border-gray-300 cursor-pointer shadow-sm transition-transform hover:scale-105"
          />
          <span className="text-gray-600 font-mono">{turno.turno_color}</span>
        </div>
      </div>
      {/* Checkbox para habilitar horarios */}
<Toggle
  label="¿Tiene horarios?"
  checked={turno.tieneHorarios || false}
  onChange={(checked) =>
    setTurno({ ...turno, tieneHorarios: checked })
  }
/>

{/* Campos adicionales si tiene horarios */}
{turno.tieneHorarios && (
  <div className="mt-4 space-y-4 border-t pt-4">
    <h3 className="font-semibold text-gray-800">Horarios del turno</h3>

    {(turno.turnos_horarios || []).map((h, i) => (
      <div
        key={i}
        className="flex flex-wrap items-center gap-3 border p-3 rounded-md bg-gray-50"
      >
        <div className="flex flex-col">
          <label className="text-sm text-gray-700">Tipo:</label>
          <select
            value={h.turno_horario_tipo || ""}
            onChange={(e) => {
              const nuevos = [...turno.turnos_horarios]
              nuevos[i].turno_horario_tipo = e.target.value
              setTurno({ ...turno, turnos_horarios: nuevos })
            }}
            className="border rounded p-2 text-sm"
            required
          >
            <option value="">Elegir</option>
            <option value="Mañana">Mañana</option>
            <option value="Tarde">Tarde</option>
            <option value="Completo">Completo</option>
          </select>
        </div>

        <div className="flex flex-col">
          <label className="text-sm text-gray-700">Entrada:</label>
          <input
            type="time"
            value={h.turno_horario_entrada || ""}
            onChange={(e) => {
              const nuevos = [...turno.turnos_horarios]
              nuevos[i].turno_horario_entrada = e.target.value
              setTurno({ ...turno, turnos_horarios: nuevos })
            }}
            className="border rounded p-2 text-sm"
            required
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm text-gray-700">Salida:</label>
          <input
            type="time"
            value={h.turno_horario_salida || ""}
            onChange={(e) => {
              const nuevos = [...turno.turnos_horarios]
              nuevos[i].turno_horario_salida = e.target.value
              setTurno({ ...turno, turnos_horarios: nuevos })
            }}
            className="border rounded p-2 text-sm"
            required
          />
        </div>

        <button
          type="button"
          onClick={() => {
            const nuevos = turno.turnos_horarios.filter((_, idx) => idx !== i)
            setTurno({ ...turno, turnos_horarios: nuevos })
          }}
          className="text-red-600 text-sm font-medium hover:underline"
        >
          Eliminar
        </button>
      </div>
    ))}

    <button
      type="button"
      onClick={() =>
        setTurno({
          ...turno,
          turnos_horarios: [
            ...(turno.turnos_horarios || []),
            { turno_horario_tipo: "", turno_horario_entrada: "", turno_horario_salida: "" },
          ],
        })
      }
      className="text-blue-600 text-sm font-semibold hover:underline mt-2"
    >
      + Agregar otro horario
    </button>
  </div>
)}
{turno.tieneHorarios && (turno.turnos_horarios?.length === 0) && (
  <p className="text-red-500 text-sm mt-2">
    ⚠️ Debes agregar al menos un horario antes de guardar el turno.
  </p>
)}

    </>
  )
}
