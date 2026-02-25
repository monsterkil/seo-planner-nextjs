import type { CampaignRecord } from '@/lib/types';

export function CampaignSelector({
  campaigns,
  activeCampaignId,
  onSwitch,
  onAdd,
  onDelete,
}: {
  campaigns: CampaignRecord[];
  activeCampaignId: string | null;
  onSwitch: (id: string) => void;
  onAdd: () => void;
  onDelete: (id: string) => void;
}) {
  return (
    <div className="mb-4 flex flex-wrap items-center gap-2">
      {campaigns.map((c) => {
        const active = c.id === activeCampaignId;
        const label = c.data.mainKeyword || 'Nowa kampania';
        return (
          <button
            key={c.id}
            type="button"
            onClick={() => onSwitch(c.id)}
            className={`group flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-medium transition ${
              active
                ? 'bg-amber-500/20 text-amber-400 ring-1 ring-amber-500/50'
                : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-300'
            }`}
          >
            <span className="max-w-[200px] truncate">{label}</span>
            {campaigns.length > 1 && (
              <span
                role="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(c.id);
                }}
                className="ml-0.5 rounded-full px-1 text-xs opacity-0 transition hover:bg-red-500/30 hover:text-red-400 group-hover:opacity-100"
              >
                ×
              </span>
            )}
          </button>
        );
      })}
      <button
        type="button"
        onClick={onAdd}
        className="rounded-full bg-slate-800 px-3 py-1.5 text-sm font-medium text-slate-500 transition hover:bg-slate-700 hover:text-amber-400"
      >
        +
      </button>
    </div>
  );
}
