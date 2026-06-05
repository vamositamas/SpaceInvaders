import { Component, OnInit, OnDestroy, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Subject, takeUntil } from 'rxjs';
import { GameStateService } from '../../../core/services/game-state.service';

/**
 * PauseOverlayComponent
 *
 * Renders a full-canvas overlay when the game is paused.
 * Provides "Resume" and "Main Menu" actions.
 */
@Component({
  selector: 'app-pause-overlay',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule],
  templateUrl: './pause-overlay.component.html',
  styleUrl: './pause-overlay.component.scss'
})
export class PauseOverlayComponent implements OnInit, OnDestroy {
  isPaused = false;
  private readonly cdr = inject(ChangeDetectorRef);

  readonly destroy$ = new Subject<void>();

  constructor(
    private readonly gameStateService: GameStateService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.gameStateService.isPaused$
      .pipe(takeUntil(this.destroy$))
      .subscribe(paused => {
        this.isPaused = paused;
        this.cdr.markForCheck();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /** Resume the game. */
  resume(): void {
    this.gameStateService.resume();
  }

  /** Reset game state and navigate back to the main menu. */
  returnToMenu(): void {
    this.gameStateService.resetGame();
    this.router.navigate(['/']);
  }
}
