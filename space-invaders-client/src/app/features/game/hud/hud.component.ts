import { Component, OnInit, OnDestroy, signal, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { GameStateService } from '../../../core/services/game-state.service';
import { LegacyGameState } from '../../../core/models';
import { Subject, takeUntil } from 'rxjs';

/**
 * HUD Component
 * Displays game state information (score, lives, level, status)
 */
@Component({
  selector: 'app-hud',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatButtonModule, MatTooltipModule],
  templateUrl: './hud.component.html',
  styleUrl: './hud.component.scss'
})
export class HudComponent implements OnInit, OnDestroy {
  gameState: LegacyGameState = {
    score: 0,
    lives: 3,
    level: 1,
    isPaused: false,
    isGameOver: false,
    isPlaying: false
  };

  readonly rapidFireEnabled = signal(false);

  private destroy$ = new Subject<void>();
  private readonly cdr = inject(ChangeDetectorRef);

  constructor(private gameStateService: GameStateService) {}

  ngOnInit(): void {
    this.gameStateService.gameState$
      .pipe(takeUntil(this.destroy$))
      .subscribe(state => {
        this.gameState = state;
        this.cdr.markForCheck();
      });

    this.gameStateService.rapidFire$
      .pipe(takeUntil(this.destroy$))
      .subscribe(enabled => this.rapidFireEnabled.set(enabled));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  toggleRapidFire(): void {
    this.gameStateService.toggleRapidFire();
  }
}
