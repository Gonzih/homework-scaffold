import type { HomeworkDetectionResult, ScaffoldingResponse, Subject, HintResponse, CheckWorkResponse, ExplainConceptResponse } from './types.js';
export declare function buildScaffoldingResponse(detection: HomeworkDetectionResult, gradeLevel: number): ScaffoldingResponse;
export declare function buildHintResponse(problem: string, stepNumber: number, subject: Subject, totalSteps?: number): HintResponse;
export declare function buildCheckWorkResponse(childWork: string, originalPrompt: string): CheckWorkResponse;
export declare function buildExplainConceptResponse(concept: string, gradeLevel: number): ExplainConceptResponse;
