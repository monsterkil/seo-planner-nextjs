import { Fragment } from 'react';
import type { TimelineRow } from '@/lib/types';
import { Accordion } from '@/components/ui/Accordion';

export function TimelineSection({ timeline }: { timeline: TimelineRow[] }) {
  return (
    <div>
      <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-white">
        Rozłożenie w czasie
      </h3>
      <Accordion
        count={timeline.length}
        countColor="bg-sky-500/20 text-sky-400"
        title="Timeline — miesiące"
      >
        <div className="grid grid-cols-[auto_1fr_1fr_1fr_1fr] gap-px overflow-hidden rounded-xl border border-slate-800 bg-slate-800">
          <div className="bg-slate-800/80 px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
            Mies.
          </div>
          <div className="bg-slate-800/80 px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
            Mocne PBN
          </div>
          <div className="bg-slate-800/80 px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
            Słabe PBN
          </div>
          <div className="bg-slate-800/80 px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
            Razem
          </div>
          <div className="bg-slate-800/80 px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
            Narastająco
          </div>
          {timeline.map((r) => (
            <Fragment key={r.month}>
              <div className="bg-slate-900/80 px-4 py-3 text-sm">{r.month}</div>
              <div className="bg-slate-900/80 px-4 py-3 text-sm font-semibold text-amber-400">
                {r.strong}
              </div>
              <div className="bg-slate-900/80 px-4 py-3 text-sm text-slate-400">
                {r.weak}
              </div>
              <div className="bg-slate-900/80 px-4 py-3 text-sm font-semibold">
                {r.total}
              </div>
              <div className="bg-slate-900/80 px-4 py-3 text-sm text-slate-400">
                {r.cumulative}
              </div>
            </Fragment>
          ))}
        </div>
      </Accordion>
    </div>
  );
}
