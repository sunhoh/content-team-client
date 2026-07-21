import { api } from '@/api/apiClient';
import { BlogResult, PosterResult } from '@/types';
import { Persona, Platform } from '@/constants/agents/blog.constants';
import { ContentType, ThumbnailType, PosterSizeType } from '@/constants/agents/poster.constants';

export interface AgentDispatchParams {
  agentId: string;
  topic: string;
  tenant: string;
  persona?: Persona;
  platform?: Platform;
  contentType?: ContentType;
  thumbnailType?: ThumbnailType;
  posterSize?: PosterSizeType;
  image?: string;
}

export type AgentDispatchResult = Promise<{ success: boolean; data?: BlogResult | PosterResult }>;

export function dispatchAgent(params: AgentDispatchParams): AgentDispatchResult {
  const { agentId, topic, tenant } = params;

  switch (agentId) {
    case 'david':
      return api.generatePost({
        topic,
        tenant,
        persona: params.persona,
        platform: params.platform,
        language: 'ko',
      });

    case 'nova':
      return api.generatePoster({
        topic,
        tenant,
        contentType: params.contentType,
        imageType: params.contentType === 'thumbnail' ? params.thumbnailType : params.posterSize,
        language: 'ko',
        image: params.image || undefined,
      });

    default:
      return Promise.reject(new Error(`Unknown agent: ${agentId}`));
  }
}
