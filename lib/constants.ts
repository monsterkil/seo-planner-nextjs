import type { LinkProfile, LinkProfileKey } from './types';

export const STRONG_PBN_OPTIONS = [10, 20, 30, 40, 50] as const;

export const STRONG_PRICE = 1.5;
export const WEAK_PRICE = 0.2;

export const LINK_PROFILES: Record<LinkProfileKey, LinkProfile> = {
  aggressive: {
    key: 'aggressive',
    label: 'Agresywny',
    directPercent: 0.40,
    blogsPercent: 0.60,
    weakRatio: 1.0,
  },
  balanced: {
    key: 'balanced',
    label: 'Zbalansowany',
    directPercent: 0.25,
    blogsPercent: 0.75,
    weakRatio: 1.2,
  },
  safe: {
    key: 'safe',
    label: 'Bezpieczny',
    directPercent: 0.15,
    blogsPercent: 0.85,
    weakRatio: 1.5,
  },
};

export const MAX_BLOGS = 7;
export const BLOG_LABELS = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];

export const GENERIC_ANCHORS = [
  'tutaj', 'sprawdź ofertę', 'więcej informacji', 'na tej stronie',
  'kliknij tutaj', 'zobacz ofertę', 'polecam', 'link',
  'szczegóły oferty', 'tutaj znajdziesz', 'sprawdź', 'oferta', 'więcej',
];

export const GENERIC_BLOG_ANCHORS = [
  'w tym artykule', 'czytaj więcej', 'tutaj', 'więcej informacji',
  'czytaj dalej', 'w tym poradniku', 'w tym przewodniku', 'ten poradnik',
];
