export default function PlanificacionTablaLocalidad({
  localidadNombre,
  days,
  empleados,
  empMapByEmpId, // Map(empId -> Map(dateYMD -> arrayAsignaciones))
  dayLabel,
  toYMD,
  renderCellLines, // (arrAsignaciones) => { lines: string[], tooltip: string }
}) {
  const rowH = 44;
  const headerH = 40;
  const maxVisibleRows = 3;
  const maxH = headerH + rowH * maxVisibleRows;

  return (
    <div className="bg-white rounded border shadow-sm">
      <div className="px-4 py-2 border-b font-semibold">{localidadNombre}</div>

      {/* 2 scrolls: horizontal en wrapper, vertical en tbody wrapper */}
      <div className="overflow-x-auto">
        <div className="min-w-max">
          {/* wrapper vertical */}
          <div
            className="overflow-y-auto"
            style={{ maxHeight: maxH }}
          >
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
                            <div className="leading-4">
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
      </div>
    </div>
  );
}
