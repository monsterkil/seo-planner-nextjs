import type { AnchorItem, BlogArticle } from '@/lib/types';
import { Pill } from './Pill';
import { tableTh, tableTd, tableTrHover } from './table-styles';

export function InternalTable({
  blogs,
  links,
}: {
  blogs: BlogArticle[];
  links: AnchorItem[][];
}) {
  return (
    <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/50">
      <table className="w-full min-w-[500px]">
        <thead>
          <tr className="bg-slate-800/50">
            <th className={tableTh}>Z bloga</th>
            <th className={tableTh}>Anchor → oferta</th>
            <th className={tableTh}>Typ</th>
            <th className={tableTh}>Kontekst</th>
          </tr>
        </thead>
        <tbody>
          {blogs.map((blog, idx) =>
            (links[idx] || []).map((l, li) => (
              <tr key={`il-${blog.id}-${li}`} className={tableTrHover}>
                <td className={`${tableTd} font-semibold text-violet-400`}>
                  {blog.label}
                </td>
                <td className={`${tableTd} font-mono text-amber-400`}>{l.text}</td>
                <td className={tableTd}>
                  <Pill type={l.type} />
                </td>
                <td className={`${tableTd} max-w-xs text-xs text-slate-500`}>
                  {l.ctx || '—'}
                </td>
              </tr>
            )),
          )}
        </tbody>
      </table>
    </div>
  );
}
