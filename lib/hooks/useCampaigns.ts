'use client';

import { useState, useCallback, useEffect } from 'react';
import type {
  CampaignInput,
  BlogArticle,
  LinkProfileKey,
  CampaignRecord,
  CampaignsStore,
  SiteSettings,
} from '../types';
import { BLOG_LABELS, LINK_PROFILES } from '../constants';
import {
  generateStrongMoneyAnchors,
  generateWeakMoneyAnchors,
  generateStrongBlogAnchors,
  generateWeakBlogAnchors,
  parseAnchorsFromJson,
  parseInternalLinksFromJson,
} from '../anchors';

const STORE_KEY = 'seo-planner-campaigns';
const OLD_KEY = 'seo-planner-campaign';

const DEFAULT_SITE: SiteSettings = {
  companyName: '',
  companyUrl: '',
  sitemapUrl: '',
};

function generateId(): string {
  return `cmp_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
}

function createDefaultInput(): CampaignInput {
  return {
    mainKeyword: '',
    volume: 0,
    kd: 0,
    moneyPageUrl: '',
    companyName: '',
    companyUrl: '',
    sitemapUrl: '',
    blogMode: 'cluster',
    linkDistribution: 'equal',
    blogs: [],
    linkProfile: 'balanced',
    strongPbnCount: 30,
    strongMoneyAnchors: [],
    weakMoneyAnchors: [],
    strongBlogAnchors: [],
    weakBlogAnchors: [],
    internalLinks: [],
    blogIdeas: [],
    publishedBlogs: [],
    usedAnchors: [],
  };
}

function createRecord(data?: CampaignInput): CampaignRecord {
  const d = data ?? createDefaultInput();
  return {
    id: generateId(),
    name: d.mainKeyword || 'Nowa kampania',
    createdAt: Date.now(),
    data: d,
  };
}

function createInitialStore(): CampaignsStore {
  const record = createRecord();
  return { version: 1, campaigns: [record], activeCampaignId: record.id, site: { ...DEFAULT_SITE } };
}

/** Migrate old formats + ensure site settings exist. */
function loadWithMigration(): CampaignsStore {
  // Try new format first
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as CampaignsStore;
      if (parsed.version === 1 && parsed.campaigns?.length > 0) {
        // Migrate: pull site settings from first campaign if store doesn't have them
        if (!parsed.site) {
          const first = parsed.campaigns[0]?.data;
          parsed.site = {
            companyName: first?.companyName || '',
            companyUrl: first?.companyUrl || '',
            sitemapUrl: first?.sitemapUrl || '',
          };
        }
        return parsed;
      }
    }
  } catch { /* corrupt data */ }

  // Try old single-campaign format
  try {
    const old = localStorage.getItem(OLD_KEY);
    if (old) {
      const data = { ...createDefaultInput(), ...JSON.parse(old) } as CampaignInput;
      const record = createRecord(data);
      const store: CampaignsStore = {
        version: 1,
        campaigns: [record],
        activeCampaignId: record.id,
        site: {
          companyName: data.companyName || '',
          companyUrl: data.companyUrl || '',
          sitemapUrl: data.sitemapUrl || '',
        },
      };
      localStorage.removeItem(OLD_KEY);
      return store;
    }
  } catch { /* corrupt data */ }

  return createInitialStore();
}

export function useCampaigns() {
  const [store, setStore] = useState<CampaignsStore>(createInitialStore);
  const [hydrated, setHydrated] = useState(false);

  // Load on mount (with migration)
  useEffect(() => {
    setStore(loadWithMigration());
    setHydrated(true);
  }, []);

  // Persist on change
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORE_KEY, JSON.stringify(store));
    } catch { /* quota exceeded */ }
  }, [store, hydrated]);

  // --- Site settings ---
  const site = store.site ?? DEFAULT_SITE;

  const updateSite = useCallback(
    <K extends keyof SiteSettings>(key: K, value: SiteSettings[K]) => {
      setStore((s) => ({ ...s, site: { ...(s.site ?? DEFAULT_SITE), [key]: value } }));
    },
    [],
  );

  // --- Derived ---
  const activeCampaign = store.campaigns.find((c) => c.id === store.activeCampaignId);
  const rawData = activeCampaign?.data ?? createDefaultInput();
  // Merge store-level site settings + ensure arrays exist
  const campaign: CampaignInput = {
    ...rawData,
    companyName: site.companyName,
    companyUrl: site.companyUrl,
    sitemapUrl: site.sitemapUrl,
    internalLinks: rawData.internalLinks ?? rawData.blogs?.map(() => []) ?? [],
    blogIdeas: rawData.blogIdeas ?? [],
    publishedBlogs: rawData.publishedBlogs ?? [],
    usedAnchors: rawData.usedAnchors ?? [],
  };

  // --- Internal primitive ---
  const updateActiveCampaign = useCallback(
    (updater: (prev: CampaignInput) => CampaignInput) => {
      setStore((s) => ({
        ...s,
        campaigns: s.campaigns.map((c) =>
          c.id === s.activeCampaignId ? { ...c, data: updater(c.data) } : c,
        ),
      }));
    },
    [],
  );

  // --- Multi-campaign actions ---
  const addCampaign = useCallback(() => {
    const record = createRecord();
    setStore((s) => ({
      ...s,
      campaigns: [...s.campaigns, record],
      activeCampaignId: record.id,
    }));
  }, []);

  const deleteCampaign = useCallback((id: string) => {
    setStore((s) => {
      const campaigns = s.campaigns.filter((c) => c.id !== id);
      let activeCampaignId = s.activeCampaignId;
      if (activeCampaignId === id) {
        activeCampaignId = campaigns[0]?.id ?? null;
      }
      if (campaigns.length === 0) {
        const blank = createRecord();
        campaigns.push(blank);
        activeCampaignId = blank.id;
      }
      return { ...s, campaigns, activeCampaignId };
    });
  }, []);

  const switchCampaign = useCallback((id: string) => {
    setStore((s) => ({ ...s, activeCampaignId: id }));
  }, []);

  // --- Single-campaign mutators ---
  const updateField = useCallback(
    <K extends keyof CampaignInput>(key: K, value: CampaignInput[K]) => {
      updateActiveCampaign((prev) => ({ ...prev, [key]: value }));
    },
    [updateActiveCampaign],
  );

  const addBlog = useCallback(() => {
    updateActiveCampaign((prev) => {
      if (prev.blogs.length >= 7) return prev;
      const idx = prev.blogs.length;
      const blog: BlogArticle = {
        id: `blog-${Date.now()}`,
        label: BLOG_LABELS[idx],
        title: '',
        keyword: '',
        volume: 0,
      };
      return {
        ...prev,
        blogs: [...prev.blogs, blog],
        strongBlogAnchors: [...prev.strongBlogAnchors, []],
        weakBlogAnchors: [...prev.weakBlogAnchors, []],
        internalLinks: [...prev.internalLinks, []],
      };
    });
  }, [updateActiveCampaign]);

  const removeBlog = useCallback(
    (id: string) => {
      updateActiveCampaign((prev) => {
        const idx = prev.blogs.findIndex((b) => b.id === id);
        if (idx === -1) return prev;
        const blogs = prev.blogs
          .filter((_, i) => i !== idx)
          .map((b, i) => ({ ...b, label: BLOG_LABELS[i] }));
        return {
          ...prev,
          blogs,
          strongBlogAnchors: prev.strongBlogAnchors.filter((_, i) => i !== idx),
          weakBlogAnchors: prev.weakBlogAnchors.filter((_, i) => i !== idx),
          internalLinks: prev.internalLinks.filter((_, i) => i !== idx),
        };
      });
    },
    [updateActiveCampaign],
  );

  const updateBlog = useCallback(
    (id: string, updates: Partial<BlogArticle>) => {
      updateActiveCampaign((prev) => ({
        ...prev,
        blogs: prev.blogs.map((b) => (b.id === id ? { ...b, ...updates } : b)),
      }));
    },
    [updateActiveCampaign],
  );

  const regenerateAnchors = useCallback(() => {
    updateActiveCampaign((prev) => ({
      ...prev,
      strongMoneyAnchors: generateStrongMoneyAnchors(prev.mainKeyword),
      weakMoneyAnchors: generateWeakMoneyAnchors(site.companyName, site.companyUrl),
      strongBlogAnchors: prev.blogs.map((b) => generateStrongBlogAnchors(b)),
      weakBlogAnchors: prev.blogs.map((b) =>
        generateWeakBlogAnchors(b, site.companyName, site.companyUrl),
      ),
    }));
  }, [updateActiveCampaign, site.companyName, site.companyUrl]);

  const resetCampaign = useCallback(() => {
    updateActiveCampaign(() => createDefaultInput());
  }, [updateActiveCampaign]);

  const importData = useCallback(
    (json: string): string | null => {
      try {
        const raw = JSON.parse(json);

        const blogs: BlogArticle[] = (raw.blogs || [])
          .slice(0, 7)
          .map(
            (b: { title?: string; keyword?: string; volume?: number }, i: number) => ({
              id: `blog-${Date.now()}-${i}`,
              label: BLOG_LABELS[i],
              title: b.title || '',
              keyword: b.keyword || '',
              volume: b.volume || 0,
            }),
          );

        const mainKeyword = raw.mainKeyword || '';

        // Update site settings from JSON if provided
        const jsonCompanyName = raw.companyName || '';
        const jsonCompanyUrl = raw.companyUrl || '';
        const jsonSitemapUrl = raw.sitemapUrl || '';
        if (jsonCompanyName || jsonCompanyUrl || jsonSitemapUrl) {
          setStore((s) => ({
            ...s,
            site: {
              companyName: jsonCompanyName || s.site?.companyName || '',
              companyUrl: jsonCompanyUrl || s.site?.companyUrl || '',
              sitemapUrl: jsonSitemapUrl || s.site?.sitemapUrl || '',
            },
          }));
        }

        const companyName = jsonCompanyName || site.companyName;
        const companyUrl = jsonCompanyUrl || site.companyUrl;

        const blogMode =
          raw.blogMode === 'traffic' ? ('traffic' as const) : ('cluster' as const);
        const linkProfile: LinkProfileKey =
          raw.linkProfile && raw.linkProfile in LINK_PROFILES
            ? (raw.linkProfile as LinkProfileKey)
            : 'balanced';

        const aiAnchors = raw.anchors ? parseAnchorsFromJson(raw.anchors) : null;
        const aiInternalLinks = raw.internalLinks
          ? parseInternalLinksFromJson(raw.internalLinks)
          : blogs.map(() => [] as import('../types').AnchorItem[]);

        const newCampaign: CampaignInput = {
          mainKeyword,
          volume: raw.volume || 0,
          kd: raw.kd || 0,
          moneyPageUrl: raw.moneyPageUrl || '',
          companyName,
          companyUrl,
          sitemapUrl: jsonSitemapUrl || site.sitemapUrl,
          blogMode,
          linkDistribution:
            raw.linkDistribution === 'equal'
              ? ('equal' as const)
              : ('proportional' as const),
          blogs,
          linkProfile,
          strongPbnCount: raw.strongPbnCount || 30,
          strongMoneyAnchors: aiAnchors?.strongMoneyAnchors ?? generateStrongMoneyAnchors(mainKeyword),
          weakMoneyAnchors: aiAnchors?.weakMoneyAnchors ?? generateWeakMoneyAnchors(companyName, companyUrl),
          strongBlogAnchors: aiAnchors?.strongBlogAnchors ?? blogs.map((b: BlogArticle) =>
            generateStrongBlogAnchors(b),
          ),
          weakBlogAnchors: aiAnchors?.weakBlogAnchors ?? blogs.map((b: BlogArticle) =>
            generateWeakBlogAnchors(b, companyName, companyUrl),
          ),
          internalLinks: aiInternalLinks,
          publishedBlogs: [],
          usedAnchors: [],
          blogIdeas: Array.isArray(raw.blogIdeas)
            ? raw.blogIdeas.map((b: { title?: string; keyword?: string; volume?: number }) => ({
                title: b.title || '',
                keyword: b.keyword || '',
                volume: b.volume || 0,
              }))
            : [],
        };

        updateActiveCampaign(() => newCampaign);
        return null;
      } catch (e) {
        return e instanceof Error ? e.message : 'Nieprawidłowy format JSON';
      }
    },
    [updateActiveCampaign, site],
  );

  return {
    // Multi-campaign
    campaigns: store.campaigns,
    activeCampaignId: store.activeCampaignId,
    addCampaign,
    deleteCampaign,
    switchCampaign,
    // Site settings
    site,
    updateSite,
    // Single-campaign (same API)
    campaign,
    hydrated,
    updateField,
    addBlog,
    removeBlog,
    updateBlog,
    regenerateAnchors,
    resetCampaign,
    importData,
  };
}
