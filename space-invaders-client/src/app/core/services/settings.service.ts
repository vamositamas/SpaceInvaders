/**
 * SettingsService
 * Manages game settings with localStorage persistence and backend sync
 */

import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, EMPTY, Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import {
  GameSettings,
  Difficulty,
  ControlScheme,
  DEFAULT_SETTINGS,
  createDefaultSettings,
  validateSettings
} from '../models/settings.model';
import { ApiService } from './api.service';

const STORAGE_KEY = 'space-invaders-settings';

/**
 * Service for managing game settings
 * 
 * Features:
 * - Reactive settings state using BehaviorSubject
 * - localStorage persistence
 * - Sound, music, and volume controls
 * - Difficulty level management
 * - Control scheme configuration
 * - Reset to defaults
 * 
 * @example
 * ```typescript
 * constructor(private settingsService: SettingsService) {
 *   this.settingsService.settings$.subscribe(settings => {
 *     console.log('Volume:', settings.volume);
 *   });
 *   
 *   this.settingsService.setVolume(80);
 *   this.settingsService.saveSettings();
 * }
 * ```
 */
@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  private readonly settingsSubject: BehaviorSubject<GameSettings>;
  private readonly apiService = inject(ApiService);
  
  /**
   * Observable stream of current settings
   */
  public readonly settings$: Observable<GameSettings>;

  constructor() {
    // Load settings from localStorage or use defaults
    const initialSettings = this.loadFromStorage();
    this.settingsSubject = new BehaviorSubject<GameSettings>(initialSettings);
    this.settings$ = this.settingsSubject.asObservable();
    // Sync with backend; update if backend responds, keep localStorage on failure
    this.syncWithBackend();
  }

  // ============================================================================
  // Sound & Music Controls
  // ============================================================================

  /**
   * Toggle sound effects on/off
   */
  toggleSound(): void {
    const current = this.settingsSubject.value;
    this.updateSettings({
      ...current,
      soundEnabled: !current.soundEnabled
    });
  }

  /**
   * Toggle background music on/off
   */
  toggleMusic(): void {
    const current = this.settingsSubject.value;
    this.updateSettings({
      ...current,
      musicEnabled: !current.musicEnabled
    });
  }

  /**
   * Set master volume (0-100)
   * @param volume Volume level (will be clamped to 0-100)
   */
  setVolume(volume: number): void {
    // Clamp volume to valid range
    const clampedVolume = Math.max(0, Math.min(100, volume));
    
    const current = this.settingsSubject.value;
    this.updateSettings({
      ...current,
      volume: clampedVolume
    });
  }

  // ============================================================================
  // Difficulty Settings
  // ============================================================================

  /**
   * Set game difficulty level
   * @param difficulty Difficulty level
   */
  setDifficulty(difficulty: Difficulty): void {
    const current = this.settingsSubject.value;
    this.updateSettings({
      ...current,
      difficulty
    });
  }

  // ============================================================================
  // Control Settings
  // ============================================================================

  /**
   * Set control scheme
   * @param controlScheme Control scheme (KEYBOARD or MOUSE)
   */
  setControlScheme(controlScheme: ControlScheme): void {
    const current = this.settingsSubject.value;
    this.updateSettings({
      ...current,
      controlScheme
    });
  }

  // ============================================================================
  // Persistence
  // ============================================================================

  /**
   * Save current settings to localStorage and sync to backend
   */
  saveSettings(): void {
    const current = this.settingsSubject.value;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
    } catch (error) {
      console.error('Error saving settings to localStorage:', error);
    }
    // Sync to backend (fire-and-forget; failure is non-critical)
    this.apiService.saveSettings(current).pipe(
      catchError(() => EMPTY)
    ).subscribe();
  }

  /**
   * Reset settings to defaults
   */
  resetToDefaults(): void {
    this.updateSettings(createDefaultSettings());
    this.saveSettings();
  }

  /**
   * Restore settings from a settings object
   * @param settings Settings object to restore
   */
  restoreSettings(settings: GameSettings): void {
    if (validateSettings(settings)) {
      this.updateSettings(settings);
    } else {
      console.warn('Invalid settings provided, using defaults');
      this.resetToDefaults();
    }
  }

  // ============================================================================
  // Helper Methods
  // ============================================================================

  /**
   * Get current settings snapshot (synchronous)
   * @returns Current settings
   */
  getCurrentSettings(): GameSettings {
    return this.settingsSubject.value;
  }

  /**
   * Check if current settings differ from defaults
   * @returns True if settings have been modified
   */
  hasChanges(): boolean {
    const current = this.settingsSubject.value;
    return JSON.stringify(current) !== JSON.stringify(DEFAULT_SETTINGS);
  }

  // ============================================================================
  // Private Methods
  // ============================================================================

  /**
   * Update settings and emit to subscribers
   * @param settings New settings
   */
  private updateSettings(settings: GameSettings): void {
    this.settingsSubject.next(settings);
  }

  /**
   * Sync settings from backend. Updates state if backend responds;
   * silently keeps current settings if backend is unavailable.
   */
  private syncWithBackend(): void {
    this.apiService.getSettings().pipe(
      catchError(() => EMPTY)
    ).subscribe(backendSettings => {
      this.updateSettings(backendSettings);
    });
  }

  /**
   * Load settings from localStorage
   * @returns Loaded settings or defaults if not found/invalid
   */
  private loadFromStorage(): GameSettings {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      
      if (!stored) {
        return createDefaultSettings();
      }

      const parsed = JSON.parse(stored);
      
      // Validate loaded settings
      if (validateSettings(parsed)) {
        return parsed;
      } else {
        console.warn('Invalid settings in localStorage, using defaults');
        return createDefaultSettings();
      }
    } catch (error) {
      console.error('Error loading settings from localStorage:', error);
      return createDefaultSettings();
    }
  }
}
