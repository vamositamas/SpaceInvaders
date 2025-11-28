import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, catchError, of, tap } from 'rxjs';
import { ApiService } from './api.service';
import { GameConfig } from '../models';

/**
 * ConfigService - Manages game configuration state
 * 
 * Features:
 * - Reactive configuration state using BehaviorSubject
 * - Local caching of configuration
 * - API integration for persistence
 * - Synchronous and asynchronous access methods
 * 
 * @example
 * ```typescript
 * constructor(private configService: ConfigService) {
 *   // Subscribe to config changes
 *   this.configService.config$.subscribe(config => {
 *     if (config) {
 *       console.log('Canvas size:', config.canvas.width);
 *     }
 *   });
 *   
 *   // Load config from API
 *   this.configService.loadConfig();
 * }
 * ```
 */
@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  private readonly apiService = inject(ApiService);
  private readonly configSubject = new BehaviorSubject<GameConfig | null>(null);
  
  /**
   * Observable stream of current configuration
   */
  public readonly config$: Observable<GameConfig | null> = this.configSubject.asObservable();

  /**
   * Loads configuration from API and updates local cache
   */
  loadConfig(): void {
    this.apiService.getConfig()
      .pipe(
        tap(config => this.configSubject.next(config)),
        catchError(error => {
          console.error('Error loading config:', error);
          return of(null);
        })
      )
      .subscribe();
  }

  /**
   * Updates configuration with partial data
   * @param config Partial configuration to update
   */
  updateConfig(config: Partial<GameConfig>): void {
    this.apiService.updateConfig(config)
      .pipe(
        tap(updatedConfig => this.configSubject.next(updatedConfig)),
        catchError(error => {
          console.error('Error updating config:', error);
          return of(null);
        })
      )
      .subscribe();
  }

  /**
   * Updates a single configuration property
   * @param property Property path (e.g., 'player.speed')
   * @param value New value for the property
   */
  updateConfigProperty(property: string, value: any): void {
    this.apiService.updateConfigProperty(property, value)
      .pipe(
        tap(updatedConfig => this.configSubject.next(updatedConfig)),
        catchError(error => {
          console.error('Error updating config property:', error);
          return of(null);
        })
      )
      .subscribe();
  }

  /**
   * Resets configuration to defaults
   */
  resetConfig(): void {
    this.apiService.resetConfig()
      .pipe(
        tap(config => this.configSubject.next(config)),
        catchError(error => {
          console.error('Error resetting config:', error);
          return of(null);
        })
      )
      .subscribe();
  }

  /**
   * Returns the current cached configuration synchronously
   * @returns Current GameConfig or null if not loaded
   */
  getConfig(): GameConfig | null {
    return this.configSubject.value;
  }
}
