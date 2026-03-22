import type { Subject } from './types.js';
export interface SubjectScaffold {
    hintPrompt: string;
    stepPrompt: string;
    conceptPrompt: string;
    encouragementStyle: string;
}
export declare function getSubjectScaffold(subject: Subject): SubjectScaffold;
export declare function getMathHint(stepNumber: number, problem: string): string;
export declare function getEnglishHint(stepNumber: number): string;
export declare function getScienceHint(stepNumber: number): string;
export declare function getSubjectHint(subject: Subject, stepNumber: number, problem: string): string;
