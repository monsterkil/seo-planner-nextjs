import type { AnchorItem, BlogArticle } from '@/lib/types';
import { Accordion } from '@/components/ui/Accordion';

export function InternalLinksSection({
  blogs,
  links,
}: {
  blogs: BlogArticle[];
  links: AnchorItem[][];
}) {
  const total = links.reduce((s, l) => s + l.length, 0);

  if (total === 0) return null;

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
        <div className="space-y-4">
          {blogs.map((blog, i) => {
            const blogLinks = links[i] || [];
            if (blogLinks.length === 0) return null;
            return (
              <div key={blog.id}>
                <p className="mb-2 text-xs font-semibold text-emerald-400">
                  Blog {blog.label}: {blog.title || blog.keyword}
                </p>
                <div className="space-y-1">
                  {blogLinks.map((l) => (
                    <div key={l.id} className="flex items-start gap-2 text-xs">
                      <span className="shrink-0 rounded bg-slate-800 px-1.5 py-0.5 font-mono text-slate-500">
                        {l.type}
                      </span>
                      <span className="text-slate-300">„{l.text}"</span>
                      {l.ctx && (
                        <span className="text-slate-500">— {l.ctx}</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </Accordion>
    </div>
  );
}
