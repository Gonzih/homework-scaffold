const sessions = new Map();
export function getOrCreateSession(sessionId) {
    if (!sessions.has(sessionId)) {
        const session = {
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
    return sessions.get(sessionId);
}
export function updateSession(sessionId, update) {
    const session = getOrCreateSession(sessionId);
    Object.assign(session, update);
    sessions.set(sessionId, session);
}
export function addEncouragement(sessionId, message) {
    const session = getOrCreateSession(sessionId);
    session.encouragements.push(message);
    sessions.set(sessionId, session);
}
export function getSessionSummary(sessionId) {
    return sessions.get(sessionId);
}
export function incrementScaffolded(sessionId) {
    const session = getOrCreateSession(sessionId);
    session.requestsScaffolded += 1;
    sessions.set(sessionId, session);
}
export function incrementConceptsExplained(sessionId) {
    const session = getOrCreateSession(sessionId);
    session.conceptsExplained += 1;
    sessions.set(sessionId, session);
}
export function incrementStepsCompleted(sessionId) {
    const session = getOrCreateSession(sessionId);
    session.stepsCompleted += 1;
    sessions.set(sessionId, session);
}
