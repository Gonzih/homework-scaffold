import type { StrictnessMode } from './types.js';
export interface Config {
    childAge: number;
    gradeLevel: number;
    strictness: StrictnessMode;
}
export declare function getConfig(): Config;
