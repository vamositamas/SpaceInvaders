import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { GameConfig, HighScore } from '../models';
import { GameSettings } from '../models/settings.model';
import { environment } from '../../../environments/environment';
import { ErrorHandlerService } from './error-handler.service';

/**
 * ApiService - Handles HTTP communication with the Node.js backend
 * 
 * Features:
 * - Type-safe API calls using TypeScript interfaces
 * - Automatic retry for failed requests (up to 2 retries)
 * - Comprehensive error handling
 * - Environment-based API URL configuration
 * 
 * @example
 * ```typescript
 * constructor(private apiService: ApiService) {}
 * 
 * // Get game configuration
 * this.apiService.getConfig().subscribe(config => {
 *   console.log('Config:', config);
 * });
 * 
 * // Add high score
 * this.apiService.addHighScore({
 *   playerName: 'Player1',
 *   score: 1000,
 *   level: 5
 * }).subscribe(score => {
 *   console.log('Score added:', score);
 * });
 * ```
 */
@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;
  private readonly errorHandler = inject(ErrorHandlerService);

  /**
   * Get game configuration
   * @returns Observable of GameConfig
   */
  getConfig(): Observable<GameConfig> {
    return this.http.get<GameConfig>(`${this.apiUrl}/config`)
      .pipe(
        retry(2),
        catchError(err => this.errorHandler.handleError(err))
      );
  }

  /**
   * Update game configuration
   * @param config Partial configuration to update
   * @returns Observable of updated GameConfig
   */
  updateConfig(config: Partial<GameConfig>): Observable<GameConfig> {
    return this.http.put<GameConfig>(`${this.apiUrl}/config`, config)
      .pipe(
        retry(2),
        catchError(err => this.errorHandler.handleError(err))
      );
  }

  /**
   * Update a specific configuration property
   * @param property Property path (e.g., 'player.speed')
   * @param value New value for the property
   * @returns Observable of updated GameConfig
   */
  updateConfigProperty(property: string, value: any): Observable<GameConfig> {
    return this.http.post<GameConfig>(`${this.apiUrl}/config/${property}`, { value })
      .pipe(
        retry(2),
        catchError(err => this.errorHandler.handleError(err))
      );
  }

  /**
   * Reset configuration to defaults
   * @returns Observable of reset GameConfig
   */
  resetConfig(): Observable<GameConfig> {
    return this.http.post<GameConfig>(`${this.apiUrl}/config/reset`, {})
      .pipe(
        retry(2),
        catchError(err => this.errorHandler.handleError(err))
      );
  }

  /**
   * Get high scores
   * @param limit Optional limit for number of scores to return
   * @returns Observable of HighScore array
   */
  getHighScores(limit?: number): Observable<HighScore[]> {
    const url = limit
      ? `${this.apiUrl}/highscores?limit=${limit}`
      : `${this.apiUrl}/highscores`;
    
    return this.http.get<HighScore[]>(url)
      .pipe(
        retry(2),
        catchError(err => this.errorHandler.handleError(err))
      );
  }

  /**
   * Add a new high score
   * @param score High score data to add
   * @returns Observable of created HighScore with ID
   */
  addHighScore(score: HighScore): Observable<HighScore> {
    return this.http.post<HighScore>(`${this.apiUrl}/highscores`, score)
      .pipe(
        retry(2),
        catchError(err => this.errorHandler.handleError(err))
      );
  }

  /**
   * Get a high score by ID
   * @param id High score ID
   * @returns Observable of HighScore
   */
  getHighScoreById(id: string): Observable<HighScore> {
    return this.http.get<HighScore>(`${this.apiUrl}/highscores/${id}`)
      .pipe(
        retry(2),
        catchError(err => this.errorHandler.handleError(err))
      );
  }

  /**
   * Delete a high score by ID
   * @param id High score ID to delete
   * @returns Observable of void
   */
  deleteHighScore(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/highscores/${id}`)
      .pipe(
        retry(2),
        catchError(err => this.errorHandler.handleError(err))
      );
  }

  // ── Settings API ────────────────────────────────────────────────────────

  /**
   * Get player settings from the backend
   * @returns Observable of GameSettings
   */
  getSettings(): Observable<GameSettings> {
    return this.http.get<GameSettings>(`${this.apiUrl}/settings`)
      .pipe(
        retry(2),
        catchError(err => this.errorHandler.handleError(err))
      );
  }

  /**
   * Save player settings to the backend
   * @param settings Settings to save
   * @returns Observable of saved GameSettings
   */
  saveSettings(settings: GameSettings): Observable<GameSettings> {
    return this.http.put<GameSettings>(`${this.apiUrl}/settings`, settings)
      .pipe(
        catchError(err => this.errorHandler.handleError(err))
      );
  }

  /**
   * Reset player settings to defaults on the backend
   * @returns Observable of default GameSettings
   */
  resetSettings(): Observable<GameSettings> {
    return this.http.post<GameSettings>(`${this.apiUrl}/settings/reset`, {})
      .pipe(
        catchError(err => this.errorHandler.handleError(err))
      );
  }
}
