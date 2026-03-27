export default function AdminTable({ title, columns = [], rows = [] }) {
  return (
    <section className="panel p-5">
      <div className="editorial-title mb-4 text-lg font-bold text-ink">{title}</div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead>
            <tr className="border-b border-border text-muted">
              {columns.map((column) => (
                <th key={column} className="px-3 py-2 font-medium">
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.length ? (
              rows.map((row, index) => (
                <tr key={index} className="border-b border-border">
                  {row.map((cell, cellIndex) => (
                    <td key={cellIndex} className="px-3 py-3 text-[#29445e]">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length || 1} className="px-3 py-6 text-sm text-muted">
                  No records yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
