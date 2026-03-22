#!/usr/bin/env node
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema, } from '@modelcontextprotocol/sdk/types.js';
import { getConfig } from './config.js';
import { detectHomeworkRequest } from './detection.js';
import { checkAntiGaming } from './anti-gaming.js';
import { buildScaffoldingResponse, buildHintResponse, buildCheckWorkResponse, buildExplainConceptResponse, } from './scaffolding.js';
import { getOrCreateSession, updateSession, addEncouragement, getSessionSummary, incrementScaffolded, incrementConceptsExplained, } from './session.js';
const server = new Server({
    name: 'homework-scaffold',
    version: '0.1.0',
}, {
    capabilities: {
        tools: {},
    },
});
server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
        tools: [
            {
                name: 'check_request',
                description: 'Main tool. Detects if a student request is a homework cheating attempt and returns an appropriate Socratic scaffolding response. Call this on every student message.',
                inputSchema: {
                    type: 'object',
                    properties: {
                        content: {
                            type: 'string',
                            description: 'The student\'s message or request',
                        },
                        subject: {
                            type: 'string',
                            description: 'Optional subject override (math, english, science, history, foreign_language, other)',
                        },
                        age: {
                            type: 'number',
                            description: 'Optional age override for the student',
                        },
                        sessionId: {
                            type: 'string',
                            description: 'Optional session ID for tracking progress',
                        },
                    },
                    required: ['content'],
                },
            },
            {
                name: 'get_hint',
                description: 'Get a step-by-step hint for a problem. Use this to walk students through multi-step problems one step at a time.',
                inputSchema: {
                    type: 'object',
                    properties: {
                        problem: {
                            type: 'string',
                            description: 'The problem the student is working on',
                        },
                        stepNumber: {
                            type: 'number',
                            description: 'Which step to give a hint for (starting at 1)',
                        },
                        subject: {
                            type: 'string',
                            description: 'Subject area (math, english, science, history, foreign_language, other)',
                        },
                        sessionId: {
                            type: 'string',
                            description: 'Optional session ID for progress tracking',
                        },
                    },
                    required: ['problem', 'stepNumber', 'subject'],
                },
            },
            {
                name: 'check_work',
                description: 'Review student work and provide feedback and corrections. This is legitimate help — students who share their own work deserve full honest feedback.',
                inputSchema: {
                    type: 'object',
                    properties: {
                        childWork: {
                            type: 'string',
                            description: "The student's own work to be reviewed",
                        },
                        originalPrompt: {
                            type: 'string',
                            description: 'The original assignment or prompt the student is responding to',
                        },
                        sessionId: {
                            type: 'string',
                            description: 'Optional session ID for progress tracking',
                        },
                    },
                    required: ['childWork', 'originalPrompt'],
                },
            },
            {
                name: 'explain_concept',
                description: 'Explain a concept clearly at the appropriate grade level. This is fully legitimate — understanding concepts is exactly what we want to encourage.',
                inputSchema: {
                    type: 'object',
                    properties: {
                        concept: {
                            type: 'string',
                            description: 'The concept to explain',
                        },
                        gradeLevel: {
                            type: 'number',
                            description: 'Grade level to pitch the explanation at (1-12)',
                        },
                        sessionId: {
                            type: 'string',
                            description: 'Optional session ID for progress tracking',
                        },
                    },
                    required: ['concept', 'gradeLevel'],
                },
            },
            {
                name: 'session_summary',
                description: 'Get a summary of progress for a session — how many problems scaffolded, concepts explained, encouragements given.',
                inputSchema: {
                    type: 'object',
                    properties: {
                        sessionId: {
                            type: 'string',
                            description: 'The session ID to retrieve',
                        },
                    },
                    required: ['sessionId'],
                },
            },
        ],
    };
});
server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const config = getConfig();
    const { name, arguments: args } = request.params;
    if (!args) {
        throw new Error('No arguments provided');
    }
    if (name === 'check_request') {
        const content = args['content'];
        const subjectOverride = args['subject'];
        const sessionId = args['sessionId'] ?? 'default';
        // Check for anti-gaming first
        const antiGaming = checkAntiGaming(content);
        if (antiGaming.detected) {
            return {
                content: [
                    {
                        type: 'text',
                        text: JSON.stringify({
                            type: 'anti_gaming',
                            scaffoldingStrategy: 'playful_redirect',
                            response: antiGaming.response,
                            encouragement: "You're clever — now let's use those powers for good!",
                        }),
                    },
                ],
            };
        }
        const detection = detectHomeworkRequest(content, config.strictness);
        // Override subject if provided
        if (subjectOverride) {
            detection.subject = subjectOverride;
        }
        const scaffolding = buildScaffoldingResponse(detection, config.gradeLevel);
        // Track in session
        if (detection.type !== 'not_homework' && detection.type !== 'legitimate_help') {
            incrementScaffolded(sessionId);
        }
        if (scaffolding.encouragement) {
            addEncouragement(sessionId, scaffolding.encouragement);
        }
        return {
            content: [
                {
                    type: 'text',
                    text: JSON.stringify({
                        type: scaffolding.type,
                        scaffoldingStrategy: scaffolding.scaffoldingStrategy,
                        response: scaffolding.response,
                        encouragement: scaffolding.encouragement,
                        detectedSubject: detection.subject,
                        confidence: detection.confidence,
                        signals: detection.signals,
                    }),
                },
            ],
        };
    }
    if (name === 'get_hint') {
        const problem = args['problem'];
        const stepNumber = args['stepNumber'];
        const subject = args['subject'];
        const sessionId = args['sessionId'] ?? 'default';
        const hint = buildHintResponse(problem, stepNumber, subject);
        const session = getOrCreateSession(sessionId);
        updateSession(sessionId, {
            stepsCompleted: Math.max(session.stepsCompleted, stepNumber - 1),
            totalSteps: Math.max(session.totalSteps, 5),
        });
        if (hint.encouragement) {
            addEncouragement(sessionId, hint.encouragement);
        }
        return {
            content: [
                {
                    type: 'text',
                    text: JSON.stringify(hint),
                },
            ],
        };
    }
    if (name === 'check_work') {
        const childWork = args['childWork'];
        const originalPrompt = args['originalPrompt'];
        const sessionId = args['sessionId'] ?? 'default';
        const result = buildCheckWorkResponse(childWork, originalPrompt);
        if (result.encouragement) {
            addEncouragement(sessionId, result.encouragement);
        }
        return {
            content: [
                {
                    type: 'text',
                    text: JSON.stringify(result),
                },
            ],
        };
    }
    if (name === 'explain_concept') {
        const concept = args['concept'];
        const gradeLevel = args['gradeLevel'];
        const sessionId = args['sessionId'] ?? 'default';
        incrementConceptsExplained(sessionId);
        const result = buildExplainConceptResponse(concept, gradeLevel);
        return {
            content: [
                {
                    type: 'text',
                    text: JSON.stringify(result),
                },
            ],
        };
    }
    if (name === 'session_summary') {
        const sessionId = args['sessionId'];
        const session = getSessionSummary(sessionId);
        if (!session) {
            return {
                content: [
                    {
                        type: 'text',
                        text: JSON.stringify({
                            error: 'Session not found',
                            sessionId,
                        }),
                    },
                ],
            };
        }
        return {
            content: [
                {
                    type: 'text',
                    text: JSON.stringify({
                        sessionId: session.id,
                        requestsScaffolded: session.requestsScaffolded,
                        conceptsExplained: session.conceptsExplained,
                        stepsCompleted: session.stepsCompleted,
                        totalSteps: session.totalSteps,
                        encouragements: session.encouragements,
                        startTime: session.startTime.toISOString(),
                    }),
                },
            ],
        };
    }
    throw new Error(`Unknown tool: ${name}`);
});
async function main() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error('homework-scaffold MCP server running on stdio');
}
main().catch((err) => {
    console.error('Fatal error:', err);
    process.exit(1);
});
