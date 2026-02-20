import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Subject, takeUntil } from 'rxjs';
import { GameStateService } from '../../core/services/game-state.service';
import { HighScoreService } from '../../core/services/highscore.service';

/**
 * Game Over Screen Component
 * Displays game over state with score, level, and high score submission
 */
@Component({
  selector: 'app-game-over',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './game-over.component.html',
  styleUrl: './game-over.component.scss'
})
export class GameOverComponent implements OnInit, OnDestroy {
  /**
   * Final score achieved
   */
  finalScore = 0;

  /**
   * Level/Wave reached
   */
  levelReached = 1;

  /**
   * Whether the score qualifies as a high score
   */
  isHighScore = false;

  /**
   * Form for player name submission
   */
  form: FormGroup;

  /**
   * Whether the form is currently submitting
   */
  isSubmitting = false;

  /**
   * Error message from submission attempt
   */
  submissionError = '';

  /**
   * Subject for managing subscriptions
   */
  private destroy$ = new Subject<void>();

  constructor(
    private router: Router,
    private gameStateService: GameStateService,
    private highScoreService: HighScoreService,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      playerName: [
        '',
        [
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(20),
          Validators.pattern(/^[a-zA-Z0-9\s]*$/) // Alphanumeric and spaces only
        ]
      ]
    });
  }

  ngOnInit(): void {
    const state = this.gameStateService.getCurrentState();
    this.finalScore = state.score;
    this.levelReached = state.level;
    this.isHighScore = this.highScoreService.checkIfHighScore(this.finalScore);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Submit high score to backend
   */
  submitHighScore(): void {
    // Validate form
    if (!this.form.valid) {
      return;
    }

    this.isSubmitting = true;
    this.submissionError = '';

    // Get trimmed player name
    const playerName = this.form.get('playerName')?.value?.trim();

    // Submit to backend
    this.highScoreService
      .addHighScore({
        playerName,
        score: this.finalScore,
        level: this.levelReached
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.isSubmitting = false;
          // Navigate to main menu after successful submission
          this.router.navigate(['/']);
        },
        error: (err) => {
          this.isSubmitting = false;
          this.submissionError = err?.error?.message || 'There was an error saving your high score. Please try again.';
        }
      });
  }

  /**
   * Navigate to play again
   */
  playAgain(): void {
    this.gameStateService.resetGame();
    this.router.navigate(['/game']);
  }

  /**
   * Navigate to main menu
   */
  returnToMenu(): void {
    this.router.navigate(['/']);
  }
}
