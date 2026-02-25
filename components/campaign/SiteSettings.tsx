'use client';

import { useState } from 'react';
import type { SiteSettings as SiteSettingsType } from '@/lib/types';

const inputCls =
  'w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-200 placeholder:text-slate-600 focus:border-amber-500 focus:outline-none';

export function SiteSettings({
  site,
  onUpdate,
}: {
  site: SiteSettingsType;
  onUpdate: <K extends keyof SiteSettingsType>(key: K, value: SiteSettingsType[K]) => void;
}) {
  const [open, setOpen] = useState(false);

  const summary = site.companyName || site.companyUrl
    ? `${site.companyName || '—'} · ${site.companyUrl || '—'}`
    : 'Uzupełnij dane firmy';

  return (
    <section className="mb-8">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between rounded-2xl border border-slate-800 bg-slate-900/40 px-6 py-4 text-left transition-colors hover:bg-slate-800/50"
      >
        <span className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-700/50 text-lg font-bold text-slate-400">
            ⛭
          </span>
          <span>
            <span className="block text-xs font-semibold uppercase tracking-wider text-slate-500">
              Ustawienia strony
            </span>
            <span className="text-sm text-slate-400">{summary}</span>
          </span>
        </span>
        <span
          className={`text-slate-500 transition-transform duration-200 ${open ? 'rotate-90' : ''}`}
        >
          ▶
        </span>
      </button>

      {open && (
        <div className="mt-2 space-y-4 rounded-2xl border border-slate-800 bg-slate-900/40 p-6">
          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-500">
              Firma (do brand anchorów)
            </label>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <input
                type="text"
                placeholder="Nazwa firmy"
                value={site.companyName}
                onChange={(e) => onUpdate('companyName', e.target.value)}
                className={inputCls}
              />
              <input
                type="text"
                placeholder="URL firmy (np. folplex.pl)"
                value={site.companyUrl}
                onChange={(e) => onUpdate('companyUrl', e.target.value)}
                className={inputCls}
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-500">
              Sitemap oferty (do anti-kanibalizacji w prompcie)
            </label>
            <input
              type="text"
              placeholder="np. https://folplex.pl/ct_offer-sitemap.xml"
              value={site.sitemapUrl}
              onChange={(e) => onUpdate('sitemapUrl', e.target.value)}
              onFocus={(e) => e.target.select()}
              className={inputCls}
              style={{ textOverflow: 'clip' }}
            />
          </div>
        </div>
      )}
    </section>
  );
}
