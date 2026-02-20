import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { Router } from '@angular/router';
import { GameContainerComponent } from './game-container.component';
import { ConfigService } from '../../../core/services/config.service';
import { GameStateService } from '../../../core/services/game-state.service';
import { CanvasService } from '../../../core/services/canvas.service';
import { BehaviorSubject } from 'rxjs';
import { GameConfig } from '../../../core/models';

describe('GameContainerComponent', () => {
  let component: GameContainerComponent;
  let fixture: ComponentFixture<GameContainerComponent>;
  let configServiceSpy: jasmine.SpyObj<ConfigService>;
  let gameStateServiceSpy: jasmine.SpyObj<GameStateService>;
  let router: Router;
  let isGameOverSubject: BehaviorSubject<boolean>;

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
    isGameOverSubject = new BehaviorSubject<boolean>(false);

    const configSpy = jasmine.createSpyObj('ConfigService', ['loadConfig'], {
      config$: new BehaviorSubject<GameConfig | null>(mockConfig)
    });

    const gameStateSpy = jasmine.createSpyObj('GameStateService', ['initGame', 'resume', 'resetGame'], {
      gameState$: new BehaviorSubject({
        score: 0, lives: 3, level: 1, isPaused: false, isGameOver: false, isPlaying: false
      }),
      isPaused$: new BehaviorSubject<boolean>(false),
      isGameOver$: isGameOverSubject
    });

    const canvasSpy = jasmine.createSpyObj('CanvasService', [
      'initCanvas', 'clearCanvas', 'drawRect', 'getContext'
    ]);

    await TestBed.configureTestingModule({
      imports: [GameContainerComponent],
      providers: [
        { provide: ConfigService, useValue: configSpy },
        { provide: GameStateService, useValue: gameStateSpy },
        { provide: CanvasService, useValue: canvasSpy },
        provideZonelessChangeDetection(),
        provideRouter([])
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(GameContainerComponent);
    component = fixture.componentInstance;
    configServiceSpy = TestBed.inject(ConfigService) as jasmine.SpyObj<ConfigService>;
    gameStateServiceSpy = TestBed.inject(GameStateService) as jasmine.SpyObj<GameStateService>;
    router = TestBed.inject(Router);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call loadConfig on init', () => {
    fixture.detectChanges();
    expect(configServiceSpy.loadConfig).toHaveBeenCalled();
  });

  it('should navigate to /game-over when isGameOver$ emits true', () => {
    spyOn(router, 'navigate');
    fixture.detectChanges();

    isGameOverSubject.next(true);

    expect(router.navigate).toHaveBeenCalledWith(['/game-over']);
  });

  it('should not navigate when isGameOver$ emits false', () => {
    spyOn(router, 'navigate');
    fixture.detectChanges();

    isGameOverSubject.next(false);

    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('should contain game-board component', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement;
    const gameBoard = compiled.querySelector('app-game-board');
    
    expect(gameBoard).toBeTruthy();
  });

  it('should contain hud component', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement;
    const hud = compiled.querySelector('app-hud');
    
    expect(hud).toBeTruthy();
  });

  it('should have Material card container', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement;
    const card = compiled.querySelector('mat-card');
    
    expect(card).toBeTruthy();
  });

  it('should have game title in card header', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement;
    const title = compiled.querySelector('mat-card-title');
    
    expect(title?.textContent).toContain('Space Invaders');
  });

  it('should apply correct layout classes', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement;
    const container = compiled.querySelector('.game-container');
    expect(container).toBeTruthy();
  });

  it('should contain canvas-wrapper element', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement;
    const wrapper = compiled.querySelector('.canvas-wrapper');
    expect(wrapper).toBeTruthy();
  });

  it('should contain pause-overlay component', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement;
    const overlay = compiled.querySelector('app-pause-overlay');
    expect(overlay).toBeTruthy();
  });
});
