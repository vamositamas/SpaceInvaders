import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { CanvasService } from '../../../core/services/canvas.service';
import { ConfigService } from '../../../core/services/config.service';
import { GameStateService } from '../../../core/services/game-state.service';
import { GameConfig } from '../../../core/models';
import { Subject, takeUntil } from 'rxjs';

/**
 * Game Board Component
 * Main game rendering component that manages the canvas and game loop
 */
@Component({
  selector: 'app-game-board',
  standalone: true,
  imports: [],
  templateUrl: './game-board.component.html',
  styleUrl: './game-board.component.scss'
})
export class GameBoardComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('gameCanvas', { static: false }) canvasRef!: ElementRef<HTMLCanvasElement>;
  
  private destroy$ = new Subject<void>();
  private animationFrameId?: number;
  private config: GameConfig | null = null;
  private isPaused = false;
  private isGameOver = false;

  constructor(
    private canvasService: CanvasService,
    private configService: ConfigService,
    private gameStateService: GameStateService
  ) {}

  ngOnInit(): void {
    // Subscribe to config
    this.configService.config$
      .pipe(takeUntil(this.destroy$))
      .subscribe(config => {
        this.config = config;
      });

    // Subscribe to game state
    this.gameStateService.isPaused$
      .pipe(takeUntil(this.destroy$))
      .subscribe(paused => {
        this.isPaused = paused;
      });

    this.gameStateService.isGameOver$
      .pipe(takeUntil(this.destroy$))
      .subscribe(gameOver => {
        this.isGameOver = gameOver;
        if (gameOver) {
          this.stopGameLoop();
        }
      });
  }

  ngAfterViewInit(): void {
    this.initializeCanvas();
    this.startGameLoop();
  }

  ngOnDestroy(): void {
    this.stopGameLoop();
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializeCanvas(): void {
    if (!this.config) {
      console.error('Config not loaded');
      return;
    }

    const canvas = this.canvasRef.nativeElement;
    const { width, height } = this.config.canvas;
    
    this.canvasService.initCanvas(canvas, width, height);
  }

  private startGameLoop(): void {
    const gameLoop = () => {
      if (!this.isPaused && !this.isGameOver) {
        this.render();
      }
      this.animationFrameId = requestAnimationFrame(gameLoop);
    };
    this.animationFrameId = requestAnimationFrame(gameLoop);
  }

  private stopGameLoop(): void {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = undefined;
    }
  }

  private render(): void {
    this.canvasService.clearCanvas();
    
    // Draw background (black)
    if (this.config) {
      this.canvasService.drawRect(
        0, 
        0, 
        this.config.canvas.width, 
        this.config.canvas.height, 
        '#000000'
      );
    }

    // TODO: Draw game objects (player, enemies, projectiles)
  }
}
