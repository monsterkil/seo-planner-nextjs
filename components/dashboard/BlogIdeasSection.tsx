import type { BlogIdea } from '@/lib/types';
import { Accordion } from '@/components/ui/Accordion';

export function BlogIdeasSection({ ideas }: { ideas: BlogIdea[] }) {
  if (ideas.length === 0) return null;

  return (
    <div>
      <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-white">
        Zapas tematów blogowych
      </h3>
      <Accordion
        count={ideas.length}
        countColor="bg-violet-500/20 text-violet-400"
        title="Tematy na przyszłość"
      >
        <div className="space-y-2">
          {ideas.map((idea, i) => (
            <div key={i} className="flex items-baseline gap-3 text-xs">
              <span className="shrink-0 w-5 text-right font-mono text-slate-600">
                {i + 1}.
              </span>
              <div className="min-w-0">
                <span className="text-slate-300">{idea.title}</span>
                <span className="ml-2 text-slate-500">
                  [{idea.keyword}]
                  {idea.volume > 0 && ` · vol. ${idea.volume}`}
                </span>
              </div>
            </div>
          ))}
        </div>
      </Accordion>
    </div>
  );
}
