import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { CanvasService } from '../../../core/services/canvas.service';
import { ConfigService } from '../../../core/services/config.service';
import { GameStateService } from '../../../core/services/game-state.service';
import { InputHandlerService } from '../../../core/services/input-handler.service';
import { PlayerService } from '../../../core/services/player.service';
import { ProjectileService } from '../../../core/services/projectile.service';
import { CollisionService } from '../../../core/services/collision.service';
import { EnemyService, EnemyEntity } from '../../../core/services/enemy.service';
import { EnemyMovementService } from '../../../core/services/enemy-movement.service';
import { EnemyShootingService } from '../../../core/services/enemy-shooting.service';
import { LevelService } from '../../../core/services/level.service';
import { ShieldService, ShieldEntity } from '../../../core/services/shield.service';
import { ScoreService } from '../../../core/services/score.service';
import { MysteryShipService } from '../../../core/services/mystery-ship.service';
import { GameConfig } from '../../../core/models';
import { Subject, takeUntil } from 'rxjs';

/** Total number of enemies in the grid (5 rows × 11 columns). */
const TOTAL_ENEMIES = 55;

/** Rapid fire reduces the cooldown to 1/4 of the normal rate. */
const RAPID_FIRE_MULTIPLIER = 0.25;

/**
 * GameBoardComponent
 *
 * Hosts the game canvas and drives the frame loop.
 * Pure game logic is delegated to injectable services following
 * single-responsibility principle.
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
  private gameInitialized = false;

  /** Used for deltaTime calculation. */
  private lastTimestamp = 0;
  /** Track previous pause-key state to detect a single press. */
  private pauseKeyWasDown = false;

  constructor(
    private canvasService: CanvasService,
    private configService: ConfigService,
    private gameStateService: GameStateService,
    private inputHandlerService: InputHandlerService,
    private playerService: PlayerService,
    private projectileService: ProjectileService,
    private collisionService: CollisionService,
    private enemyService: EnemyService,
    private enemyMovementService: EnemyMovementService,
    private enemyShootingService: EnemyShootingService,
    private levelService: LevelService,
    private shieldService: ShieldService,
    private scoreService: ScoreService,
    private mysteryShipService: MysteryShipService
  ) {}

  ngOnInit(): void {
    this.configService.config$
      .pipe(takeUntil(this.destroy$))
      .subscribe(config => {
        this.config = config;
      });

    this.gameStateService.isPaused$
      .pipe(takeUntil(this.destroy$))
      .subscribe(paused => { this.isPaused = paused; });

    this.gameStateService.isGameOver$
      .pipe(takeUntil(this.destroy$))
      .subscribe(gameOver => { this.isGameOver = gameOver; });
  }

  ngAfterViewInit(): void {
    this.initializeCanvas();
    this.initGame();
    this.startGameLoop();
  }

  ngOnDestroy(): void {
    this.stopGameLoop();
    this.inputHandlerService.cleanup();
    this.destroy$.next();
    this.destroy$.complete();
  }

  // ─── Initialisation ──────────────────────────────────────────────────────

  private initializeCanvas(): void {
    if (!this.config) return;
    const canvas = this.canvasRef.nativeElement;
    const { width, height } = this.config.canvas;
    this.canvasService.initCanvas(canvas, width, height);
  }

  private initGame(): void {
    if (!this.config) return;
    const { width, height } = this.config.canvas;
    const canvas = this.canvasRef.nativeElement;

    this.inputHandlerService.initialize(canvas);
    this.gameStateService.initGame(this.config);
    this.playerService.initPlayer(width, height, this.config);
    this.enemyService.initGrid(this.config, width);
    this.shieldService.initShields(width, height);
    this.projectileService.clear();
    this.levelService.reset();
    this.enemyMovementService.reset();
    this.enemyShootingService.reset();
    this.mysteryShipService.reset();
    this.scoreService.reset();
    this.gameInitialized = true;
  }

  // ─── Game loop ───────────────────────────────────────────────────────────

  private startGameLoop(): void {
    const loop = (timestamp: number) => {
      const deltaTime = this.lastTimestamp
        ? Math.min(timestamp - this.lastTimestamp, 100)
        : 0;
      this.lastTimestamp = timestamp;

      if (!this.isPaused && !this.isGameOver && this.gameInitialized) {
        this.update(deltaTime, timestamp);
      }
      this.render(timestamp);

      this.animationFrameId = requestAnimationFrame(loop);
    };
    this.animationFrameId = requestAnimationFrame(loop);
  }

  private stopGameLoop(): void {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = undefined;
    }
  }

  // ─── Update ──────────────────────────────────────────────────────────────

  private update(deltaTime: number, currentTime: number): void {
    if (!this.config) return;
    const { width, height } = this.config.canvas;

    this.handlePauseInput();

    const player = this.playerService.getPlayer();
    if (!player) return;

    // Update player movement
    this.playerService.update(deltaTime, this.inputHandlerService, width, currentTime);

    // Player fire input: space key or left mouse click
    const firePressed = this.inputHandlerService.isKeyPressed(' ')
      || this.inputHandlerService.isMouseButtonPressed(0);
    const effectiveFireRate = this.gameStateService.isRapidFireEnabled()
      ? this.config.player.fireRate * RAPID_FIRE_MULTIPLIER
      : this.config.player.fireRate;
    if (firePressed && this.playerService.canFire(currentTime, effectiveFireRate)) {
      const px = player.x + player.width / 2 - ProjectileService.PROJECTILE_WIDTH / 2;
      const py = player.y;
      this.projectileService.addPlayerProjectile(px, py);
      this.playerService.recordFired(currentTime);
    }

    // Update all projectile positions and cull off-screen
    this.projectileService.update(deltaTime, height);

    // Update enemy formation movement
    const activeEnemies = this.enemyService.getActiveEnemies();
    this.enemyMovementService.update(deltaTime, activeEnemies, width, TOTAL_ENEMIES);

    // Update enemy shooting
    const levelConfig = this.levelService.getLevelConfig(
      this.levelService.getCurrentLevel(), this.config
    );
    this.enemyShootingService.update(
      deltaTime,
      this.enemyService.getBottomEnemiesPerColumn(),
      (x, y) => this.projectileService.addEnemyProjectile(x, y),
      currentTime,
      levelConfig.enemies.fireRate
    );

    // Update mystery ship
    this.mysteryShipService.update(deltaTime, currentTime, width);

    // ── Collision detection ─────────────────────────────────────────────
    const playerProjs = this.projectileService.getActivePlayerProjectiles();
    const enemyProjs = this.projectileService.getActiveEnemyProjectiles();

    // Player projectiles vs enemies
    this.resolveCollisions(
      this.collisionService.checkProjectilesVsTargets(playerProjs, activeEnemies as EnemyEntity[]),
      (projectile, target) => {
        this.projectileService.deactivate(projectile as ReturnType<typeof this.projectileService.getActivePlayerProjectiles>[0]);
        (target as EnemyEntity).isActive = false;
        const pts = (target as EnemyEntity).pointValue;
        this.scoreService.addPoints(pts, currentTime);
        this.gameStateService.updateScore(pts);
      }
    );

    // Player projectiles vs shields
    this.resolveCollisions(
      this.collisionService.checkProjectilesVsTargets(playerProjs, this.shieldService.getActiveShields() as ShieldEntity[]),
      (projectile, target) => {
        this.projectileService.deactivate(projectile as ReturnType<typeof this.projectileService.getActivePlayerProjectiles>[0]);
        this.shieldService.damageShield(target as ShieldEntity);
      }
    );

    // Player projectiles vs mystery ship
    const mysteryShip = this.mysteryShipService.getShip();
    if (mysteryShip.isActive) {
      const pVsMs = playerProjs.find(p => this.collisionService.checkAABB(p, mysteryShip));
      if (pVsMs) {
        this.projectileService.deactivate(pVsMs);
        const pts = this.mysteryShipService.hit();
        this.scoreService.addPoints(pts, currentTime);
        this.gameStateService.updateScore(pts);
      }
    }

    // Enemy projectiles vs shields
    this.resolveCollisions(
      this.collisionService.checkProjectilesVsTargets(enemyProjs, this.shieldService.getActiveShields() as ShieldEntity[]),
      (projectile, target) => {
        this.projectileService.deactivate(projectile as ReturnType<typeof this.projectileService.getActiveEnemyProjectiles>[0]);
        this.shieldService.damageShield(target as ShieldEntity);
      }
    );

    // Enemy projectiles vs player
    if (!player.isInvincible) {
      const hitProj = enemyProjs.find(p => this.collisionService.checkAABB(p, player));
      if (hitProj) {
        this.projectileService.deactivate(hitProj);
        this.playerService.takeDamage(currentTime);
        const newLives = this.gameStateService.getCurrentState().lives - 1;
        this.gameStateService.setLives(newLives);
        if (newLives <= 0) {
          this.gameStateService.gameOver();
          return;
        }
      }
    }

    // Enemies reaching bottom or overlapping player
    const updatedEnemies = this.enemyService.getActiveEnemies();
    for (const enemy of updatedEnemies) {
      if (enemy.y + enemy.height >= player.y || enemy.y + enemy.height >= height) {
        this.gameStateService.gameOver();
        return;
      }
    }

    // Level complete: all enemies destroyed
    if (this.enemyService.areAllDestroyed()) {
      this.levelService.nextLevel();
      const nextLevel = this.levelService.getCurrentLevel();
      const nextLevelConfig = this.levelService.getLevelConfig(nextLevel, this.config);
      this.gameStateService.setLevel(nextLevel);
      this.enemyService.initGrid(nextLevelConfig, width);
      this.shieldService.initShields(width, height);
      this.playerService.initPlayer(width, height, this.config);
      this.enemyMovementService.reset();
      this.enemyShootingService.reset();
      this.projectileService.clear();
      this.mysteryShipService.reset();
    }
  }

  /**
   * Process collision pairs, deduplicating on projectile so each projectile
   * only resolves one collision even if it overlaps multiple targets in one frame.
   */
  private resolveCollisions(
    pairs: { projectile: { isActive: boolean }; target: { isActive: boolean } }[],
    handler: (projectile: { isActive: boolean }, target: { isActive: boolean }) => void
  ): void {
    const hitProjectiles = new Set<object>();
    const hitTargets = new Set<object>();
    for (const { projectile, target } of pairs) {
      if (hitProjectiles.has(projectile) || hitTargets.has(target)) continue;
      hitProjectiles.add(projectile);
      hitTargets.add(target);
      handler(projectile, target);
    }
  }

  /** Toggle pause on 'p' or 'Escape' (single press, not hold). */
  private handlePauseInput(): void {
    const pauseDown = this.inputHandlerService.isKeyPressed('p')
      || this.inputHandlerService.isKeyPressed('escape');
    if (pauseDown && !this.pauseKeyWasDown) {
      this.isPaused ? this.gameStateService.resume() : this.gameStateService.pause();
    }
    this.pauseKeyWasDown = pauseDown;
  }

  // ─── Render ──────────────────────────────────────────────────────────────

  private render(timestamp: number): void {
    if (!this.config) return;
    const { width, height } = this.config.canvas;

    this.canvasService.clearCanvas();
    this.canvasService.drawRect(0, 0, width, height, '#000000');

    if (!this.gameInitialized) return;

    // Shields — colour intensity reflects remaining health
    for (const shield of this.shieldService.getActiveShields()) {
      const green = Math.floor(128 + 127 * (shield.health / shield.maxHealth));
      this.canvasService.drawRect(shield.x, shield.y, shield.width, shield.height, `rgb(0,${green},0)`);
    }

    // Mystery ship
    const ms = this.mysteryShipService.getShip();
    if (ms.isActive) {
      this.canvasService.drawRect(ms.x, ms.y, ms.width, ms.height, '#FF0000');
      this.canvasService.drawText(
        String(ms.pointValue),
        ms.x + ms.width / 2,
        ms.y - 4,
        '10px monospace',
        '#FF0000'
      );
    }

    // Enemies
    const enemyColors: Record<string, string> = {
      squid: '#00FFFF',
      crab: '#FFFFFF',
      octopus: '#FF00FF'
    };
    for (const enemy of this.enemyService.getActiveEnemies()) {
      this.canvasService.drawRect(enemy.x, enemy.y, enemy.width, enemy.height, enemyColors[enemy.type]);
    }

    // Player — flicker every 100 ms during invincibility
    const player = this.playerService.getPlayer();
    if (player && player.isActive) {
      const showPlayer = !player.isInvincible || Math.floor(timestamp / 100) % 2 === 0;
      if (showPlayer) {
        this.canvasService.drawRect(player.x, player.y, player.width, player.height, '#00FF00');
      }
    }

    // Enemy projectiles (orange)
    for (const p of this.projectileService.getActiveEnemyProjectiles()) {
      this.canvasService.drawRect(p.x, p.y, p.width, p.height, '#FF6600');
    }

    // Player projectiles (yellow)
    for (const p of this.projectileService.getActivePlayerProjectiles()) {
      this.canvasService.drawRect(p.x, p.y, p.width, p.height, '#FFFF00');
    }

    // Pause overlay
    if (this.isPaused) {
      this.canvasService.drawRect(0, 0, width, height, 'rgba(0,0,0,0.5)');
      this.canvasService.drawText('PAUSED', width / 2, height / 2, '48px monospace', '#FFFFFF');
    }
  }
}
