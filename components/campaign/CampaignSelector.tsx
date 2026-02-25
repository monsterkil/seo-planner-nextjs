import type { CampaignRecord } from '@/lib/types';

export function CampaignSelector({
  campaigns,
  onSelect,
  onAdd,
  onDelete,
}: {
  campaigns: CampaignRecord[];
  onSelect: (id: string) => void;
  onAdd: () => void;
  onDelete: (id: string) => void;
}) {
  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-bold text-white">Kampanie</h1>
        <button
          type="button"
          onClick={onAdd}
          className="rounded-lg bg-amber-500/20 px-4 py-2 text-sm font-medium text-amber-400 transition hover:bg-amber-500/30"
        >
          + Nowa kampania
        </button>
      </div>

      <div className="space-y-2">
        {campaigns.map((c) => {
          const keyword = c.data.mainKeyword || 'Nowa kampania';
          const blogCount = c.data.blogs.length;
          const hasData = c.data.mainKeyword.trim() !== '' && blogCount > 0;

          return (
            <div
              key={c.id}
              className="group flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900/60 px-5 py-4 transition hover:border-slate-700 hover:bg-slate-800/60"
            >
              <button
                type="button"
                onClick={() => onSelect(c.id)}
                className="flex flex-1 items-center gap-4 text-left"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-500/15 text-lg font-bold text-amber-400">
                  {keyword.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium text-white">
                    {keyword}
                  </div>
                  <div className="mt-0.5 text-xs text-slate-500">
                    {hasData
                      ? `${blogCount} blogów · vol. ${c.data.volume} · KD ${c.data.kd} · ${c.data.strongPbnCount} PBN`
                      : 'Pusta — kliknij żeby skonfigurować'}
                  </div>
                </div>
                <span className="text-slate-600 transition group-hover:text-slate-400">
                  →
                </span>
              </button>

              {campaigns.length > 1 && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(c.id);
                  }}
                  className="ml-3 shrink-0 rounded-lg p-2 text-slate-600 opacity-0 transition hover:bg-red-500/20 hover:text-red-400 group-hover:opacity-100"
                  title="Usuń kampanię"
                >
                  ✕
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
