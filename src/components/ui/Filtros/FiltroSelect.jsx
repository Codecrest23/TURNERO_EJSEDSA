import Select from "react-select";

export default function FiltroSelect({
  label,
  options,
  value,
  onChange,
  placeholder = "Seleccionar...",
  isMulti = true,
  className = ""
}) {
  const customStyles = {
    control: (base) => ({
      ...base,
      borderColor: "#d1d5db",
      paddingTop: 4,
      paddingBottom: 4,
      borderRadius: 6,
      boxShadow: "none",
      "&:hover": { borderColor: "#9ca3af" },
    }),
    menu: (base) => ({
      ...base,
      zIndex: 9999,
    }),
  };

  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {label && (
        <label className="text-sm font-medium text-gray-700">
          {label}
        </label>
      )}

      <Select
        options={options}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        isMulti={isMulti}
        isSearchable={true}
        styles={customStyles}
        classNamePrefix="react-select"
      />
    </div>
  );
}
