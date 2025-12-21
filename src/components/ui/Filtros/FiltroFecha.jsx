import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function FiltroFecha({
  label,
  value,
  onChange,
  minDate,
  placeholder,
}) {
  return (
    <div className="flex flex-col">
      <label className="text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>

      <DatePicker
        selected={value}
        onChange={onChange}
        minDate={minDate}
        dateFormat="dd/MM/yyyy"
        placeholderText={placeholder}
        isClearable
        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm
                   focus:outline-none focus:ring-2 focus:ring-blue-500
                   h-[38px]"
        portalId="datepicker-portal"
        popperPlacement="bottom-start"

      />
    </div>
  );
}
