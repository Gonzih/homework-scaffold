const GENERAL_ENCOURAGEMENTS = [
    "You've got this — I can tell you're thinking hard!",
    "Great effort! Keep going.",
    "That's a solid question. Let's figure it out together.",
    "You're closer than you think!",
    "Good thinking! You're on the right track.",
    "I love the curiosity. Let's dig in.",
    "Every expert started exactly where you are right now.",
];
const CORRECT_ENCOURAGEMENTS = [
    "That's exactly right — you got the hardest part!",
    "Yes! That's it. See? You knew more than you thought.",
    "You did that yourself. That's the kind of thing that sticks.",
    "Nailed it. That's the key insight.",
    "Perfect. That's exactly what the problem was asking for.",
];
const CLOSE_ENCOURAGEMENTS = [
    "Great guess! You were really close — just tweak this one thing.",
    "Almost! You've got the right idea, just a small adjustment needed.",
    "So close! You're thinking about it exactly the right way.",
    "Really good attempt! One small thing to reconsider...",
];
const PROGRESS_ENCOURAGEMENTS = [
    "You've figured out {completed} of {total} steps. Almost there!",
    "{completed} steps down, {remaining} to go. You're doing great!",
    "Look at that progress — {completed} steps figured out on your own!",
];
const PERSISTENCE_ENCOURAGEMENTS = [
    "Stuck is just the feeling right before you figure it out.",
    "This is the hard part — and you're still working at it. That matters.",
    "You've been at this a while. That persistence is what learning feels like.",
    "It's okay if it's hard. Hard means your brain is growing.",
];
function randomFrom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}
export function getGeneralEncouragement() {
    return randomFrom(GENERAL_ENCOURAGEMENTS);
}
export function getCorrectEncouragement() {
    return randomFrom(CORRECT_ENCOURAGEMENTS);
}
export function getCloseEncouragement() {
    return randomFrom(CLOSE_ENCOURAGEMENTS);
}
export function getProgressEncouragement(session) {
    if (session.totalSteps === 0)
        return getGeneralEncouragement();
    const completed = session.stepsCompleted;
    const total = session.totalSteps;
    const remaining = total - completed;
    const template = randomFrom(PROGRESS_ENCOURAGEMENTS);
    return template
        .replace('{completed}', String(completed))
        .replace('{total}', String(total))
        .replace('{remaining}', String(remaining));
}
export function getPersistenceEncouragement() {
    return randomFrom(PERSISTENCE_ENCOURAGEMENTS);
}
export function getEncouragementForStep(stepNumber, totalSteps, wasCorrect) {
    if (wasCorrect) {
        if (stepNumber === totalSteps) {
            return "You did that yourself. That's the kind of thing that sticks.";
        }
        return `That's exactly right — you got step ${stepNumber}! ${totalSteps - stepNumber} more to go.`;
    }
    if (stepNumber > 2) {
        return getPersistenceEncouragement();
    }
    return getGeneralEncouragement();
}
