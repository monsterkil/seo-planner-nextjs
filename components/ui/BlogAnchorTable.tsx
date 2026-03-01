import { Fragment, useState } from 'react';
import type { AnchorItem, BlogArticle, AnchorType } from '@/lib/types';
import { Pill } from './Pill';
import { tableTh, tableTd, tableTrHover } from './table-styles';

interface GroupedRow {
  text: string;
  type: AnchorType;
  count: number;
  ids: string[];
}

function groupAnchors(list: AnchorItem[]): GroupedRow[] {
  const g: Record<string, GroupedRow> = {};
  list.forEach((i) => {
    const k = `${i.text}||${i.type}`;
    if (!g[k]) g[k] = { text: i.text, type: i.type, count: 0, ids: [] };
    g[k].count++;
    g[k].ids.push(i.id);
  });
  const order: Record<string, number> = { e: 0, p: 1, b: 2, g: 3 };
  return Object.values(g).sort((a, b) => order[a.type] - order[b.type]);
}

const checkboxCls =
  'h-4.5 w-4.5 rounded border-slate-600 bg-slate-800 text-emerald-500 focus:ring-emerald-500/30 cursor-pointer';

function CopyBlogAnchors({ items }: { items: AnchorItem[] }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    const unique: string[] = [];
    items.forEach((item) => {
      if (!unique.includes(item.text)) unique.push(item.text);
    });
    navigator.clipboard.writeText(unique.join('|'));
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <button
      type="button"
      onClick={copy}
      className="ml-2 rounded bg-slate-700/60 px-2 py-0.5 text-[10px] font-medium text-slate-500 transition hover:bg-slate-700 hover:text-slate-300"
    >
      {copied ? '✓' : '⧉ kopiuj'}
    </button>
  );
}

export function BlogAnchorTable({
  blogs,
  slices,
  accent,
  usedAnchors,
  onToggle,
}: {
  blogs: BlogArticle[];
  slices: AnchorItem[][];
  accent: string;
  usedAnchors?: string[];
  onToggle?: (ids: string[]) => void;
}) {
  const used = new Set(usedAnchors ?? []);
  const hasCb = !!onToggle;

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/50">
      <table className="w-full min-w-[400px]">
        <thead>
          <tr className="bg-slate-800/50">
            {hasCb && <th className={`${tableTh} w-8`} />}
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
                    colSpan={hasCb ? 5 : 4}
                    className={`${tableTd} text-xs font-semibold text-slate-400`}
                  >
                    Blog {blog.label} · {blog.title || blog.keyword || '—'} · {items.length} linków
                    <CopyBlogAnchors items={items} />
                  </td>
                </tr>
                {gr.map((i, gi) => {
                  const allUsed = i.ids.every((id) => used.has(id));
                  return (
                    <tr
                      key={`b-${idx}-${gi}`}
                      className={`${tableTrHover} ${allUsed ? 'opacity-40' : ''}`}
                    >
                      {hasCb && (
                        <td
                          className={`${tableTd} cursor-pointer select-none`}
                          onClick={() => onToggle!(i.ids)}
                        >
                          <input
                            type="checkbox"
                            checked={allUsed}
                            readOnly
                            className={checkboxCls}
                          />
                        </td>
                      )}
                      <td className={`${tableTd} font-semibold text-violet-400`}>
                        {blog.label}
                      </td>
                      <td className={`${tableTd} font-mono ${accent} ${allUsed ? 'line-through' : ''}`}>
                        {i.text}
                      </td>
                      <td className={tableTd}>
                        <Pill type={i.type} />
                      </td>
                      <td className={`${tableTd} font-medium`}>{i.count}</td>
                    </tr>
                  );
                })}
              </Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
