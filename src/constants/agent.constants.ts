import type { LucideIcon } from 'lucide-react';
import { BookOpen, Palette } from 'lucide-react';

import { AgentStatus } from '@/types';

export type AgentConfig = {
  id: string;
  name: string;
  role: string;
  status: AgentStatus;
  description: string;
  tags: string[];
  image?: string;
  icon?: LucideIcon;
  textColorClass: string;
  bgColorClass: string;
};

export const AGENTS: AgentConfig[] = [
  {
    id: 'david',
    name: 'David',
    role: 'Blog Agent',
    status: 'active',
    description: '리서치부터 초안 작성·이미지 프롬프트·완성본까지 블로그 포스트를 자동으로 제작합니다',
    tags: ['Research', 'Writing', 'SEO'],
    image: '/images/David-DataAnalyst-Avatar_origin.CahzHabe.webp',
    icon: BookOpen,
    textColorClass: 'text-aria',
    bgColorClass: 'bg-aria/10',
  },
  // {
  //   id: 'flux',
  //   name: 'Flux',
  //   role: 'Instagram Agent',
  //   status: 'processing',
  //   description: '인스타그램 카드뉴스 캐러셀과 피드 캡션·해시태그를 자동으로 제작합니다',
  //   tags: ['Carousel', 'Caption', 'Hashtag'],
  //   image: '/images/Alex-Engineer-Avatar.webp',
  //   icon: Camera,
  //   textColorClass: 'text-flux',
  //   bgColorClass: 'bg-flux/10',
  // },
  // {
  //   id: 'scout',
  //   name: 'Scout',
  //   role: 'Thread Agent',
  //   status: 'active',
  //   description: 'X(트위터) 포스트를 목적에 맞는 페르소나로 280자 이내에 자동 작성합니다',
  //   tags: ['X', 'Twitter', '280자'],
  //   image: '/images/Mike-TeamLeader-Avatar.webp',
  //   icon: Hash,
  //   textColorClass: 'text-scout',
  //   bgColorClass: 'bg-scout/10',
  // },
  {
    id: 'nova',
    name: 'Nova',
    role: 'Poster Designer Agent',
    status: 'active',
    description: '이벤트·프로모션·시술 안내·SNS 피드 등 포스터를 Figma 편집 가능한 레이어 구조로 제작합니다',
    tags: ['Figma', 'Poster', 'Design'],
    image: '/images/Emma-ProductManager-Avatar_origin.BBeqkRr7.webp',
    icon: Palette,
    textColorClass: 'text-nova',
    bgColorClass: 'bg-nova/10',
  },
];
