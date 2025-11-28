import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { GameBoardComponent } from './game-board.component';
import { CanvasService } from '../../../core/services/canvas.service';
import { ConfigService } from '../../../core/services/config.service';
import { GameStateService } from '../../../core/services/game-state.service';
import { of, BehaviorSubject } from 'rxjs';
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

  beforeEach(async () => {
    const canvasSpy = jasmine.createSpyObj('CanvasService', [
      'initCanvas',
      'clearCanvas',
      'drawRect',
      'getContext'
    ]);
    
    const configSpy = jasmine.createSpyObj('ConfigService', ['loadConfig'], {
      config$: new BehaviorSubject<GameConfig | null>(mockConfig)
    });
    
    const gameStateSpy = jasmine.createSpyObj('GameStateService', ['initGame'], {
      isPaused$: new BehaviorSubject<boolean>(false),
      isGameOver$: new BehaviorSubject<boolean>(false)
    });

    await TestBed.configureTestingModule({
      imports: [GameBoardComponent],
      providers: [
        { provide: CanvasService, useValue: canvasSpy },
        { provide: ConfigService, useValue: configSpy },
        { provide: GameStateService, useValue: gameStateSpy },
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
    spyOn(window, 'requestAnimationFrame').and.callFake((callback: FrameRequestCallback) => {
      callback(0);
      return 1;
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
        0,
        0,
        mockConfig.canvas.width,
        mockConfig.canvas.height,
        '#000000'
      );
      done();
    }, 50);
  });

  it('should not render when paused', (done) => {
    fixture.detectChanges();
    canvasServiceSpy.clearCanvas.calls.reset();
    
    (gameStateServiceSpy.isPaused$ as BehaviorSubject<boolean>).next(true);
    
    setTimeout(() => {
      const callCount = canvasServiceSpy.clearCanvas.calls.count();
      
      setTimeout(() => {
        // Should not increase call count when paused
        expect(canvasServiceSpy.clearCanvas.calls.count()).toBe(callCount);
        done();
      }, 50);
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

  it('should handle config not loaded', () => {
    (configServiceSpy.config$ as BehaviorSubject<GameConfig | null>).next(null);
    spyOn(console, 'error');
    
    fixture.detectChanges();
    
    expect(console.error).toHaveBeenCalledWith('Config not loaded');
  });

  it('should stop rendering when game over', (done) => {
    fixture.detectChanges();
    canvasServiceSpy.clearCanvas.calls.reset();
    
    (gameStateServiceSpy.isGameOver$ as BehaviorSubject<boolean>).next(true);
    
    setTimeout(() => {
      const callCount = canvasServiceSpy.clearCanvas.calls.count();
      
      setTimeout(() => {
        // Should not increase call count when game over
        expect(canvasServiceSpy.clearCanvas.calls.count()).toBe(callCount);
        done();
      }, 50);
    }, 50);
  });
});
