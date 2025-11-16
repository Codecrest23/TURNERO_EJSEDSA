import FiltroSelect from "./FiltroSelect";

export default function FiltroTurno({ turnos, value, onChange }) {
  const options = turnos.map((t) => ({
    value: t.id_turno,
    label: t.turno_nombre,
  }));

  return (
    <FiltroSelect
      label="Turno"
      options={options}
      value={value}
      onChange={onChange}
      placeholder="Filtrar turnos"
    />
  );
}
