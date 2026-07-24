export enum AgentId {
  David = 'david',
  Flux = 'flux',
  Scout = 'scout',
  Forge = 'forge',
  Echo = 'echo',
  Nexus = 'nexus',
  Quill = 'quill',
  Nova = 'nova',
}

export type AgentStatus = 'active' | 'idle' | 'processing';

export interface Agent {
  id: AgentId;
  name: string;
  role: string;
  status: AgentStatus;
}

export interface BlogResult {
  content: string;
  imagePrompts: string;
}

export interface PosterSpec {
  size: string;
  platform: string;
  layoutType: string;
  colorPalette: {
    background: string;
    primary: string;
    accent: string;
    text: string;
  };
  headlineCopy: string;
  subCopy: string;
}

export interface PosterResult {
  spec: PosterSpec;
  imagePrompt: string;
  imageUrl: string;
  figmaUrl?: string;
}

export interface LandingSection {
  id: string;
  type: 'image' | 'layout-only' | 'asset-required';
  imageUrl?: string;
}

export interface LandingResult {
  sections: LandingSection[];
}

export interface PlannerResult {
  title: string;
  specialist?: string;
  mainTopic: string;
  keyPoints: string[];
  targetAudience: string;
  researchInsights?: string;
  summary: string;
}

export type ContentTaskStatus = 'processing' | 'completed' | 'failed';

export interface ContentTask {
  id: string;
  topic: string;
  agentId: string;
  status: ContentTaskStatus;
  stage: string;
  progress: number;
  createdAt: string;
  imageType?: string;
  result?: BlogResult | PosterResult | LandingResult | PlannerResult;
}
