export type PropRow = {
  name: string;
  type: string;
  default?: string;
  description: string;
};

export function PropsTable({ rows, caption }: { rows: PropRow[]; caption?: string }) {
  return (
    <div className="overflow-x-auto border-2 border-ink">
      <table className="w-full min-w-xl border-collapse text-left text-sm">
        {caption && (
          <caption className="border-b-2 border-ink bg-paper px-4 py-2 text-left font-mono text-xs font-bold">
            {caption}
          </caption>
        )}
        <thead className="bg-paper-sunken font-mono text-xs uppercase">
          <tr>
            <th scope="col" className="border-b-2 border-ink px-4 py-2.5">Prop</th>
            <th scope="col" className="border-b-2 border-ink px-4 py-2.5">Type</th>
            <th scope="col" className="border-b-2 border-ink px-4 py-2.5">Default</th>
            <th scope="col" className="border-b-2 border-ink px-4 py-2.5">Description</th>
          </tr>
        </thead>
        <tbody className="bg-paper-raised">
          {rows.map((r) => (
            <tr key={r.name} className="border-b-2 border-ink-faint last:border-b-0">
              <th scope="row" className="px-4 py-3 align-top font-mono text-sm font-bold whitespace-nowrap">
                {r.name}
              </th>
              <td className="px-4 py-3 align-top">
                <code className="font-mono text-xs break-words text-ink-muted">{r.type}</code>
              </td>
              <td className="px-4 py-3 align-top">
                <code className="font-mono text-xs">{r.default ?? "—"}</code>
              </td>
              <td className="px-4 py-3 align-top leading-relaxed">{r.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
