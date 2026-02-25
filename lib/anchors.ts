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

export function generateInternalLinks(
  blog: BlogArticle,
  mainKeyword: string,
): AnchorItem[] {
  const kw = mainKeyword.trim();
  const blogKw = blog.keyword.trim();
  return [
    {
      id: uid(),
      text: `${kw} ${blogKw.split(' ').slice(0, 2).join(' ')}`.trim(),
      type: 'p',
      ctx: `Kontekst w artykule "${blog.title}" — odniesienie do oferty.`,
    },
    {
      id: uid(),
      text: `zamów ${kw}`,
      type: 'g',
      ctx: 'CTA w ramce na końcu akapitu.',
    },
  ];
}
