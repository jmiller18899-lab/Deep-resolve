export interface AnalysisResult {
  selectedFrameworks: string[];
  discardedFrameworksSummary: string;
  reasoningChain: string[];
  rootCause: string;
  finalAnswer: string;
  laymanSummary: string;
}

export enum AppState {
  IDLE = 'IDLE',
  ANALYZING = 'ANALYZING',
  COMPLETED = 'COMPLETED',
  ERROR = 'ERROR'
}

export interface ProcessingStep {
  id: number;
  label: string;
  status: 'pending' | 'active' | 'completed';
}