import type { AnchorItem, BlogArticle } from '@/lib/types';
import { Accordion } from '@/components/ui/Accordion';
import { BlogAnchorTable } from '@/components/ui/BlogAnchorTable';

export function BlogAnchorsSection({
  blogs,
  strongSlices,
  weakSlices,
  usedAnchors,
  onToggle,
}: {
  blogs: BlogArticle[];
  strongSlices: AnchorItem[][];
  weakSlices: AnchorItem[][];
  usedAnchors: string[];
  onToggle: (ids: string[]) => void;
}) {
  const usedSet = new Set(usedAnchors);
  const allStrong = strongSlices.flat();
  const allWeak = weakSlices.flat();
  const strongUsed = allStrong.filter((a) => usedSet.has(a.id)).length;
  const weakUsed = allWeak.filter((a) => usedSet.has(a.id)).length;

  return (
    <div>
      <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-white">
        Blogi
      </h3>
      <div className="space-y-3">
        <Accordion
          count={`${strongUsed}/${allStrong.length}`}
          countColor={strongUsed === allStrong.length ? 'bg-emerald-500/20 text-emerald-400' : 'bg-violet-500/20 text-violet-400'}
          title="Mocne PBN → Blogi"
        >
          <BlogAnchorTable blogs={blogs} slices={strongSlices} accent="text-violet-400" usedAnchors={usedAnchors} onToggle={onToggle} />
        </Accordion>
        <Accordion
          count={`${weakUsed}/${allWeak.length}`}
          countColor={weakUsed === allWeak.length ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-500/20 text-slate-400'}
          title="Słabe PBN → Blogi"
        >
          <BlogAnchorTable blogs={blogs} slices={weakSlices} accent="text-slate-400" usedAnchors={usedAnchors} onToggle={onToggle} />
        </Accordion>
      </div>
    </div>
  );
}
