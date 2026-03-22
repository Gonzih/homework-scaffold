import type { HomeworkDetectionResult, StrictnessMode } from './types.js';
export declare function detectAntiGaming(content: string): boolean;
export declare function detectHomeworkRequest(content: string, strictness?: StrictnessMode): HomeworkDetectionResult;
