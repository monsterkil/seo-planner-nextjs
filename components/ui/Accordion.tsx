'use client';

import { useState } from 'react';

export function Accordion({
  count,
  countColor,
  title,
  children,
  defaultOpen = false,
}: {
  count: number | string;
  countColor: string;
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/40 shadow-xl shadow-black/20">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between px-6 py-4 text-left transition-colors hover:bg-slate-800/50"
      >
        <span className="flex items-center gap-3">
          <span
            className={`flex h-9 w-9 items-center justify-center rounded-lg text-lg font-bold ${countColor}`}
          >
            {count}
          </span>
          <span className="text-sm font-medium text-slate-300">{title}</span>
        </span>
        <span
          className={`text-slate-500 transition-transform duration-200 ${open ? 'rotate-90' : ''}`}
        >
          ▶
        </span>
      </button>
      {open && (
        <div className="border-t border-slate-800 px-6 py-4">{children}</div>
      )}
    </div>
  );
}
