export default function PlanificacionTablaLocalidad({
  localidadNombre,
  days,
  empleados,
  empMapByEmpId, // Map(empId -> Map(dateYMD -> arrayAsignaciones))
  dayLabel,
  toYMD,
  renderCellLines, // (arrAsignaciones) => { lines: string[], tooltip: string }
}) {
  const rowH = 40;
  const headerH = 35;
  const maxVisibleRows = 3;
  const maxH = headerH + rowH * maxVisibleRows;
const monthGroups = (() => {
  const groups = [];
  let currentKey = null;
  let startIdx = 0;

  const getKey = (d) => `${d.getFullYear()}-${d.getMonth()}`; // ej 2025-11
  const getLabel = (d) => {
    const meses = ["ENE","FEB","MAR","ABR","MAY","JUN","JUL","AGO","SEP","OCT","NOV","DIC"];
    const yy = String(d.getFullYear()).slice(-2);
    return `${meses[d.getMonth()]} ${yy}`;
  };

    for (let i = 0; i < days.length; i++) {
        const key = getKey(days[i]);
        if (currentKey === null) {
        currentKey = key;
        startIdx = i;
        } else if (key !== currentKey) {
        groups.push({
            label: getLabel(days[startIdx]),
            span: i - startIdx,
        });
        currentKey = key;
        startIdx = i;
        }
    }

    if (currentKey !== null) {
        groups.push({
        label: getLabel(days[startIdx]),
        span: days.length - startIdx,
        });
    }

    return groups;
    })();

  return (
    <div className="bg-white rounded border shadow-sm">
<div className="px-4 py-2 border-b flex items-center justify-between">
  <div className="font-semibold">{localidadNombre}</div>

  <div className="flex gap-2">
    {monthGroups.map((g, idx) => (
      <span
        key={`${g.label}-${idx}`}
        className="text-[11px] font-semibold text-gray-700 px-2 py-0.5 rounded border bg-gray-50"
      >
        {g.label}
      </span>
    ))}
  </div>
</div>

        
<div
  className="grid"
  style={{ gridTemplateRows: "1fr 5px", maxHeight: maxH }}
>
  {/* 1) Área principal: scroll vertical */}
  <div className="overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
    {/* el X NO va acá */}
    <div className="min-w-max">

            <table className="min-w-max w-full border-separate border-spacing-0">
              <thead className="sticky top-0 z-30">
                <tr>
                  <th
                    className="sticky left-0 z-40 bg-gray-100 border-b border-r px-3 text-left text-sm font-semibold"
                    style={{ minWidth: 220, height: headerH }}
                  >
                    Empleado
                  </th>

                  {days.map((d) => (
                    <th
                      key={toYMD(d)}
                      className="bg-gray-100 border-b border-r px-2 text-center text-xs font-semibold whitespace-nowrap"
                      style={{ minWidth: 80, height: headerH }}
                    >
                      {dayLabel(d)}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {empleados.map((e) => {
                  const empId = Number(e.id_empleado);
                  const mapFechas = empMapByEmpId.get(empId) ?? new Map();

                  return (
                    <tr key={empId} className="hover:bg-gray-50">
                      <td
                        className="sticky left-0 z-20 bg-white border-b border-r px-3 text-sm"
                        style={{ minWidth: 220, height: rowH }}
                      >
                        {e.empleado_nombre_apellido}
                      </td>

                      {days.map((d) => {
                        const key = toYMD(d);
                        const arr = mapFechas.get(key) ?? [];
                        const { lines, tooltip } = renderCellLines(arr);

                        return (
                          <td
                            key={key}
                            title={tooltip}
                            className="border-b border-r px-1 text-center text-[11px] font-semibold"
                            style={{ minWidth: 80, height: rowH }}
                          >
                            <div className="leading-2">
                              <div>{lines[0] || ""}</div>
                              <div>{lines[1] || ""}</div>
                              {lines[2] ? (
                                <div className="text-[10px] font-normal">{lines[2]}</div>
                              ) : null}
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
            </div>
  </div>

  {/* 2) Barra horizontal fija (siempre visible) */}
  <div className="overflow-x-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
    {/* Este “spacer” crea el ancho scrolleable */}
    <div style={{ gridTemplateRows: "1fr 12px", maxHeight: maxH }}/>
  </div>
        
      </div>
    </div>
  );
}
