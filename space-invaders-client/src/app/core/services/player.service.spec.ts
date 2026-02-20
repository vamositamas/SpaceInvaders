import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { PlayerService } from './player.service';
import { InputHandlerService } from './input-handler.service';
import { GameConfig } from '../models';

describe('PlayerService', () => {
  let service: PlayerService;
  let inputHandler: jasmine.SpyObj<InputHandlerService>;

  const mockConfig: GameConfig = {
    canvas: { width: 800, height: 600 },
    player: { speed: 5, fireRate: 500, lives: 3 },
    enemies: { rows: 5, columns: 11, baseSpeed: 1, speedIncrement: 0.1, fireRate: 2000 },
    difficulty: {
      easy: { speedMultiplier: 0.75, fireRateMultiplier: 0.75 },
      normal: { speedMultiplier: 1, fireRateMultiplier: 1 },
      hard: { speedMultiplier: 1.5, fireRateMultiplier: 1.5 }
    }
  };

  beforeEach(() => {
    inputHandler = jasmine.createSpyObj('InputHandlerService', [
      'isKeyPressed', 'isMouseButtonPressed', 'getMousePosition'
    ]);
    inputHandler.isKeyPressed.and.returnValue(false);
    inputHandler.isMouseButtonPressed.and.returnValue(false);
    inputHandler.getMousePosition.and.returnValue({ x: 0, y: 0 });

    TestBed.configureTestingModule({
      providers: [
        PlayerService,
        { provide: InputHandlerService, useValue: inputHandler },
        provideZonelessChangeDetection()
      ]
    });
    service = TestBed.inject(PlayerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('initPlayer', () => {
    it('should create player centered horizontally', () => {
      service.initPlayer(800, 600, mockConfig);
      const player = service.getPlayer()!;
      expect(player.x).toBe((800 - player.width) / 2);
    });

    it('should create player near the bottom', () => {
      service.initPlayer(800, 600, mockConfig);
      const player = service.getPlayer()!;
      expect(player.y).toBe(600 - 60);
    });

    it('should set player size to 40x20', () => {
      service.initPlayer(800, 600, mockConfig);
      const player = service.getPlayer()!;
      expect(player.width).toBe(40);
      expect(player.height).toBe(20);
    });

    it('should set player as active', () => {
      service.initPlayer(800, 600, mockConfig);
      expect(service.getPlayer()!.isActive).toBe(true);
    });

    it('should set player not invincible initially', () => {
      service.initPlayer(800, 600, mockConfig);
      expect(service.getPlayer()!.isInvincible).toBe(false);
    });
  });

  describe('update - keyboard movement', () => {
    beforeEach(() => {
      service.initPlayer(800, 600, mockConfig);
    });

    it('should move left when ArrowLeft is pressed', () => {
      const startX = service.getPlayer()!.x;
      inputHandler.isKeyPressed.and.callFake((key: string) => key === 'arrowleft');
      service.update(16, inputHandler, 800, 1000);
      expect(service.getPlayer()!.x).toBeLessThan(startX);
    });

    it('should move left when A is pressed', () => {
      const startX = service.getPlayer()!.x;
      inputHandler.isKeyPressed.and.callFake((key: string) => key === 'a');
      service.update(16, inputHandler, 800, 1000);
      expect(service.getPlayer()!.x).toBeLessThan(startX);
    });

    it('should move right when ArrowRight is pressed', () => {
      const startX = service.getPlayer()!.x;
      inputHandler.isKeyPressed.and.callFake((key: string) => key === 'arrowright');
      service.update(16, inputHandler, 800, 1000);
      expect(service.getPlayer()!.x).toBeGreaterThan(startX);
    });

    it('should move right when D is pressed', () => {
      const startX = service.getPlayer()!.x;
      inputHandler.isKeyPressed.and.callFake((key: string) => key === 'd');
      service.update(16, inputHandler, 800, 1000);
      expect(service.getPlayer()!.x).toBeGreaterThan(startX);
    });

    it('should not move when no keys pressed', () => {
      const startX = service.getPlayer()!.x;
      service.update(16, inputHandler, 800, 1000);
      expect(service.getPlayer()!.x).toBe(startX);
    });

    it('should use deltaTime for frame-independent movement', () => {
      inputHandler.isKeyPressed.and.callFake((key: string) => key === 'arrowright');
      service.update(32, inputHandler, 800, 1000); // 32ms = 2x normal frame
      const doubleFrame = service.getPlayer()!.x;

      service.initPlayer(800, 600, mockConfig);
      service.update(16, inputHandler, 800, 1000); // 16ms = 1x normal frame
      const singleFrame = service.getPlayer()!.x;
      const startX = (800 - 40) / 2;

      expect(doubleFrame - startX).toBeCloseTo((singleFrame - startX) * 2, 0);
    });
  });

  describe('update - boundary constraints', () => {
    beforeEach(() => {
      service.initPlayer(800, 600, mockConfig);
    });

    it('should not move left past x=0', () => {
      // Force to left edge
      service.getPlayer()!.x = 0;
      inputHandler.isKeyPressed.and.callFake((key: string) => key === 'arrowleft');
      service.update(100, inputHandler, 800, 1000);
      expect(service.getPlayer()!.x).toBe(0);
    });

    it('should not move right past canvasWidth - playerWidth', () => {
      // Force to right edge
      service.getPlayer()!.x = 800 - 40;
      inputHandler.isKeyPressed.and.callFake((key: string) => key === 'arrowright');
      service.update(100, inputHandler, 800, 1000);
      expect(service.getPlayer()!.x).toBe(800 - 40);
    });
  });

  describe('update - mouse control', () => {
    beforeEach(() => {
      service.initPlayer(800, 600, mockConfig);
    });

    it('should follow mouse X position when mouse has moved', () => {
      inputHandler.getMousePosition.and.returnValue({ x: 400, y: 300 });
      service.update(16, inputHandler, 800, 1000);
      const player = service.getPlayer()!;
      expect(player.x).toBe(400 - player.width / 2);
    });

    it('should clamp mouse-driven position to canvas boundaries', () => {
      inputHandler.getMousePosition.and.returnValue({ x: 5, y: 300 }); // near left edge
      service.update(16, inputHandler, 800, 1000);
      expect(service.getPlayer()!.x).toBe(0);
    });
  });

  describe('fire rate', () => {
    beforeEach(() => {
      service.initPlayer(800, 600, mockConfig);
    });

    it('should be able to fire initially', () => {
      expect(service.canFire(1000, 500)).toBe(true);
    });

    it('should not be able to fire immediately after firing', () => {
      service.recordFired(1000);
      expect(service.canFire(1100, 500)).toBe(false);
    });

    it('should be able to fire after cooldown expires', () => {
      service.recordFired(1000);
      expect(service.canFire(1500, 500)).toBe(true);
    });

    it('should be able to fire exactly at cooldown time', () => {
      service.recordFired(1000);
      expect(service.canFire(1500, 500)).toBe(true);
    });
  });

  describe('takeDamage', () => {
    beforeEach(() => {
      service.initPlayer(800, 600, mockConfig);
    });

    it('should return true when damage is applied', () => {
      expect(service.takeDamage(1000)).toBe(true);
    });

    it('should set player as invincible after taking damage', () => {
      service.takeDamage(1000);
      expect(service.getPlayer()!.isInvincible).toBe(true);
    });

    it('should return false when player is invincible', () => {
      service.takeDamage(1000);
      expect(service.takeDamage(1100)).toBe(false);
    });

    it('should remove invincibility after 2 seconds', () => {
      service.takeDamage(1000);
      service.update(16, inputHandler, 800, 3001); // currentTime = 3001 > 1000+2000
      expect(service.getPlayer()!.isInvincible).toBe(false);
    });
  });

  describe('reset', () => {
    it('should clear player state', () => {
      service.initPlayer(800, 600, mockConfig);
      service.reset();
      expect(service.getPlayer()).toBeNull();
    });
  });
});
