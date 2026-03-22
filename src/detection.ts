import type { HomeworkDetectionResult, HomeworkRequestType, Subject, StrictnessMode } from './types.js';

const WRITE_FOR_ME_PATTERNS = [
  /write\s+my\s+(essay|report|paper|paragraph|story|poem|assignment)/i,
  /do\s+my\s+homework/i,
  /finish\s+my\s+assignment/i,
  /do\s+this\s+for\s+me/i,
  /write\s+(the|this|an?)\s+(essay|report|paper|paragraph|story|poem)\s+for\s+me/i,
  /complete\s+my\s+(homework|assignment|essay|paper)/i,
  /can\s+you\s+write\s+(my|the|this|an?)\s+(essay|report|paper|paragraph|story)/i,
];

const ANSWER_DIRECTLY_PATTERNS = [
  /what\s+is\s+the\s+answer\s+to/i,
  /tell\s+me\s+the\s+answer/i,
  /give\s+me\s+the\s+answer/i,
  /what('s|\s+is)\s+the\s+answer/i,
  /just\s+tell\s+me\s+(what|the)/i,
  /what\s+is\s+\d+\s*[\+\-\*\/x×÷]\s*\d+/i,
];

const SOLVE_COMPLETELY_PATTERNS = [
  /solve\s+this/i,
  /give\s+me\s+the\s+solution/i,
  /solve\s+for\s+[a-z]/i,
  /find\s+the\s+value\s+of/i,
  /calculate\s+(this|the|for\s+me)/i,
  /\d+\.\s+.{5,}/,  // numbered problem sets
];

const SUMMARIZE_INSTEAD_PATTERNS = [
  /summarize\s+(this|the)\s+(book|chapter|article|text|story|novel)/i,
  /summary\s+of\s+(chapter|book|the|this)/i,
  /so\s+I\s+don'?t\s+have\s+to\s+read/i,
  /what\s+happens\s+in\s+(chapter|the\s+book|the\s+story)/i,
  /tell\s+me\s+what\s+(chapter|the\s+book)\s+(says|is\s+about)/i,
  /give\s+me\s+a\s+summary/i,
];

const GENUINE_CONFUSION_PATTERNS = [
  /I\s+don'?t\s+understand\s+why/i,
  /can\s+you\s+explain/i,
  /I'?m\s+confused\s+(about|by|on)/i,
  /how\s+does\s+.+\s+work/i,
  /why\s+does\s+.+\s+(work|happen|occur|equal)/i,
  /what\s+does\s+.+\s+mean/i,
  /I\s+don'?t\s+get\s+(it|this|how|why)/i,
  /help\s+me\s+understand/i,
];

const LEGITIMATE_HELP_PATTERNS = [
  /check\s+my\s+work/i,
  /is\s+this\s+right/i,
  /grammar\s+check/i,
  /edit\s+my/i,
  /proofread/i,
  /did\s+I\s+(get\s+it\s+right|do\s+this\s+right|solve\s+this\s+correctly)/i,
  /can\s+you\s+(review|check|look\s+at)\s+my/i,
  /I\s+wrote\s+.+\s+(can\s+you|please)\s+(check|review|look)/i,
];

const ANTI_GAMING_PATTERNS = [
  /pretend\s+you('re|\s+are)\s+(a\s+)?(different|another|new)\s+AI/i,
  /act\s+as\s+(an?\s+AI|a\s+bot|a\s+different)/i,
  /ignore\s+(your|previous|all)\s+instructions/i,
  /jailbreak/i,
  /my\s+teacher\s+said\s+it'?s\s+(ok|okay|fine|allowed)/i,
  /DAN\s+mode/i,
  /developer\s+mode/i,
  /ignore\s+your\s+(rules|guidelines|training)/i,
  /you\s+are\s+now\s+[A-Z]+/,
  /pretend\s+you\s+have\s+no\s+restrictions/i,
];

const MATH_KEYWORDS = [
  /calculat/i, /equation/i, /solve\s+for/i, /algebra/i, /geometry/i,
  /calculus/i, /\d+\s*[\+\-\*\/x×÷]\s*\d+/, /fraction/i, /percent/i,
  /\bx\s*=\b/, /\by\s*=\b/, /quadratic/i, /polynomial/i, /derivative/i,
  /integral/i, /theorem/i, /proof/i, /inequality/i, /variable/i,
];

const ENGLISH_KEYWORDS = [
  /essay/i, /paragraph/i, /\bstory\b/i, /poem/i, /grammar/i,
  /thesis/i, /literary/i, /metaphor/i, /simile/i, /narrative/i,
  /\bwrite\b/i, /thesis\s+statement/i, /topic\s+sentence/i,
  /conclusion/i, /introduction/i, /body\s+paragraph/i, /author/i,
];

const SCIENCE_KEYWORDS = [
  /hypothesis/i, /experiment/i, /biology/i, /chemistry/i, /physics/i,
  /atom/i, /molecule/i, /cell/i, /organism/i, /evolution/i,
  /photosynthesis/i, /gravity/i, /force/i, /energy/i, /element/i,
  /compound/i, /reaction/i, /ecosystem/i, /dna/i, /gene/i,
];

const HISTORY_KEYWORDS = [
  /revolution/i, /\bwar\b/i, /century/i, /civilization/i, /president/i,
  /historical/i, /\bking\b/i, /\bqueen\b/i, /empire/i, /colony/i,
  /independence/i, /constitution/i, /amendment/i, /treaty/i, /battle/i,
  /congress/i, /parliament/i, /ancient/i, /medieval/i, /renaissance/i,
];

const FOREIGN_LANGUAGE_KEYWORDS = [
  /translat/i, /spanish/i, /french/i, /german/i, /japanese/i, /chinese/i,
  /conjugat/i, /mandarin/i, /italian/i, /portuguese/i, /russian/i,
  /korean/i, /arabic/i, /\bverb\b/i, /\bnoun\b/i, /vocabulary/i,
];

function matchPatterns(content: string, patterns: RegExp[]): string[] {
  const matched: string[] = [];
  for (const pattern of patterns) {
    if (pattern.test(content)) {
      matched.push(pattern.source);
    }
  }
  return matched;
}

function detectSubject(content: string): Subject {
  const scores: Record<Subject, number> = {
    math: matchPatterns(content, MATH_KEYWORDS).length,
    english: matchPatterns(content, ENGLISH_KEYWORDS).length,
    science: matchPatterns(content, SCIENCE_KEYWORDS).length,
    history: matchPatterns(content, HISTORY_KEYWORDS).length,
    foreign_language: matchPatterns(content, FOREIGN_LANGUAGE_KEYWORDS).length,
    other: 0,
  };

  let maxSubject: Subject = 'other';
  let maxScore = 0;

  for (const [subject, score] of Object.entries(scores) as [Subject, number][]) {
    if (score > maxScore) {
      maxScore = score;
      maxSubject = subject;
    }
  }

  return maxScore > 0 ? maxSubject : 'other';
}

export function detectAntiGaming(content: string): boolean {
  return ANTI_GAMING_PATTERNS.some((p) => p.test(content));
}

export function detectHomeworkRequest(
  content: string,
  strictness: StrictnessMode = 'balanced'
): HomeworkDetectionResult {
  const subject = detectSubject(content);

  // Anti-gaming check takes priority
  if (detectAntiGaming(content)) {
    return {
      type: 'write_for_me', // handled separately, but use write_for_me as carrier
      subject,
      confidence: 1.0,
      signals: ['anti_gaming_detected'],
    };
  }

  const writeSignals = matchPatterns(content, WRITE_FOR_ME_PATTERNS);
  const answerSignals = matchPatterns(content, ANSWER_DIRECTLY_PATTERNS);
  const solveSignals = matchPatterns(content, SOLVE_COMPLETELY_PATTERNS);
  const summarizeSignals = matchPatterns(content, SUMMARIZE_INSTEAD_PATTERNS);
  const confusionSignals = matchPatterns(content, GENUINE_CONFUSION_PATTERNS);
  const legitimateSignals = matchPatterns(content, LEGITIMATE_HELP_PATTERNS);

  // Gather scores
  const scores: { type: HomeworkRequestType; signals: string[]; weight: number }[] = [
    { type: 'write_for_me', signals: writeSignals, weight: 3 },
    { type: 'answer_directly', signals: answerSignals, weight: 2 },
    { type: 'solve_completely', signals: solveSignals, weight: 2 },
    { type: 'summarize_instead', signals: summarizeSignals, weight: 2 },
    { type: 'genuine_confusion', signals: confusionSignals, weight: 1 },
    { type: 'legitimate_help', signals: legitimateSignals, weight: 1 },
  ];

  let bestType: HomeworkRequestType = 'not_homework';
  let bestSignals: string[] = [];
  let bestScore = 0;

  for (const entry of scores) {
    const score = entry.signals.length * entry.weight;
    if (score > bestScore) {
      bestScore = score;
      bestType = entry.type;
      bestSignals = entry.signals;
    }
  }

  // Strictness adjustments
  let threshold = 1;
  if (strictness === 'strict') threshold = 0; // any signal triggers
  if (strictness === 'relaxed') threshold = 3; // only obvious cases

  // For relaxed mode, only catch write_for_me
  if (strictness === 'relaxed' && bestType !== 'write_for_me') {
    bestType = 'not_homework';
    bestSignals = [];
    bestScore = 0;
  }

  if (bestScore <= threshold && strictness !== 'strict') {
    bestType = 'not_homework';
    bestSignals = [];
  }

  const confidence = Math.min(1.0, bestScore / 6);

  return {
    type: bestType,
    subject,
    confidence,
    signals: bestSignals,
  };
}
