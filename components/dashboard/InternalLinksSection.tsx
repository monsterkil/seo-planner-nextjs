import type { AnchorItem, BlogArticle } from '@/lib/types';
import { Accordion } from '@/components/ui/Accordion';

export function InternalLinksSection({
  blogs,
  links,
  publishedBlogs,
  onTogglePublished,
}: {
  blogs: BlogArticle[];
  links: AnchorItem[][];
  publishedBlogs: string[];
  onTogglePublished: (blogId: string) => void;
}) {
  const total = links.reduce((s, l) => s + l.length, 0);

  if (total === 0) return null;

  const doneCount = blogs.filter((b) => publishedBlogs.includes(b.id)).length;
  const blogsWithLinks = blogs.filter((_, i) => (links[i] || []).length > 0).length;

  return (
    <div>
      <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-white">
        Linki z blogów do oferty
      </h3>
      <Accordion
        count={`${doneCount}/${blogsWithLinks}`}
        countColor={doneCount === blogsWithLinks ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}
        title="Blog → Oferta"
      >
        <div className="space-y-4">
          {blogs.map((blog, i) => {
            const blogLinks = links[i] || [];
            if (blogLinks.length === 0) return null;
            const done = publishedBlogs.includes(blog.id);
            return (
              <div key={blog.id} className={done ? 'opacity-50' : ''}>
                <label className="mb-2 flex cursor-pointer items-center gap-2 text-xs font-semibold text-emerald-400">
                  <input
                    type="checkbox"
                    checked={done}
                    onChange={() => onTogglePublished(blog.id)}
                    className="h-3.5 w-3.5 rounded border-slate-600 bg-slate-800 text-emerald-500 focus:ring-emerald-500/30"
                  />
                  <span className={done ? 'line-through' : ''}>
                    Blog {blog.label}: {blog.title || blog.keyword}
                  </span>
                </label>
                <div className="space-y-1 pl-5">
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
