'use client';

import { useState, useRef } from 'react';
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
      // Wrapper span stops ALL events from reaching parent <button> and draggable div
      <span
        role="presentation"
        draggable={false}
        onClick={(e) => e.stopPropagation()}
        onMouseDown={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.stopPropagation()}
        onKeyUp={(e) => e.stopPropagation()}
      >
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
          placeholder="np. Priorytet!"
          className="w-28 rounded border border-amber-500/50 bg-slate-950 px-2 py-0.5 text-xs text-amber-300 placeholder:text-slate-600 focus:outline-none"
        />
      </span>
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
        onMouseDown={(e) => e.stopPropagation()}
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
      onMouseDown={(e) => e.stopPropagation()}
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
  onReorder,
}: {
  campaigns: CampaignRecord[];
  onSelect: (id: string) => void;
  onAdd: () => void;
  onDelete: (id: string) => void;
  onUpdateStatus: (id: string, status: string) => void;
  onReorder: (fromIndex: number, toIndex: number) => void;
}) {
  const dragItem = useRef<number | null>(null);
  const dragOverItem = useRef<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const handleDragStart = (index: number) => {
    dragItem.current = index;
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    dragOverItem.current = index;
    setDragOverIndex(index);
  };

  const handleDragEnd = () => {
    if (dragItem.current !== null && dragOverItem.current !== null && dragItem.current !== dragOverItem.current) {
      onReorder(dragItem.current, dragOverItem.current);
    }
    dragItem.current = null;
    dragOverItem.current = null;
    setDragOverIndex(null);
  };

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
        {campaigns.map((c, index) => {
          const keyword = c.data.mainKeyword || 'Nowa kampania';
          const blogCount = c.data.blogs.length;
          const hasData = c.data.mainKeyword.trim() !== '' && blogCount > 0;
          const isDragOver = dragOverIndex === index && dragItem.current !== index;

          return (
            <div
              key={c.id}
              draggable
              onDragStart={() => handleDragStart(index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragEnd={handleDragEnd}
              className={`group flex items-center justify-between rounded-xl border bg-slate-900/60 px-5 py-4 transition hover:border-slate-700 hover:bg-slate-800/60 ${
                isDragOver
                  ? 'border-amber-500/50 bg-amber-500/5'
                  : 'border-slate-800'
              }`}
            >
              {/* Drag handle */}
              <div
                className="mr-3 flex shrink-0 cursor-grab items-center text-slate-700 opacity-0 transition active:cursor-grabbing group-hover:opacity-100"
                title="Przeciągnij żeby zmienić kolejność"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                  <circle cx="5" cy="3" r="1.5" />
                  <circle cx="11" cy="3" r="1.5" />
                  <circle cx="5" cy="8" r="1.5" />
                  <circle cx="11" cy="8" r="1.5" />
                  <circle cx="5" cy="13" r="1.5" />
                  <circle cx="11" cy="13" r="1.5" />
                </svg>
              </div>

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
