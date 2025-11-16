import React from "react";

export default function SelectTurnosPorLocalidad({
  turnos,
  localidadId,
  value,
  onChange
}) {
  const locID = Number(localidadId);

  // Turnos asociados
  const turnosLocalidad = turnos
    .filter(t => Number(t.turno_id_localidad) === locID)
    .map(t => ({
      label: t.turno_nombre,
      value: t.id_turno
    }));

  // Otros turnos
  const otrosTurnos = turnos
    .filter(t => Number(t.turno_id_localidad) !== locID)
    .map(t => ({
      label: t.turno_nombre,
      value: t.id_turno
    }));

  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="border rounded px-3 py-2 w-full"
    >
      <option value="">Seleccionar turno</option>

      {turnosLocalidad.length > 0 && (
        <optgroup label="Turnos de esta Localidad">
          {turnosLocalidad.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </optgroup>
      )}

      {otrosTurnos.length > 0 && (
        <optgroup label="Otros Turnos">
          {otrosTurnos.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </optgroup>
      )}
    </select>
  );
}
