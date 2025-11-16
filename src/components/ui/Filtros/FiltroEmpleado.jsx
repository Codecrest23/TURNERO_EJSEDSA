import FiltroSelect from "./FiltroSelect";

export default function FiltroEmpleado({ empleados, value, onChange }) {
  const options = empleados.map((e) => ({
    value: e.id_empleado,
    label: e.empleado_nombre_apellido,
  }));

  return (
    <FiltroSelect
      label="Empleado"
      options={options}
      value={value}
      onChange={onChange}
      placeholder="Filtrar empleados"
    />
  );
}
