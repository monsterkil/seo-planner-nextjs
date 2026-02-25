'use client';

import { useState } from 'react';
import type { CampaignRecord } from '@/lib/types';

function StatusBadge({
  status,
  onSave,
}: {
  status?: string;
  onSave: (value: string) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(status || '');

  if (editing) {
    return (
      <input
        autoFocus
        type="text"
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={() => {
          onSave(draft);
          setEditing(false);
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            onSave(draft);
            setEditing(false);
          }
          if (e.key === 'Escape') {
            setDraft(status || '');
            setEditing(false);
          }
        }}
        onClick={(e) => e.stopPropagation()}
        placeholder="np. Priorytet!"
        className="w-28 rounded border border-amber-500/50 bg-slate-950 px-2 py-0.5 text-xs text-amber-300 placeholder:text-slate-600 focus:outline-none"
      />
    );
  }

  if (status) {
    return (
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setDraft(status);
          setEditing(true);
        }}
        className="rounded-full bg-amber-500/15 px-2.5 py-0.5 text-xs font-medium text-amber-400 transition hover:bg-amber-500/25"
        title="Kliknij żeby edytować status"
      >
        {status}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        setDraft('');
        setEditing(true);
      }}
      className="rounded-full border border-dashed border-slate-700 px-2.5 py-0.5 text-xs text-slate-600 opacity-0 transition group-hover:opacity-100 hover:border-slate-500 hover:text-slate-400"
      title="Dodaj status"
    >
      + status
    </button>
  );
}

export function CampaignSelector({
  campaigns,
  onSelect,
  onAdd,
  onDelete,
  onUpdateStatus,
}: {
  campaigns: CampaignRecord[];
  onSelect: (id: string) => void;
  onAdd: () => void;
  onDelete: (id: string) => void;
  onUpdateStatus: (id: string, status: string) => void;
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
                  <div className="flex items-center gap-2">
                    <span className="truncate text-sm font-medium text-white">
                      {keyword}
                    </span>
                    <StatusBadge
                      status={c.status}
                      onSave={(v) => onUpdateStatus(c.id, v)}
                    />
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
