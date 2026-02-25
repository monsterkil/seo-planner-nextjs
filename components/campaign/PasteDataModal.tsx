'use client';

import { useState } from 'react';

const EXAMPLE_JSON = `{
  "mainKeyword": "oklejanie witryn Warszawa",
  "volume": 200,
  "kd": 1,
  "moneyPageUrl": "/oferta/oklejanie-witryn/",
  "companyName": "Folplex",
  "companyUrl": "folplex.pl",
  "strongPbnCount": 50,
  "linkProfile": "balanced",
  "blogs": [
    {
      "title": "Jak nakleić folię na szybę na mokro — instrukcja krok po kroku",
      "keyword": "naklejanie folii na szybę na mokro",
      "volume": 400
    },
    {
      "title": "Folia One Way Vision (OWV) — co to jest, jak działa i ile kosztuje",
      "keyword": "folia one way vision",
      "volume": 600
    }
  ]
}`;

export function PasteDataModal({
  open,
  onClose,
  onImport,
}: {
  open: boolean;
  onClose: () => void;
  onImport: (json: string) => string | null;
}) {
  const [value, setValue] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (!open) return null;

  const handleImport = () => {
    const err = onImport(value);
    if (err) {
      setError(err);
    } else {
      setValue('');
      setError(null);
      onClose();
    }
  };

  const handleLoadExample = () => {
    setValue(EXAMPLE_JSON);
    setError(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="mx-4 w-full max-w-2xl rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4">
          <h3 className="text-lg font-bold text-white">Wstaw dane</h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-800 hover:text-white"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-4">
          <p className="mb-3 text-sm text-slate-400">
            Wklej JSON z danymi kampanii (np. wygenerowany przez Claude z Ahrefs).
            Anchory zostaną wygenerowane automatycznie.
          </p>

          <textarea
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              setError(null);
            }}
            placeholder='{"mainKeyword": "...", "blogs": [...]}'
            className="h-64 w-full resize-none rounded-xl border border-slate-700 bg-slate-950 p-4 font-mono text-sm text-slate-200 placeholder:text-slate-600 focus:border-amber-500 focus:outline-none"
            spellCheck={false}
          />

          {error && (
            <div className="mt-2 rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-400">
              {error}
            </div>
          )}

          {/* Format hint */}
          <details className="mt-3">
            <summary className="cursor-pointer text-xs text-slate-500 hover:text-slate-400">
              Format JSON — pokaż przykład
            </summary>
            <pre className="mt-2 max-h-48 overflow-auto rounded-lg bg-slate-950 p-3 text-xs text-slate-400">
              {EXAMPLE_JSON}
            </pre>
          </details>
        </div>

        {/* Footer */}
        <div className="flex justify-between border-t border-slate-800 px-6 py-4">
          <button
            type="button"
            onClick={handleLoadExample}
            className="rounded-lg bg-slate-800 px-4 py-2 text-sm font-medium text-slate-400 transition hover:bg-slate-700 hover:text-slate-300"
          >
            Załaduj przykład
          </button>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg bg-slate-800 px-4 py-2 text-sm font-medium text-slate-400 transition hover:bg-slate-700"
            >
              Anuluj
            </button>
            <button
              type="button"
              onClick={handleImport}
              disabled={!value.trim()}
              className="rounded-lg bg-amber-500/20 px-4 py-2 text-sm font-medium text-amber-400 transition hover:bg-amber-500/30 disabled:opacity-40"
            >
              Importuj
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
