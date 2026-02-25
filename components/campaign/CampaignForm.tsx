'use client';

import { useState } from 'react';
import type { CampaignInput, BlogArticle, LinkProfileKey, BlogMode, LinkDistribution } from '@/lib/types';
import { LINK_PROFILES, MAX_BLOGS } from '@/lib/constants';
import { BlogFieldGroup } from './BlogFieldGroup';
import { PasteDataModal } from './PasteDataModal';

const inputCls =
  'w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-200 placeholder:text-slate-600 focus:border-amber-500 focus:outline-none';

export function CampaignForm({
  campaign,
  onUpdateField,
  onAddBlog,
  onRemoveBlog,
  onUpdateBlog,
  onRegenerate,
  onReset,
  onImport,
}: {
  campaign: CampaignInput;
  onUpdateField: <K extends keyof CampaignInput>(key: K, value: CampaignInput[K]) => void;
  onAddBlog: () => void;
  onRemoveBlog: (id: string) => void;
  onUpdateBlog: (id: string, updates: Partial<BlogArticle>) => void;
  onRegenerate: () => void;
  onReset: () => void;
  onImport: (json: string) => string | null;
}) {
  const [expanded, setExpanded] = useState(false);
  const [pasteOpen, setPasteOpen] = useState(false);

  const hasData = campaign.mainKeyword.trim() !== '';

  return (
    <section className="mb-10">
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="mb-4 flex w-full items-center justify-between rounded-2xl border border-slate-800 bg-slate-900/40 px-6 py-4 text-left transition-colors hover:bg-slate-800/50"
      >
        <span className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500/20 text-lg font-bold text-amber-400">
            ⚙
          </span>
          <span className="text-sm font-medium text-slate-300">
            {hasData
              ? `${campaign.mainKeyword} · ${campaign.blogs.length} blogów · ${campaign.companyName || '—'}`
              : 'Konfiguracja kampanii'}
          </span>
        </span>
        <span
          className={`text-slate-500 transition-transform duration-200 ${expanded ? 'rotate-90' : ''}`}
        >
          ▶
        </span>
      </button>

      {expanded && (
        <div className="space-y-6 rounded-2xl border border-slate-800 bg-slate-900/40 p-6">
          {/* Main keyword + volume + KD */}
          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-500">
              Fraza główna
            </label>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_100px_80px]">
              <input
                type="text"
                placeholder="np. oklejanie witryn Warszawa"
                value={campaign.mainKeyword}
                onChange={(e) => onUpdateField('mainKeyword', e.target.value)}
                className={inputCls}
              />
              <input
                type="number"
                placeholder="Vol."
                value={campaign.volume || ''}
                onChange={(e) =>
                  onUpdateField('volume', parseInt(e.target.value) || 0)
                }
                className={inputCls}
              />
              <input
                type="number"
                placeholder="KD"
                value={campaign.kd || ''}
                onChange={(e) =>
                  onUpdateField('kd', parseInt(e.target.value) || 0)
                }
                className={inputCls}
              />
            </div>
          </div>

          {/* Money page URL */}
          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-500">
              URL money page
            </label>
            <input
              type="text"
              placeholder="np. /oferta/oklejanie-witryn/"
              value={campaign.moneyPageUrl}
              onChange={(e) => onUpdateField('moneyPageUrl', e.target.value)}
              onFocus={(e) => e.target.select()}
              className={`${inputCls} text-ellipsis-none`}
              style={{ textOverflow: 'clip' }}
            />
          </div>

          {/* Sitemap URL */}
          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-500">
              Sitemap oferty (do anti-kanibalizacji w prompcie)
            </label>
            <input
              type="text"
              placeholder="np. https://folplex.pl/ct_offer-sitemap.xml"
              value={campaign.sitemapUrl}
              onChange={(e) => onUpdateField('sitemapUrl', e.target.value)}
              onFocus={(e) => e.target.select()}
              className={inputCls}
              style={{ textOverflow: 'clip' }}
            />
          </div>

          {/* Company info */}
          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-500">
              Firma (do brand anchorów)
            </label>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <input
                type="text"
                placeholder="Nazwa firmy"
                value={campaign.companyName}
                onChange={(e) => onUpdateField('companyName', e.target.value)}
                className={inputCls}
              />
              <input
                type="text"
                placeholder="URL firmy (np. folplex.pl)"
                value={campaign.companyUrl}
                onChange={(e) => onUpdateField('companyUrl', e.target.value)}
                className={inputCls}
              />
            </div>
          </div>

          {/* Link profile */}
          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-500">
              Profil linkowania
            </label>
            <div className="flex flex-wrap gap-2">
              {(Object.keys(LINK_PROFILES) as LinkProfileKey[]).map((key) => {
                const active = campaign.linkProfile === key;
                const p = LINK_PROFILES[key];
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => onUpdateField('linkProfile', key)}
                    title={`${Math.round(p.directPercent * 100)}% direct · ${Math.round(p.blogsPercent * 100)}% blogi · słabe ${p.weakRatio}x`}
                    className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                      active
                        ? 'bg-emerald-500/30 text-emerald-400 ring-1 ring-emerald-500/50'
                        : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                    }`}
                  >
                    {p.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Blog mode */}
          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-500">
              Tryb blogów
            </label>
            <div className="flex gap-2">
              {([
                { key: 'cluster' as BlogMode, label: 'Cluster', desc: 'topical authority (bez ruchu)' },
                { key: 'traffic' as BlogMode, label: 'Traffic', desc: 'frazy z ruchem (informacyjne)' },
              ]).map((mode) => {
                const active = campaign.blogMode === mode.key;
                return (
                  <button
                    key={mode.key}
                    type="button"
                    onClick={() => onUpdateField('blogMode', mode.key)}
                    className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                      active
                        ? mode.key === 'traffic'
                          ? 'bg-sky-500/30 text-sky-400 ring-1 ring-sky-500/50'
                          : 'bg-purple-500/30 text-purple-400 ring-1 ring-purple-500/50'
                        : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                    }`}
                  >
                    <div>{mode.label}</div>
                    <div className="mt-0.5 text-xs opacity-70">{mode.desc}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Link distribution */}
          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-500">
              Podział linków na blogi
            </label>
            <div className="flex gap-2">
              {([
                { key: 'proportional' as LinkDistribution, label: 'Wg volume', desc: 'więcej linków na blogi z ruchem' },
                { key: 'equal' as LinkDistribution, label: 'Równy', desc: 'tyle samo linków na każdy blog' },
              ]).map((mode) => {
                const active = campaign.linkDistribution === mode.key;
                return (
                  <button
                    key={mode.key}
                    type="button"
                    onClick={() => onUpdateField('linkDistribution', mode.key)}
                    className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                      active
                        ? 'bg-teal-500/30 text-teal-400 ring-1 ring-teal-500/50'
                        : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                    }`}
                  >
                    <div>{mode.label}</div>
                    <div className="mt-0.5 text-xs opacity-70">{mode.desc}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Blog articles */}
          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Artykuły blogowe ({campaign.blogs.length}/{MAX_BLOGS})
              </label>
              {campaign.blogs.length < MAX_BLOGS && (
                <button
                  type="button"
                  onClick={onAddBlog}
                  className="rounded-lg bg-violet-500/20 px-3 py-1 text-xs font-medium text-violet-400 transition hover:bg-violet-500/30"
                >
                  + Dodaj blog
                </button>
              )}
            </div>
            <div className="space-y-2">
              {campaign.blogs.map((blog) => (
                <BlogFieldGroup
                  key={blog.id}
                  blog={blog}
                  blogMode={campaign.blogMode}
                  onUpdate={onUpdateBlog}
                  onRemove={onRemoveBlog}
                />
              ))}
              {campaign.blogs.length === 0 && (
                <p className="text-sm text-slate-500">
                  Dodaj artykuły blogowe, które będą wspierać money page.
                </p>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-3 border-t border-slate-800 pt-4">
            <button
              type="button"
              onClick={() => setPasteOpen(true)}
              className="rounded-lg bg-sky-500/20 px-4 py-2 text-sm font-medium text-sky-400 transition hover:bg-sky-500/30"
            >
              Wstaw dane
            </button>
            <button
              type="button"
              onClick={onRegenerate}
              disabled={!hasData}
              className="rounded-lg bg-amber-500/20 px-4 py-2 text-sm font-medium text-amber-400 transition hover:bg-amber-500/30 disabled:opacity-40 disabled:hover:bg-amber-500/20"
            >
              Generuj anchory
            </button>
            <button
              type="button"
              onClick={onReset}
              className="rounded-lg bg-red-500/10 px-4 py-2 text-sm font-medium text-red-400 transition hover:bg-red-500/20"
            >
              Reset
            </button>
          </div>
        </div>
      )}

      <PasteDataModal
        open={pasteOpen}
        onClose={() => setPasteOpen(false)}
        onImport={onImport}
        blogMode={campaign.blogMode}
        mainKeyword={campaign.mainKeyword}
        sitemapUrl={campaign.sitemapUrl}
      />
    </section>
  );
}
