import type { BlogArticle, PlanDistribution } from '@/lib/types';

export function FlowDiagram({
  distribution,
  blogs,
  mainKeyword,
}: {
  distribution: PlanDistribution;
  blogs: BlogArticle[];
  mainKeyword: string;
}) {
  const { strongDirect, strongToBlogs, weakDirect, weakToBlogs } = distribution;

  return (
    <section className="mb-10">
      <h3 className="mb-3 text-xs font-semibold uppercase tracking-widest text-slate-500">
        Przepływ mocy
      </h3>
      <div className="mb-3 flex flex-wrap gap-4 text-xs text-slate-500">
        <span className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-violet-500" />
          mocne PBN (exact + partial) · 1,50 zł/mies.
        </span>
        <span className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-slate-500" />
          słabe PBN (brand + generic + URL) · 0,20 zł/mies.
        </span>
      </div>

      {/* Single horizontal row — scrolls on overflow */}
      <div className="flex gap-3 overflow-x-auto pb-2">
        {/* Money page card */}
        <div className="flex min-w-[160px] shrink-0 flex-col rounded-2xl border border-amber-500/30 bg-gradient-to-br from-amber-500/15 to-transparent p-4 shadow-lg">
          <div className="flex items-baseline justify-between gap-2">
            <span className="text-2xl font-bold text-amber-400">{strongDirect}</span>
            <span className="text-xs text-slate-500">+{weakDirect} sł.</span>
          </div>
          <div className="mt-1 text-xs font-medium uppercase text-amber-400/80">
            mocne → oferta
          </div>
          <div className="mt-auto pt-3 border-t border-slate-700/50">
            <span className="inline-block rounded bg-amber-500/20 px-2 py-0.5 text-xs font-semibold text-amber-400">
              Oferta
            </span>
            <div className="mt-1 truncate text-xs font-medium text-amber-400/90" title={mainKeyword}>
              {mainKeyword || '—'}
            </div>
          </div>
        </div>

        {/* Blog cards */}
        {blogs.map((blog, i) => {
          const strong = strongToBlogs[i] || 0;
          const weak = weakToBlogs[i] || 0;
          return (
            <div
              key={blog.id}
              className="flex min-w-[160px] shrink-0 flex-col rounded-2xl border border-slate-700 bg-slate-900/60 p-4 transition hover:border-violet-500/30"
            >
              <div className="flex items-baseline justify-between gap-2">
                <span className="text-2xl font-bold text-violet-400">{strong}</span>
                <span className="text-xs text-slate-500">+{weak} sł.</span>
              </div>
              <div className="mt-1 text-xs font-medium uppercase text-slate-500">
                mocne → Blog {blog.label}
              </div>
              <div className="mt-auto pt-3 border-t border-slate-700/50">
                <div className="flex items-center justify-between">
                  <span className="inline-block rounded bg-violet-500/20 px-2 py-0.5 text-xs font-semibold text-violet-400">
                    {blog.label}
                  </span>
                  {blog.volume > 0 && (
                    <span className="text-xs text-slate-500">vol. {blog.volume}</span>
                  )}
                </div>
                <div
                  className="mt-1 line-clamp-2 text-xs font-medium leading-snug text-slate-300"
                  title={blog.title || blog.keyword}
                >
                  {blog.title || blog.keyword || '—'}
                </div>
                <div className="mt-1 text-xs text-amber-500/70">2× link → oferta</div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
