export type AnchorType = 'e' | 'p' | 'b' | 'g';

export interface AnchorItem {
  id: string;
  text: string;
  type: AnchorType;
  ctx?: string;
}

export interface GroupedAnchor {
  text: string;
  type: AnchorType;
  count: number;
}

export interface BlogArticle {
  id: string;
  label: string;
  title: string;
  keyword: string;
  volume: number;
}

export interface BlogIdea {
  title: string;
  keyword: string;
  volume: number;
}

export type BlogMode = 'traffic' | 'cluster';
export type LinkDistribution = 'proportional' | 'equal';

export type LinkProfileKey = 'aggressive' | 'balanced' | 'safe';

export interface LinkProfile {
  key: LinkProfileKey;
  label: string;
  directPercent: number;
  blogsPercent: number;
  weakRatio: number;
}

export interface CampaignInput {
  mainKeyword: string;
  volume: number;
  kd: number;
  moneyPageUrl: string;
  companyName: string;
  companyUrl: string;
  sitemapUrl: string;
  blogMode: BlogMode;
  linkDistribution: LinkDistribution;
  blogs: BlogArticle[];
  linkProfile: LinkProfileKey;
  strongPbnCount: number;
  strongMoneyAnchors: AnchorItem[];
  weakMoneyAnchors: AnchorItem[];
  strongBlogAnchors: AnchorItem[][];
  weakBlogAnchors: AnchorItem[][];
  internalLinks: AnchorItem[][];
  blogIdeas: BlogIdea[];
}

export interface PlanDistribution {
  strongDirect: number;
  strongToBlogs: number[];
  weakDirect: number;
  weakToBlogs: number[];
  weakTotal: number;
  totalLinks: number;
  months: number;
  monthlyPrice: number;
}

export interface TimelineRow {
  month: number;
  strong: number;
  weak: number;
  total: number;
  cumulative: number;
}

export interface CalculatedPlan {
  distribution: PlanDistribution;
  timeline: TimelineRow[];
  strongMoneySlice: AnchorItem[];
  weakMoneySlice: AnchorItem[];
  strongBlogSlices: AnchorItem[][];
  weakBlogSlices: AnchorItem[][];
}

export interface CampaignRecord {
  id: string;
  name: string;
  createdAt: number;
  data: CampaignInput;
}

export interface CampaignsStore {
  version: 1;
  campaigns: CampaignRecord[];
  activeCampaignId: string | null;
}
