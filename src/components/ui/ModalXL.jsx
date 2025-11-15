export default function ModalXL({ title, children, onClose }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
      
      {/* CONTENEDOR DEL MODAL → versión personalizada */}
      <div className="
        bg-white p-6 rounded-xl shadow-xl 
        w-full max-w-4xl         /* ancho más grande */
      ">
        
        {/* HEADER */}
        <div className="flex justify-between items-center mb-4 rounded-t-xl">
          <h2 className="text-xl font-bold">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800 font-bold text-lg"
          >
            ✕
          </button>
        </div>

        {/* CONTENIDO */}
        <div className="px-6 py-4 max-h-[80vh] overflow-y-auto rounded-b-xl"> {/* padding derecho para scroll */}
          {children}
        </div>

      </div>
    </div>
  );
}
