import type { AnchorItem } from '@/lib/types';
import { Accordion } from '@/components/ui/Accordion';
import { AnchorTable } from '@/components/ui/AnchorTable';

export function OfferAnchorsSection({
  strongSlice,
  weakSlice,
  usedAnchors,
  onToggle,
}: {
  strongSlice: AnchorItem[];
  weakSlice: AnchorItem[];
  usedAnchors: string[];
  onToggle: (ids: string[]) => void;
}) {
  const usedSet = new Set(Array.isArray(usedAnchors) ? usedAnchors : []);
  const strongUsed = strongSlice.filter((a) => usedSet.has(a.id)).length;
  const weakUsed = weakSlice.filter((a) => usedSet.has(a.id)).length;

  return (
    <div>
      <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-white">
        Oferta
      </h3>
      <div className="space-y-3">
        <Accordion
          count={`${strongUsed}/${strongSlice.length}`}
          countColor={strongUsed === strongSlice.length ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}
          title="Mocne PBN → Oferta"
        >
          <AnchorTable items={strongSlice} accent="text-amber-400" usedAnchors={usedAnchors} onToggle={onToggle} />
        </Accordion>
        <Accordion
          count={`${weakUsed}/${weakSlice.length}`}
          countColor={weakUsed === weakSlice.length ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-500/20 text-slate-400'}
          title="Słabe PBN → Oferta"
        >
          <AnchorTable items={weakSlice} accent="text-slate-400" usedAnchors={usedAnchors} onToggle={onToggle} />
        </Accordion>
      </div>
    </div>
  );
}
