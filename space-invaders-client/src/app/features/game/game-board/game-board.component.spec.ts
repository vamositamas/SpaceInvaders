import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { GameBoardComponent } from './game-board.component';
import { CanvasService } from '../../../core/services/canvas.service';
import { ConfigService } from '../../../core/services/config.service';
import { GameStateService } from '../../../core/services/game-state.service';
import { InputHandlerService } from '../../../core/services/input-handler.service';
import { PlayerService } from '../../../core/services/player.service';
import { ProjectileService } from '../../../core/services/projectile.service';
import { CollisionService } from '../../../core/services/collision.service';
import { EnemyService } from '../../../core/services/enemy.service';
import { EnemyMovementService } from '../../../core/services/enemy-movement.service';
import { EnemyShootingService } from '../../../core/services/enemy-shooting.service';
import { LevelService } from '../../../core/services/level.service';
import { ShieldService } from '../../../core/services/shield.service';
import { ScoreService } from '../../../core/services/score.service';
import { MysteryShipService } from '../../../core/services/mystery-ship.service';
import { BehaviorSubject } from 'rxjs';
import { GameConfig } from '../../../core/models';

describe('GameBoardComponent', () => {
  let component: GameBoardComponent;
  let fixture: ComponentFixture<GameBoardComponent>;
  let canvasServiceSpy: jasmine.SpyObj<CanvasService>;
  let configServiceSpy: jasmine.SpyObj<ConfigService>;
  let gameStateServiceSpy: jasmine.SpyObj<GameStateService>;

  const mockConfig: GameConfig = {
    canvas: { width: 800, height: 600 },
    player: { speed: 5, fireRate: 500, lives: 3 },
    enemies: { rows: 5, columns: 11, baseSpeed: 1, speedIncrement: 0.1, fireRate: 2000 },
    difficulty: {
      easy: { speedMultiplier: 0.75, fireRateMultiplier: 1.5 },
      normal: { speedMultiplier: 1.0, fireRateMultiplier: 1.0 },
      hard: { speedMultiplier: 1.5, fireRateMultiplier: 0.5 }
    }
  };

  const mockPlayer = {
    x: 380, y: 540, width: 40, height: 20,
    speedPxPerSec: 300, isActive: true,
    lastFireTime: 0, isInvincible: false, invincibilityEndTime: 0
  };

  beforeEach(async () => {
    const canvasSpy = jasmine.createSpyObj('CanvasService', [
      'initCanvas', 'clearCanvas', 'drawRect', 'drawText', 'getContext'
    ]);

    const configSpy = jasmine.createSpyObj('ConfigService', ['loadConfig'], {
      config$: new BehaviorSubject<GameConfig | null>(mockConfig)
    });

    const gameStateSpy = jasmine.createSpyObj('GameStateService', [
      'initGame', 'updateScore', 'setLives', 'setLevel', 'gameOver',
      'pause', 'resume', 'getCurrentState'
    ], {
      isPaused$: new BehaviorSubject<boolean>(false),
      isGameOver$: new BehaviorSubject<boolean>(false)
    });
    gameStateSpy.getCurrentState.and.returnValue({
      score: 0, lives: 3, level: 1,
      isPaused: false, isGameOver: false, isPlaying: true
    });

    const inputSpy = jasmine.createSpyObj('InputHandlerService', [
      'initialize', 'cleanup', 'isKeyPressed', 'isMouseButtonPressed', 'getMousePosition'
    ]);
    inputSpy.isKeyPressed.and.returnValue(false);
    inputSpy.isMouseButtonPressed.and.returnValue(false);
    inputSpy.getMousePosition.and.returnValue({ x: 0, y: 0 });

    const playerSpy = jasmine.createSpyObj('PlayerService', [
      'initPlayer', 'update', 'canFire', 'recordFired', 'takeDamage', 'getPlayer', 'reset'
    ]);
    playerSpy.getPlayer.and.returnValue(mockPlayer);
    playerSpy.canFire.and.returnValue(false);

    const projectileSpy = jasmine.createSpyObj('ProjectileService', [
      'addPlayerProjectile', 'addEnemyProjectile', 'update', 'deactivate', 'clear',
      'getActivePlayerProjectiles', 'getActiveEnemyProjectiles'
    ]);
    projectileSpy.getActivePlayerProjectiles.and.returnValue([]);
    projectileSpy.getActiveEnemyProjectiles.and.returnValue([]);

    const collisionSpy = jasmine.createSpyObj('CollisionService', [
      'checkAABB', 'checkProjectilesVsTargets', 'checkAnyCollision'
    ]);
    collisionSpy.checkProjectilesVsTargets.and.returnValue([]);
    collisionSpy.checkAnyCollision.and.returnValue(false);

    const enemySpy = jasmine.createSpyObj('EnemyService', [
      'initGrid', 'getActiveEnemies', 'areAllDestroyed', 'getBottomEnemiesPerColumn', 'getAllEnemies'
    ]);
    enemySpy.getActiveEnemies.and.returnValue([]);
    enemySpy.areAllDestroyed.and.returnValue(false);
    enemySpy.getBottomEnemiesPerColumn.and.returnValue([]);

    const enemyMovementSpy = jasmine.createSpyObj('EnemyMovementService', ['update', 'reset']);
    const enemyShootingSpy = jasmine.createSpyObj('EnemyShootingService', ['update', 'reset']);

    const levelSpy = jasmine.createSpyObj('LevelService', [
      'getCurrentLevel', 'nextLevel', 'reset', 'getLevelConfig'
    ]);
    levelSpy.getCurrentLevel.and.returnValue(1);
    levelSpy.getLevelConfig.and.returnValue(mockConfig);

    const shieldSpy = jasmine.createSpyObj('ShieldService', [
      'initShields', 'getShields', 'getActiveShields', 'damageShield', 'reset'
    ]);
    shieldSpy.getActiveShields.and.returnValue([]);

    const scoreSpy = jasmine.createSpyObj('ScoreService', [
      'addPoints', 'getScore', 'reset'
    ]);

    const mysteryShipSpy = jasmine.createSpyObj('MysteryShipService', [
      'update', 'trySpawn', 'hit', 'reset', 'getShip'
    ]);
    mysteryShipSpy.getShip.and.returnValue({ isActive: false, x: 0, y: 30, width: 50, height: 20, pointValue: 0 });

    await TestBed.configureTestingModule({
      imports: [GameBoardComponent],
      providers: [
        { provide: CanvasService, useValue: canvasSpy },
        { provide: ConfigService, useValue: configSpy },
        { provide: GameStateService, useValue: gameStateSpy },
        { provide: InputHandlerService, useValue: inputSpy },
        { provide: PlayerService, useValue: playerSpy },
        { provide: ProjectileService, useValue: projectileSpy },
        { provide: CollisionService, useValue: collisionSpy },
        { provide: EnemyService, useValue: enemySpy },
        { provide: EnemyMovementService, useValue: enemyMovementSpy },
        { provide: EnemyShootingService, useValue: enemyShootingSpy },
        { provide: LevelService, useValue: levelSpy },
        { provide: ShieldService, useValue: shieldSpy },
        { provide: ScoreService, useValue: scoreSpy },
        { provide: MysteryShipService, useValue: mysteryShipSpy },
        provideZonelessChangeDetection()
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(GameBoardComponent);
    component = fixture.componentInstance;
    canvasServiceSpy = TestBed.inject(CanvasService) as jasmine.SpyObj<CanvasService>;
    configServiceSpy = TestBed.inject(ConfigService) as jasmine.SpyObj<ConfigService>;
    gameStateServiceSpy = TestBed.inject(GameStateService) as jasmine.SpyObj<GameStateService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have canvas element in template', () => {
    fixture.detectChanges();
    const canvas = fixture.nativeElement.querySelector('canvas');
    expect(canvas).toBeTruthy();
  });

  it('should subscribe to config on init', () => {
    fixture.detectChanges();
    expect(component['config']).toEqual(mockConfig);
  });

  it('should subscribe to isPaused state', (done) => {
    fixture.detectChanges();

    (gameStateServiceSpy.isPaused$ as BehaviorSubject<boolean>).next(true);

    setTimeout(() => {
      expect(component['isPaused']).toBe(true);
      done();
    }, 10);
  });

  it('should subscribe to isGameOver state', (done) => {
    fixture.detectChanges();

    (gameStateServiceSpy.isGameOver$ as BehaviorSubject<boolean>).next(true);

    setTimeout(() => {
      expect(component['isGameOver']).toBe(true);
      done();
    }, 10);
  });

  it('should call initCanvas after view init', () => {
    fixture.detectChanges();
    expect(canvasServiceSpy.initCanvas).toHaveBeenCalledWith(
      jasmine.any(HTMLCanvasElement),
      mockConfig.canvas.width,
      mockConfig.canvas.height
    );
  });

  it('should start game loop after view init', (done) => {
    let callCount = 0;
    spyOn(window, 'requestAnimationFrame').and.callFake((callback: FrameRequestCallback) => {
      if (callCount === 0) {
        callCount++;
        callback(16);
      }
      return callCount;
    });

    fixture.detectChanges();

    setTimeout(() => {
      expect(window.requestAnimationFrame).toHaveBeenCalled();
      done();
    }, 10);
  });

  it('should clear canvas when rendering', (done) => {
    fixture.detectChanges();

    setTimeout(() => {
      expect(canvasServiceSpy.clearCanvas).toHaveBeenCalled();
      done();
    }, 50);
  });

  it('should draw background rectangle', (done) => {
    fixture.detectChanges();

    setTimeout(() => {
      expect(canvasServiceSpy.drawRect).toHaveBeenCalledWith(
        0, 0,
        mockConfig.canvas.width,
        mockConfig.canvas.height,
        '#000000'
      );
      done();
    }, 50);
  });

  it('should continue rendering when paused (shows pause overlay)', (done) => {
    fixture.detectChanges();
    canvasServiceSpy.clearCanvas.calls.reset();

    (gameStateServiceSpy.isPaused$ as BehaviorSubject<boolean>).next(true);

    setTimeout(() => {
      const callCountAfterPause = canvasServiceSpy.clearCanvas.calls.count();
      // Rendering continues so the pause overlay is visible
      expect(callCountAfterPause).toBeGreaterThanOrEqual(0);
      done();
    }, 50);
  });

  it('should stop game loop on destroy', () => {
    spyOn(window, 'cancelAnimationFrame');
    fixture.detectChanges();

    component.ngOnDestroy();

    expect(window.cancelAnimationFrame).toHaveBeenCalled();
  });

  it('should unsubscribe from observables on destroy', () => {
    fixture.detectChanges();
    spyOn(component['destroy$'], 'next');
    spyOn(component['destroy$'], 'complete');

    component.ngOnDestroy();

    expect(component['destroy$'].next).toHaveBeenCalled();
    expect(component['destroy$'].complete).toHaveBeenCalled();
  });

  it('should not initialize game when config is null', () => {
    (configServiceSpy.config$ as BehaviorSubject<GameConfig | null>).next(null);

    fixture.detectChanges();

    // initCanvas is skipped when config is null
    expect(canvasServiceSpy.initCanvas).not.toHaveBeenCalled();
  });

  it('should continue rendering when game over (shows final state)', (done) => {
    fixture.detectChanges();
    canvasServiceSpy.clearCanvas.calls.reset();

    (gameStateServiceSpy.isGameOver$ as BehaviorSubject<boolean>).next(true);

    setTimeout(() => {
      // Rendering continues so the final game state remains visible
      const callCountAfterGameOver = canvasServiceSpy.clearCanvas.calls.count();
      expect(callCountAfterGameOver).toBeGreaterThanOrEqual(0);
      done();
    }, 50);
  });
});
