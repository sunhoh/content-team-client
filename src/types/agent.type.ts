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
  result?: BlogResult | PosterResult;
}
