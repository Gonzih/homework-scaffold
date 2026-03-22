export function getSubjectScaffold(subject) {
    switch (subject) {
        case 'math':
            return {
                hintPrompt: 'What formula do you think applies here? Think about what you are trying to find and what information you already have.',
                stepPrompt: 'Before we go further — what do you know (the "given" information)? And what are you trying to find?',
                conceptPrompt: 'Let me explain the concept, then you can apply it. Does the formula make sense once you see why it works?',
                encouragementStyle: 'precise',
            };
        case 'english':
            return {
                hintPrompt: "What's your main idea here? Don't worry about perfect words yet — just tell me what you want to say.",
                stepPrompt: "Let's build an outline together. What are the three most important things you want your reader to know?",
                conceptPrompt: 'Writing is about having something to say. What do YOU think about this topic? Start there.',
                encouragementStyle: 'expressive',
            };
        case 'science':
            return {
                hintPrompt: "What do you already know about how this works? Even a guess is a great starting point — that's literally what a hypothesis is!",
                stepPrompt: "Let's understand the concept first. Once you see WHY this works, the answer will make sense on its own.",
                conceptPrompt: 'Science is all about asking WHY. Why do you think this happens? Take a guess — scientists guess all the time.',
                encouragementStyle: 'curious',
            };
        case 'history':
            return {
                hintPrompt: 'What context do you already know about this period? History is about understanding WHY things happened, not just memorizing dates.',
                stepPrompt: "Let's think about causes and effects. If you were alive then, what do you think would have led to this?",
                conceptPrompt: "History is an argument, not just facts. What's YOUR take on why this happened? There's often more than one right answer.",
                encouragementStyle: 'analytical',
            };
        case 'foreign_language':
            return {
                hintPrompt: '¿Puedes intentarlo primero? (Can you try first?) Even a rough attempt is great practice — mistakes are how languages stick.',
                stepPrompt: "Think about the root of the word. Do you recognize any part of it from words you already know?",
                conceptPrompt: "Language learning is about patterns. What other words do you know that follow a similar pattern?",
                encouragementStyle: 'playful',
            };
        case 'other':
        default:
            return {
                hintPrompt: "What do you already know about this? Let's build from there.",
                stepPrompt: "What's the very first thing you'd need to figure out?",
                conceptPrompt: "Let me explain how this works, and then you can try applying it.",
                encouragementStyle: 'general',
            };
    }
}
export function getMathHint(stepNumber, problem) {
    const hints = [
        `Step ${stepNumber}: What information are you given in this problem? List everything you know.`,
        `Step ${stepNumber}: What formula or method usually handles this type of problem?`,
        `Step ${stepNumber}: Let's set it up — can you write out the equation before solving?`,
        `Step ${stepNumber}: Now solve for the variable. What operation do you need to do to both sides?`,
        `Step ${stepNumber}: Check your answer — does it make sense? Plug it back in and see!`,
    ];
    // Use problem length as a deterministic way to vary hints slightly
    const idx = Math.min(stepNumber - 1, hints.length - 1);
    return hints[idx] ?? `Step ${stepNumber}: What's the next thing you need to figure out for this problem: "${problem}"?`;
}
export function getEnglishHint(stepNumber) {
    const hints = [
        'Step 1: What is the main point you want to make? Write it in one sentence.',
        'Step 2: What are two or three reasons or examples that support your main point?',
        'Step 3: Write your introduction — start with something that grabs attention, then end with your thesis.',
        'Step 4: Write your body paragraphs. Start each with a topic sentence.',
        'Step 5: Write your conclusion — restate your main idea in new words, and end with something memorable.',
    ];
    const idx = Math.min(stepNumber - 1, hints.length - 1);
    return hints[idx] ?? `Step ${stepNumber}: What comes next in your writing?`;
}
export function getScienceHint(stepNumber) {
    const hints = [
        'Step 1: What is the question or problem asking you to explain or find?',
        'Step 2: What scientific concept or principle applies here? (Think: what chapter is this from?)',
        'Step 3: Can you write a hypothesis — your best guess about what the answer is?',
        'Step 4: Apply the concept or formula. Show your work step by step.',
        'Step 5: Does your answer make sense in the real world? How would you test it?',
    ];
    const idx = Math.min(stepNumber - 1, hints.length - 1);
    return hints[idx] ?? `Step ${stepNumber}: What's the next part of the scientific process here?`;
}
export function getSubjectHint(subject, stepNumber, problem) {
    switch (subject) {
        case 'math':
            return getMathHint(stepNumber, problem);
        case 'english':
            return getEnglishHint(stepNumber);
        case 'science':
            return getScienceHint(stepNumber);
        default: {
            const scaffold = getSubjectScaffold(subject);
            return `Step ${stepNumber}: ${scaffold.stepPrompt}`;
        }
    }
}
