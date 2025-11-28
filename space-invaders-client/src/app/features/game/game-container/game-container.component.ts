import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { GameBoardComponent } from '../game-board/game-board.component';
import { HudComponent } from '../hud/hud.component';
import { ConfigService } from '../../../core/services/config.service';
import { GameStateService } from '../../../core/services/game-state.service';

/**
 * Game Container Component
 * Main container that composes the game board and HUD
 */
@Component({
  selector: 'app-game-container',
  standalone: true,
  imports: [CommonModule, MatCardModule, GameBoardComponent, HudComponent],
  templateUrl: './game-container.component.html',
  styleUrl: './game-container.component.scss'
})
export class GameContainerComponent implements OnInit {
  constructor(
    private configService: ConfigService,
    private gameStateService: GameStateService
  ) {}

  ngOnInit(): void {
    // Load configuration
    this.configService.loadConfig();
    
    // Initialize game when config is loaded
    this.configService.config$.subscribe(config => {
      if (config) {
        this.gameStateService.initGame(config);
      }
    });
  }
}
