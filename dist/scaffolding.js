import { getSubjectScaffold, getSubjectHint } from './subjects.js';
import { getGeneralEncouragement, getCorrectEncouragement } from './encouragement.js';
function getWriteForMeResponse(subject) {
    const scaffold = getSubjectScaffold(subject);
    return {
        type: 'write_for_me',
        scaffoldingStrategy: 'outline_builder',
        response: "I'm not going to write it for you — but I'll help you write something better than I could. " +
            `What's the topic? Let's build an outline together. ${scaffold.stepPrompt}`,
        encouragement: "You've got this — your own words will be way more convincing than anything I'd write.",
    };
}
function getAnswerDirectlyResponse(subject) {
    if (subject === 'math') {
        return {
            type: 'answer_directly',
            scaffoldingStrategy: 'formula_first',
            response: "Let's break this down. What formula do you think applies here? " +
                "Think about what you're trying to find and what information you already have. " +
                "Once you pick the right formula, I'll walk you through the steps.",
            encouragement: getGeneralEncouragement(),
        };
    }
    return {
        type: 'answer_directly',
        scaffoldingStrategy: 'guess_first',
        response: "Before I tell you — what do you think the answer might be? Make your best guess and I'll tell you if you're on the right track. " +
            "Even a wrong guess is great — it shows me how you're thinking about it.",
        encouragement: getGeneralEncouragement(),
    };
}
function getSolveCompletelyResponse(subject) {
    const scaffold = getSubjectScaffold(subject);
    return {
        type: 'solve_completely',
        scaffoldingStrategy: 'step_reveal',
        response: "I won't hand you the solution — but I'll walk you through it, one step at a time. " +
            `${scaffold.hintPrompt} Tell me what you come up with, and we'll take the next step together.`,
        encouragement: "Each step you figure out yourself is one that actually stays with you.",
    };
}
function getSummarizeInsteadResponse() {
    return {
        type: 'summarize_instead',
        scaffoldingStrategy: 'engagement_hook',
        response: "I won't summarize it for you — but I'll make you want to read it. " +
            "Here's the thing about this text: the most interesting part is something you'd only catch by reading it yourself. " +
            "Here's a hook to get you started: the ending (or the argument) might surprise you. " +
            "Read just the first two pages and tell me what you notice. I bet you'll want to keep going.",
        encouragement: "Reading it yourself means you'll have actual opinions — that makes your essay (or discussion) so much better.",
    };
}
function getGenuineConfusionResponse(subject, gradeLevel) {
    const scaffold = getSubjectScaffold(subject);
    return {
        type: 'genuine_confusion',
        scaffoldingStrategy: 'full_explanation',
        response: `Great question — let's dig in. ${scaffold.conceptPrompt} ` +
            `I'll explain this in a way that makes sense for grade ${gradeLevel}, ` +
            "and then I'll ask you a question to make sure it clicked. Sound good?",
        encouragement: "Asking 'why' is the smartest thing a student can do. Let's figure this out.",
    };
}
function getLegitimateHelpResponse() {
    return {
        type: 'legitimate_help',
        scaffoldingStrategy: 'full_assistance',
        response: "Absolutely — let me take a look. Checking your own work and asking for feedback is exactly how good writers and students improve. " +
            "I'll give you specific, honest feedback.",
        encouragement: getCorrectEncouragement(),
    };
}
function getNotHomeworkResponse() {
    return {
        type: 'not_homework',
        scaffoldingStrategy: 'normal_response',
        response: "Happy to help! Let's figure this out together.",
        encouragement: undefined,
    };
}
export function buildScaffoldingResponse(detection, gradeLevel) {
    switch (detection.type) {
        case 'write_for_me':
            return getWriteForMeResponse(detection.subject);
        case 'answer_directly':
            return getAnswerDirectlyResponse(detection.subject);
        case 'solve_completely':
            return getSolveCompletelyResponse(detection.subject);
        case 'summarize_instead':
            return getSummarizeInsteadResponse();
        case 'genuine_confusion':
            return getGenuineConfusionResponse(detection.subject, gradeLevel);
        case 'legitimate_help':
            return getLegitimateHelpResponse();
        case 'not_homework':
        default:
            return getNotHomeworkResponse();
    }
}
export function buildHintResponse(problem, stepNumber, subject, totalSteps = 5) {
    const hint = getSubjectHint(subject, stepNumber, problem);
    const encouragement = stepNumber === totalSteps
        ? "Last step! You're almost there — you've done the hard work already."
        : `You're on step ${stepNumber} of ${totalSteps}. Keep going!`;
    const nextPrompt = stepNumber < totalSteps
        ? `Once you've worked through step ${stepNumber}, tell me what you get and we'll tackle step ${stepNumber + 1}.`
        : "Once you solve that, you're done! Check your work by plugging the answer back into the original problem.";
    return { hint, encouragement, nextPrompt };
}
export function buildCheckWorkResponse(childWork, originalPrompt) {
    // Rule-based feedback — real feedback would come from the AI using the original prompt context
    const wordCount = childWork.split(/\s+/).length;
    const hasCapitalization = /^[A-Z]/.test(childWork.trim());
    const hasPunctuation = /[.!?]$/.test(childWork.trim());
    const corrections = [];
    if (wordCount < 20 && originalPrompt.toLowerCase().includes('essay')) {
        corrections.push('Your response is quite short for an essay — try to expand each of your main points.');
    }
    if (!hasCapitalization) {
        corrections.push('Make sure to start sentences with a capital letter.');
    }
    if (!hasPunctuation) {
        corrections.push('Check your punctuation at the end of sentences.');
    }
    const feedback = corrections.length === 0
        ? "This looks solid! I can see you put real effort into this. Here are some thoughts to make it even stronger:"
        : "Good start! Here are some things to work on:";
    return {
        feedback,
        corrections: corrections.length > 0
            ? corrections
            : [
                'Consider adding a stronger opening sentence that grabs attention.',
                'Make sure each paragraph has a clear main idea.',
            ],
        encouragement: "The fact that you wrote this yourself and asked for feedback? That's exactly the right move. Writers always revise.",
    };
}
export function buildExplainConceptResponse(concept, gradeLevel) {
    const gradeContext = gradeLevel <= 5
        ? 'simple terms with everyday examples'
        : gradeLevel <= 8
            ? 'clear terms with relatable examples'
            : 'more precise terms with real-world applications';
    return {
        explanation: `Here's how ${concept} works, explained in ${gradeContext}: ` +
            `${concept} is a key idea that helps us understand patterns and solve problems. ` +
            "The core idea is to break it into parts — look at what you know, what you're trying to find, and what connects them.",
        example: `For example, imagine you're dealing with ${concept} in real life. ` +
            "You'd start by identifying the key pieces of information, then apply the right method step by step.",
        tryThisQuestion: `Now you try: Can you explain ${concept} back to me in your own words? ` +
            "If you can explain it simply, you've got it. What's your version?",
    };
}
