import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { CanvasService } from '../../../core/services/canvas.service';
import { ConfigService } from '../../../core/services/config.service';
import { GameStateService } from '../../../core/services/game-state.service';
import { InputHandlerService } from '../../../core/services/input-handler.service';
import { PlayerService } from '../../../core/services/player.service';
import { ProjectileService } from '../../../core/services/projectile.service';
import { CollisionService, Rect } from '../../../core/services/collision.service';
import { EnemyService, EnemyEntity } from '../../../core/services/enemy.service';
import { EnemyMovementService } from '../../../core/services/enemy-movement.service';
import { EnemyShootingService } from '../../../core/services/enemy-shooting.service';
import { LevelService } from '../../../core/services/level.service';
import { ShieldService, ShieldEntity } from '../../../core/services/shield.service';
import { ScoreService } from '../../../core/services/score.service';
import { MysteryShipService } from '../../../core/services/mystery-ship.service';
import { AudioService } from '../../../core/services/audio.service';
import { ParticleService } from '../../../core/services/particle.service';
import { GameConfig } from '../../../core/models';
import { Subject, takeUntil } from 'rxjs';

/** Total number of enemies in the grid (5 rows × 11 columns). */
const TOTAL_ENEMIES = 55;

/** Rapid fire reduces the cooldown to 1/4 of the normal rate. */
const RAPID_FIRE_MULTIPLIER = 0.25;

// Sprite matrices for pixelated retro arcade elements
const PLAYER_SPRITE = [
  '00000100000',
  '00001110000',
  '00001110000',
  '01111111110',
  '11111111111',
  '11111111111',
  '11111111111',
  '11111111111'
];

const SQUID_SPRITES = [
  [
    '00011000',
    '00111100',
    '01111110',
    '11011011',
    '11111111',
    '00100100',
    '01011010',
    '10100101'
  ],
  [
    '00011000',
    '00111100',
    '01111110',
    '11011011',
    '11111111',
    '01011010',
    '10000101',
    '01000010'
  ]
];

const CRAB_SPRITES = [
  [
    '0010000100',
    '0001001000',
    '0011111100',
    '0110110110',
    '1111111111',
    '1011111101',
    '1010000101',
    '0001111000'
  ],
  [
    '0010000100',
    '1001001001',
    '1011111101',
    '1110110111',
    '0111111110',
    '0011111100',
    '0010000100',
    '0100000010'
  ]
];

const OCTOPUS_SPRITES = [
  [
    '0001111000',
    '0111111110',
    '1111111111',
    '1110000111',
    '1111111111',
    '0011001100',
    '0110110110',
    '1100000011'
  ],
  [
    '0001111000',
    '0111111110',
    '1111111111',
    '1110000111',
    '1111111111',
    '0001111000',
    '0010000100',
    '0100000010'
  ]
];

const UFO_SPRITE = [
  '00001111110000',
  '00111111111100',
  '01111111111110',
  '11011011011011',
  '11111111111111',
  '00111000111000',
  '00010000010000'
];

const SHIELD_SPRITE = [
  '000111111111111000',
  '001111111111111100',
  '011111111111111110',
  '111111111111111111',
  '111111111111111111',
  '111111111111111111',
  '111111100001111111',
  '111110000000111111',
  '111110000000111111',
  '111110000000111111'
];

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
    private mysteryShipService: MysteryShipService,
    private audioService: AudioService,
    private particleService: ParticleService
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
    this.particleService.clear();
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
      this.audioService.playShoot();
    }

    // Update all projectile positions and cull off-screen
    this.projectileService.update(deltaTime, height);

    // Update all active visual particles
    this.particleService.update(deltaTime);

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
      (x, y) => {
        this.projectileService.addEnemyProjectile(x, y);
        this.audioService.playShoot();
      },
      currentTime,
      levelConfig.enemies.fireRate
    );

    // Update mystery ship
    this.mysteryShipService.update(deltaTime, currentTime, width);

    // ── Collision detection ─────────────────────────────────────────────
    const playerProjs = this.projectileService.getActivePlayerProjectiles();
    const enemyProjs = this.projectileService.getActiveEnemyProjectiles();

    const enemyColors: Record<string, string> = {
      squid: '#00FFFF',
      crab: '#FFFFFF',
      octopus: '#FF00FF'
    };

    // Player projectiles vs enemies
    this.resolveCollisions(
      this.collisionService.checkProjectilesVsTargets(playerProjs, activeEnemies as EnemyEntity[]),
      (projectile, target) => {
        this.projectileService.deactivate(projectile as ReturnType<typeof this.projectileService.getActivePlayerProjectiles>[0]);
        (target as EnemyEntity).isActive = false;
        const pts = (target as EnemyEntity).pointValue;
        this.scoreService.addPoints(pts, currentTime);
        this.gameStateService.updateScore(pts);
        
        // Effects
        this.particleService.spawnExplosion(target.x + target.width / 2, target.y + target.height / 2, enemyColors[(target as EnemyEntity).type] || '#FFFFFF');
        this.audioService.playExplosion();
      }
    );

    // Player projectiles vs shields
    this.resolveCollisions(
      this.collisionService.checkProjectilesVsTargets(playerProjs, this.shieldService.getActiveShields() as ShieldEntity[]),
      (projectile, target) => {
        this.projectileService.deactivate(projectile as ReturnType<typeof this.projectileService.getActivePlayerProjectiles>[0]);
        this.shieldService.damageShield(target as ShieldEntity);

        // Effects
        this.particleService.spawnExplosion(projectile.x, projectile.y, '#00FF00', 4);
        this.audioService.playHit();
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

        // Effects
        this.particleService.spawnExplosion(mysteryShip.x + mysteryShip.width / 2, mysteryShip.y + mysteryShip.height / 2, '#FF0000', 25);
        this.audioService.playExplosion();
      }
    }

    // Enemy projectiles vs shields
    this.resolveCollisions(
      this.collisionService.checkProjectilesVsTargets(enemyProjs, this.shieldService.getActiveShields() as ShieldEntity[]),
      (projectile, target) => {
        this.projectileService.deactivate(projectile as ReturnType<typeof this.projectileService.getActiveEnemyProjectiles>[0]);
        this.shieldService.damageShield(target as ShieldEntity);

        // Effects
        this.particleService.spawnExplosion(projectile.x, projectile.y, '#00FF00', 4);
        this.audioService.playHit();
      }
    );

    // Enemy projectiles vs player
    if (!player.isInvincible) {
      const hitProj = enemyProjs.find(p => this.collisionService.checkAABB(p, player));
      if (hitProj) {
        this.projectileService.deactivate(hitProj);
        this.playerService.takeDamage(currentTime);
        
        // Effects
        this.particleService.spawnExplosion(player.x + player.width / 2, player.y + player.height / 2, '#00FF00', 30);
        this.audioService.playExplosion();

        const newLives = this.gameStateService.getCurrentState().lives - 1;
        this.gameStateService.setLives(newLives);
        if (newLives <= 0) {
          this.gameStateService.gameOver();
          this.audioService.playGameOver();
          return;
        }
      }
    }

    // Enemies reaching bottom or overlapping player
    const updatedEnemies = this.enemyService.getActiveEnemies();
    for (const enemy of updatedEnemies) {
      if (enemy.y + enemy.height >= player.y || enemy.y + enemy.height >= height) {
        this.gameStateService.gameOver();
        this.audioService.playGameOver();
        return;
      }
    }

    // Level complete: all enemies destroyed
    if (this.enemyService.areAllDestroyed()) {
      this.levelService.nextLevel();
      this.audioService.playLevelUp();
      const nextLevel = this.levelService.getCurrentLevel();
      const nextLevelConfig = this.levelService.getLevelConfig(nextLevel, this.config);
      this.gameStateService.setLevel(nextLevel);
      this.enemyService.initGrid(nextLevelConfig, width);
      this.shieldService.initShields(width, height);
      this.playerService.initPlayer(width, height, this.config);
      this.enemyMovementService.reset();
      this.enemyShootingService.reset();
      this.projectileService.clear();
      this.particleService.clear();
      this.mysteryShipService.reset();
    }
  }

  /**
   * Process collision pairs, deduplicating on projectile so each projectile
   * only resolves one collision even if it overlaps multiple targets in one frame.
   */
  private resolveCollisions(
    pairs: { projectile: Rect; target: Rect }[],
    handler: (projectile: Rect, target: Rect) => void
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

    let ctx: CanvasRenderingContext2D | undefined;
    try {
      ctx = this.canvasService.getContext();
    } catch (e) {
      // In unit testing getContext might throw or return undefined
    }

    // Shields — draw classic shield with erosion/shattering damage effect
    for (const shield of this.shieldService.getActiveShields()) {
      const green = Math.floor(128 + 127 * (shield.health / shield.maxHealth));
      const healthFraction = shield.health / shield.maxHealth;
      this.drawSprite(
        shield.x,
        shield.y,
        shield.width,
        shield.height,
        SHIELD_SPRITE,
        `rgb(0,${green},0)`,
        healthFraction * 100
      );
    }

    // Mystery ship
    const ms = this.mysteryShipService.getShip();
    if (ms.isActive) {
      this.drawSprite(ms.x, ms.y, ms.width, ms.height, UFO_SPRITE, '#FF0055');
      this.canvasService.drawText(
        String(ms.pointValue),
        ms.x + ms.width / 2 - 12,
        ms.y - 4,
        '10px monospace',
        '#FF0055'
      );
    }

    // Enemies
    const enemySprites: Record<string, string[][]> = {
      squid: SQUID_SPRITES,
      crab: CRAB_SPRITES,
      octopus: OCTOPUS_SPRITES
    };
    const enemyColors: Record<string, string> = {
      squid: '#00FFFF',
      crab: '#FFFFFF',
      octopus: '#FF00FF'
    };
    // Animation frame changes every 500ms
    const frameIndex = Math.floor(timestamp / 500) % 2;
    for (const enemy of this.enemyService.getActiveEnemies()) {
      const sprite = enemySprites[enemy.type][frameIndex];
      this.drawSprite(enemy.x, enemy.y, enemy.width, enemy.height, sprite, enemyColors[enemy.type]);
    }

    // Player — flicker every 100 ms during invincibility
    const player = this.playerService.getPlayer();
    if (player && player.isActive) {
      const showPlayer = !player.isInvincible || Math.floor(timestamp / 100) % 2 === 0;
      if (showPlayer) {
        this.drawSprite(player.x, player.y, player.width, player.height, PLAYER_SPRITE, '#39ff14');
      }
    }

    // Enemy projectiles (orange glow)
    for (const p of this.projectileService.getActiveEnemyProjectiles()) {
      if (ctx) {
        ctx.fillStyle = '#FF6600';
        ctx.shadowColor = '#FF6600';
        ctx.shadowBlur = 8;
        ctx.fillRect(p.x, p.y, p.width, p.height);
        ctx.shadowBlur = 0; // reset
      } else {
        this.canvasService.drawRect(p.x, p.y, p.width, p.height, '#FF6600');
      }
    }

    // Player projectiles (yellow glow)
    for (const p of this.projectileService.getActivePlayerProjectiles()) {
      if (ctx) {
        ctx.fillStyle = '#FFFF00';
        ctx.shadowColor = '#FFFF00';
        ctx.shadowBlur = 8;
        ctx.fillRect(p.x, p.y, p.width, p.height);
        ctx.shadowBlur = 0; // reset
      } else {
        this.canvasService.drawRect(p.x, p.y, p.width, p.height, '#FFFF00');
      }
    }

    // Fading visual particles
    for (const p of this.particleService.getParticles()) {
      const alpha = p.life / p.maxLife;
      let fillStyle = p.color;
      if (p.color.startsWith('#')) {
        const hex = p.color.slice(1);
        let r = 255, g = 255, b = 255;
        if (hex.length === 6) {
          r = parseInt(hex.slice(0, 2), 16);
          g = parseInt(hex.slice(2, 4), 16);
          b = parseInt(hex.slice(4, 6), 16);
        }
        fillStyle = `rgba(${r},${g},${b},${alpha})`;
      } else if (p.color.startsWith('rgb(')) {
        fillStyle = p.color.replace('rgb(', 'rgba(').replace(')', `,${alpha})`);
      }
      if (ctx) {
        ctx.fillStyle = fillStyle;
        ctx.fillRect(p.x, p.y, p.size, p.size);
      } else {
        this.canvasService.drawRect(p.x, p.y, p.size, p.size, fillStyle);
      }
    }

    // Pause overlay
    if (this.isPaused) {
      this.canvasService.drawRect(0, 0, width, height, 'rgba(0,0,0,0.5)');
      this.canvasService.drawText('PAUSED', width / 2 - 80, height / 2, '36px Orbitron', '#FFFFFF');
    }
  }

  /**
   * Draws a pixel-art sprite on the canvas.
   */
  private drawSprite(
    x: number,
    y: number,
    width: number,
    height: number,
    sprite: string[],
    color: string,
    erosionThreshold?: number
  ): void {
    const rows = sprite.length;
    const cols = sprite[0].length;
    const pixelW = width / cols;
    const pixelH = height / rows;

    for (let r = 0; r < rows; r++) {
      const rowStr = sprite[r];
      for (let c = 0; c < cols; c++) {
        if (rowStr[c] === '1') {
          if (erosionThreshold !== undefined) {
            const hash = (r * 17 + c * 31) % 100;
            if (hash >= erosionThreshold) {
              continue;
            }
          }
          this.canvasService.drawRect(x + c * pixelW, y + r * pixelH, pixelW + 0.5, pixelH + 0.5, color);
        }
      }
    }
  }
}
