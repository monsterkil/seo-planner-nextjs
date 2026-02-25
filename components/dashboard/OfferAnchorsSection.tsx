import type { AnchorItem } from '@/lib/types';
import { Accordion } from '@/components/ui/Accordion';
import { AnchorTable } from '@/components/ui/AnchorTable';

export function OfferAnchorsSection({
  strongSlice,
  weakSlice,
}: {
  strongSlice: AnchorItem[];
  weakSlice: AnchorItem[];
}) {
  return (
    <div>
      <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-white">
        Oferta
      </h3>
      <div className="space-y-3">
        <Accordion
          count={strongSlice.length}
          countColor="bg-amber-500/20 text-amber-400"
          title="Mocne PBN → Oferta (exact + partial)"
        >
          <AnchorTable items={strongSlice} accent="text-amber-400" />
        </Accordion>
        <Accordion
          count={weakSlice.length}
          countColor="bg-slate-500/20 text-slate-400"
          title="Słabe PBN → Oferta (brand + generic + URL)"
        >
          <AnchorTable items={weakSlice} accent="text-slate-400" />
        </Accordion>
      </div>
    </div>
  );
}
