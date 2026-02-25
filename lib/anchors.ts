import type { AnchorItem, AnchorType, BlogArticle } from './types';
import { GENERIC_ANCHORS, GENERIC_BLOG_ANCHORS } from './constants';

let _counter = 0;
function uid(): string {
  return `a-${++_counter}-${Date.now().toString(36)}`;
}

function toItems(texts: string[], type: AnchorType): AnchorItem[] {
  return texts.map((t) => ({ id: uid(), text: t, type }));
}

function interleave(a: AnchorItem[], b: AnchorItem[]): AnchorItem[] {
  const result: AnchorItem[] = [];
  const max = Math.max(a.length, b.length);
  for (let i = 0; i < max; i++) {
    if (i < a.length) result.push(a[i]);
    if (i < b.length) result.push(b[i]);
  }
  return result;
}

interface AnchorGroup {
  exact?: string[];
  partial?: string[];
  brand?: string[];
  generic?: string[];
}

/**
 * Parse AI-generated anchors from imported JSON.
 * Returns null if no anchors present — caller falls back to generators.
 */
export function parseAnchorsFromJson(raw: {
  offer?: AnchorGroup;
  blogs?: AnchorGroup[];
}): {
  strongMoneyAnchors: AnchorItem[];
  weakMoneyAnchors: AnchorItem[];
  strongBlogAnchors: AnchorItem[][];
  weakBlogAnchors: AnchorItem[][];
} | null {
  if (!raw?.offer && !raw?.blogs) return null;

  const o = raw.offer || {};
  const strongMoneyAnchors = interleave(
    toItems(o.exact || [], 'e'),
    toItems(o.partial || [], 'p'),
  );
  const weakMoneyAnchors = interleave(
    toItems(o.brand || [], 'b'),
    toItems(o.generic || [], 'g'),
  );

  const blogGroups = Array.isArray(raw.blogs) ? raw.blogs : [];
  const strongBlogAnchors = blogGroups.map((bg: AnchorGroup) =>
    interleave(toItems(bg.exact || [], 'e'), toItems(bg.partial || [], 'p')),
  );
  const weakBlogAnchors = blogGroups.map((bg: AnchorGroup) =>
    interleave(toItems(bg.brand || [], 'b'), toItems(bg.generic || [], 'g')),
  );

  return { strongMoneyAnchors, weakMoneyAnchors, strongBlogAnchors, weakBlogAnchors };
}

/** Parse internal links (blog → offer) from JSON. Handles non-array gracefully. */
export function parseInternalLinksFromJson(
  raw: unknown,
): AnchorItem[][] {
  if (!Array.isArray(raw)) return [];
  return raw.map((blogLinks: unknown) => {
    if (!Array.isArray(blogLinks)) return [];
    return blogLinks.map((l: { text?: string; type?: string; ctx?: string }) => ({
      id: uid(),
      text: l?.text || '',
      type: (l?.type as AnchorType) || 'p',
      ctx: l?.ctx,
    }));
  });
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

