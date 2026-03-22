import type { SessionData } from './types.js';
export declare function getOrCreateSession(sessionId: string): SessionData;
export declare function updateSession(sessionId: string, update: Partial<SessionData>): void;
export declare function addEncouragement(sessionId: string, message: string): void;
export declare function getSessionSummary(sessionId: string): SessionData | undefined;
export declare function incrementScaffolded(sessionId: string): void;
export declare function incrementConceptsExplained(sessionId: string): void;
export declare function incrementStepsCompleted(sessionId: string): void;
