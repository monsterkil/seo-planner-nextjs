'use client';

import { useState, useCallback, useEffect } from 'react';
import type { CampaignInput, BlogArticle } from '../types';
import { BLOG_LABELS } from '../constants';
import {
  generateStrongMoneyAnchors,
  generateWeakMoneyAnchors,
  generateStrongBlogAnchors,
  generateWeakBlogAnchors,
  generateInternalLinks,
} from '../anchors';

const STORAGE_KEY = 'seo-planner-campaign';

function createDefaultInput(): CampaignInput {
  return {
    mainKeyword: '',
    volume: 0,
    kd: 0,
    moneyPageUrl: '',
    companyName: '',
    companyUrl: '',
    blogs: [],
    linkProfile: 'balanced',
    strongPbnCount: 30,
    strongMoneyAnchors: [],
    weakMoneyAnchors: [],
    strongBlogAnchors: [],
    weakBlogAnchors: [],
    internalLinks: [],
  };
}

export function useCampaign() {
  const [campaign, setCampaign] = useState<CampaignInput>(createDefaultInput);
  const [hydrated, setHydrated] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setCampaign(JSON.parse(saved));
    } catch { /* ignore */ }
    setHydrated(true);
  }, []);

  // Persist on change (after hydration)
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(campaign));
    } catch { /* quota exceeded */ }
  }, [campaign, hydrated]);

  const updateField = useCallback(<K extends keyof CampaignInput>(
    key: K,
    value: CampaignInput[K],
  ) => {
    setCampaign((prev) => ({ ...prev, [key]: value }));
  }, []);

  const addBlog = useCallback(() => {
    setCampaign((prev) => {
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
  }, []);

  const removeBlog = useCallback((id: string) => {
    setCampaign((prev) => {
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
  }, []);

  const updateBlog = useCallback((id: string, updates: Partial<BlogArticle>) => {
    setCampaign((prev) => ({
      ...prev,
      blogs: prev.blogs.map((b) => (b.id === id ? { ...b, ...updates } : b)),
    }));
  }, []);

  const regenerateAnchors = useCallback(() => {
    setCampaign((prev) => ({
      ...prev,
      strongMoneyAnchors: generateStrongMoneyAnchors(prev.mainKeyword),
      weakMoneyAnchors: generateWeakMoneyAnchors(prev.companyName, prev.companyUrl),
      strongBlogAnchors: prev.blogs.map((b) => generateStrongBlogAnchors(b)),
      weakBlogAnchors: prev.blogs.map(() =>
        generateWeakBlogAnchors(prev.companyName, prev.companyUrl),
      ),
      internalLinks: prev.blogs.map((b) =>
        generateInternalLinks(b, prev.mainKeyword),
      ),
    }));
  }, []);

  const resetCampaign = useCallback(() => {
    setCampaign(createDefaultInput());
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  /** Import campaign data from a JSON string (pasted from Claude). */
  const importData = useCallback((json: string): string | null => {
    try {
      const raw = JSON.parse(json);

      // Build blogs with proper IDs and labels
      const blogs: BlogArticle[] = (raw.blogs || [])
        .slice(0, 7)
        .map((b: { title?: string; keyword?: string; volume?: number }, i: number) => ({
          id: `blog-${Date.now()}-${i}`,
          label: BLOG_LABELS[i],
          title: b.title || '',
          keyword: b.keyword || '',
          volume: b.volume || 0,
        }));

      const mainKeyword = raw.mainKeyword || '';
      const companyName = raw.companyName || '';
      const companyUrl = raw.companyUrl || '';

      const newCampaign: CampaignInput = {
        mainKeyword,
        volume: raw.volume || 0,
        kd: raw.kd || 0,
        moneyPageUrl: raw.moneyPageUrl || '',
        companyName,
        companyUrl,
        blogs,
        linkProfile: raw.linkProfile || 'balanced',
        strongPbnCount: raw.strongPbnCount || 30,
        // Auto-generate anchors from imported data
        strongMoneyAnchors: generateStrongMoneyAnchors(mainKeyword),
        weakMoneyAnchors: generateWeakMoneyAnchors(companyName, companyUrl),
        strongBlogAnchors: blogs.map((b: BlogArticle) => generateStrongBlogAnchors(b)),
        weakBlogAnchors: blogs.map(() => generateWeakBlogAnchors(companyName, companyUrl)),
        internalLinks: blogs.map((b: BlogArticle) => generateInternalLinks(b, mainKeyword)),
      };

      setCampaign(newCampaign);
      return null; // success
    } catch (e) {
      return e instanceof Error ? e.message : 'Nieprawidłowy format JSON';
    }
  }, []);

  return {
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
