import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { BehaviorSubject } from 'rxjs';
import { PauseOverlayComponent } from './pause-overlay.component';
import { GameStateService } from '../../../core/services/game-state.service';

describe('PauseOverlayComponent', () => {
  let component: PauseOverlayComponent;
  let fixture: ComponentFixture<PauseOverlayComponent>;
  let mockGameStateService: jasmine.SpyObj<GameStateService>;
  let isPausedSubject: BehaviorSubject<boolean>;
  let router: Router;

  beforeEach(async () => {
    isPausedSubject = new BehaviorSubject<boolean>(false);

    mockGameStateService = jasmine.createSpyObj(
      'GameStateService',
      ['resume', 'resetGame'],
      { isPaused$: isPausedSubject.asObservable() }
    );

    await TestBed.configureTestingModule({
      imports: [
        PauseOverlayComponent,
        MatButtonModule,
        MatIconModule,
        NoopAnimationsModule
      ],
      providers: [
        provideZonelessChangeDetection(),
        provideRouter([]),
        { provide: GameStateService, useValue: mockGameStateService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PauseOverlayComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
  });

  // ── Creation ─────────────────────────────────────────────────────────────

  describe('Component Creation', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should start with isPaused = false', () => {
      fixture.detectChanges();
      expect(component.isPaused).toBeFalse();
    });
  });

  // ── Visibility ────────────────────────────────────────────────────────────

  describe('Visibility', () => {
    it('should hide overlay when game is not paused', () => {
      isPausedSubject.next(false);
      fixture.detectChanges();
      const overlay = fixture.nativeElement.querySelector('.pause-overlay');
      expect(overlay).toBeFalsy();
    });

    it('should show overlay when game is paused', () => {
      isPausedSubject.next(true);
      fixture.detectChanges();
      const overlay = fixture.nativeElement.querySelector('.pause-overlay');
      expect(overlay).toBeTruthy();
    });

    it('should update isPaused when service emits true', () => {
      fixture.detectChanges();
      isPausedSubject.next(true);
      expect(component.isPaused).toBeTrue();
    });

    it('should update isPaused when service emits false after true', () => {
      fixture.detectChanges();
      isPausedSubject.next(true);
      isPausedSubject.next(false);
      expect(component.isPaused).toBeFalse();
    });
  });

  // ── Pause text ────────────────────────────────────────────────────────────

  describe('Paused Content', () => {
    beforeEach(() => {
      isPausedSubject.next(true);
      fixture.detectChanges();
    });

    it('should display PAUSED title', () => {
      const title = fixture.nativeElement.querySelector('.pause-title');
      expect(title?.textContent).toContain('PAUSED');
    });

    it('should display a Resume button', () => {
      const buttons: NodeListOf<HTMLElement> = fixture.nativeElement.querySelectorAll('button');
      const resumeBtn = Array.from(buttons).find(b => b.textContent?.includes('Resume'));
      expect(resumeBtn).toBeTruthy();
    });

    it('should display a Main Menu button', () => {
      const buttons: NodeListOf<HTMLElement> = fixture.nativeElement.querySelectorAll('button');
      const menuBtn = Array.from(buttons).find(b => b.textContent?.includes('Main Menu'));
      expect(menuBtn).toBeTruthy();
    });

    it('should show keyboard shortcut hint', () => {
      const hint = fixture.nativeElement.querySelector('.pause-hint');
      expect(hint?.textContent).toContain('P');
    });
  });

  // ── Actions ───────────────────────────────────────────────────────────────

  describe('Resume action', () => {
    beforeEach(() => {
      isPausedSubject.next(true);
      fixture.detectChanges();
    });

    it('should call gameStateService.resume() when resume() is called', () => {
      component.resume();
      expect(mockGameStateService.resume).toHaveBeenCalledTimes(1);
    });

    it('should call resume() when Resume button is clicked', () => {
      const buttons: NodeListOf<HTMLElement> = fixture.nativeElement.querySelectorAll('button');
      const resumeBtn = Array.from(buttons).find(b => b.textContent?.includes('Resume')) as HTMLButtonElement;
      resumeBtn.click();
      expect(mockGameStateService.resume).toHaveBeenCalledTimes(1);
    });
  });

  describe('Back to menu action', () => {
    beforeEach(() => {
      isPausedSubject.next(true);
      fixture.detectChanges();
    });

    it('should call gameStateService.resetGame() when returnToMenu() is called', () => {
      component.returnToMenu();
      expect(mockGameStateService.resetGame).toHaveBeenCalledTimes(1);
    });

    it('should navigate to / when returnToMenu() is called', () => {
      spyOn(router, 'navigate');
      component.returnToMenu();
      expect(router.navigate).toHaveBeenCalledWith(['/']);
    });

    it('should reset game and navigate when Main Menu button is clicked', () => {
      spyOn(router, 'navigate');
      const buttons: NodeListOf<HTMLElement> = fixture.nativeElement.querySelectorAll('button');
      const menuBtn = Array.from(buttons).find(b => b.textContent?.includes('Main Menu')) as HTMLButtonElement;
      menuBtn.click();
      expect(mockGameStateService.resetGame).toHaveBeenCalledTimes(1);
      expect(router.navigate).toHaveBeenCalledWith(['/']);
    });
  });

  // ── Cleanup ───────────────────────────────────────────────────────────────

  describe('Component Lifecycle', () => {
    it('should unsubscribe on destroy', () => {
      fixture.detectChanges();
      spyOn(component['destroy$'], 'next');
      spyOn(component['destroy$'], 'complete');
      component.ngOnDestroy();
      expect(component['destroy$'].next).toHaveBeenCalled();
      expect(component['destroy$'].complete).toHaveBeenCalled();
    });
  });
});
