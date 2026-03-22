import type { StrictnessMode } from './types.js';

export interface Config {
  childAge: number;
  gradeLevel: number;
  strictness: StrictnessMode;
}

export function getConfig(): Config {
  return {
    childAge: parseInt(process.env.HOMEWORK_SCAFFOLD_CHILD_AGE || '12', 10),
    gradeLevel: parseInt(process.env.HOMEWORK_SCAFFOLD_GRADE_LEVEL || '7', 10),
    strictness: (process.env.HOMEWORK_SCAFFOLD_STRICTNESS || 'balanced') as StrictnessMode,
  };
}
