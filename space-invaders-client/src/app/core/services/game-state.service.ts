import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, combineLatest, map } from 'rxjs';
import { GameConfig, LegacyGameState } from '../models';

/**
 * Service for managing game state
 * Handles score, lives, level, pause/resume, game over state
 */
@Injectable({
  providedIn: 'root'
})
export class GameStateService {
  // Initial state values
  private readonly INITIAL_SCORE = 0;
  private readonly INITIAL_LIVES = 3;
  private readonly INITIAL_LEVEL = 1;
  private readonly INITIAL_IS_PAUSED = false;
  private readonly INITIAL_IS_GAME_OVER = false;
  private readonly INITIAL_IS_PLAYING = false;

  // Individual state subjects
  private scoreSubject = new BehaviorSubject<number>(this.INITIAL_SCORE);
  private livesSubject = new BehaviorSubject<number>(this.INITIAL_LIVES);
  private levelSubject = new BehaviorSubject<number>(this.INITIAL_LEVEL);
  private isPausedSubject = new BehaviorSubject<boolean>(this.INITIAL_IS_PAUSED);
  private isGameOverSubject = new BehaviorSubject<boolean>(this.INITIAL_IS_GAME_OVER);
  private isPlayingSubject = new BehaviorSubject<boolean>(this.INITIAL_IS_PLAYING);
  private rapidFireSubject = new BehaviorSubject<boolean>(false);

  // Individual observables
  public readonly score$: Observable<number> = this.scoreSubject.asObservable();
  public readonly lives$: Observable<number> = this.livesSubject.asObservable();
  public readonly level$: Observable<number> = this.levelSubject.asObservable();
  public readonly isPaused$: Observable<boolean> = this.isPausedSubject.asObservable();
  public readonly isGameOver$: Observable<boolean> = this.isGameOverSubject.asObservable();
  public readonly rapidFire$: Observable<boolean> = this.rapidFireSubject.asObservable();

  // Combined game state observable
  public readonly gameState$: Observable<LegacyGameState> = combineLatest([
    this.score$,
    this.lives$,
    this.level$,
    this.isPaused$,
    this.isGameOver$,
    this.isPlayingSubject.asObservable()
  ]).pipe(
    map(([score, lives, level, isPaused, isGameOver, isPlaying]) => ({
      score,
      lives,
      level,
      isPaused,
      isGameOver,
      isPlaying
    }))
  );

  constructor() {}

  /**
   * Initialize game with configuration
   * Sets lives from config and sets isPlaying to true
   */
  initGame(config: GameConfig): void {
    this.scoreSubject.next(this.INITIAL_SCORE);
    this.livesSubject.next(config.player.lives);
    this.levelSubject.next(this.INITIAL_LEVEL);
    this.isPausedSubject.next(this.INITIAL_IS_PAUSED);
    this.isGameOverSubject.next(this.INITIAL_IS_GAME_OVER);
    this.isPlayingSubject.next(true);
  }

  /**
   * Add points to current score
   */
  updateScore(points: number): void {
    const currentScore = this.scoreSubject.value;
    this.scoreSubject.next(currentScore + points);
  }

  /**
   * Set number of lives
   */
  setLives(lives: number): void {
    this.livesSubject.next(lives);
  }

  /**
   * Set current level
   */
  setLevel(level: number): void {
    this.levelSubject.next(level);
  }

  /**
   * Pause the game
   */
  pause(): void {
    this.isPausedSubject.next(true);
  }

  /**
   * Resume the game
   */
  resume(): void {
    this.isPausedSubject.next(false);
  }

  /**
   * Set game over state
   * Sets isGameOver to true and isPlaying to false
   */
  gameOver(): void {
    this.isGameOverSubject.next(true);
    this.isPlayingSubject.next(false);
  }

  /**
   * Reset game to initial state
   */
  resetGame(): void {
    this.scoreSubject.next(this.INITIAL_SCORE);
    this.livesSubject.next(this.INITIAL_LIVES);
    this.levelSubject.next(this.INITIAL_LEVEL);
    this.isPausedSubject.next(this.INITIAL_IS_PAUSED);
    this.isGameOverSubject.next(this.INITIAL_IS_GAME_OVER);
    this.isPlayingSubject.next(this.INITIAL_IS_PLAYING);
    this.rapidFireSubject.next(false);
  }

  /**
   * Toggle rapid fire mode on/off
   */
  toggleRapidFire(): void {
    this.rapidFireSubject.next(!this.rapidFireSubject.value);
  }

  /**
   * Returns whether rapid fire is currently enabled
   */
  isRapidFireEnabled(): boolean {
    return this.rapidFireSubject.value;
  }

  /**
   * Get current state synchronously
   */
  getCurrentState(): LegacyGameState {
    return {
      score: this.scoreSubject.value,
      lives: this.livesSubject.value,
      level: this.levelSubject.value,
      isPaused: this.isPausedSubject.value,
      isGameOver: this.isGameOverSubject.value,
      isPlaying: this.isPlayingSubject.value
    };
  }
}
