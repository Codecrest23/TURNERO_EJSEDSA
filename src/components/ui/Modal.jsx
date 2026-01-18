export default function Modal({ title, children, onClose }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-xs  z-[9999] px-2 sm:px-0 ">
      <div className=" bg-white
          rounded-xl
          shadow-xl
          w-full
          max-w-lg
          max-h-[90vh]
          overflow-y-auto
          p-6 
        ">
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
