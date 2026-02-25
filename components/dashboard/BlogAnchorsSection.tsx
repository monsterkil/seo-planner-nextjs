import type { AnchorItem, BlogArticle } from '@/lib/types';
import { Accordion } from '@/components/ui/Accordion';
import { BlogAnchorTable } from '@/components/ui/BlogAnchorTable';

export function BlogAnchorsSection({
  blogs,
  strongSlices,
  weakSlices,
}: {
  blogs: BlogArticle[];
  strongSlices: AnchorItem[][];
  weakSlices: AnchorItem[][];
}) {
  const strongTotal = strongSlices.reduce((s, sl) => s + sl.length, 0);
  const weakTotal = weakSlices.reduce((s, sl) => s + sl.length, 0);

  return (
    <div>
      <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-white">
        Blogi
      </h3>
      <div className="space-y-3">
        <Accordion
          count={strongTotal}
          countColor="bg-violet-500/20 text-violet-400"
          title="Mocne PBN → Blogi"
        >
          <BlogAnchorTable blogs={blogs} slices={strongSlices} accent="text-violet-400" />
        </Accordion>
        <Accordion
          count={weakTotal}
          countColor="bg-slate-500/20 text-slate-400"
          title="Słabe PBN → Blogi"
        >
          <BlogAnchorTable blogs={blogs} slices={weakSlices} accent="text-slate-400" />
        </Accordion>
      </div>
    </div>
  );
}
