import FiltroSelect from "./FiltroSelect";

export default function FiltroZona({ zonas, value, onChange }) {
  const options = zonas.map((z) => ({
    value: z.id_zona,
    label: z.zona_nombre,
  }));

  return (
    <FiltroSelect
      label="Zona"
      options={options}
      value={value}
      onChange={onChange}
      placeholder="Filtrar Zonas"
    />
  );
}
