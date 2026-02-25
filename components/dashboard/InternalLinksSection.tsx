import type { AnchorItem, BlogArticle } from '@/lib/types';
import { Accordion } from '@/components/ui/Accordion';
import { InternalTable } from '@/components/ui/InternalTable';

export function InternalLinksSection({
  blogs,
  links,
}: {
  blogs: BlogArticle[];
  links: AnchorItem[][];
}) {
  const total = links.reduce((s, l) => s + l.length, 0);

  return (
    <div>
      <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-white">
        Linki z blogów do oferty
      </h3>
      <Accordion
        count={total}
        countColor="bg-emerald-500/20 text-emerald-400"
        title="Blog → Oferta"
      >
        <InternalTable blogs={blogs} links={links} />
      </Accordion>
    </div>
  );
}
