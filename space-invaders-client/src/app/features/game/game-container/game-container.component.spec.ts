import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { GameContainerComponent } from './game-container.component';
import { ConfigService } from '../../../core/services/config.service';
import { GameStateService } from '../../../core/services/game-state.service';
import { BehaviorSubject } from 'rxjs';
import { GameConfig } from '../../../core/models';

describe('GameContainerComponent', () => {
  let component: GameContainerComponent;
  let fixture: ComponentFixture<GameContainerComponent>;
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
    const configSpy = jasmine.createSpyObj('ConfigService', ['loadConfig'], {
      config$: new BehaviorSubject<GameConfig | null>(mockConfig)
    });
    
    const gameStateSpy = jasmine.createSpyObj('GameStateService', ['initGame']);

    await TestBed.configureTestingModule({
      imports: [GameContainerComponent],
      providers: [
        { provide: ConfigService, useValue: configSpy },
        { provide: GameStateService, useValue: gameStateSpy },
        provideZonelessChangeDetection()
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(GameContainerComponent);
    component = fixture.componentInstance;
    configServiceSpy = TestBed.inject(ConfigService) as jasmine.SpyObj<ConfigService>;
    gameStateServiceSpy = TestBed.inject(GameStateService) as jasmine.SpyObj<GameStateService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call loadConfig on init', () => {
    fixture.detectChanges();
    expect(configServiceSpy.loadConfig).toHaveBeenCalled();
  });

  it('should call initGame when config is loaded', (done) => {
    fixture.detectChanges();
    
    setTimeout(() => {
      expect(gameStateServiceSpy.initGame).toHaveBeenCalledWith(mockConfig);
      done();
    }, 10);
  });

  it('should not init game if config is null', (done) => {
    (configServiceSpy.config$ as BehaviorSubject<GameConfig | null>).next(null);
    gameStateServiceSpy.initGame.calls.reset();
    
    fixture.detectChanges();
    
    setTimeout(() => {
      expect(gameStateServiceSpy.initGame).not.toHaveBeenCalled();
      done();
    }, 10);
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
});
