import type { LucideIcon } from 'lucide-react';

export interface SavedProcess {
  id: number;
  name: string;
  description: string;
  processId: string;
  config: Record<string, string>;
  createdAt: string;
}

export interface ProcessDefinition {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  color: 'blue' | 'green' | 'orange' | 'red' | 'cyan' | 'purple' | 'yellow';
}

export interface ProcessChainStep {
  id: number;
  processId: string;
  config: Record<string, string>;
}

export interface OutputResult {
  id: number;
  trade: string;
  message: string;
  type: 'success' | 'warning' | 'error';
  time: string;
  step?: number;
}
