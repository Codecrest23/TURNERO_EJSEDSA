export default function Toggle({ label, checked, onChange }) {
  return (
    <div className="flex items-center justify-between px-1 py-2">
      <span className="text-gray-700 font-medium">{label}</span>
      <div className="flex items-center gap-3">
        <span
          className={`text-sm font-medium ${
            checked ? "text-gray-400" : "text-gray-800"
          }`}
        >
          No
        </span>

        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={checked}
             onChange={() => onChange(!checked)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:bg-blue-600 peer-focus:ring-2 peer-focus:ring-blue-300 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></div>
        </label>

        <span
          className={`text-sm font-medium ${
            checked ? "text-blue-600" : "text-gray-400"
          }`}
        >
          Sí
        </span>
      </div>
    </div>
  );
}
