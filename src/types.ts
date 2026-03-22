export type HomeworkRequestType =
  | 'write_for_me'
  | 'answer_directly'
  | 'solve_completely'
  | 'summarize_instead'
  | 'genuine_confusion'
  | 'legitimate_help'
  | 'not_homework';

export type Subject = 'math' | 'english' | 'science' | 'history' | 'foreign_language' | 'other';
export type StrictnessMode = 'strict' | 'balanced' | 'relaxed';

export interface HomeworkDetectionResult {
  type: HomeworkRequestType;
  subject: Subject;
  confidence: number;
  signals: string[];
}

export interface ScaffoldingResponse {
  type: HomeworkRequestType;
  scaffoldingStrategy: string;
  response: string;
  encouragement?: string;
}

export interface SessionData {
  id: string;
  requestsScaffolded: number;
  conceptsExplained: number;
  stepsCompleted: number;
  totalSteps: number;
  encouragements: string[];
  startTime: Date;
}

export interface HintResponse {
  hint: string;
  encouragement: string;
  nextPrompt?: string;
}

export interface CheckWorkResponse {
  feedback: string;
  corrections: string[];
  encouragement: string;
  score?: number;
}

export interface ExplainConceptResponse {
  explanation: string;
  example: string;
  tryThisQuestion: string;
}
