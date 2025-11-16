import FiltroSelect from "./FiltroSelect";

export default function FiltroLocalidad({ localidades, value, onChange }) {
  const options = localidades.map((l) => ({
    value: l.id_localidad,
    label: l.localidad_nombre,
  }));

  return (
    <FiltroSelect
      label="Localidad"
      options={options}
      value={value}
      onChange={onChange}
      placeholder="Filtrar por localidad"
    />
  );
}
