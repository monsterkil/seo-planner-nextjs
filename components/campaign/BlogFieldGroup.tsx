import type { BlogArticle } from '@/lib/types';

export function BlogFieldGroup({
  blog,
  onUpdate,
  onRemove,
}: {
  blog: BlogArticle;
  onUpdate: (id: string, updates: Partial<BlogArticle>) => void;
  onRemove: (id: string) => void;
}) {
  return (
    <div className="flex items-start gap-2 rounded-xl border border-slate-700 bg-slate-800/30 p-3">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-violet-500/20 text-sm font-bold text-violet-400">
        {blog.label}
      </span>
      <div className="grid flex-1 grid-cols-1 gap-2 sm:grid-cols-3">
        <input
          type="text"
          placeholder="Tytuł artykułu"
          value={blog.title}
          onChange={(e) => onUpdate(blog.id, { title: e.target.value })}
          className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-200 placeholder:text-slate-600 focus:border-violet-500 focus:outline-none sm:col-span-3"
        />
        <input
          type="text"
          placeholder="Fraza docelowa"
          value={blog.keyword}
          onChange={(e) => onUpdate(blog.id, { keyword: e.target.value })}
          className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-200 placeholder:text-slate-600 focus:border-violet-500 focus:outline-none sm:col-span-2"
        />
        <input
          type="number"
          placeholder="Vol."
          value={blog.volume || ''}
          onChange={(e) =>
            onUpdate(blog.id, { volume: parseInt(e.target.value) || 0 })
          }
          className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-200 placeholder:text-slate-600 focus:border-violet-500 focus:outline-none"
        />
      </div>
      <button
        type="button"
        onClick={() => onRemove(blog.id)}
        className="mt-1 shrink-0 rounded-lg p-2 text-slate-500 transition hover:bg-red-500/20 hover:text-red-400"
        title="Usuń blog"
      >
        ✕
      </button>
    </div>
  );
}
