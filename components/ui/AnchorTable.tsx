import { Fragment } from 'react';
import type { AnchorItem, GroupedAnchor, AnchorType } from '@/lib/types';
import { Pill } from './Pill';
import { tableTh, tableTd, tableTrHover } from './table-styles';

const typeLabels: { t: AnchorType; l: string }[] = [
  { t: 'e', l: 'Exact match' },
  { t: 'p', l: 'Partial match' },
  { t: 'b', l: 'Brand / URL' },
  { t: 'g', l: 'Generic' },
];

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

export function AnchorTable({
  items,
  accent,
}: {
  items: AnchorItem[];
  accent: string;
}) {
  const n = items.length;
  if (n === 0) return <p className="text-sm text-slate-500">Brak anchorów — wygeneruj je przyciskiem powyżej.</p>;

  const gr = groupAnchors(items);
  let num = 1;

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/50">
      <table className="w-full min-w-[400px]">
        <thead>
          <tr className="bg-slate-800/50">
            <th className={tableTh}>#</th>
            <th className={tableTh}>Anchor</th>
            <th className={tableTh}>Typ</th>
            <th className={tableTh}>Ile</th>
          </tr>
        </thead>
        <tbody>
          {typeLabels.map((type) => {
            const typeItems = gr.filter((g) => g.type === type.t);
            if (!typeItems.length) return null;
            const tot = typeItems.reduce((s, i) => s + i.count, 0);
            const pct = Math.round((tot / n) * 100);
            const rows = typeItems.map((i) => {
              const f = num;
              const t2 = num + i.count - 1;
              const r = f === t2 ? `${f}` : `${f}–${t2}`;
              num += i.count;
              return (
                <tr key={`${i.text}-${i.type}-${f}`} className={tableTrHover}>
                  <td className={`${tableTd} font-mono text-slate-400`}>{r}</td>
                  <td className={`${tableTd} font-mono ${accent}`}>{i.text}</td>
                  <td className={tableTd}>
                    <Pill type={i.type} />
                  </td>
                  <td className={`${tableTd} font-medium`}>{i.count}</td>
                </tr>
              );
            });
            return (
              <Fragment key={`gh-${type.t}`}>
                <tr className="bg-slate-800/30">
                  <td
                    colSpan={4}
                    className={`${tableTd} text-xs font-semibold uppercase tracking-wider text-slate-500`}
                  >
                    {type.l} — {tot} ({pct}%)
                  </td>
                </tr>
                {rows}
              </Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
