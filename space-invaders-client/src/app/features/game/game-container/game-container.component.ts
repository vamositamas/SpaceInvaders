import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { GameBoardComponent } from '../game-board/game-board.component';
import { HudComponent } from '../hud/hud.component';
import { PauseOverlayComponent } from '../pause-overlay/pause-overlay.component';
import { ConfigService } from '../../../core/services/config.service';
import { GameStateService } from '../../../core/services/game-state.service';
import { Subject, takeUntil, filter } from 'rxjs';

/**
 * Game Container Component
 * Main container that composes the game board and HUD.
 * Responsible for initiating config loading and navigating to the
 * game-over screen when the game ends.
 */
@Component({
  selector: 'app-game-container',
  standalone: true,
  imports: [CommonModule, MatCardModule, GameBoardComponent, HudComponent, PauseOverlayComponent],
  templateUrl: './game-container.component.html',
  styleUrl: './game-container.component.scss'
})
export class GameContainerComponent implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject<void>();

  constructor(
    private configService: ConfigService,
    private gameStateService: GameStateService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Load configuration — GameBoardComponent calls initGame once the canvas is ready
    this.configService.loadConfig();

    // Navigate to game-over screen when the game ends
    this.gameStateService.isGameOver$
      .pipe(takeUntil(this.destroy$), filter(v => v))
      .subscribe(() => this.router.navigate(['/game-over']));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
