'use client';

import { useState } from 'react';
import type { CampaignInput, CalculatedPlan, AnchorItem } from '@/lib/types';
import { LINK_PROFILES } from '@/lib/constants';

const TYPE_LABELS: Record<string, string> = {
  e: 'exact',
  p: 'partial',
  b: 'brand',
  g: 'generic',
};

function anchorLine(a: AnchorItem): string {
  return `  - „${a.text}" [${TYPE_LABELS[a.type] || a.type}]`;
}

function buildText(campaign: CampaignInput, plan: CalculatedPlan): string {
  const d = plan.distribution;
  const profile = LINK_PROFILES[campaign.linkProfile];
  const lines: string[] = [];

  lines.push(`KAMPANIA SEO: ${campaign.mainKeyword}`);
  lines.push(`Volume: ${campaign.volume} | KD: ${campaign.kd}`);
  if (campaign.moneyPageUrl) lines.push(`Money page: ${campaign.moneyPageUrl}`);
  if (campaign.companyName) lines.push(`Firma: ${campaign.companyName} (${campaign.companyUrl})`);
  lines.push(`Profil: ${profile.label} (${Math.round(profile.directPercent * 100)}% direct, ${Math.round(profile.blogsPercent * 100)}% blogi, słabe ×${profile.weakRatio})`);
  lines.push(`Tryb blogów: ${campaign.blogMode === 'cluster' ? 'cluster (topical authority)' : 'traffic (informacyjne)'}`);
  lines.push(`Podział linków: ${campaign.linkDistribution === 'equal' ? 'równy' : 'proporcjonalny wg volume'}`);
  lines.push('');

  lines.push(`LINKI OGÓŁEM: ${d.totalLinks} (${campaign.strongPbnCount} mocnych + ${d.weakTotal} słabych)`);
  lines.push(`Czas: ${d.months} mies. | Koszt: ${d.monthlyPrice.toFixed(0)} zł/mies.`);
  lines.push('');
  lines.push('TYPY PBN:');
  lines.push('  Mocne PBN — linki ze strony głównej mocnych domen (wysoki DR/DA). Przekazują dużo mocy.');
  lines.push('  Słabe PBN — linki ze stron wewnętrznych (artykułów) słabszych domen. Tańsze, budują naturalny profil.');
  lines.push('');

  lines.push('PRZEPŁYW MOCY:');
  lines.push(`  Oferta: ${d.strongDirect} mocnych + ${d.weakDirect} słabych`);
  campaign.blogs.forEach((blog, i) => {
    lines.push(`  Blog ${blog.label} („${blog.title || blog.keyword}"): ${d.strongToBlogs[i] || 0} mocnych + ${d.weakToBlogs[i] || 0} słabych`);
  });
  lines.push('');

  // Anchory oferta
  lines.push('ANCHORY → OFERTA (mocne PBN):');
  plan.strongMoneySlice.forEach((a) => lines.push(anchorLine(a)));
  lines.push('');
  lines.push('ANCHORY → OFERTA (słabe PBN):');
  plan.weakMoneySlice.forEach((a) => lines.push(anchorLine(a)));
  lines.push('');

  // Anchory blogi
  campaign.blogs.forEach((blog, i) => {
    lines.push(`ANCHORY → BLOG ${blog.label} „${blog.title || blog.keyword}" (mocne PBN):`);
    (plan.strongBlogSlices[i] || []).forEach((a) => lines.push(anchorLine(a)));
    lines.push('');
    lines.push(`ANCHORY → BLOG ${blog.label} (słabe PBN):`);
    (plan.weakBlogSlices[i] || []).forEach((a) => lines.push(anchorLine(a)));
    lines.push('');
  });

  // Internal links
  lines.push('LINKI WEWNĘTRZNE (blog → oferta):');
  lines.push('  Każdy blog zawiera 2 linki do money page — anchory dobiera autor artykułu kontekstowo.');
  lines.push('  Wytyczne: 1 link kontekstowy (partial/exact match frazy głównej), 1 CTA (generic).');
  lines.push('');

  // Timeline
  lines.push('TIMELINE:');
  plan.timeline.forEach((row) => {
    lines.push(`  Miesiąc ${row.month}: +${row.strong} mocnych, +${row.weak} słabych (suma: ${row.cumulative})`);
  });

  return lines.join('\n');
}

function buildBlogBrief(campaign: CampaignInput): string {
  const lines: string[] = [];

  lines.push(`BRIEF: ARTYKUŁY BLOGOWE DLA KAMPANII „${campaign.mainKeyword}"`);
  lines.push(`Firma: ${campaign.companyName || '—'} (${campaign.companyUrl || '—'})`);
  lines.push(`Money page: ${campaign.moneyPageUrl || '—'}`);
  lines.push(`Tryb: ${campaign.blogMode === 'cluster' ? 'cluster (topical authority — blogi wzmacniają tematycznie money page)' : 'traffic (informacyjne — blogi przyciągają ruch organiczny)'}`);
  lines.push('');

  lines.push(`Do napisania: ${campaign.blogs.length} artykułów.`);
  lines.push('Każdy artykuł powinien zawierać 2 linki wewnętrzne do money page (naturalnie wplecione w treść):');
  lines.push('  - 1 link kontekstowy z anchorem partial/exact match frazy głównej (wpleciony naturalnie w akapit)');
  lines.push('  - 1 link CTA z anchorem generic (np. „sprawdź ofertę", „zapytaj o wycenę" — w ramce, podsumowaniu lub sidebar)');
  lines.push('Anchory dobiera autor artykułu — muszą pasować do kontekstu zdania, nie być sztucznie wklejone.');
  lines.push('');

  campaign.blogs.forEach((blog, i) => {
    lines.push(`--- BLOG ${blog.label} ---`);
    lines.push(`Tytuł: ${blog.title || '—'}`);
    lines.push(`Fraza docelowa: ${blog.keyword || '—'}`);
    if (blog.volume > 0) lines.push(`Volume: ${blog.volume}`);

    lines.push('');
  });

  lines.push('WYTYCZNE:');
  lines.push('- Artykuły informacyjne/poradnikowe, NIE ofertowe.');
  lines.push('- Naturalny język, bez keyword stuffing.');
  lines.push('- Linki do money page wplecione kontekstowo (nie na siłę).');
  lines.push(`- Każdy artykuł zoptymalizowany pod swoją frazę docelową.`);
  if (campaign.sitemapUrl) {
    lines.push(`- NIE kanibalizować stron ofertowych (sitemap: ${campaign.sitemapUrl}).`);
  }

  return lines.join('\n');
}

function CopyBlock({ text, label }: { text: string; label: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  return (
    <details className="mt-4 max-w-5xl">
      <summary className="cursor-pointer text-xs text-slate-600 hover:text-slate-400">
        {label}
      </summary>
      <div className="relative mt-2">
        <button
          type="button"
          onClick={handleCopy}
          className={`absolute right-3 top-3 rounded-lg px-3 py-1.5 text-xs font-medium transition ${
            copied
              ? 'bg-emerald-500/20 text-emerald-400'
              : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-300'
          }`}
        >
          {copied ? 'Skopiowano!' : 'Kopiuj'}
        </button>
        <pre className="max-h-96 overflow-auto rounded-xl border border-slate-800 bg-slate-950 p-4 text-xs leading-relaxed text-slate-400 whitespace-pre-wrap">
          {text}
        </pre>
      </div>
    </details>
  );
}

export function LlmOutput({
  campaign,
  plan,
}: {
  campaign: CampaignInput;
  plan: CalculatedPlan;
}) {
  return (
    <div className="mt-8">
      <CopyBlock text={buildText(campaign, plan)} label="LLM output — plan linkowania" />
      <CopyBlock text={buildBlogBrief(campaign)} label="LLM output — brief blogów do napisania" />
    </div>
  );
}
