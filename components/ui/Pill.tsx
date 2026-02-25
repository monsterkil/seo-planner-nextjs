import type { AnchorType } from '@/lib/types';

const styles: Record<AnchorType, string> = {
  e: 'bg-rose-500/20 text-rose-400 border border-rose-500/30',
  p: 'bg-blue-500/20 text-blue-400 border border-blue-500/30',
  b: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30',
  g: 'bg-slate-500/20 text-slate-400 border border-slate-500/30',
};

const labels: Record<AnchorType, string> = {
  e: 'exact',
  p: 'partial',
  b: 'brand',
  g: 'generic',
};

export function Pill({ type }: { type: AnchorType }) {
  return (
    <span
      className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ${styles[type]}`}
    >
      {labels[type]}
    </span>
  );
}
