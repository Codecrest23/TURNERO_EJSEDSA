export default function ModalXL({ title, children, onClose }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
      
      {/* CONTENEDOR DEL MODAL → versión personalizada */}
      <div className="
        bg-white p-6 rounded-xl shadow-xl 
        w-full max-w-4xl         /* ancho más grande */
        max-h-[85vh]             /* límite de alto */
        overflow-y-auto          /* scroll interno */
      ">
        
        {/* HEADER */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800 font-bold text-lg"
          >
            ✕
          </button>
        </div>

        {/* CONTENIDO */}
        <div className="pr-2"> {/* padding derecho para scroll */}
          {children}
        </div>

      </div>
    </div>
  );
}
