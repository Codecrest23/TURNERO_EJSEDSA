import { Fragment, useEffect, useMemo, useRef, useState } from "react";

export default function PlanificacionTabla({
  days,
  groups, // [{ locId, locNombre, empleados, empMapByEmpId }]
  dayLabel,
  toYMD,
  renderCellLines, // (arrAsignaciones) => { lines: string[], tooltip: string, bgColor?: string }
}) {
  // ===== Layout / tamaños =====
  const rowH = 40;
  const headerH = 35;
  const monthH = 26;

  const stickyColW = 230;
  const dayColW = 80;

  // Alto visible: podés ajustar
  const maxVisibleRows = 15;
  const maxH = monthH + headerH + rowH * maxVisibleRows;

  // ===== Agrupación de meses (thead fila 1) =====
  const monthGroups = useMemo(() => {
    const out = [];
    let currentKey = null;
    let startIdx = 0;

    const getKey = (d) => `${d.getFullYear()}-${d.getMonth()}`;
    const getLabel = (d) => {
      const meses = ["ENE", "FEB", "MAR", "ABR", "MAY", "JUN", "JUL", "AGO", "SEP", "OCT", "NOV", "DIC"];
      const yy = String(d.getFullYear()).slice(-2);
      return `${meses[d.getMonth()]} ${yy}`;
    };

    for (let i = 0; i < days.length; i++) {
      const key = getKey(days[i]);
      if (currentKey === null) {
        currentKey = key;
        startIdx = i;
      } else if (key !== currentKey) {
        out.push({ label: getLabel(days[startIdx]), span: i - startIdx });
        currentKey = key;
        startIdx = i;
      }
    }
    if (currentKey !== null) {
      out.push({ label: getLabel(days[startIdx]), span: days.length - startIdx });
    }
    return out;
  }, [days]);

  // ===== Expand / collapse por localidad =====
  const [open, setOpen] = useState(() => ({}));

  useEffect(() => {
    // por defecto: todo abierto la primera vez
    setOpen((prev) => {
      const next = { ...prev };
      for (const g of groups) {
        if (next[g.locId] === undefined) next[g.locId] = true;
      }
      return next;
    });
  }, [groups]);

  const tableWidth = useMemo(() => {
    return stickyColW + days.length * dayColW;
  }, [days.length]);



  return (
    <div className="bg-white rounded shadow-sm border">

      <div
        className="grid"
        style={{
          gridTemplateRows: "1fr 5px",
          maxHeight: maxH,
        }}
      >
        {/* ===== Área principal: vertical + (X oculto) ===== */}
  
          <div className="overflow-y-auto  scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
              <table className="border-collapse" style={{ minWidth: tableWidth }}>
                <thead className="bg-gray-100">
                  {/* Fila meses */}
                  <tr >
                    <th
                      className="sticky left-0 top-0 bg-gray-300  z-[80]"
                      style={{ width: stickyColW, minWidth: stickyColW, height: monthH }}
                    >
                        Meses
                    </th>
                    {monthGroups.map((g, idx) => (
                      <th
                        key={`${g.label}-${idx}`}
                        colSpan={g.span}
                        className="sticky top-0 bg-gray-300 border-r text-center text-xs font-semibold z-[60]"
                        style={{ height: monthH }}
                      >
                        {g.label}
                      </th>
                    ))}
                  </tr>

                  {/* Fila días */}
                  <tr >
                    <th
                      className="sticky left-0 top-6 bg-gray-100 border-b border-r z-[70]"
                      style={{ width: stickyColW, minWidth: stickyColW, height: headerH }}
                    >
                       Localidad / Empleado
                    </th>

                    {days.map((d) => (
                      <th
                        key={toYMD(d)}
                        className=" bg-gray-100 border-b border-r px-2 text-center text-xs font-semibold whitespace-nowrap sticky top-6"
                        style={{ width: dayColW, minWidth: dayColW, height: headerH }}
                      >
                        {dayLabel(d)}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {groups.map((g) => {
                    const isOpen = open[g.locId] !== false;
                    const totalCols = 1 + days.length;

                    return (
                      <Fragment key={g.locId}>
                        {/* Header de localidad (fila de grupo) */}
                        <tr className="bg-gray-50">
                          <td
                            colSpan={totalCols}
                            className=" bg-gray-50 border-b px-3 py-2 text-sm font-semibold"
                            style={{ top: monthH + headerH }}
                          >
                            <span className="sticky left-0 z-10 px-2 z-50">
                            <button
                              type="button"
                              onClick={() => setOpen((p) => ({ ...p, [g.locId]: !isOpen }))}
                              className=" inline-flex items-center justify-center w-6 h-6 mr-2 rounded border bg-white hover:bg-gray-100 "
                              title={isOpen ? "Colapsar" : "Expandir"}
                            >
                              {isOpen ? "−" : "+"}
                            </button>
                            
                            {g.locNombre}
                            
                            <span className="ml-2 text-xs text-gray-500">
                              ({g.empleados.length} emp.)
                            </span>
                            </span>
                          </td>
                        </tr>

                        {/* Filas de empleados */}
                        {isOpen &&
                          g.empleados.map((e) => {
                            const empId = Number(e.id_empleado);
                            const mapFechas = g.empMapByEmpId.get(empId) ?? new Map();

                            return (
                              <tr key={`${g.locId}-${empId}`} className="hover:bg-gray-50">
                                <td
                                  className="sticky left-0 z-10 bg-white border-b border-r px-2 text-sm"
                                  style={{ width: stickyColW, minWidth: stickyColW, height: rowH }}
                                >
                                  {e.empleado_nombre_apellido}
                                </td>

                                {days.map((d) => {
                                  const key = toYMD(d);
                                  const arr = mapFechas.get(key) ?? [];
                                  const { lines, tooltip, bgColor } = renderCellLines(arr);

                                  return (
                                    <td
                                      key={`${empId}-${key}`}
                                      title={tooltip}
                                      className="border-b border-r px-1 text-center text-[11px] font-semibold"
                                      style={{
                                        width: dayColW,
                                        minWidth: dayColW,
                                        height: rowH,
                                        backgroundColor: bgColor ? `${bgColor}26` : undefined,
                                      }}
                                    >
                                      <div className="leading-4">
                                        <div>{lines[0] || ""}</div>
                                        <div>{lines[1] || ""}</div>
                                        {lines[2] ? (
                                          <div className="text-[9px] font-normal">{lines[2]}</div>
                                        ) : null}
                                      </div>
                                    </td>
                                  );
                                })}
                              </tr>
                            );
                          })}
                      </Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>

      </div>
    </div>
  );
}
