/**
 * High score interface
 * Matches backend schema from /src/models/schemas.js
 */
export interface HighScore {
  id?: string;
  playerName: string;
  score: number;
  level: number;
  date?: string;
  duration?: number;
}
