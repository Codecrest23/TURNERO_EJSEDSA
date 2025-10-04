export default function Modal({ title, children, onClose }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
      <div className="bg-white p-6 rounded-xl shadow-xl w-96">
        {/* Encabezado */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800 font-bold text-lg"
          >
            ✕
          </button>
        </div>

        {/* Contenido del modal */}
        {children}
      </div>
    </div>
  )
}
