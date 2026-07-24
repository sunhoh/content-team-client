import { api } from '@/api/apiClient';
import { Persona, Platform } from '@/constants/agents/blog.constants';
import {
  ContentType,
  ImageType,
} from '@/constants/agents/poster.constants';
import { BlogResult, PosterResult, LandingResult, PlannerResult } from '@/types';
import { AgentId } from '@/types/agent.type';

export interface AgentDispatchParams {
  agentId: string;
  topic: string;
  tenant: string;
  persona?: Persona;
  platform?: Platform;
  imageType?: ImageType;
  contentType?: ContentType;
  images?: File[];
}

export type AgentDispatchResult = Promise<{
  data?: BlogResult | PosterResult | LandingResult | PlannerResult;
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
      if (params.imageType === 'thumbnail') {
        return api.generateThumbnail({
          topic,
          tenant,
          contentType: params.contentType ?? 'meta',
          language: 'ko',
          image: params.images?.[0],
        });
      }
      if (params.imageType === 'landing') {
        return api.generateLanding({
          tenant,
          language: 'ko',
          sections: [{ topic }],
        });
      }
      return api.generatePoster({
        topic,
        tenant,
        language: 'ko',
        image: params.images?.[0],
      });

    case AgentId.Flux:
      return api.generatePlanner({
        topic,
        tenant,
        language: 'ko',
      });

    default:
      return Promise.reject(new Error(`Unknown agent: ${agentId}`));
  }
}
