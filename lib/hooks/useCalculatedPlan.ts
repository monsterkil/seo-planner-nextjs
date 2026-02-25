import { useMemo } from 'react';
import type { CampaignInput, CalculatedPlan } from '../types';
import { LINK_PROFILES } from '../constants';
import { buildPlan } from '../engine';

export function useCalculatedPlan(campaign: CampaignInput): CalculatedPlan {
  return useMemo(() => {
    const profile = LINK_PROFILES[campaign.linkProfile] || LINK_PROFILES.balanced;

    // In equal distribution mode, zero out volumes so engine splits equally
    const blogs = campaign.linkDistribution === 'equal'
      ? campaign.blogs.map((b) => ({ ...b, volume: 0 }))
      : campaign.blogs;

    return buildPlan(
      campaign.strongPbnCount,
      profile,
      blogs,
      campaign.strongMoneyAnchors,
      campaign.weakMoneyAnchors,
      campaign.strongBlogAnchors,
      campaign.weakBlogAnchors,
    );
  }, [
    campaign.strongPbnCount,
    campaign.linkProfile,
    campaign.linkDistribution,
    campaign.blogs,
    campaign.strongMoneyAnchors,
    campaign.weakMoneyAnchors,
    campaign.strongBlogAnchors,
    campaign.weakBlogAnchors,
  ]);
}
