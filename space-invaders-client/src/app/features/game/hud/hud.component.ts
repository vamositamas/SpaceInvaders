import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
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
  imports: [CommonModule, MatCardModule, MatIconModule],
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

  private destroy$ = new Subject<void>();

  constructor(private gameStateService: GameStateService) {}

  ngOnInit(): void {
    this.gameStateService.gameState$
      .pipe(takeUntil(this.destroy$))
      .subscribe(state => {
        this.gameState = state;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
