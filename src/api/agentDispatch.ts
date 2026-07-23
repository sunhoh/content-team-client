import { api } from '@/api/apiClient';
import { Persona, Platform } from '@/constants/agents/blog.constants';
import {
  ContentType,
  ImageType,
  PosterSizeType,
} from '@/constants/agents/poster.constants';
import { BlogResult, PosterResult } from '@/types';
import { AgentId } from '@/types/agent.type';

export interface AgentDispatchParams {
  agentId: string;
  topic: string;
  tenant: string;
  persona?: Persona;
  platform?: Platform;
  imageType?: ImageType;
  contentType?: ContentType;
  posterSize?: PosterSizeType;
  image?: File;
}

export type AgentDispatchResult = Promise<{
  data?: BlogResult | PosterResult;
}>;

export function dispatchAgent(
  params: AgentDispatchParams,
): AgentDispatchResult {
  const { agentId, topic, tenant } = params;

  switch (agentId) {
    case AgentId.David:
      return api.generatePost({
        topic,
        tenant,
        persona: params.persona,
        platform: params.platform,
        language: 'ko',
      });

    case AgentId.Nova:
      return api.generatePoster({
        topic,
        tenant,
        imageType: params.imageType,
        contentType: params.imageType === 'thumbnail' ? params.contentType : undefined,
        posterSize: params.imageType === 'poster' ? params.posterSize : undefined,
        language: 'ko',
        image: params.image,
      });

    default:
      return Promise.reject(new Error(`Unknown agent: ${agentId}`));
  }
}
