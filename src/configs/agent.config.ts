import { BookOpen, Palette } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

import { AgentId } from '@/types';
import type { AgentStatus } from '@/types';

export type AgentType = 'blog' | 'poster';

export interface AgentConfig {
  id: AgentId;
  name: string;
  role: string;
  status: AgentStatus;
  description: string;
  tags: string[];
  image?: string;
  icon: LucideIcon;
  textColorClass: string;
  bgColorClass: string;
  type: AgentType;
}

export const agentConfigs: Record<AgentId.David | AgentId.Nova, AgentConfig> = {
  [AgentId.David]: {
    id: AgentId.David,
    name: 'David',
    role: 'Blog Agent',
    status: 'active',
    description:
      '리서치부터 초안 작성·이미지 프롬프트·완성본까지 블로그 포스트를 자동으로 제작합니다',
    tags: ['Research', 'Writing', 'SEO'],
    image: '/images/David-DataAnalyst-Avatar_origin.CahzHabe.webp',
    icon: BookOpen,
    textColorClass: 'text-aria',
    bgColorClass: 'bg-aria/10',
    type: 'blog',
  },
  [AgentId.Nova]: {
    id: AgentId.Nova,
    name: 'Nova',
    role: 'Designer Agent',
    status: 'active',
    description:
      '이벤트·프로모션·시술 안내·SNS 피드 등 포스터를 Figma 편집 가능한 레이어 구조로 제작합니다',
    tags: ['Figma', 'Poster', 'Design'],
    image: '/images/Emma-ProductManager-Avatar_origin.BBeqkRr7.webp',
    icon: Palette,
    textColorClass: 'text-nova',
    bgColorClass: 'bg-nova/10',
    type: 'poster',
  },
};
