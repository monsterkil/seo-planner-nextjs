import { useMemo } from 'react';
import type { CampaignInput, CalculatedPlan } from '../types';
import { LINK_PROFILES } from '../constants';
import { buildPlan } from '../engine';

export function useCalculatedPlan(campaign: CampaignInput): CalculatedPlan {
  return useMemo(() => {
    const profile = LINK_PROFILES[campaign.linkProfile] || LINK_PROFILES.balanced;
    return buildPlan(
      campaign.strongPbnCount,
      profile,
      campaign.blogs,
      campaign.strongMoneyAnchors,
      campaign.weakMoneyAnchors,
      campaign.strongBlogAnchors,
      campaign.weakBlogAnchors,
    );
  }, [
    campaign.strongPbnCount,
    campaign.linkProfile,
    campaign.blogs,
    campaign.strongMoneyAnchors,
    campaign.weakMoneyAnchors,
    campaign.strongBlogAnchors,
    campaign.weakBlogAnchors,
  ]);
}
