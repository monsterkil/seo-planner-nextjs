'use client';

import { useCampaign } from '@/lib/hooks/useCampaign';
import { useCalculatedPlan } from '@/lib/hooks/useCalculatedPlan';
import { CampaignForm } from './CampaignForm';
import { HeroStats } from '@/components/dashboard/HeroStats';
import { FlowDiagram } from '@/components/dashboard/FlowDiagram';
import { OfferAnchorsSection } from '@/components/dashboard/OfferAnchorsSection';
import { BlogAnchorsSection } from '@/components/dashboard/BlogAnchorsSection';
import { InternalLinksSection } from '@/components/dashboard/InternalLinksSection';
import { TimelineSection } from '@/components/dashboard/TimelineSection';

export default function CampaignDashboard() {
  const {
    campaign,
    hydrated,
    updateField,
    addBlog,
    removeBlog,
    updateBlog,
    regenerateAnchors,
    resetCampaign,
    importData,
  } = useCampaign();

  const plan = useCalculatedPlan(campaign);

  if (!hydrated) {
    return (
      <div className="min-h-screen bg-slate-950">
        <main className="mx-auto max-w-6xl px-6 py-8">
          <div className="animate-pulse text-slate-500">Ładowanie...</div>
        </main>
      </div>
    );
  }

  const hasData = campaign.mainKeyword.trim() !== '' && campaign.blogs.length > 0;

  return (
    <div className="min-h-screen bg-slate-950">
      <main className="mx-auto max-w-6xl px-6 py-8">
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

            <div className="space-y-8">
              <OfferAnchorsSection
                strongSlice={plan.strongMoneySlice}
                weakSlice={plan.weakMoneySlice}
              />

              {campaign.blogs.length > 0 && (
                <BlogAnchorsSection
                  blogs={campaign.blogs}
                  strongSlices={plan.strongBlogSlices}
                  weakSlices={plan.weakBlogSlices}
                />
              )}

              <InternalLinksSection
                blogs={campaign.blogs}
                links={campaign.internalLinks}
              />

              <TimelineSection timeline={plan.timeline} />
            </div>

            <footer className="mt-16 border-t border-slate-800 pt-8">
              <p className="text-xs leading-relaxed text-slate-500">
                Docelowy profil oferty: ~10% exact · ~20% partial · ~45% brand/URL ·
                ~25% generic. Mocne PBN = exact + partial · Słabe PBN = brand +
                generic + URL. Tempo: max 1 link na URL/tydzień.
              </p>
            </footer>
          </>
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-700 p-12 text-center">
            <p className="text-lg text-slate-500">
              Wpisz frazę główną i dodaj co najmniej 1 blog, żeby zobaczyć plan kampanii.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
