import type {
  BlogArticle,
  LinkProfile,
  PlanDistribution,
  TimelineRow,
  CalculatedPlan,
  AnchorItem,
} from './types';
import { STRONG_PRICE, WEAK_PRICE } from './constants';

/** Distribute N links among blogs proportionally by volume (largest-remainder). */
export function distributeByVolume(blogs: BlogArticle[], total: number): number[] {
  if (blogs.length === 0 || total === 0) return blogs.map(() => 0);
  const totalVol = blogs.reduce((s, b) => s + b.volume, 0);
  if (totalVol === 0) {
    const base = Math.floor(total / blogs.length);
    const remainder = total - base * blogs.length;
    return blogs.map((_, i) => base + (i < remainder ? 1 : 0));
  }
  const raw = blogs.map((b) => (b.volume / totalVol) * total);
  const floored = raw.map(Math.floor);
  let assigned = floored.reduce((s, v) => s + v, 0);
  const remainders = raw.map((r, i) => ({ i, r: r - floored[i] }));
  remainders.sort((a, b) => b.r - a.r);
  for (let j = 0; assigned < total; j++, assigned++) {
    floored[remainders[j].i]++;
  }
  return floored;
}

export function calculateDistribution(
  strongTotal: number,
  profile: LinkProfile,
  blogs: BlogArticle[],
): PlanDistribution {
  const strongDirect = Math.round(strongTotal * profile.directPercent);
  const strongBlogs = strongTotal - strongDirect;
  const strongToBlogs = distributeByVolume(blogs, strongBlogs);

  const weakTotal = Math.round(strongTotal * profile.weakRatio);
  const weakDirect = Math.round(weakTotal * profile.directPercent);
  const weakBlogs = weakTotal - weakDirect;
  const weakToBlogs = distributeByVolume(blogs, weakBlogs);

  const totalLinks = strongTotal + weakTotal;

  // Max ~4 links per URL per month (1/week). Bottleneck = URL with most links.
  const moneyLinks = strongDirect + weakDirect;
  const blogLinksPerBlog = blogs.map((_, i) => (strongToBlogs[i] || 0) + (weakToBlogs[i] || 0));
  const maxToSingleUrl = Math.max(moneyLinks, ...blogLinksPerBlog, 0);
  const months = Math.max(3, Math.ceil(maxToSingleUrl / 4));

  const monthlyPrice = strongTotal * STRONG_PRICE + weakTotal * WEAK_PRICE;

  return {
    strongDirect,
    strongToBlogs,
    weakDirect,
    weakToBlogs,
    weakTotal,
    totalLinks,
    months,
    monthlyPrice,
  };
}

export function calculateTimeline(
  strongTotal: number,
  weakTotal: number,
  months: number,
): TimelineRow[] {
  const rows: TimelineRow[] = [];
  let cumS = 0;
  let cumW = 0;
  for (let m = 1; m <= months; m++) {
    const s = m === months
      ? strongTotal - cumS
      : Math.round((strongTotal / months) * m) - cumS;
    const w = m === months
      ? weakTotal - cumW
      : Math.round((weakTotal / months) * m) - cumW;
    cumS += s;
    cumW += w;
    rows.push({ month: m, strong: s, weak: w, total: s + w, cumulative: cumS + cumW });
  }
  return rows;
}

/** Slice anchor pool to count, cycling if pool is smaller than count. */
export function sliceAnchors(pool: AnchorItem[], count: number): AnchorItem[] {
  if (count <= 0 || pool.length === 0) return [];
  const result: AnchorItem[] = [];
  for (let i = 0; i < count; i++) {
    result.push(pool[i % pool.length]);
  }
  return result;
}

export function buildPlan(
  strongTotal: number,
  profile: LinkProfile,
  blogs: BlogArticle[],
  strongMoneyAnchors: AnchorItem[],
  weakMoneyAnchors: AnchorItem[],
  strongBlogAnchors: AnchorItem[][],
  weakBlogAnchors: AnchorItem[][],
): CalculatedPlan {
  const distribution = calculateDistribution(strongTotal, profile, blogs);
  const timeline = calculateTimeline(strongTotal, distribution.weakTotal, distribution.months);

  return {
    distribution,
    timeline,
    strongMoneySlice: sliceAnchors(strongMoneyAnchors, distribution.strongDirect),
    weakMoneySlice: sliceAnchors(weakMoneyAnchors, distribution.weakDirect),
    strongBlogSlices: blogs.map((_, i) =>
      sliceAnchors(strongBlogAnchors[i] || [], distribution.strongToBlogs[i]),
    ),
    weakBlogSlices: blogs.map((_, i) =>
      sliceAnchors(weakBlogAnchors[i] || [], distribution.weakToBlogs[i]),
    ),
  };
}
