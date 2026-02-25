'use client';

import { useMemo, Fragment, useState } from 'react';
import {
  BL,
  BN,
  blogLinks,
  strongMoney,
  strongBlogs,
  weakMoney,
  weakBlogs,
  internalLinks,
  keywordIdeas,
  type AnchorItem,
} from '@/lib/data';

/* ── Helpers ── */

const pillStyles: Record<string, string> = {
  e: 'bg-rose-500/20 text-rose-400 border border-rose-500/30',
  p: 'bg-blue-500/20 text-blue-400 border border-blue-500/30',
  b: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30',
  g: 'bg-slate-500/20 text-slate-400 border border-slate-500/30',
};
const pillLabel: Record<string, string> = {
  e: 'exact',
  p: 'partial',
  b: 'brand',
  g: 'generic',
};

function Pill({ t }: { t: string }) {
  return (
    <span
      className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ${pillStyles[t]}`}
    >
      {pillLabel[t]}
    </span>
  );
}

const linkStrStyles: Record<string, string> = {
  strong: 'bg-violet-500/20 text-violet-400 border border-violet-500/30',
  medium: 'bg-amber-500/20 text-amber-400 border border-amber-500/30',
  weak: 'bg-slate-500/20 text-slate-400 border border-slate-500/30',
};

function LinkStr({ strength }: { strength: string }) {
  const cls =
    strength === 'silny' ? 'strong' : strength === 'średni' ? 'medium' : 'weak';
  return (
    <span
      className={`inline-flex rounded-md px-2 py-0.5 text-xs font-medium ${linkStrStyles[cls]}`}
    >
      {strength}
    </span>
  );
}

interface GroupedAnchor {
  a: string;
  t: string;
  c: number;
}

function groupAnchors(list: AnchorItem[]): GroupedAnchor[] {
  const g: Record<string, GroupedAnchor> = {};
  list.forEach((i) => {
    const k = i.a + '||' + i.t;
    if (!g[k]) g[k] = { a: i.a, t: i.t, c: 0 };
    g[k].c++;
  });
  const order: Record<string, number> = { e: 0, p: 1, b: 2, g: 3 };
  return Object.values(g).sort((a, b) => order[a.t] - order[b.t]);
}

const typeLabels = [
  { t: 'e', l: 'Exact match' },
  { t: 'p', l: 'Partial match' },
  { t: 'b', l: 'Brand / URL' },
  { t: 'g', l: 'Generic' },
];

/* ── Table components ── */

const tableTh =
  'text-left text-xs font-semibold uppercase tracking-wider text-slate-500 px-4 py-3 border-b border-slate-800';
const tableTd =
  'px-4 py-3 text-sm border-b border-slate-800/50 last:border-0';
const tableTrHover = 'hover:bg-slate-800/30 transition-colors';

function AnchorTable({
  pool,
  n,
  accent,
}: {
  pool: AnchorItem[];
  n: number;
  accent: string;
}) {
  const sel = pool.slice(0, n);
  const gr = groupAnchors(sel);
  let num = 1;
  return (
    <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/50">
      <table className="w-full min-w-[400px]">
        <thead>
          <tr className="bg-slate-800/50">
            <th className={tableTh}>#</th>
            <th className={tableTh}>Anchor</th>
            <th className={tableTh}>Typ</th>
            <th className={tableTh}>Ile</th>
          </tr>
        </thead>
        <tbody>
          {typeLabels.map((type) => {
            const items = gr.filter((g) => g.t === type.t);
            if (!items.length) return null;
            const tot = items.reduce((s, i) => s + i.c, 0);
            const pct = Math.round((tot / n) * 100);
            const rows = items.map((i) => {
              const f = num;
              const t2 = num + i.c - 1;
              const r = f === t2 ? `${f}` : `${f}–${t2}`;
              num += i.c;
              return (
                <tr key={`${i.a}-${i.t}-${f}`} className={tableTrHover}>
                  <td className={`${tableTd} font-mono text-slate-400`}>{r}</td>
                  <td className={`${tableTd} font-mono ${accent}`}>{i.a}</td>
                  <td className={tableTd}>
                    <Pill t={i.t} />
                  </td>
                  <td className={`${tableTd} font-medium`}>{i.c}</td>
                </tr>
              );
            });
            return (
              <Fragment key={`gh-${type.t}`}>
                <tr className="bg-slate-800/30">
                  <td
                    colSpan={4}
                    className={`${tableTd} text-xs font-semibold uppercase tracking-wider text-slate-500`}
                  >
                    {type.l} — {tot} ({pct}%)
                  </td>
                </tr>
                {rows}
              </Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function BlogAnchorTable({
  pools,
  counts,
  accent,
}: {
  pools: AnchorItem[][];
  counts: number[];
  accent: string;
}) {
  return (
    <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/50">
      <table className="w-full min-w-[400px]">
        <thead>
          <tr className="bg-slate-800/50">
            <th className={tableTh}>Blog</th>
            <th className={tableTh}>Anchor</th>
            <th className={tableTh}>Typ</th>
            <th className={tableTh}>Ile</th>
          </tr>
        </thead>
        <tbody>
          {counts.map((c, idx) => {
            if (!c) return null;
            const pool = pools[idx].slice(0, c);
            const gr = groupAnchors(pool);
            return (
              <Fragment key={`bgh-${idx}`}>
                <tr className="bg-slate-800/30">
                  <td
                    colSpan={4}
                    className={`${tableTd} text-xs font-semibold text-slate-400`}
                  >
                    Blog {BL[idx]} · {BN[idx]} · {c} linków
                  </td>
                </tr>
                {gr.map((i, gi) => (
                  <tr key={`b-${idx}-${gi}`} className={tableTrHover}>
                    <td className={`${tableTd} font-semibold text-violet-400`}>
                      {BL[idx]}
                    </td>
                    <td className={`${tableTd} font-mono ${accent}`}>{i.a}</td>
                    <td className={tableTd}>
                      <Pill t={i.t} />
                    </td>
                    <td className={`${tableTd} font-medium`}>{i.c}</td>
                  </tr>
                ))}
              </Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function InternalTable() {
  return (
    <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/50">
      <table className="w-full min-w-[500px]">
        <thead>
          <tr className="bg-slate-800/50">
            <th className={tableTh}>Z bloga</th>
            <th className={tableTh}>Anchor → oferta</th>
            <th className={tableTh}>Typ</th>
            <th className={tableTh}>Kontekst</th>
          </tr>
        </thead>
        <tbody>
          {internalLinks.map((links, idx) =>
            links.map((l, li) => (
              <tr key={`il-${idx}-${li}`} className={tableTrHover}>
                <td className={`${tableTd} font-semibold text-violet-400`}>
                  {BL[idx]}
                </td>
                <td className={`${tableTd} font-mono text-amber-400`}>{l.a}</td>
                <td className={tableTd}>
                  <Pill t={l.t} />
                </td>
                <td className={`${tableTd} max-w-xs text-xs text-slate-500`}>
                  {l.ctx || '—'}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

function Timeline() {
  const months = 8;
  const totalS = 50,
    totalW = 60;
  const sPerM = totalS / months,
    wPerM = totalW / months;

  const rows = useMemo(() => {
    const result = [];
    let cumS = 0,
      cumW = 0;
    for (let m = 1; m <= months; m++) {
      const s =
        m === months ? totalS - cumS : Math.round(sPerM * m) - cumS;
      const w =
        m === months ? totalW - cumW : Math.round(wPerM * m) - cumW;
      cumS += s;
      cumW += w;
      result.push({ m, s, w, total: s + w, cum: cumS + cumW });
    }
    return result;
  }, []);

  return (
    <div className="grid grid-cols-[auto_1fr_1fr_1fr_1fr] gap-px overflow-hidden rounded-xl border border-slate-800 bg-slate-800">
      <div className="bg-slate-800/80 px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
        Mies.
      </div>
      <div className="bg-slate-800/80 px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
        Mocne PBN
      </div>
      <div className="bg-slate-800/80 px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
        Słabe PBN
      </div>
      <div className="bg-slate-800/80 px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
        Razem
      </div>
      <div className="bg-slate-800/80 px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
        Narastająco
      </div>
      {rows.map((r) => (
        <Fragment key={r.m}>
          <div className="bg-slate-900/80 px-4 py-3 text-sm">{r.m}</div>
          <div className="bg-slate-900/80 px-4 py-3 text-sm font-semibold text-amber-400">
            {r.s}
          </div>
          <div className="bg-slate-900/80 px-4 py-3 text-sm text-slate-400">
            {r.w}
          </div>
          <div className="bg-slate-900/80 px-4 py-3 text-sm font-semibold">
            {r.total}
          </div>
          <div className="bg-slate-900/80 px-4 py-3 text-sm text-slate-400">
            {r.cum}
          </div>
        </Fragment>
      ))}
    </div>
  );
}

/* ── Accordion ── */

function Accordion({
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

/* ── Main Dashboard ── */

export default function PbnDashboard() {
  const wb = blogLinks.map((n) => Math.round((n * 45) / 55));
  const blogVols = [1000, 700, 700, 600, 350, 250, 200];
  const blogKws = [
    'atrakcje na wesele',
    'ścianka do zdjęć na 18 jak zrobić',
    'atrakcje na 18 urodziny na sali',
    'pomysły dekoracja stołu komunijnego',
    'jak zrobić ściankę z balonów',
    'baby shower pomysły',
    'gender reveal pomysły',
  ];
  const flowBlogs = [
    { n: 7, l: 'A', w: 6 },
    { n: 7, l: 'B', w: 6 },
    { n: 6, l: 'C', w: 5 },
    { n: 5, l: 'D', w: 4 },
    { n: 5, l: 'E', w: 4 },
    { n: 4, l: 'F', w: 3 },
    { n: 3, l: 'G', w: 2 },
  ];

  return (
    <div className="min-h-screen bg-slate-950">
      {/* App header */}
      <header className="sticky top-0 z-10 border-b border-slate-800 bg-slate-950/95 backdrop-blur supports-[backdrop-filter]:bg-slate-950/80">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-600 text-lg font-bold text-white shadow-lg shadow-violet-500/20">
              PBN
            </div>
            <div>
              <h1 className="text-lg font-semibold text-white">
                SEO Planner
              </h1>
              <p className="text-xs text-slate-500">
                Plan kampanii · litery ze styroduru
              </p>
            </div>
          </div>
          <span className="rounded-full border border-emerald-500/40 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400">
            v2 — SERP verified
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-8">
        {/* Hero + stats */}
        <section className="mb-10">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-white">
              <span className="text-amber-400">litery ze styroduru</span>
              <span className="ml-2 text-sm font-normal text-slate-500">
                vol. 100 · KD 0
              </span>
            </h2>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="rounded-2xl border border-amber-500/20 bg-gradient-to-br from-amber-500/10 to-transparent p-5 shadow-lg">
              <div className="text-2xl font-bold text-amber-400">
                50 <span className="text-sm font-normal text-slate-500">× 1,50 zł</span>
              </div>
              <div className="mt-1 text-xs font-medium uppercase tracking-wider text-slate-500">
                Mocne PBN
              </div>
            </div>
            <div className="rounded-2xl border border-slate-700 bg-slate-900/60 p-5">
              <div className="text-2xl font-bold text-slate-400">
                60 <span className="text-sm font-normal text-slate-500">× 0,20 zł</span>
              </div>
              <div className="mt-1 text-xs font-medium uppercase tracking-wider text-slate-500">
                Słabe PBN
              </div>
            </div>
            <div className="rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/10 to-transparent p-5">
              <div className="text-2xl font-bold text-emerald-400">
                87 <span className="text-sm font-normal text-slate-500">zł/mies.</span>
              </div>
              <div className="mt-1 text-xs font-medium uppercase tracking-wider text-slate-500">
                Razem / miesiąc
              </div>
            </div>
            <div className="rounded-2xl border border-slate-700 bg-slate-900/60 p-5">
              <div className="text-2xl font-bold text-white">
                8 <span className="text-sm font-normal text-slate-500">mies.</span>
              </div>
              <div className="mt-1 text-xs font-medium uppercase tracking-wider text-slate-500">
                Czas kampanii
              </div>
            </div>
          </div>
        </section>

        {/* Flow */}
        <section className="mb-10">
          <h3 className="mb-4 text-xs font-semibold uppercase tracking-widest text-slate-500">
            Przepływ mocy
          </h3>
          <div className="mb-4 flex flex-wrap gap-4 text-xs text-slate-500">
            <span className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-violet-500" />
              mocne PBN (exact + partial) · 1,50 zł/mies.
            </span>
            <span className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-slate-500" />
              słabe PBN (brand + generic + URL) · 0,20 zł/mies.
            </span>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
            <div className="rounded-2xl border border-amber-500/30 bg-gradient-to-br from-amber-500/15 to-transparent p-4 text-center shadow-lg">
              <div className="text-2xl font-bold text-amber-400">13</div>
              <div className="text-xs font-medium uppercase text-slate-500">Mocne</div>
              <div className="mt-1 text-xs text-amber-400/80">→ oferta</div>
              <div className="mt-2 border-t border-slate-700/50 pt-2 text-xs text-slate-500">
                +<strong className="text-slate-400">30</strong> słabych
              </div>
            </div>
            {flowBlogs.map((b) => (
              <div
                key={b.l}
                className="rounded-2xl border border-slate-700 bg-slate-900/60 p-4 text-center transition hover:border-violet-500/30"
              >
                <div className="text-2xl font-bold text-violet-400">{b.n}</div>
                <div className="text-xs font-medium uppercase text-slate-500">
                  → Blog {b.l}
                </div>
                <div className="mt-2 border-t border-slate-700/50 pt-2 text-xs text-slate-500">
                  +<strong className="text-slate-400">{b.w}</strong> sł.
                </div>
              </div>
            ))}
          </div>
          <div className="my-3 flex justify-center text-slate-600">↓</div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
            <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 text-center">
              <span className="inline-block rounded-lg bg-amber-500/20 px-2 py-0.5 text-xs font-semibold text-amber-400">
                💰 Oferta
              </span>
              <div className="mt-2 text-xs font-medium text-amber-400/90">
                litery ze styroduru
              </div>
            </div>
            {BN.map((name, i) => (
              <div
                key={i}
                className="group relative rounded-2xl border border-slate-700 bg-slate-900/60 p-4 text-center transition hover:border-violet-500/30"
              >
                <span className="inline-block rounded-lg bg-violet-500/20 px-2 py-0.5 text-xs font-semibold text-violet-400">
                  {BL[i]}
                </span>
                <div className="mt-2 line-clamp-2 text-xs font-medium leading-snug text-slate-300" title={name}>
                  {name}
                </div>
                <div className="mt-1 text-xs text-slate-500">vol. {blogVols[i]}</div>
                <div className="mt-1 text-xs text-amber-500/70">2× link → oferta</div>
                <div className="absolute bottom-full left-2 right-2 z-10 rounded-lg border border-fuchsia-500/30 bg-slate-900 px-2 py-1.5 text-center text-xs text-fuchsia-400 opacity-0 shadow-xl transition-opacity group-hover:opacity-100">
                  🎯 {blogKws[i]}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Note */}
        <div className="mb-10 rounded-2xl border border-amber-500/20 bg-amber-500/5 p-5">
          <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-amber-400">
            ⚠ Zmiany w v2 vs v1
          </div>
          <p className="text-sm leading-relaxed text-slate-400">
            Wymieniono wszystkie 7 blogów. Stare miały{' '}
            <strong className="text-rose-400">transakcyjny SERP</strong> — Google
            pokazuje sklepy, blog by się nie przebił. Nowe 7 blogów mają
            zweryfikowany informacyjny SERP i naturalny kontekst na link do liter
            ze styroduru.
          </p>
        </div>

        {/* Sections */}
        <div className="space-y-8">
          <div>
            <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-white">
              💡 Pomysły na artykuły — 20 fraz
            </h3>
            <Accordion
              count={20}
              countColor="bg-fuchsia-500/20 text-fuchsia-400"
              title="Frazy z Ahrefs — SERP zweryfikowany"
              defaultOpen
            >
              <div className="overflow-x-auto rounded-xl border border-slate-800">
                <table className="w-full min-w-[600px]">
                  <thead>
                    <tr className="bg-slate-800/50">
                      <th className={tableTh}>#</th>
                      <th className={tableTh}>Fraza</th>
                      <th className={tableTh}>Vol.</th>
                      <th className={tableTh}>SERP</th>
                      <th className={tableTh}>Link</th>
                      <th className={tableTh}>Tytuł artykułu</th>
                    </tr>
                  </thead>
                  <tbody>
                    {keywordIdeas.map((kw, i) => (
                      <tr key={i} className={tableTrHover}>
                        <td className={tableTd}>{kw.num}</td>
                        <td className={`${tableTd} font-mono text-fuchsia-400`}>
                          {kw.keyword}
                        </td>
                        <td className={tableTd}>{kw.vol}</td>
                        <td className={tableTd}>
                          <span className="rounded-md bg-emerald-500/20 px-2 py-0.5 text-xs text-emerald-400">
                            {kw.serp}
                          </span>
                        </td>
                        <td className={tableTd}>
                          <LinkStr strength={kw.linkStrength} />
                        </td>
                        <td className={`${tableTd} text-slate-300`}>{kw.title}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Accordion>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-white">
              💰 Oferta
            </h3>
            <div className="space-y-3">
              <Accordion
                count={13}
                countColor="bg-amber-500/20 text-amber-400"
                title="Mocne PBN → Oferta (exact + partial)"
              >
                <AnchorTable pool={strongMoney} n={13} accent="text-amber-400" />
              </Accordion>
              <Accordion
                count={30}
                countColor="bg-slate-500/20 text-slate-400"
                title="Słabe PBN → Oferta (brand + generic + URL)"
              >
                <AnchorTable pool={weakMoney} n={30} accent="text-slate-400" />
              </Accordion>
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-white">
              📝 Blogi (A–G)
            </h3>
            <div className="space-y-3">
              <Accordion
                count={37}
                countColor="bg-violet-500/20 text-violet-400"
                title="Mocne PBN → Blogi (exact + partial)"
              >
                <BlogAnchorTable
                  pools={strongBlogs}
                  counts={blogLinks}
                  accent="text-violet-400"
                />
              </Accordion>
              <Accordion
                count={30}
                countColor="bg-slate-500/20 text-slate-400"
                title="Słabe PBN → Blogi (brand + generic)"
              >
                <BlogAnchorTable pools={weakBlogs} counts={wb} accent="text-slate-400" />
              </Accordion>
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-white">
              🔗 Linki z blogów do oferty
            </h3>
            <Accordion
              count={14}
              countColor="bg-emerald-500/20 text-emerald-400"
              title="Blog → Oferta (kontekst linkowania)"
            >
              <InternalTable />
            </Accordion>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-white">
              📅 Rozłożenie w czasie
            </h3>
            <Accordion
              count={8}
              countColor="bg-sky-500/20 text-sky-400"
              title="Timeline — miesiące"
            >
              <Timeline />
            </Accordion>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-white">
              🤖 Prompty AI
            </h3>
            <Accordion
              count={7}
              countColor="bg-fuchsia-500/20 text-fuchsia-400"
              title="Prompty do generowania artykułów"
            >
              <p className="text-sm text-slate-500">
                Prompty zostaną dodane później.
              </p>
            </Accordion>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-16 border-t border-slate-800 pt-8">
          <p className="text-xs leading-relaxed text-slate-500">
            Docelowy profil oferty: ~10% exact · ~20% partial · ~45% brand/URL ·
            ~25% generic. Mocne PBN = exact + partial · Słabe PBN = brand +
            generic + URL. Tempo: max 1 link na URL/tydzień.
          </p>
        </footer>
      </main>
    </div>
  );
}
