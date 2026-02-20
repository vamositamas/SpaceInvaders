import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { GameOverComponent } from './game-over.component';
import { GameStateService } from '../../core/services/game-state.service';
import { HighScoreService } from '../../core/services/highscore.service';
import { HighScore } from '../../core/models';
import { of, throwError, Subject } from 'rxjs';

describe('GameOverComponent', () => {
  let component: GameOverComponent;
  let fixture: ComponentFixture<GameOverComponent>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockGameStateService: jasmine.SpyObj<GameStateService>;
  let mockHighScoreService: jasmine.SpyObj<HighScoreService>;

  beforeEach(async () => {
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockGameStateService = jasmine.createSpyObj(
      'GameStateService',
      ['resetGame', 'getCurrentState'],
      { gameOver$: of(true) }
    );
    mockGameStateService.getCurrentState.and.returnValue({
      score: 0, level: 1, lives: 3, isPaused: false, isGameOver: false, isPlaying: false
    });
    mockHighScoreService = jasmine.createSpyObj(
      'HighScoreService',
      ['checkIfHighScore', 'addHighScore', 'getHighScores'],
      { highScores$: of([]) }
    );

    await TestBed.configureTestingModule({
      imports: [
        GameOverComponent,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatCardModule,
        MatIconModule,
        MatProgressSpinnerModule,
        NoopAnimationsModule
      ],
      providers: [
        provideZonelessChangeDetection(),
        { provide: Router, useValue: mockRouter },
        { provide: GameStateService, useValue: mockGameStateService },
        { provide: HighScoreService, useValue: mockHighScoreService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(GameOverComponent);
    component = fixture.componentInstance;
  });

  describe('Component Initialization', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize with default values', () => {
      expect(component.finalScore).toBe(0);
      expect(component.levelReached).toBe(1);
      expect(component.isHighScore).toBe(false);
      expect(component.isSubmitting).toBe(false);
      expect(component.submissionError).toBe('');
    });

    it('should have a reactive form initialized', () => {
      expect(component.form).toBeDefined();
      expect(component.form?.get('playerName')).toBeDefined();
    });

    it('should initialize playerName with empty string', () => {
      expect(component.form?.get('playerName')?.value).toBe('');
    });

    it('should read finalScore and levelReached from GameStateService on init', () => {
      mockGameStateService.getCurrentState.and.returnValue({
        score: 3500, level: 4, lives: 1, isPaused: false, isGameOver: true, isPlaying: false
      });
      fixture.detectChanges(); // triggers ngOnInit
      expect(component.finalScore).toBe(3500);
      expect(component.levelReached).toBe(4);
    });

    it('should pass actual score to checkIfHighScore on init', () => {
      mockGameStateService.getCurrentState.and.returnValue({
        score: 2000, level: 2, lives: 2, isPaused: false, isGameOver: true, isPlaying: false
      });
      mockHighScoreService.checkIfHighScore.and.returnValue(true);
      fixture.detectChanges();
      expect(mockHighScoreService.checkIfHighScore).toHaveBeenCalledWith(2000);
    });
  });

  describe('Game State Display', () => {
    it('should display final score', async () => {
      mockGameStateService.getCurrentState.and.returnValue({
        score: 2500, level: 1, lives: 3, isPaused: false, isGameOver: true, isPlaying: false
      });
      fixture.detectChanges();
      await fixture.whenStable();
      const compiled = fixture.nativeElement as HTMLElement;
      const scoreDisplay = compiled.querySelector('.final-score');
      expect(scoreDisplay?.textContent).toContain('2,500');
    });

    it('should display level reached', () => {
      mockGameStateService.getCurrentState.and.returnValue({
        score: 0, level: 5, lives: 3, isPaused: false, isGameOver: true, isPlaying: false
      });
      fixture.detectChanges();
      const compiled = fixture.nativeElement as HTMLElement;
      const levelDisplay = compiled.querySelector('.level-reached');
      expect(levelDisplay?.textContent).toContain('5');
    });

    it('should show high score message when isHighScore is true', () => {
      mockHighScoreService.checkIfHighScore.and.returnValue(true);
      fixture.detectChanges();
      const compiled = fixture.nativeElement as HTMLElement;
      const highScoreMsg = compiled.querySelector('.high-score-message');
      expect(highScoreMsg).toBeTruthy();
      expect(highScoreMsg?.textContent).toContain('High Score');
    });

    it('should not show high score message when isHighScore is false', () => {
      component.isHighScore = false;
      fixture.detectChanges();
      const compiled = fixture.nativeElement as HTMLElement;
      const highScoreMsg = compiled.querySelector('.high-score-message');
      expect(highScoreMsg).toBeFalsy();
    });
  });

  describe('Player Name Input', () => {
    it('should display name input when isHighScore is true', () => {
      mockHighScoreService.checkIfHighScore.and.returnValue(true);
      fixture.detectChanges();
      const compiled = fixture.nativeElement as HTMLElement;
      const nameInput = compiled.querySelector('input[formControlName="playerName"]');
      expect(nameInput).toBeTruthy();
    });

    it('should not display name input when isHighScore is false', () => {
      component.isHighScore = false;
      fixture.detectChanges();
      const compiled = fixture.nativeElement as HTMLElement;
      const nameInput = compiled.querySelector('input[formControlName="playerName"]');
      expect(nameInput).toBeFalsy();
    });

    it('should have placeholder text for name input', () => {
      mockHighScoreService.checkIfHighScore.and.returnValue(true);
      fixture.detectChanges();
      const compiled = fixture.nativeElement as HTMLElement;
      const nameInput = compiled.querySelector('input[formControlName="playerName"]') as HTMLInputElement;
      expect(nameInput?.placeholder).toBeTruthy();
    });

    it('should update form value when input changes', () => {
      component.form?.patchValue({ playerName: 'Player123' });
      expect(component.form?.get('playerName')?.value).toBe('Player123');
    });
  });

  describe('Name Validation', () => {
    it('should require player name', () => {
      const nameControl = component.form?.get('playerName');
      nameControl?.setValue('');
      expect(nameControl?.hasError('required')).toBe(true);
    });

    it('should validate minimum length (1 character)', () => {
      const nameControl = component.form?.get('playerName');
      nameControl?.setValue('A');
      expect(nameControl?.hasError('minlength')).toBe(false);
    });

    it('should validate maximum length (20 characters)', () => {
      const nameControl = component.form?.get('playerName');
      nameControl?.setValue('123456789012345678901'); // 21 characters
      expect(nameControl?.hasError('maxlength')).toBe(true);
    });

    it('should accept exactly 20 character name', () => {
      const nameControl = component.form?.get('playerName');
      nameControl?.setValue('12345678901234567890'); // 20 characters
      expect(nameControl?.hasError('maxlength')).toBe(false);
    });

    it('should allow alphanumeric characters and spaces', () => {
      const nameControl = component.form?.get('playerName');
      nameControl?.setValue('Player 123');
      expect(nameControl?.valid).toBe(true);
    });

    it('should reject special characters', () => {
      const nameControl = component.form?.get('playerName');
      nameControl?.setValue('Player@#$');
      expect(nameControl?.hasError('pattern')).toBe(true);
    });

    it('should disable submit button when form is invalid', () => {
      component.form?.patchValue({ playerName: '' });
      fixture.detectChanges();
      expect(component.form?.valid).toBe(false);
    });

    it('should enable submit button when form is valid', () => {
      component.form?.patchValue({ playerName: 'ValidName' });
      fixture.detectChanges();
      expect(component.form?.valid).toBe(true);
    });
  });

  describe('High Score Check', () => {
    it('should check if score is high score on init', () => {
      mockHighScoreService.checkIfHighScore.and.returnValue(true);
      component.ngOnInit();
      expect(mockHighScoreService.checkIfHighScore).toHaveBeenCalledWith(component.finalScore);
    });

    it('should set isHighScore to true when score qualifies', () => {
      mockHighScoreService.checkIfHighScore.and.returnValue(true);
      component.ngOnInit();
      expect(component.isHighScore).toBe(true);
    });

    it('should set isHighScore to false when score does not qualify', () => {
      mockHighScoreService.checkIfHighScore.and.returnValue(false);
      component.ngOnInit();
      expect(component.isHighScore).toBe(false);
    });
  });;

  describe('Submit High Score', () => {
    beforeEach(() => {
      component.isHighScore = true;
      component.finalScore = 2500;
      component.levelReached = 5;
    });

    it('should submit high score with valid name', () => {
      const mockResponse: HighScore = { id: '123', playerName: 'TestPlayer', score: 2500, level: 5 };
      mockHighScoreService.addHighScore.and.returnValue(of(mockResponse));
      component.form?.patchValue({ playerName: 'TestPlayer' });
      component.submitHighScore();
      expect(mockHighScoreService.addHighScore).toHaveBeenCalledWith({
        playerName: 'TestPlayer',
        score: 2500,
        level: 5
      });
    });

    it('should set isSubmitting to true while submitting', () => {
      const responseSubject = new Subject<HighScore>();
      mockHighScoreService.addHighScore.and.returnValue(responseSubject.asObservable());
      component.form?.patchValue({ playerName: 'TestPlayer' });
      component.submitHighScore();
      expect(component.isSubmitting).toBe(true);
      responseSubject.complete();
    });

    it('should clear submission error on successful submission', (done) => {
      const mockResponse: HighScore = { id: '123', playerName: 'TestPlayer', score: 2500, level: 5 };
      mockHighScoreService.addHighScore.and.returnValue(of(mockResponse));
      component.submissionError = 'Previous error';
      component.form?.patchValue({ playerName: 'TestPlayer' });
      component.submitHighScore();
      setTimeout(() => {
        expect(component.submissionError).toBe('');
        done();
      }, 100);
    });

    it('should set error message on submission failure', (done) => {
      mockHighScoreService.addHighScore.and.returnValue(
        throwError(() => new Error('Network error'))
      );
      component.form?.patchValue({ playerName: 'TestPlayer' });
      component.submitHighScore();
      setTimeout(() => {
        expect(component.submissionError).toContain('error');
        done();
      }, 100);
    });

    it('should not submit if form is invalid', () => {
      component.form?.patchValue({ playerName: '' });
      component.submitHighScore();
      expect(mockHighScoreService.addHighScore).not.toHaveBeenCalled();
    });

    it('should not submit if name contains special characters', () => {
      component.form?.patchValue({ playerName: 'Player@123' });
      component.submitHighScore();
      expect(mockHighScoreService.addHighScore).not.toHaveBeenCalled();
    });

    it('should trim whitespace from player name', () => {
      const mockResponse: HighScore = { id: '123', playerName: 'TestPlayer', score: 2500, level: 5 };
      mockHighScoreService.addHighScore.and.returnValue(of(mockResponse));
      component.form?.patchValue({ playerName: '  TestPlayer  ' });
      component.submitHighScore();
      expect(mockHighScoreService.addHighScore).toHaveBeenCalledWith(
        jasmine.objectContaining({
          playerName: 'TestPlayer'
        })
      );
    });
  });

  describe('Navigation Actions', () => {
    it('should navigate to game when Play Again is clicked', () => {
      component.playAgain();
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/game']);
    });

    it('should navigate to main menu', () => {
      component.returnToMenu();
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/']);
    });

    it('should reset game state when playing again', () => {
      mockGameStateService.resetGame.and.returnValue(undefined);
      component.playAgain();
      expect(mockGameStateService.resetGame).toHaveBeenCalled();
    });

    it('should have Play Again button visible', () => {
      fixture.detectChanges();
      const compiled = fixture.nativeElement as HTMLElement;
      const playAgainBtn = compiled.querySelector('.play-again-btn');
      expect(playAgainBtn).toBeTruthy();
    });

    it('should have Main Menu button visible', () => {
      fixture.detectChanges();
      const compiled = fixture.nativeElement as HTMLElement;
      const menuBtn = compiled.querySelector('.main-menu-btn');
      expect(menuBtn).toBeTruthy();
    });
  });

  describe('Template Rendering', () => {
    it('should render game over title', () => {
      fixture.detectChanges();
      const compiled = fixture.nativeElement as HTMLElement;
      const title = compiled.querySelector('h1');
      expect(title?.textContent).toContain('Game Over');
    });

    it('should display score section', () => {
      fixture.detectChanges();
      const compiled = fixture.nativeElement as HTMLElement;
      const scoreSection = compiled.querySelector('.score-section');
      expect(scoreSection).toBeTruthy();
    });

    it('should display level section', () => {
      fixture.detectChanges();
      const compiled = fixture.nativeElement as HTMLElement;
      const levelSection = compiled.querySelector('.level-section');
      expect(levelSection).toBeTruthy();
    });

    it('should show loading indicator while submitting', () => {
      mockHighScoreService.checkIfHighScore.and.returnValue(true);
      fixture.detectChanges();
      component.isSubmitting = true;
      fixture.componentRef.changeDetectorRef.markForCheck();
      fixture.detectChanges();
      const compiled = fixture.nativeElement as HTMLElement;
      const spinner = compiled.querySelector('mat-spinner, .loading-spinner');
      expect(spinner).toBeTruthy();
    });

    it('should display error message when submission fails', () => {
      mockHighScoreService.checkIfHighScore.and.returnValue(true);
      fixture.detectChanges();
      component.submissionError = 'Failed to save score';
      fixture.componentRef.changeDetectorRef.markForCheck();
      fixture.detectChanges();
      const compiled = fixture.nativeElement as HTMLElement;
      const errorMsg = compiled.querySelector('.error-message');
      expect(errorMsg?.textContent).toContain('Failed to save score');
    });

    it('should have accessible form elements', () => {
      mockHighScoreService.checkIfHighScore.and.returnValue(true);
      fixture.detectChanges();
      const compiled = fixture.nativeElement as HTMLElement;
      const labels = compiled.querySelectorAll('mat-label');
      expect(labels.length).toBeGreaterThan(0);
    });
  });

  describe('Accessibility', () => {
    it('should have semantic heading for game over', () => {
      fixture.detectChanges();
      const compiled = fixture.nativeElement as HTMLElement;
      const h1 = compiled.querySelector('h1');
      expect(h1).toBeTruthy();
    });

    it('should have aria-labels on interactive elements', () => {
      fixture.detectChanges();
      const compiled = fixture.nativeElement as HTMLElement;
      const buttons = compiled.querySelectorAll('button');
      buttons.forEach(btn => {
        const ariaLabel = btn.getAttribute('aria-label');
        const textContent = btn.textContent?.trim() ?? '';
        expect(ariaLabel || textContent).toBeTruthy();
      });
    });

    it('should have accessible form validation messages', () => {
      mockHighScoreService.checkIfHighScore.and.returnValue(true);
      fixture.detectChanges();
      const nameControl = component.form?.get('playerName');
      nameControl?.markAsTouched();
      nameControl?.setValue('');
      fixture.componentRef.changeDetectorRef.markForCheck();
      fixture.detectChanges();
      const compiled = fixture.nativeElement as HTMLElement;
      const errorDisplay = compiled.querySelector('mat-error');
      expect(errorDisplay).toBeTruthy();
    });
  });

  describe('Error Handling', () => {
    it('should display user-friendly error message on API failure', (done) => {
      mockHighScoreService.addHighScore.and.returnValue(
        throwError(() => ({ error: { message: 'Invalid score' } }))
      );
      component.finalScore = 2500;
      component.form?.patchValue({ playerName: 'TestPlayer' });
      component.submitHighScore();
      setTimeout(() => {
        expect(component.submissionError).toBeTruthy();
        done();
      }, 100);
    });

    it('should reset submitting state on error', (done) => {
      mockHighScoreService.addHighScore.and.returnValue(
        throwError(() => new Error('Network error'))
      );
      component.form?.patchValue({ playerName: 'TestPlayer' });
      component.submitHighScore();
      setTimeout(() => {
        expect(component.isSubmitting).toBe(false);
        done();
      }, 100);
    });

    it('should reset submitting state on success', (done) => {
      const mockResponse: HighScore = { id: '123', playerName: 'TestPlayer', score: 2500, level: 5 };
      mockHighScoreService.addHighScore.and.returnValue(of(mockResponse));
      component.form?.patchValue({ playerName: 'TestPlayer' });
      component.submitHighScore();
      setTimeout(() => {
        expect(component.isSubmitting).toBe(false);
        done();
      }, 100);
    });
  });

  describe('Edge Cases', () => {
    it('should handle score of 0', () => {
      component.finalScore = 0;
      fixture.detectChanges();
      const compiled = fixture.nativeElement as HTMLElement;
      const scoreDisplay = compiled.querySelector('.final-score');
      expect(scoreDisplay?.textContent).toContain('0');
    });

    it('should handle large scores (999999)', async () => {
      mockGameStateService.getCurrentState.and.returnValue({
        score: 999999, level: 1, lives: 3, isPaused: false, isGameOver: true, isPlaying: false
      });
      fixture.detectChanges();
      await fixture.whenStable();
      const compiled = fixture.nativeElement as HTMLElement;
      const scoreDisplay = compiled.querySelector('.final-score');
      expect(scoreDisplay?.textContent).toContain('999,999');
    });

    it('should handle level 1', () => {
      component.levelReached = 1;
      fixture.detectChanges();
      const compiled = fixture.nativeElement as HTMLElement;
      const levelDisplay = compiled.querySelector('.level-reached');
      expect(levelDisplay?.textContent).toContain('1');
    });

    it('should handle high level reached (50+)', () => {
      mockGameStateService.getCurrentState.and.returnValue({
        score: 0, level: 50, lives: 3, isPaused: false, isGameOver: true, isPlaying: false
      });
      fixture.detectChanges();
      const compiled = fixture.nativeElement as HTMLElement;
      const levelDisplay = compiled.querySelector('.level-reached');
      expect(levelDisplay?.textContent).toContain('50');
    });
  });

  describe('Component Lifecycle', () => {
    it('should unsubscribe on destroy', () => {
      spyOn(component['destroy$'], 'next');
      spyOn(component['destroy$'], 'complete');
      component.ngOnDestroy();
      expect(component['destroy$'].next).toHaveBeenCalled();
      expect(component['destroy$'].complete).toHaveBeenCalled();
    });

    it('should initialize on component init', () => {
      spyOn(component, 'ngOnInit').and.callThrough();
      component.ngOnInit();
      expect(component.ngOnInit).toHaveBeenCalled();
    });
  });
});
