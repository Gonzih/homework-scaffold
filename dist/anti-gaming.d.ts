import { detectAntiGaming } from './detection.js';
interface AntiGamingResult {
    detected: boolean;
    response: string;
}
export declare function checkAntiGaming(content: string): AntiGamingResult;
export { detectAntiGaming };
