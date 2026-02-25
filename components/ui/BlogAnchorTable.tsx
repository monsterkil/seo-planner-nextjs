import { Fragment } from 'react';
import type { AnchorItem, BlogArticle, GroupedAnchor } from '@/lib/types';
import { Pill } from './Pill';
import { tableTh, tableTd, tableTrHover } from './table-styles';

function groupAnchors(list: AnchorItem[]): GroupedAnchor[] {
  const g: Record<string, GroupedAnchor> = {};
  list.forEach((i) => {
    const k = `${i.text}||${i.type}`;
    if (!g[k]) g[k] = { text: i.text, type: i.type, count: 0 };
    g[k].count++;
  });
  const order: Record<string, number> = { e: 0, p: 1, b: 2, g: 3 };
  return Object.values(g).sort((a, b) => order[a.type] - order[b.type]);
}

export function BlogAnchorTable({
  blogs,
  slices,
  accent,
}: {
  blogs: BlogArticle[];
  slices: AnchorItem[][];
  accent: string;
}) {
  return (
    <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/50">
      <table className="w-full min-w-[400px]">
        <thead>
          <tr className="bg-slate-800/50">
            <th className={tableTh}>Blog</th>
            <th className={tableTh}>Anchor</th>
            <th className={tableTh}>Typ</th>
            <th className={tableTh}>Ile</th>
          </tr>
        </thead>
        <tbody>
          {blogs.map((blog, idx) => {
            const items = slices[idx] || [];
            if (!items.length) return null;
            const gr = groupAnchors(items);
            return (
              <Fragment key={blog.id}>
                <tr className="bg-slate-800/30">
                  <td
                    colSpan={4}
                    className={`${tableTd} text-xs font-semibold text-slate-400`}
                  >
                    Blog {blog.label} · {blog.title || blog.keyword || '—'} · {items.length} linków
                  </td>
                </tr>
                {gr.map((i, gi) => (
                  <tr key={`b-${idx}-${gi}`} className={tableTrHover}>
                    <td className={`${tableTd} font-semibold text-violet-400`}>
                      {blog.label}
                    </td>
                    <td className={`${tableTd} font-mono ${accent}`}>{i.text}</td>
                    <td className={tableTd}>
                      <Pill type={i.type} />
                    </td>
                    <td className={`${tableTd} font-medium`}>{i.count}</td>
                  </tr>
                ))}
              </Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
