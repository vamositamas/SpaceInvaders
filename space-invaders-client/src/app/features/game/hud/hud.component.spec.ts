import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { HudComponent } from './hud.component';
import { GameStateService } from '../../../core/services/game-state.service';
import { BehaviorSubject } from 'rxjs';
import { LegacyGameState } from '../../../core/models';

describe('HudComponent', () => {
  let component: HudComponent;
  let fixture: ComponentFixture<HudComponent>;
  let gameStateServiceSpy: jasmine.SpyObj<GameStateService>;

  const mockGameState: LegacyGameState = {
    score: 1000,
    lives: 3,
    level: 2,
    isPaused: false,
    isGameOver: false,
    isPlaying: true
  };

  beforeEach(async () => {
    const gameStateSpy = jasmine.createSpyObj('GameStateService', ['toggleRapidFire'], {
      gameState$: new BehaviorSubject<LegacyGameState>(mockGameState),
      rapidFire$: new BehaviorSubject<boolean>(false)
    });

    await TestBed.configureTestingModule({
      imports: [HudComponent],
      providers: [
        { provide: GameStateService, useValue: gameStateSpy },
        provideZonelessChangeDetection()
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HudComponent);
    component = fixture.componentInstance;
    gameStateServiceSpy = TestBed.inject(GameStateService) as jasmine.SpyObj<GameStateService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have initial game state', () => {
    expect(component.gameState).toBeDefined();
  });

  it('should subscribe to gameState$ on init', (done) => {
    fixture.detectChanges();
    
    setTimeout(() => {
      expect(component.gameState).toEqual(mockGameState);
      done();
    }, 10);
  });

  it('should update state when gameState$ emits', (done) => {
    fixture.detectChanges();
    
    const newState: LegacyGameState = {
      score: 2000,
      lives: 2,
      level: 3,
      isPaused: false,
      isGameOver: false,
      isPlaying: true
    };
    
    (gameStateServiceSpy.gameState$ as BehaviorSubject<LegacyGameState>).next(newState);
    
    setTimeout(() => {
      expect(component.gameState).toEqual(newState);
      done();
    }, 10);
  });

  it('should display score correctly', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement;
    const scoreElement = compiled.querySelector('.hud-value');
    
    expect(scoreElement?.textContent).toContain('1000');
  });

  it('should display lives correctly', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement;
    const hudItems = compiled.querySelectorAll('.hud-item');
    const livesValue = hudItems[1]?.querySelector('.hud-value');
    
    expect(livesValue?.textContent).toContain('3');
  });

  it('should display level correctly', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement;
    const hudItems = compiled.querySelectorAll('.hud-item');
    const levelValue = hudItems[2]?.querySelector('.hud-value');
    
    expect(levelValue?.textContent).toContain('2');
  });

  it('should show PAUSED status when paused', (done) => {
    const pausedState: LegacyGameState = { ...mockGameState, isPaused: true };
    (gameStateServiceSpy.gameState$ as BehaviorSubject<LegacyGameState>).next(pausedState);
    
    fixture.detectChanges();
    
    setTimeout(() => {
      const compiled = fixture.nativeElement;
      const pausedText = compiled.querySelector('.paused');
      expect(pausedText?.textContent).toContain('PAUSED');
      done();
    }, 10);
  });

  it('should show GAME OVER status when game over', (done) => {
    const gameOverState: LegacyGameState = { ...mockGameState, isGameOver: true };
    (gameStateServiceSpy.gameState$ as BehaviorSubject<LegacyGameState>).next(gameOverState);
    
    fixture.detectChanges();
    
    setTimeout(() => {
      const compiled = fixture.nativeElement;
      const gameOverText = compiled.querySelector('.game-over');
      expect(gameOverText?.textContent).toContain('GAME OVER');
      done();
    }, 10);
  });

  it('should not show PAUSED when not paused', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement;
    const pausedText = compiled.querySelector('.paused');
    
    expect(pausedText).toBeNull();
  });

  it('should not show GAME OVER when game is not over', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement;
    const gameOverText = compiled.querySelector('.game-over');
    
    expect(gameOverText).toBeNull();
  });

  it('should render Material icons', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement;
    const icons = compiled.querySelectorAll('mat-icon');
    
    expect(icons.length).toBeGreaterThan(0);
  });

  it('should unsubscribe on destroy', () => {
    fixture.detectChanges();
    spyOn(component['destroy$'], 'next');
    spyOn(component['destroy$'], 'complete');
    
    component.ngOnDestroy();
    
    expect(component['destroy$'].next).toHaveBeenCalled();
    expect(component['destroy$'].complete).toHaveBeenCalled();
  });
});
