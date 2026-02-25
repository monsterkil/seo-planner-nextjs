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
  campaign.blogs.forEach((blog, i) => {
    const links = campaign.internalLinks[i] || [];
    if (links.length > 0) {
      lines.push(`  Blog ${blog.label}:`);
      links.forEach((l) => lines.push(`    - „${l.text}"${l.ctx ? ` [kontekst: ${l.ctx}]` : ''}`));
    }
  });
  lines.push('');

  // Timeline
  lines.push('TIMELINE:');
  plan.timeline.forEach((row) => {
    lines.push(`  Miesiąc ${row.month}: +${row.strong} mocnych, +${row.weak} słabych (suma: ${row.cumulative})`);
  });

  return lines.join('\n');
}

export function LlmOutput({
  campaign,
  plan,
}: {
  campaign: CampaignInput;
  plan: CalculatedPlan;
}) {
  const [copied, setCopied] = useState(false);
  const text = buildText(campaign, plan);

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
    <details className="mt-8 max-w-5xl">
      <summary className="cursor-pointer text-xs text-slate-600 hover:text-slate-400">
        LLM-friendly output (tekst do skopiowania)
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
