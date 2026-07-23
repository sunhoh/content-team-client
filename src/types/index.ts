import { AgentId } from './agent.type';
export { AgentId };
export type {
  AgentStatus,
  Agent,
  BlogResult,
  PosterResult,
  PosterSpec,
  ContentTaskStatus,
  ContentTask,
} from './agent.type';

export type TaskStatus = 'complete' | 'in-progress' | 'waiting';

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
  icon: 'research' | 'analyze' | 'generate' | 'report';
}
