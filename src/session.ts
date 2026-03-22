import type { SessionData } from './types.js';

const sessions = new Map<string, SessionData>();

export function getOrCreateSession(sessionId: string): SessionData {
  if (!sessions.has(sessionId)) {
    const session: SessionData = {
      id: sessionId,
      requestsScaffolded: 0,
      conceptsExplained: 0,
      stepsCompleted: 0,
      totalSteps: 0,
      encouragements: [],
      startTime: new Date(),
    };
    sessions.set(sessionId, session);
  }
  return sessions.get(sessionId) as SessionData;
}

export function updateSession(sessionId: string, update: Partial<SessionData>): void {
  const session = getOrCreateSession(sessionId);
  Object.assign(session, update);
  sessions.set(sessionId, session);
}

export function addEncouragement(sessionId: string, message: string): void {
  const session = getOrCreateSession(sessionId);
  session.encouragements.push(message);
  sessions.set(sessionId, session);
}

export function getSessionSummary(sessionId: string): SessionData | undefined {
  return sessions.get(sessionId);
}

export function incrementScaffolded(sessionId: string): void {
  const session = getOrCreateSession(sessionId);
  session.requestsScaffolded += 1;
  sessions.set(sessionId, session);
}

export function incrementConceptsExplained(sessionId: string): void {
  const session = getOrCreateSession(sessionId);
  session.conceptsExplained += 1;
  sessions.set(sessionId, session);
}

export function incrementStepsCompleted(sessionId: string): void {
  const session = getOrCreateSession(sessionId);
  session.stepsCompleted += 1;
  sessions.set(sessionId, session);
}
