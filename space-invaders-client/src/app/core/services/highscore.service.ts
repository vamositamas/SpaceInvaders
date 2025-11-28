import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, catchError, map, of, tap } from 'rxjs';
import { ApiService } from './api.service';
import { HighScore } from '../models';

/**
 * HighScoreService - Manages high score state
 * 
 * Features:
 * - Reactive high score state using BehaviorSubject
 * - Local caching of high scores
 * - API integration for persistence
 * - High score qualification checking
 * 
 * @example
 * ```typescript
 * constructor(private highScoreService: HighScoreService) {
 *   // Subscribe to score changes
 *   this.highScoreService.highScores$.subscribe(scores => {
 *     console.log('Top scores:', scores);
 *   });
 *   
 *   // Load scores
 *   this.highScoreService.loadHighScores(10);
 *   
 *   // Check if score qualifies
 *   this.highScoreService.isHighScore(1500).subscribe(qualifies => {
 *     if (qualifies) {
 *       console.log('New high score!');
 *     }
 *   });
 * }
 * ```
 */
@Injectable({
  providedIn: 'root'
})
export class HighScoreService {
  private readonly apiService = inject(ApiService);
  private readonly highScoresSubject = new BehaviorSubject<HighScore[]>([]);
  
  /**
   * Observable stream of current high scores
   */
  public readonly highScores$: Observable<HighScore[]> = this.highScoresSubject.asObservable();

  /**
   * Loads high scores from API and updates local cache
   * @param limit Optional limit for number of scores to load
   */
  loadHighScores(limit?: number): void {
    this.apiService.getHighScores(limit)
      .pipe(
        tap(scores => this.highScoresSubject.next(scores)),
        catchError(error => {
          console.error('Error loading high scores:', error);
          return of([]);
        })
      )
      .subscribe();
  }

  /**
   * Adds a new high score and refreshes the cache
   * @param score High score data to add
   * @returns Observable of the created high score
   */
  addHighScore(score: HighScore): Observable<HighScore> {
    return this.apiService.addHighScore(score)
      .pipe(
        tap(() => {
          // Refresh scores after adding
          this.loadHighScores();
        }),
        catchError(error => {
          console.error('Error adding high score:', error);
          throw error;
        })
      );
  }

  /**
   * Checks if a score qualifies as a high score
   * @param score Score to check
   * @returns Observable of boolean indicating if score qualifies
   */
  isHighScore(score: number): Observable<boolean> {
    const currentScores = this.highScoresSubject.value;
    
    // If less than 100 scores, any score qualifies
    if (currentScores.length < 100) {
      return of(true);
    }
    
    // Check if score is higher than the lowest score
    const lowestScore = currentScores[currentScores.length - 1];
    return of(score > lowestScore.score);
  }

  /**
   * Returns the current cached high scores synchronously
   * @returns Array of high scores
   */
  getHighScores(): HighScore[] {
    return this.highScoresSubject.value;
  }
}
