import type { BlogArticle, PlanDistribution } from '@/lib/types';

function weakLabel(n: number): string {
  if (n === 1) return '1 słaby link';
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14))
    return `${n} słabe linki`;
  return `${n} słabych linków`;
}

function strongAdj(n: number): string {
  if (n === 1) return 'MOCNY';
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14))
    return 'MOCNE';
  return 'MOCNYCH';
}

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
  const cols = 1 + blogs.length; // offer + blogs

  return (
    <section className="mb-10">
      <h3 className="mb-3 text-xs font-semibold uppercase tracking-widest text-slate-500">
        Przepływ mocy
      </h3>
      {/* Top row: link counts */}
      <div
        className="grid gap-3"
        style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
      >
        {/* Money page direct */}
        <div className="rounded-2xl border border-amber-500/30 bg-gradient-to-br from-amber-500/15 to-transparent p-3 text-center shadow-lg">
          <div className="text-2xl font-bold text-amber-400">{strongDirect}</div>
          <div className="text-xs font-medium text-slate-500">{strongAdj(strongDirect)} → oferta</div>
          <div className="mt-2 border-t border-slate-700/50 pt-2 text-xs text-slate-500">
            +<strong className="text-slate-400">{weakLabel(weakDirect)}</strong>
          </div>
        </div>

        {/* Blog link cards */}
        {blogs.map((blog, i) => (
          <div
            key={blog.id}
            className="rounded-2xl border border-slate-700 bg-slate-900/60 p-3 text-center transition hover:border-violet-500/30"
          >
            <div className="text-2xl font-bold text-violet-400">
              {strongToBlogs[i] || 0}
            </div>
            <div className="text-xs font-medium text-slate-500">
              {strongAdj(strongToBlogs[i] || 0)} → Blog {blog.label}
            </div>
            <div className="mt-2 border-t border-slate-700/50 pt-2 text-xs text-slate-500">
              +<strong className="text-slate-400">{weakLabel(weakToBlogs[i] || 0)}</strong>
            </div>
          </div>
        ))}
      </div>

      <div className="my-3 flex justify-center text-slate-600">↓</div>

      {/* Bottom row: targets */}
      <div
        className="grid gap-3"
        style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
      >
        {/* Money page */}
        <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-3 text-center">
          <span className="inline-block rounded bg-amber-500/20 px-2 py-0.5 text-xs font-semibold text-amber-400">
            Oferta
          </span>
          <div className="mt-1 truncate text-xs font-medium text-amber-400/90" title={mainKeyword}>
            {mainKeyword || '—'}
          </div>
        </div>

        {/* Blog targets */}
        {blogs.map((blog) => (
          <div
            key={blog.id}
            className="rounded-2xl border border-slate-700 bg-slate-900/60 p-3 text-center transition hover:border-violet-500/30"
          >
            <span className="inline-block rounded bg-violet-500/20 px-2 py-0.5 text-xs font-semibold text-violet-400">
              {blog.label}
            </span>
            {blog.keyword && (
              <div className="mt-1 truncate text-xs font-medium text-violet-400/80" title={blog.keyword}>
                {blog.keyword}
              </div>
            )}
            {blog.volume > 0 && (
              <div className="mt-0.5 text-xs text-slate-500">vol. {blog.volume}</div>
            )}
            <div
              className="mt-1 line-clamp-2 text-xs leading-snug text-slate-400"
              title={blog.title}
            >
              {blog.title || '—'}
            </div>
            <div className="mt-1 text-xs text-amber-500/70">2× link → oferta</div>
          </div>
        ))}
      </div>
    </section>
  );
}
