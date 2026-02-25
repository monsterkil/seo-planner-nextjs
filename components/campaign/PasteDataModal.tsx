'use client';

import { useState } from 'react';
import type { BlogMode } from '@/lib/types';

const ANCHOR_GUIDELINES = `
Wygeneruj też anchory (teksty linków) do kampanii PBN. Typy anchorów:
- exact: dokładna fraza kluczowa (np. "litery świetlne") — 7× dla oferty, 4× per blog
- partial: fraza w naturalnym kontekście (np. "profesjonalne litery świetlne") — 6× dla oferty, 4× per blog
- brand: nazwa firmy lub URL w różnych odmianach (np. "Folplex", "folplex.pl") — 10× dla oferty, 6× per blog
- generic: ogólne CTA (np. "sprawdź ofertę", "tutaj", "więcej informacji") — 10× dla oferty, 6× per blog
Każdy anchor unikalny i naturalnie brzmiący. Exact mogą się powtarzać.

Dla każdego bloga wygeneruj 2 linki wewnętrzne do money page:
- 1 kontekstowy (partial/exact match) — naturalnie wpleciony w treść artykułu
- 1 CTA (generic) — w ramce, podsumowaniu lub sidebar
Podaj anchor text, typ i kontekst umieszczenia w artykule.
WAŻNE: Anchor musi uzupełniać treść artykułu, nie powtarzać jej. Np. w artykule o cenach NIE linkuj "sprawdź cennik" — zamiast tego "zamów wycenę" lub "zobacz realizacje".
ZAKAZ: NIE wymyślaj konkretnych faktów o firmie (nazwy dostawców, lata gwarancji, certyfikaty, zakres usług dodatkowych). Używaj TYLKO ogólnych sformułowań: "sprawdź ofertę", "zamów wycenę", "zobacz realizacje", "skontaktuj się". Kontekst (ctx) też musi być ogólny — NIE pisz "sekcja o modułach Samsung" ani "ramka o 5-letniej gwarancji".`;

const ANCHOR_JSON_FORMAT = `
  "anchors": {
    "offer": {
      "exact": ["fraza główna", "fraza główna", "fraza główna", "fraza główna", "fraza główna", "fraza główna", "fraza główna"],
      "partial": ["profesjonalne X", "X na zamówienie", "X cena", "producent X", "zamów X", "X Warszawa"],
      "brand": ["Firma", "domena.pl", "https://domena.pl", "oferta Firma", "na stronie domena.pl", "firma Firma", "Firma oferta", "strona Firma", "domena.pl", "Firma"],
      "generic": ["tutaj", "sprawdź ofertę", "więcej informacji", "na tej stronie", "kliknij tutaj", "zobacz ofertę", "polecam", "link", "szczegóły oferty", "sprawdź"]
    },
    "blogs": [
      {
        "exact": ["fraza bloga", "fraza bloga", "fraza bloga", "fraza bloga"],
        "partial": ["wariant frazy bloga 1", "wariant frazy bloga 2", "wariant frazy bloga 3", "wariant frazy bloga 4"],
        "brand": ["na blogu Firma", "artykuł na domena.pl", "Firma blog", "na blogu domena.pl", "blog domena.pl", "Firma"],
        "generic": ["w tym artykule", "czytaj więcej", "tutaj", "więcej informacji", "czytaj dalej", "w tym poradniku"]
      }
    ]
  }`;

function buildPromptTraffic(sitemapUrl: string): string {
  const antiCannibal = sitemapUrl.trim()
    ? `\n\nWAŻNE: Artykuły blogowe NIE MOGĄ kanibalizować istniejących stron ofertowych. Sprawdź sitemap oferty: ${sitemapUrl.trim()} — jeśli fraza pasuje do już istniejącej strony ofertowej, NIE proponuj jej jako blog. Blogi mają być informacyjne/poradnikowe, nie ofertowe.\n`
    : '';

  return `Sprawdź w Ahrefs frazy związane z [WPISZ TEMAT]. Znajdź 5-7 fraz informacyjnych z ruchem (KD 0-5), na które warto pisać blogi wspierające money page. Dla każdej frazy sprawdź SERP — wybieraj te, gdzie rankują poradniki/blogi, nie strony ofertowe. Podaj tytuły artykułów klikalne i zoptymalizowane pod SEO.${antiCannibal}
${ANCHOR_GUIDELINES}

Zwróć wynik TYLKO jako JSON (bez komentarzy) w tym formacie:
{
  "mainKeyword": "fraza główna money page",
  "volume": 200,
  "kd": 1,
  "moneyPageUrl": "/oferta/...",
  "companyName": "Nazwa firmy",
  "companyUrl": "domena.pl",
  "strongPbnCount": 50,
  "linkProfile": "balanced",
  "blogMode": "traffic",
  "blogs": [
    {"title": "Tytuł artykułu SEO", "keyword": "fraza docelowa", "volume": 400},
    {"title": "...", "keyword": "...", "volume": 300}
  ],
${ANCHOR_JSON_FORMAT},
  "internalLinks": [
    [
      {"text": "anchor kontekstowy", "type": "p", "ctx": "Gdzie w artykule umieścić link."},
      {"text": "anchor CTA", "type": "g", "ctx": "Kontekst CTA w artykule."}
    ]
  ]
}`;
}

function buildPromptCluster(sitemapUrl: string): string {
  const antiCannibal = sitemapUrl.trim()
    ? `\n\nWAŻNE: Artykuły blogowe NIE MOGĄ kanibalizować istniejących stron ofertowych. Sprawdź sitemap oferty: ${sitemapUrl.trim()} — jeśli fraza pasuje do już istniejącej strony ofertowej, NIE proponuj jej jako blog. Blogi mają budować topical authority, nie konkurować z ofertą.\n`
    : '';

  return `Sprawdź w Ahrefs frazy związane z [WPISZ TEMAT]. Znajdź 5-7 fraz tematycznie powiązanych z money page, które budują topical authority wokół głównej frazy. To mogą być frazy o niskim lub zerowym ruchu — liczy się tematyczne wzmocnienie, nie traffic. Podaj tytuły artykułów klikalne i zoptymalizowane pod SEO.${antiCannibal}
${ANCHOR_GUIDELINES}

Zwróć wynik TYLKO jako JSON (bez komentarzy) w tym formacie:
{
  "mainKeyword": "fraza główna money page",
  "volume": 200,
  "kd": 1,
  "moneyPageUrl": "/oferta/...",
  "companyName": "Nazwa firmy",
  "companyUrl": "domena.pl",
  "strongPbnCount": 50,
  "linkProfile": "balanced",
  "blogMode": "cluster",
  "blogs": [
    {"title": "Tytuł artykułu SEO", "keyword": "fraza docelowa"},
    {"title": "...", "keyword": "..."}
  ],
${ANCHOR_JSON_FORMAT},
  "internalLinks": [
    [
      {"text": "anchor kontekstowy", "type": "p", "ctx": "Gdzie w artykule umieścić link."},
      {"text": "anchor CTA", "type": "g", "ctx": "Kontekst CTA w artykule."}
    ]
  ]
}`;
}

const EXAMPLE_TRAFFIC = `{
  "mainKeyword": "oklejanie witryn Warszawa",
  "volume": 200,
  "kd": 1,
  "moneyPageUrl": "/oferta/oklejanie-witryn/",
  "companyName": "Folplex",
  "companyUrl": "folplex.pl",
  "strongPbnCount": 50,
  "linkProfile": "balanced",
  "blogMode": "traffic",
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
  ],
  "anchors": {
    "offer": {
      "exact": ["oklejanie witryn Warszawa", "oklejanie witryn Warszawa", "oklejanie witryn Warszawa", "oklejanie witryn Warszawa", "oklejanie witryn Warszawa", "oklejanie witryn Warszawa", "oklejanie witryn Warszawa"],
      "partial": ["profesjonalne oklejanie witryn", "oklejanie witryn sklepowych", "oklejanie szyb folią Warszawa", "folie na witryny sklepowe", "zamów oklejanie witryn", "oklejanie witryn cena"],
      "brand": ["Folplex", "folplex.pl", "https://folplex.pl", "oferta Folplex", "na stronie folplex.pl", "firma Folplex", "Folplex reklama", "realizacje Folplex", "folplex.pl", "Folplex"],
      "generic": ["tutaj", "sprawdź ofertę", "więcej informacji", "na tej stronie", "kliknij tutaj", "zobacz ofertę", "polecam", "link", "szczegóły oferty", "sprawdź"]
    },
    "blogs": [
      {
        "exact": ["naklejanie folii na szybę na mokro", "naklejanie folii na szybę na mokro", "naklejanie folii na szybę na mokro", "naklejanie folii na szybę na mokro"],
        "partial": ["jak nakleić folię na szybę", "naklejanie folii na mokro instrukcja", "montaż folii na szybie", "folia na szybę krok po kroku"],
        "brand": ["na blogu Folplex", "artykuł na folplex.pl", "Folplex blog", "na blogu folplex.pl", "blog folplex.pl", "Folplex"],
        "generic": ["w tym artykule", "czytaj więcej", "tutaj", "więcej informacji", "czytaj dalej", "w tym poradniku"]
      },
      {
        "exact": ["folia one way vision", "folia one way vision", "folia one way vision", "folia one way vision"],
        "partial": ["folia OWV na witryny", "co to jest folia one way vision", "folia perforowana na szyby", "folia one way vision cena"],
        "brand": ["na blogu Folplex", "artykuł na folplex.pl", "Folplex blog", "na blogu folplex.pl", "blog folplex.pl", "Folplex"],
        "generic": ["w tym artykule", "czytaj więcej", "tutaj", "więcej informacji", "czytaj dalej", "w tym poradniku"]
      }
    ]
  },
  "internalLinks": [
    [
      {"text": "oklejanie witryn sklepowych", "type": "p", "ctx": "W akapicie o technice mokrego naklejania — odniesienie do profesjonalnej usługi."},
      {"text": "sprawdź ofertę oklejania", "type": "g", "ctx": "CTA box pod sekcją z instrukcją."}
    ],
    [
      {"text": "oklejanie witryn folią OWV", "type": "p", "ctx": "Przy opisie zastosowań folii one way vision — link do realizacji."},
      {"text": "zapytaj o wycenę", "type": "g", "ctx": "CTA w podsumowaniu artykułu."}
    ]
  ]
}`;

const EXAMPLE_CLUSTER = `{
  "mainKeyword": "oklejanie witryn Warszawa",
  "volume": 200,
  "kd": 1,
  "moneyPageUrl": "/oferta/oklejanie-witryn/",
  "companyName": "Folplex",
  "companyUrl": "folplex.pl",
  "strongPbnCount": 50,
  "linkProfile": "balanced",
  "blogMode": "cluster",
  "blogs": [
    {
      "title": "Rodzaje folii do oklejania witryn sklepowych — porównanie",
      "keyword": "rodzaje folii na witryny"
    },
    {
      "title": "Oklejanie witryn a przepisy — czy potrzeba pozwolenia?",
      "keyword": "oklejanie witryn przepisy"
    }
  ],
  "anchors": {
    "offer": {
      "exact": ["oklejanie witryn Warszawa", "oklejanie witryn Warszawa", "oklejanie witryn Warszawa", "oklejanie witryn Warszawa", "oklejanie witryn Warszawa", "oklejanie witryn Warszawa", "oklejanie witryn Warszawa"],
      "partial": ["profesjonalne oklejanie witryn", "oklejanie witryn sklepowych", "oklejanie szyb folią Warszawa", "folie na witryny sklepowe", "zamów oklejanie witryn", "oklejanie witryn cena"],
      "brand": ["Folplex", "folplex.pl", "https://folplex.pl", "oferta Folplex", "na stronie folplex.pl", "firma Folplex", "Folplex reklama", "realizacje Folplex", "folplex.pl", "Folplex"],
      "generic": ["tutaj", "sprawdź ofertę", "więcej informacji", "na tej stronie", "kliknij tutaj", "zobacz ofertę", "polecam", "link", "szczegóły oferty", "sprawdź"]
    },
    "blogs": [
      {
        "exact": ["rodzaje folii na witryny", "rodzaje folii na witryny", "rodzaje folii na witryny", "rodzaje folii na witryny"],
        "partial": ["porównanie folii na witryny", "jaką folię wybrać na witrynę", "rodzaje folii okiennych", "folia na witrynę sklepową"],
        "brand": ["na blogu Folplex", "artykuł na folplex.pl", "Folplex blog", "na blogu folplex.pl", "blog folplex.pl", "Folplex"],
        "generic": ["w tym artykule", "czytaj więcej", "tutaj", "więcej informacji", "czytaj dalej", "w tym poradniku"]
      },
      {
        "exact": ["oklejanie witryn przepisy", "oklejanie witryn przepisy", "oklejanie witryn przepisy", "oklejanie witryn przepisy"],
        "partial": ["przepisy dotyczące oklejania witryn", "pozwolenie na oklejenie witryny", "oklejanie witryn a prawo", "formalności przy oklejaniu witryn"],
        "brand": ["na blogu Folplex", "artykuł na folplex.pl", "Folplex blog", "na blogu folplex.pl", "blog folplex.pl", "Folplex"],
        "generic": ["w tym artykule", "czytaj więcej", "tutaj", "więcej informacji", "czytaj dalej", "w tym poradniku"]
      }
    ]
  },
  "internalLinks": [
    [
      {"text": "rodzaje folii do oklejania witryn", "type": "p", "ctx": "W akapicie porównawczym — odniesienie do oferty oklejania."},
      {"text": "sprawdź ofertę", "type": "g", "ctx": "CTA w podsumowaniu artykułu."}
    ],
    [
      {"text": "oklejanie witryn Warszawa", "type": "e", "ctx": "Przy omawianiu formalności — link do strony z realizacjami."},
      {"text": "zapytaj o wycenę", "type": "g", "ctx": "CTA box pod sekcją o przepisach."}
    ]
  ]
}`;

export function PasteDataModal({
  open,
  onClose,
  onImport,
  blogMode,
  mainKeyword,
  sitemapUrl,
}: {
  open: boolean;
  onClose: () => void;
  onImport: (json: string) => string | null;
  blogMode: BlogMode;
  mainKeyword: string;
  sitemapUrl: string;
}) {
  const [value, setValue] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [tab, setTab] = useState<'prompt' | 'paste'>('prompt');

  if (!open) return null;

  const rawPrompt = blogMode === 'cluster' ? buildPromptCluster(sitemapUrl) : buildPromptTraffic(sitemapUrl);
  const promptTemplate = mainKeyword.trim()
    ? rawPrompt.replace('[WPISZ TEMAT]', mainKeyword.trim())
    : rawPrompt;
  const exampleJson = blogMode === 'cluster' ? EXAMPLE_CLUSTER : EXAMPLE_TRAFFIC;

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
    setValue(exampleJson);
    setError(null);
    setTab('paste');
  };

  const handleCopyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(promptTemplate);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
      const ta = document.createElement('textarea');
      ta.value = promptTemplate;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="mx-4 w-full max-w-2xl rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4">
          <h3 className="text-lg font-bold text-white">
            Wstaw dane
            <span className="ml-2 text-sm font-normal text-slate-500">
              ({blogMode === 'cluster' ? 'cluster' : 'traffic'})
            </span>
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-800 hover:text-white"
          >
            ✕
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-800">
          <button
            type="button"
            onClick={() => setTab('prompt')}
            className={`flex-1 px-6 py-3 text-sm font-medium transition ${
              tab === 'prompt'
                ? 'border-b-2 border-sky-400 text-sky-400'
                : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            1. Prompt do Claude
          </button>
          <button
            type="button"
            onClick={() => setTab('paste')}
            className={`flex-1 px-6 py-3 text-sm font-medium transition ${
              tab === 'paste'
                ? 'border-b-2 border-amber-400 text-amber-400'
                : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            2. Wklej JSON
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-4">
          {tab === 'prompt' ? (
            <>
              <p className="mb-3 text-sm text-slate-400">
                {blogMode === 'cluster'
                  ? 'Prompt pod blogi klastrowe (topical authority).'
                  : 'Prompt pod blogi z ruchem (informacyjne).'}
                {mainKeyword.trim()
                  ? ` Fraza "${mainKeyword.trim()}" już wstawiona.`
                  : ' Zamień [WPISZ TEMAT] na swój temat.'}
              </p>
              <div className="relative">
                <pre className="h-64 overflow-auto rounded-xl border border-slate-700 bg-slate-950 p-4 text-sm leading-relaxed text-slate-300 whitespace-pre-wrap">
                  {promptTemplate}
                </pre>
                <button
                  type="button"
                  onClick={handleCopyPrompt}
                  className={`absolute right-3 top-3 rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                    copied
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-300'
                  }`}
                >
                  {copied ? 'Skopiowano!' : 'Kopiuj'}
                </button>
              </div>
              <p className="mt-3 text-xs text-slate-500">
                Po otrzymaniu JSONa od Claude, przejdź do zakładki &quot;2. Wklej JSON&quot;.
              </p>
            </>
          ) : (
            <>
              <p className="mb-3 text-sm text-slate-400">
                Wklej JSON z danymi kampanii (odpowiedź Claude z Ahrefs).
                Anchory z JSONa zostaną zaimportowane.
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
                  {exampleJson}
                </pre>
              </details>
            </>
          )}
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
            {tab === 'prompt' ? (
              <button
                type="button"
                onClick={() => setTab('paste')}
                className="rounded-lg bg-sky-500/20 px-4 py-2 text-sm font-medium text-sky-400 transition hover:bg-sky-500/30"
              >
                Dalej →
              </button>
            ) : (
              <button
                type="button"
                onClick={handleImport}
                disabled={!value.trim()}
                className="rounded-lg bg-amber-500/20 px-4 py-2 text-sm font-medium text-amber-400 transition hover:bg-amber-500/30 disabled:opacity-40"
              >
                Importuj
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
