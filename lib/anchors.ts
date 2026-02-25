import type { AnchorItem, BlogArticle } from './types';
import { GENERIC_ANCHORS, GENERIC_BLOG_ANCHORS } from './constants';

let _counter = 0;
function uid(): string {
  return `a-${++_counter}-${Date.now().toString(36)}`;
}

export function generateStrongMoneyAnchors(mainKeyword: string): AnchorItem[] {
  const kw = mainKeyword.trim();
  if (!kw) return [];

  const partials = [
    `profesjonalne ${kw}`,
    `${kw} na zamówienie`,
    `${kw} cena`,
    `producent ${kw}`,
    `zamów ${kw}`,
    `${kw} Warszawa`,
  ];

  const pool: AnchorItem[] = [];
  for (let i = 0; i < 7; i++) {
    pool.push({ id: uid(), text: kw, type: 'e' });
    if (i < partials.length) {
      pool.push({ id: uid(), text: partials[i], type: 'p' });
    }
  }
  return pool;
}

export function generateWeakMoneyAnchors(
  companyName: string,
  companyUrl: string,
): AnchorItem[] {
  const name = companyName.trim();
  const url = companyUrl.trim().replace(/^https?:\/\//, '');
  if (!name && !url) return [];

  const brands = [
    name, url, `https://${url}`, `oferta ${name}`,
    `na stronie ${url}`, `firma ${name}`, `${name} oferta`,
    `strona ${name}`, url, name,
  ].filter(Boolean);

  const pool: AnchorItem[] = [];
  const generics = [...GENERIC_ANCHORS];
  const maxLen = Math.max(brands.length, generics.length);
  for (let i = 0; i < maxLen; i++) {
    if (i < brands.length) pool.push({ id: uid(), text: brands[i], type: 'b' });
    if (i < generics.length) pool.push({ id: uid(), text: generics[i], type: 'g' });
  }
  return pool;
}

export function generateStrongBlogAnchors(blog: BlogArticle): AnchorItem[] {
  const kw = blog.keyword.trim();
  if (!kw) return [];

  const partials = [
    `${kw} poradnik`,
    `jak ${kw}`,
    `${kw} pomysły`,
    `${kw} ${new Date().getFullYear()}`,
  ];

  const pool: AnchorItem[] = [];
  for (let i = 0; i < 4; i++) {
    pool.push({ id: uid(), text: kw, type: 'e' });
    if (i < partials.length) {
      pool.push({ id: uid(), text: partials[i], type: 'p' });
    }
  }
  return pool;
}

export function generateWeakBlogAnchors(
  companyName: string,
  companyUrl: string,
): AnchorItem[] {
  const name = companyName.trim();
  const url = companyUrl.trim().replace(/^https?:\/\//, '');

  const brands = [
    `na blogu ${name}`, `artykuł na ${url}`, `${name} blog`,
    `na blogu ${url}`, `blog ${url}`, name,
  ].filter(Boolean);

  const pool: AnchorItem[] = [];
  const generics = [...GENERIC_BLOG_ANCHORS];
  const maxLen = Math.max(brands.length, generics.length);
  for (let i = 0; i < maxLen; i++) {
    if (i < brands.length) pool.push({ id: uid(), text: brands[i], type: 'b' });
    if (i < generics.length) pool.push({ id: uid(), text: generics[i], type: 'g' });
  }
  return pool;
}

const CONTEXTUAL_PATTERNS = [
  (kw: string) => `${kw} na zamówienie`,
  (kw: string) => `producent ${kw}`,
  (kw: string) => `profesjonalne ${kw}`,
  (kw: string) => `oferta ${kw}`,
  (kw: string) => `${kw} od producenta`,
  (kw: string) => `sprawdź ${kw}`,
  (kw: string) => `${kw} — realizacja`,
];

const CTA_PATTERNS = [
  (kw: string) => `zamów ${kw}`,
  () => 'sprawdź ofertę',
  () => 'sprawdź cennik',
  (kw: string) => `zobacz ofertę ${kw}`,
  () => 'zapytaj o wycenę',
  () => 'dobierz rozwiązanie',
  () => 'porównaj i zamów',
];

const CTX_PATTERNS = [
  (title: string) => `Naturalnie w treści artykułu "${title}" — odniesienie do oferty.`,
  (title: string) => `Akapit porównawczy w "${title}" z linkiem do oferty.`,
  (title: string) => `W podsumowaniu artykułu "${title}".`,
  (title: string) => `Ramka „Przeczytaj też" w "${title}".`,
  (title: string) => `Kontekst w "${title}" — przy omawianiu realizacji.`,
  (title: string) => `W sekcji FAQ artykułu "${title}".`,
  (title: string) => `W akapicie o wyborze dostawcy w "${title}".`,
];

const CTA_CTX_PATTERNS = [
  'CTA w ramce na końcu akapitu.',
  'CTA box pod pierwszą sekcją artykułu.',
  'Banner CTA po podsumowaniu.',
  'Wyróżniony link w sekcji „Co dalej?".',
  'Przycisk CTA w sidebar artykułu.',
  'Link w ramce „Potrzebujesz wyceny?".',
  'CTA w podsumowaniu artykułu.',
];

export function generateInternalLinks(
  blog: BlogArticle,
  mainKeyword: string,
  index: number = 0,
): AnchorItem[] {
  const kw = mainKeyword.trim();
  const ctxIdx = index % CONTEXTUAL_PATTERNS.length;
  const ctaIdx = index % CTA_PATTERNS.length;

  return [
    {
      id: uid(),
      text: CONTEXTUAL_PATTERNS[ctxIdx](kw),
      type: 'p',
      ctx: CTX_PATTERNS[index % CTX_PATTERNS.length](blog.title || blog.keyword),
    },
    {
      id: uid(),
      text: CTA_PATTERNS[ctaIdx](kw),
      type: 'g',
      ctx: CTA_CTX_PATTERNS[index % CTA_CTX_PATTERNS.length],
    },
  ];
}
