/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Lesson {
  id: string;
  category: "home-row" | "top-row" | "bottom-row" | "words" | "sentences" | "numbers" | "ai-custom";
  title: string;
  description: string;
  text: string;
  difficulty: "easy" | "medium" | "hard";
}

export interface TypingStats {
  wpm: number;      // Words Per Minute
  cpm: number;      // Characters Per Minute
  accuracy: number; // Percentage 0 - 100
  timeElapsed: number; // in seconds
  correctChars: number;
  incorrectChars: number;
  totalKeystrokes: number;
}

export type FingerName = 
  | "left-pinky"
  | "left-ring"
  | "left-middle"
  | "left-index"
  | "left-thumb"
  | "right-thumb"
  | "right-index"
  | "right-middle"
  | "right-ring"
  | "right-pinky";

export interface KeyFingerMapping {
  key: string;
  finger: FingerName;
  hand: "left" | "right";
}
