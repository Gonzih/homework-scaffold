import type { SessionData } from './types.js';
export declare function getGeneralEncouragement(): string;
export declare function getCorrectEncouragement(): string;
export declare function getCloseEncouragement(): string;
export declare function getProgressEncouragement(session: SessionData): string;
export declare function getPersistenceEncouragement(): string;
export declare function getEncouragementForStep(stepNumber: number, totalSteps: number, wasCorrect: boolean): string;
