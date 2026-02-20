/**
 * Settings Model
 * Defines game settings structure and defaults
 */

/**
 * Difficulty levels
 */
export enum Difficulty {
  EASY = 'EASY',
  NORMAL = 'NORMAL',
  HARD = 'HARD'
}

/**
 * Control schemes
 */
export enum ControlScheme {
  KEYBOARD = 'KEYBOARD',
  MOUSE = 'MOUSE'
}

/**
 * Game settings interface
 */
export interface GameSettings {
  /** Enable/disable sound effects */
  soundEnabled: boolean;
  
  /** Enable/disable background music */
  musicEnabled: boolean;
  
  /** Master volume (0-100) */
  volume: number;
  
  /** Game difficulty level */
  difficulty: Difficulty;
  
  /** Preferred control scheme */
  controlScheme: ControlScheme;
}

/**
 * Default game settings
 */
export const DEFAULT_SETTINGS: GameSettings = {
  soundEnabled: true,
  musicEnabled: true,
  volume: 75,
  difficulty: Difficulty.NORMAL,
  controlScheme: ControlScheme.KEYBOARD
};

/**
 * Factory function to create default settings
 */
export function createDefaultSettings(): GameSettings {
  return { ...DEFAULT_SETTINGS };
}

/**
 * Factory function to create settings from partial data
 */
export function createSettings(partial: Partial<GameSettings>): GameSettings {
  return {
    ...DEFAULT_SETTINGS,
    ...partial
  };
}

/**
 * Validate settings object
 */
export function validateSettings(settings: GameSettings): boolean {
  return (
    typeof settings.soundEnabled === 'boolean' &&
    typeof settings.musicEnabled === 'boolean' &&
    typeof settings.volume === 'number' &&
    settings.volume >= 0 &&
    settings.volume <= 100 &&
    Object.values(Difficulty).includes(settings.difficulty) &&
    Object.values(ControlScheme).includes(settings.controlScheme)
  );
}
