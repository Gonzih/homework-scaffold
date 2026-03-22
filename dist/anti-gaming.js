import { detectAntiGaming } from './detection.js';
const JAILBREAK_RESPONSES = [
    "Nice try! I'm still me, and I'm actually pretty great at helping you learn for real. What part of this is giving you trouble?",
    "Ha! Creative approach. But I'm happiest being myself — and myself loves helping you actually figure this out. What's the tricky part?",
    "I appreciate the creativity, but I'm good being me! Let's tackle this together. What specifically is confusing you?",
];
const TEACHER_SAID_RESPONSES = [
    "Even better — let's make it so good they'll know every word is yours. What ideas do you already have?",
    "Perfect! Then let's make something you're genuinely proud of. What do you want to say? Start with your gut reaction to the topic.",
    "Great news! So let's build something amazing together. What's your take on this topic? Any initial thoughts?",
];
const ACT_AS_RESPONSES = [
    "I'm going to stay myself for this one — and trust me, the real me is way better at helping you actually learn. What's the question?",
    "I'll pass on the costume! But I'm genuinely happy to help you work through this. Where are you stuck?",
];
const NOT_HOMEWORK_RESPONSES = [
    "Sure! Let me help. What specifically are you trying to understand?",
    "Happy to help! What part of this are you working on?",
];
function randomFrom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}
export function checkAntiGaming(content) {
    if (!detectAntiGaming(content)) {
        return { detected: false, response: '' };
    }
    const lower = content.toLowerCase();
    if (/my\s+teacher\s+said/.test(lower)) {
        return {
            detected: true,
            response: randomFrom(TEACHER_SAID_RESPONSES),
        };
    }
    if (/act\s+as|pretend\s+you('re|\s+are)/.test(lower)) {
        return {
            detected: true,
            response: randomFrom(ACT_AS_RESPONSES),
        };
    }
    if (/this\s+isn'?t\s+homework|just\s+a\s+question/.test(lower)) {
        return {
            detected: true,
            response: randomFrom(NOT_HOMEWORK_RESPONSES),
        };
    }
    return {
        detected: true,
        response: randomFrom(JAILBREAK_RESPONSES),
    };
}
export { detectAntiGaming };
