'use client';

import { useState, useCallback } from 'react';
import { useCampaigns } from '@/lib/hooks/useCampaigns';
import { useCalculatedPlan } from '@/lib/hooks/useCalculatedPlan';
import { CampaignSelector } from './CampaignSelector';
import { SiteSettings } from './SiteSettings';
import { CampaignForm } from './CampaignForm';
import { HeroStats } from '@/components/dashboard/HeroStats';
import { FlowDiagram } from '@/components/dashboard/FlowDiagram';
import { OfferAnchorsSection } from '@/components/dashboard/OfferAnchorsSection';
import { BlogAnchorsSection } from '@/components/dashboard/BlogAnchorsSection';
import { InternalLinksSection } from '@/components/dashboard/InternalLinksSection';
import { BlogIdeasSection } from '@/components/dashboard/BlogIdeasSection';
import { LlmOutput } from '@/components/dashboard/LlmOutput';

export default function CampaignDashboard() {
  const {
    campaigns,
    activeCampaignId,
    addCampaign,
    deleteCampaign,
    switchCampaign,
    updateCampaignStatus,
    reorderCampaigns,
    site,
    updateSite,
    campaign,
    hydrated,
    updateField,
    addBlog,
    removeBlog,
    updateBlog,
    regenerateAnchors,
    resetCampaign,
    importData,
  } = useCampaigns();

  const [view, setView] = useState<'list' | 'detail'>('list');
  const plan = useCalculatedPlan(campaign);

  const toggleAnchors = useCallback(
    (ids: string[]) => {
      const arr = Array.isArray(campaign.usedAnchors) ? campaign.usedAnchors : [];
      const current = new Set(arr);
      const allUsed = ids.every((id) => current.has(id));
      if (allUsed) {
        ids.forEach((id) => current.delete(id));
      } else {
        ids.forEach((id) => current.add(id));
      }
      updateField('usedAnchors', [...current]);
    },
    [campaign.usedAnchors, updateField],
  );

  if (!hydrated) {
    return (
      <div className="min-h-screen bg-slate-950">
        <main className="mx-auto max-w-[1600px] px-6 py-8">
          <div className="animate-pulse text-slate-500">Ładowanie...</div>
        </main>
      </div>
    );
  }

  const handleSelect = (id: string) => {
    switchCampaign(id);
    setView('detail');
  };

  const handleAdd = () => {
    addCampaign();
    setView('detail');
  };

  const hasData = campaign.mainKeyword.trim() !== '' && campaign.blogs.length > 0;

  // --- List view ---
  if (view === 'list') {
    return (
      <div className="min-h-screen bg-slate-950">
        <main className="mx-auto max-w-4xl px-6 py-8">
          <SiteSettings site={site} onUpdate={updateSite} />
          <CampaignSelector
            campaigns={campaigns}
            onSelect={handleSelect}
            onAdd={handleAdd}
            onDelete={deleteCampaign}
            onUpdateStatus={updateCampaignStatus}
            onReorder={reorderCampaigns}
          />
        </main>
      </div>
    );
  }

  // --- Detail view ---
  return (
    <div className="min-h-screen bg-slate-950">
      <main className="mx-auto max-w-[1600px] px-6 py-8">
        {/* Back button */}
        <div className="mb-4 max-w-4xl">
          <button
            type="button"
            onClick={() => setView('list')}
            className="rounded-lg px-3 py-1.5 text-sm font-medium text-slate-500 transition hover:bg-slate-800 hover:text-slate-300"
          >
            ← Kampanie
          </button>
        </div>

        {/* Form */}
        <div className="max-w-4xl">
          <CampaignForm
            campaign={campaign}
            onUpdateField={updateField}
            onAddBlog={addBlog}
            onRemoveBlog={removeBlog}
            onUpdateBlog={updateBlog}
            onRegenerate={regenerateAnchors}
            onReset={resetCampaign}
            onImport={importData}
          />
        </div>

        {hasData ? (
          <>
            <HeroStats
              mainKeyword={campaign.mainKeyword}
              volume={campaign.volume}
              kd={campaign.kd}
              strongPbnCount={campaign.strongPbnCount}
              weakTotal={plan.distribution.weakTotal}
              monthlyPrice={plan.distribution.monthlyPrice}
              months={plan.distribution.months}
              linkProfile={campaign.linkProfile}
              onStrongChange={(n) => updateField('strongPbnCount', n)}
              onProfileChange={(p) => updateField('linkProfile', p)}
            />

            <FlowDiagram
              distribution={plan.distribution}
              blogs={campaign.blogs}
              mainKeyword={campaign.mainKeyword}
            />

            <div className="max-w-5xl space-y-8">
              <OfferAnchorsSection
                strongSlice={plan.strongMoneySlice}
                weakSlice={plan.weakMoneySlice}
                usedAnchors={campaign.usedAnchors}
                onToggle={toggleAnchors}
              />

              {campaign.blogs.length > 0 && (
                <BlogAnchorsSection
                  blogs={campaign.blogs}
                  strongSlices={plan.strongBlogSlices}
                  weakSlices={plan.weakBlogSlices}
                  usedAnchors={campaign.usedAnchors}
                  onToggle={toggleAnchors}
                />
              )}

              <InternalLinksSection
                blogs={campaign.blogs}
                links={campaign.internalLinks}
                publishedBlogs={campaign.publishedBlogs}
                onTogglePublished={(blogId) => {
                  const current = campaign.publishedBlogs;
                  updateField(
                    'publishedBlogs',
                    current.includes(blogId)
                      ? current.filter((id) => id !== blogId)
                      : [...current, blogId],
                  );
                }}
              />

              <BlogIdeasSection ideas={campaign.blogIdeas} />
            </div>

            <LlmOutput campaign={campaign} plan={plan} />

            <footer className="mt-16 max-w-5xl border-t border-slate-800 pt-8">
              <p className="text-xs leading-relaxed text-slate-500">
                Docelowy profil oferty: ~10% exact · ~20% partial · ~45% brand/URL ·
                ~25% generic. Mocne PBN = exact + partial · Słabe PBN = brand +
                generic + URL. Tempo: max 1 link na URL/tydzień.
              </p>
            </footer>
          </>
        ) : (
          <div className="mx-auto max-w-4xl rounded-2xl border border-dashed border-slate-700 p-12 text-center">
            <p className="text-lg text-slate-500">
              Wpisz frazę główną i dodaj co najmniej 1 blog, żeby zobaczyć plan kampanii.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
