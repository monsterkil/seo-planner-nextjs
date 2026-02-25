'use client';

import { useMemo, Fragment } from 'react';
import {
  BL, BN, blogLinks,
  strongMoney, strongBlogs, weakMoney, weakBlogs, internalLinks, keywordIdeas,
  type AnchorItem,
} from '@/lib/data';

/* ── helpers ── */

const pillClass: Record<string, string> = { e: 'e', p: 'p', b: 'b', g: 'g' };
const pillLabel: Record<string, string> = { e: 'exact', p: 'partial', b: 'brand', g: 'generic' };

function Pill({ t }: { t: string }) {
  return <span className={`pill ${pillClass[t]}`}>{pillLabel[t]}</span>;
}

function LinkStr({ strength }: { strength: string }) {
  const cls = strength === 'silny' ? 'strong' : strength === 'średni' ? 'medium' : 'weak';
  return <span className={`link-str ${cls}`}>{strength}</span>;
}

interface GroupedAnchor { a: string; t: string; c: number; }

function groupAnchors(list: AnchorItem[]): GroupedAnchor[] {
  const g: Record<string, GroupedAnchor> = {};
  list.forEach(i => {
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

function AnchorTable({ pool, n, color }: { pool: AnchorItem[]; n: number; color: string }) {
  const sel = pool.slice(0, n);
  const gr = groupAnchors(sel);

  let num = 1;
  return (
    <table>
      <thead><tr><th>#</th><th>Anchor</th><th>Typ</th><th>Ile</th></tr></thead>
      <tbody>
        {typeLabels.map(type => {
          const items = gr.filter(g => g.t === type.t);
          if (!items.length) return null;
          const tot = items.reduce((s, i) => s + i.c, 0);
          const pct = Math.round(tot / n * 100);
          const rows = items.map(i => {
            const f = num;
            const t2 = num + i.c - 1;
            const r = f === t2 ? `${f}` : `${f}–${t2}`;
            num += i.c;
            return (
              <tr key={`${i.a}-${i.t}-${f}`}>
                <td>{r}</td>
                <td className={`a ${color}`}>{i.a}</td>
                <td><Pill t={i.t} /></td>
                <td>{i.c}</td>
              </tr>
            );
          });
          return [
            <tr className="group-header" key={`gh-${type.t}`}>
              <td colSpan={4}>{type.l} — {tot} ({pct}%)</td>
            </tr>,
            ...rows,
          ];
        })}
      </tbody>
    </table>
  );
}

function BlogAnchorTable({ pools, counts, color }: { pools: AnchorItem[][]; counts: number[]; color: string }) {
  return (
    <table>
      <thead><tr><th>Blog</th><th>Anchor</th><th>Typ</th><th>Ile</th></tr></thead>
      <tbody>
        {counts.map((c, idx) => {
          if (!c) return null;
          const pool = pools[idx].slice(0, c);
          const gr = groupAnchors(pool);
          return [
            <tr className="group-header" key={`bgh-${idx}`}>
              <td colSpan={4}>Blog {BL[idx]} · {BN[idx]} · {c} linków</td>
            </tr>,
            ...gr.map((i, gi) => (
              <tr key={`b-${idx}-${gi}`}>
                <td className="dest bl">{BL[idx]}</td>
                <td className={`a ${color}`}>{i.a}</td>
                <td><Pill t={i.t} /></td>
                <td>{i.c}</td>
              </tr>
            )),
          ];
        })}
      </tbody>
    </table>
  );
}

function InternalTable() {
  return (
    <table>
      <thead><tr><th>Z bloga</th><th>Anchor → /oferta/litery-logo-ze-styroduru/</th><th>Typ</th><th>Kontekst w artykule</th></tr></thead>
      <tbody>
        {internalLinks.map((links, idx) =>
          links.map((l, li) => (
            <tr key={`il-${idx}-${li}`}>
              <td className="dest bl">{BL[idx]}</td>
              <td className="a gold">{l.a}</td>
              <td><Pill t={l.t} /></td>
              <td style={{ fontSize: 10, color: '#555', maxWidth: 300 }}>{l.ctx || ''}</td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
}

function Timeline() {
  const months = 8;
  const totalS = 50, totalW = 60;
  const sPerM = totalS / months, wPerM = totalW / months;

  const rows = useMemo(() => {
    const result = [];
    let cumS = 0, cumW = 0;
    for (let m = 1; m <= months; m++) {
      const s = m === months ? totalS - cumS : Math.round(sPerM * m) - cumS;
      const w = m === months ? totalW - cumW : Math.round(wPerM * m) - cumW;
      cumS += s;
      cumW += w;
      result.push({ m, s, w, total: s + w, cum: cumS + cumW });
    }
    return result;
  }, []);

  return (
    <div className="timeline-grid">
      <div className="tg-cell th">Mies.</div>
      <div className="tg-cell th">Mocne PBN</div>
      <div className="tg-cell th">Słabe PBN</div>
      <div className="tg-cell th">Razem / mies.</div>
      <div className="tg-cell th">Narastająco</div>
      {rows.map(r => (
        <Fragment key={r.m}>
          <div className="tg-cell">{r.m}</div>
          <div className="tg-cell"><span className="gold-num">{r.s}</span></div>
          <div className="tg-cell"><span className="dim-num">{r.w}</span></div>
          <div className="tg-cell"><b>{r.total}</b></div>
          <div className="tg-cell">{r.cum}</div>
        </Fragment>
      ))}
    </div>
  );
}

/* ── Accordion ── */

function Accordion({ count, countClass, title, children, defaultOpen = false, countStyle }: {
  count: number | string;
  countClass: string;
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  countStyle?: React.CSSProperties;
}) {
  return (
    <details open={defaultOpen || undefined}>
      <summary>
        <span className="s-left">
          <span className={`s-count ${countClass}`} style={countStyle}>{count}</span>
          <span className="s-title">{title}</span>
        </span>
        <span className="chevron">▶</span>
      </summary>
      <div className="details-body">{children}</div>
    </details>
  );
}

/* ── Main Dashboard ── */

export default function PbnDashboard() {
  const wb = blogLinks.map(n => Math.round(n * 45 / 55));

  return (
    <div className="container">
      {/* Header */}
      <div className="header">
        <p className="target-line">
          <span>litery ze styroduru</span>{' '}
          <span className="kw-meta">vol. 100 · KD 0</span>
          <span className="version-badge">v2 — SERP verified</span>
        </p>
        <div className="cost-bar">
          <div className="cost-card hl-gold">
            <div className="cc-num">50 <span className="unit">× 1,50 zł</span></div>
            <div className="cc-lbl">Mocne PBN</div>
          </div>
          <div className="cost-card hl-dim">
            <div className="cc-num">60 <span className="unit">× 0,20 zł</span></div>
            <div className="cc-lbl">Słabe PBN</div>
          </div>
          <div className="cost-card hl-green">
            <div className="cc-num">87 <span className="unit">zł/mies.</span></div>
            <div className="cc-lbl">Razem / miesiąc</div>
          </div>
          <div className="cost-card">
            <div className="cc-num">8 <span className="unit">mies.</span></div>
            <div className="cc-lbl">Czas kampanii</div>
          </div>
        </div>
      </div>

      {/* Flow diagram */}
      <div className="diagram-section">
        <div className="section-label">Przepływ mocy</div>
        <div className="legend">
          <div className="legend-item"><div className="legend-dot strong" /> mocne PBN (exact + partial) · 1,50 zł/mies.</div>
          <div className="legend-item"><div className="legend-dot weak" /> słabe PBN (brand + generic + URL) · 0,20 zł/mies.</div>
        </div>
        <div className="flow-grid">
          <div className="flow-box money">
            <div className="num">13</div>
            <div className="lbl">Mocne</div>
            <div className="sub">→ oferta</div>
            <div className="weak-tag">+<b>30</b> słabych</div>
          </div>
          {[
            { n: 7, l: 'A', w: 6 }, { n: 7, l: 'B', w: 6 }, { n: 6, l: 'C', w: 5 },
            { n: 5, l: 'D', w: 4 }, { n: 5, l: 'E', w: 4 }, { n: 4, l: 'F', w: 3 },
            { n: 3, l: 'G', w: 2 },
          ].map(b => (
            <div className="flow-box pbn" key={b.l}>
              <div className="num">{b.n}</div>
              <div className="lbl">→ Blog {b.l}</div>
              <div className="weak-tag">+<b>{b.w}</b> sł.</div>
            </div>
          ))}
        </div>
        <div className="arrow-row">
          {Array(8).fill(0).map((_, i) => <div key={i}>↓</div>)}
        </div>
        <div className="blog-row">
          <div className="blog-box" style={{ borderColor: '#f59e0b33', background: '#12110c' }}>
            <div className="blog-tag" style={{ color: '#f59e0b', background: '#f59e0b12' }}>💰</div>
            <div className="blog-name" style={{ color: '#f59e0b' }}>Oferta</div>
            <div className="blog-vol">litery ze styroduru</div>
          </div>
          {BN.map((name, i) => (
            <div className="blog-box" key={i}>
              <div className="blog-tag">{BL[i]}</div>
              <div className="blog-name">{name}</div>
              <div className="blog-vol">vol. {[1000, 700, 700, 600, 350, 250, 200][i]}</div>
              <div className="blog-internal">2× link → oferta</div>
              <div className="blog-kw">🎯 {['atrakcje na wesele', 'ścianka do zdjęć na 18 jak zrobić', 'atrakcje na 18 urodziny na sali', 'pomysły dekoracja stołu komunijnego', 'jak zrobić ściankę z balonów', 'baby shower pomysły', 'gender reveal pomysły'][i]}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Note box */}
      <div className="note-box">
        <div className="note-title">⚠ Zmiany w v2 vs v1</div>
        <div className="note-text">
          Wymieniono wszystkie 7 blogów. Stare (ścianka weselna, napis LOVE, ścianka do zdjęć, dekoracje na chrzest, dekoracja sali weselnej) miały <b style={{ color: '#f87171' }}>transakcyjny SERP</b> — Google pokazuje sklepy, blog by się nie przebił. Stare techniczne (styrodur vs styropian, czym ciąć styrodur) trafiały do budowlańców, nie do klientów dekoracji. Nowe 7 blogów mają zweryfikowany informacyjny SERP i naturalny kontekst na link do liter ze styroduru.
        </div>
      </div>

      {/* Tables */}
      <div className="tables-wrap">
        {/* Keyword ideas */}
        <div className="section-divider">💡 Pomysły na artykuły — 20 fraz z informacyjnym SERP</div>
        <Accordion count={20} countClass="" title="Frazy z Ahrefs — SERP zweryfikowany" defaultOpen countStyle={{ color: '#e879f9' }}>
          <table>
            <thead><tr><th>#</th><th>Fraza docelowa</th><th>Vol.</th><th>SERP</th><th>Link do oferty</th><th>Proponowany tytuł artykułu</th></tr></thead>
            <tbody>
              {keywordIdeas.map((kw, i) => (
                <tr key={i}>
                  <td>{kw.num}</td>
                  <td className="a" style={{ color: '#e879f9' }}>{kw.keyword}</td>
                  <td>{kw.vol}</td>
                  <td><span className="serp-badge info">{kw.serp}</span></td>
                  <td><LinkStr strength={kw.linkStrength} /></td>
                  <td>{kw.title}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Accordion>

        {/* Strong PBN → Oferta */}
        <div className="section-divider">💰 Oferta — /oferta/litery-logo-ze-styroduru/</div>
        <Accordion count={13} countClass="gold" title="Mocne PBN → Oferta (exact + partial)">
          <AnchorTable pool={strongMoney} n={13} color="gold" />
        </Accordion>
        <Accordion count={30} countClass="dim" title="Słabe PBN → Oferta (brand + generic + URL)">
          <AnchorTable pool={weakMoney} n={30} color="dim" />
        </Accordion>

        {/* Blogs */}
        <div className="section-divider">📝 Blogi (A–G)</div>
        <Accordion count={37} countClass="purple" title="Mocne PBN → Blogi (exact + partial)">
          <BlogAnchorTable pools={strongBlogs} counts={blogLinks} color="purple" />
        </Accordion>
        <Accordion count={30} countClass="dim" title="Słabe PBN → Blogi (brand + generic)">
          <BlogAnchorTable pools={weakBlogs} counts={wb} color="dim" />
        </Accordion>

        {/* Internal links */}
        <div className="section-divider">🔗 Linki z blogów do oferty</div>
        <Accordion count={14} countClass="green" title="Blog → Oferta (kontekst linkowania)">
          <InternalTable />
        </Accordion>

        {/* Timeline */}
        <div className="section-divider">📅 Rozłożenie w czasie</div>
        <Accordion count={8} countClass="blue" title="Timeline — miesiące">
          <Timeline />
        </Accordion>

        {/* Prompts placeholder */}
        <div className="section-divider">🤖 Prompty do generowania artykułów</div>
        <Accordion count={7} countClass="" title="Prompty AI — kliknij aby rozwinąć" countStyle={{ color: '#e879f9' }}>
          <p style={{ color: '#3a3a50', fontFamily: "'JetBrains Mono', monospace", fontSize: 11 }}>
            Prompty zostaną dodane później.
          </p>
        </Accordion>
      </div>

      {/* Footer */}
      <div className="footer">
        Docelowy profil oferty: ~10% exact · ~20% partial · ~45% brand/URL · ~25% generic<br />
        Docelowy profil blogów: ~30% exact · ~25% partial · ~15% brand · ~30% generic<br />
        Mocne PBN = exact + partial (siła anchora) · Słabe PBN = brand + generic + URL (rozcieńczenie profilu)<br />
        Tempo: nigdy 2 linki na ten sam URL w tym samym tygodniu · Hover na tytuł bloga → fraza docelowa
      </div>
    </div>
  );
}
