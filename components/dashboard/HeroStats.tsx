import type { LinkProfileKey } from '@/lib/types';
import { STRONG_PBN_OPTIONS, LINK_PROFILES, STRONG_PRICE, WEAK_PRICE } from '@/lib/constants';

export function HeroStats({
  mainKeyword,
  volume,
  kd,
  strongPbnCount,
  weakTotal,
  monthlyPrice,
  months,
  linkProfile,
  onStrongChange,
  onProfileChange,
}: {
  mainKeyword: string;
  volume: number;
  kd: number;
  strongPbnCount: number;
  weakTotal: number;
  monthlyPrice: number;
  months: number;
  linkProfile: LinkProfileKey;
  onStrongChange: (n: number) => void;
  onProfileChange: (p: LinkProfileKey) => void;
}) {
  return (
    <section className="mb-10">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white">
          <span className="text-amber-400">{mainKeyword || '—'}</span>
          {(volume > 0 || kd > 0) && (
            <span className="ml-2 text-sm font-normal text-slate-500">
              vol. {volume} · KD {kd}
            </span>
          )}
        </h2>
      </div>

      {/* Profile selector */}
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <span className="text-xs font-medium uppercase tracking-wider text-slate-500">
          Profil:
        </span>
        {(Object.keys(LINK_PROFILES) as LinkProfileKey[]).map((key) => {
          const p = LINK_PROFILES[key];
          return (
            <button
              key={key}
              type="button"
              onClick={() => onProfileChange(key)}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${
                linkProfile === key
                  ? 'bg-emerald-500/30 text-emerald-400 ring-1 ring-emerald-500/50'
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-300'
              }`}
              title={`${Math.round(p.directPercent * 100)}% direct / ${Math.round(p.blogsPercent * 100)}% blogi · słabe ${p.weakRatio}x`}
            >
              {p.label}
            </button>
          );
        })}
      </div>

      {/* PBN count selector */}
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <span className="text-xs font-medium uppercase tracking-wider text-slate-500">
          Mocne PBN:
        </span>
        {STRONG_PBN_OPTIONS.map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => onStrongChange(n)}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${
              strongPbnCount === n
                ? 'bg-amber-500/30 text-amber-400 ring-1 ring-amber-500/50'
                : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-300'
            }`}
          >
            {n}
          </button>
        ))}
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-2xl border border-amber-500/20 bg-gradient-to-br from-amber-500/10 to-transparent p-5 shadow-lg">
          <div className="text-2xl font-bold text-amber-400">
            {strongPbnCount}{' '}
            <span className="text-sm font-normal text-slate-500">× {STRONG_PRICE.toFixed(2)} zł</span>
          </div>
          <div className="mt-1 text-xs font-medium uppercase tracking-wider text-slate-500">
            Mocne PBN
          </div>
        </div>
        <div className="rounded-2xl border border-slate-700 bg-slate-900/60 p-5">
          <div className="text-2xl font-bold text-slate-400">
            {weakTotal}{' '}
            <span className="text-sm font-normal text-slate-500">× {WEAK_PRICE.toFixed(2)} zł</span>
          </div>
          <div className="mt-1 text-xs font-medium uppercase tracking-wider text-slate-500">
            Słabe PBN
          </div>
        </div>
        <div className="rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/10 to-transparent p-5">
          <div className="text-2xl font-bold text-emerald-400">
            {monthlyPrice.toFixed(0)}{' '}
            <span className="text-sm font-normal text-slate-500">zł/mies.</span>
          </div>
          <div className="mt-1 text-xs font-medium uppercase tracking-wider text-slate-500">
            Razem / miesiąc
          </div>
        </div>
        <div className="rounded-2xl border border-slate-700 bg-slate-900/60 p-5">
          <div className="text-2xl font-bold text-white">
            {months}{' '}
            <span className="text-sm font-normal text-slate-500">mies.</span>
          </div>
          <div className="mt-1 text-xs font-medium uppercase tracking-wider text-slate-500">
            Czas kampanii
          </div>
        </div>
      </div>
    </section>
  );
}
