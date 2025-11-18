import React, { useState } from "react";

export default function Table({ headers, children }) {
  // 👇 Estado de anchos de columnas (uno por índice)
  const [columnWidths, setColumnWidths] = useState({});

  // 👇 Lógica de resize, también adentro del componente
  const startResize = (index, e) => {
    e.preventDefault();

    const startX = e.clientX;
    // si no hay ancho guardado, usamos el ancho actual del th
    const th = e.target.parentElement;
    const startWidth = columnWidths[index] ?? th.offsetWidth;

    const onMouseMove = (moveEvent) => {
      const newWidth = Math.max(
        80,
        startWidth + (moveEvent.clientX - startX)
      );
      setColumnWidths((prev) => ({ ...prev, [index]: newWidth }));
    };

    const onMouseUp = () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  };

  return (
    <div className="overflow-x-auto bg-white shadow-md rounded-lg max-h-[70vh] h-fit overflow-y-auto">
      <table className="min-w-full text-sm text-left text-gray-600 table-fixed">
        <thead className="bg-gray-200 text-s uppercase text-gray-700 sticky top-0 z-10">
          <tr>
            {headers.map((header, index) => (
              <th
                key={index}
                className="px-6 py-3 text-left font-semibold relative select-none"
                style={
                  columnWidths[index]
                    ? { width: columnWidths[index] }
                    : undefined
                }
              >
                {header}

                {/* Handler para agrandar/achicar la columna */}
                <div
                  onMouseDown={(e) => startResize(index, e)}
                  className="
                    absolute top-0 right-0 w-1 h-full cursor-col-resize 
                    hover:bg-blue-400/40
                  "
                />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}

