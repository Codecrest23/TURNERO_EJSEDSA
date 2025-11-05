export default function Table({ headers, children }) {
  return (
    <div className="overflow-x-auto bg-white shadow-md rounded-lg max-h-[70vh] h-fit overflow-y-auto">
      <table className="min-w-full text-sm text-left text-gray-600">
        <thead className="bg-gray-200 text-s uppercase text-gray-700 sticky top-0 z-10">
          <tr>
            {headers.map((h, i) => (
              <th key={i} className="px-6 py-3">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  )
}
