export type AgentId = "david" | "flux" | "scout" | "forge" | "echo" | "nexus" | "quill" | "nova";

export type TaskStatus = "complete" | "in-progress" | "waiting";

export type AgentStatus = "active" | "idle" | "processing";

export interface Agent {
  id: AgentId;
  name: string;
  role: string;
  status: AgentStatus;
}

export interface Task {
  id: string;
  title: string;
  type: string;
  assignee: AgentId;
  status: TaskStatus;
  time: string;
}

export interface MetricCard {
  id: string;
  label: string;
  sublabel: string;
  assignee: string;
  icon: "research" | "analyze" | "generate" | "report";
}

export interface BlogResult {
  content: string;
  imagePrompts: string;
}

export interface PosterResult {
  figmaUrl: string;
  imageUrl?: string;
}

export type BlogTaskStatus = "processing" | "completed" | "failed";

export interface BlogTask {
  id: string;
  topic: string;
  agentId: string;
  status: BlogTaskStatus;
  stage: string;
  progress: number;
  createdAt: string;
  result?: BlogResult | PosterResult;
}
