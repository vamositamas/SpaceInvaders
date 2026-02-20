import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { InstructionsDialogComponent } from './instructions-dialog.component';

describe('InstructionsDialogComponent', () => {
  let component: InstructionsDialogComponent;
  let fixture: ComponentFixture<InstructionsDialogComponent>;
  let mockDialogRef: jasmine.SpyObj<MatDialogRef<InstructionsDialogComponent>>;

  beforeEach(async () => {
    mockDialogRef = jasmine.createSpyObj('MatDialogRef', ['close']);

    await TestBed.configureTestingModule({
      imports: [
        InstructionsDialogComponent,
        MatDialogModule,
        MatExpansionModule,
        MatIconModule,
        MatButtonModule,
        NoopAnimationsModule
      ],
      providers: [
        provideZonelessChangeDetection(),
        { provide: MatDialogRef, useValue: mockDialogRef },
        { provide: MAT_DIALOG_DATA, useValue: {} }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(InstructionsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('Component Initialization', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize with all instruction sections', () => {
      expect(component.sections).toBeDefined();
      expect(component.sections.length).toBeGreaterThan(0);
    });

    it('should have Controls section', () => {
      const controlsSection = component.sections.find(s => s.title === 'Controls');
      expect(controlsSection).toBeDefined();
    });

    it('should have Gameplay section', () => {
      const gameplaySection = component.sections.find(s => s.title === 'Gameplay');
      expect(gameplaySection).toBeDefined();
    });

    it('should have Scoring section', () => {
      const scoringSection = component.sections.find(s => s.title === 'Scoring');
      expect(scoringSection).toBeDefined();
    });

    it('should have Tips section', () => {
      const tipsSection = component.sections.find(s => s.title === 'Tips');
      expect(tipsSection).toBeDefined();
    });
  });

  describe('Controls Section', () => {
    it('should display keyboard controls', () => {
      const controlsSection = component.sections.find(s => s.title === 'Controls');
      expect(controlsSection?.content).toContain('Arrow Keys');
    });

    it('should display alternative keyboard controls (WASD)', () => {
      const controlsSection = component.sections.find(s => s.title === 'Controls');
      expect(controlsSection?.content).toContain('WASD');
    });

    it('should display shoot control', () => {
      const controlsSection = component.sections.find(s => s.title === 'Controls');
      expect(controlsSection?.content).toContain('Space');
    });

    it('should display pause control', () => {
      const controlsSection = component.sections.find(s => s.title === 'Controls');
      expect(controlsSection?.content).toContain('P');
    });

    it('should include mouse controls', () => {
      const controlsSection = component.sections.find(s => s.title === 'Controls');
      expect(controlsSection?.content).toContain('Mouse');
    });
  });

  describe('Gameplay Section', () => {
    it('should explain enemy types', () => {
      const gameplaySection = component.sections.find(s => s.title === 'Gameplay');
      expect(gameplaySection?.content).toContain('enemies');
    });

    it('should explain shield mechanics', () => {
      const gameplaySection = component.sections.find(s => s.title === 'Gameplay');
      expect(gameplaySection?.content).toContain('shield');
    });

    it('should explain lives system', () => {
      const gameplaySection = component.sections.find(s => s.title === 'Gameplay');
      expect(gameplaySection?.content).toContain('lives');
    });

    it('should explain wave progression', () => {
      const gameplaySection = component.sections.find(s => s.title === 'Gameplay');
      expect(gameplaySection?.content).toContain('wave');
    });
  });

  describe('Scoring Section', () => {
    it('should display enemy point values', () => {
      const scoringSection = component.sections.find(s => s.title === 'Scoring');
      expect(scoringSection?.content).toContain('points');
    });

    it('should mention different enemy types have different values', () => {
      const scoringSection = component.sections.find(s => s.title === 'Scoring');
      // Should contain references to different point values
      expect(scoringSection?.content).toMatch(/\d+\s*points/i);
    });
  });

  describe('Tips Section', () => {
    it('should provide gameplay tips', () => {
      const tipsSection = component.sections.find(s => s.title === 'Tips');
      expect(tipsSection?.content).toBeDefined();
      expect(tipsSection?.content.length).toBeGreaterThan(0);
    });
  });

  describe('Dialog Actions', () => {
    it('should close dialog when close is called', () => {
      component.close();
      expect(mockDialogRef.close).toHaveBeenCalled();
    });
  });

  describe('Template Rendering', () => {
    it('should render dialog title', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const title = compiled.querySelector('h2');
      expect(title?.textContent).toContain('How to Play');
    });

    it('should render all expansion panels', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const panels = compiled.querySelectorAll('mat-expansion-panel');
      expect(panels.length).toBe(component.sections.length);
    });

    it('should render close button', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const closeButton = compiled.querySelector('mat-dialog-actions button');
      expect(closeButton).toBeTruthy();
    });

    it('should display mat-icons for visual representation', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const icons = compiled.querySelectorAll('mat-icon');
      expect(icons.length).toBeGreaterThan(0);
    });
  });

  describe('Accessibility', () => {
    it('should have accessible dialog title', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const title = compiled.querySelector('[mat-dialog-title]');
      expect(title).toBeTruthy();
    });

    it('should have accessible expansion panels with headers', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const panelHeaders = compiled.querySelectorAll('mat-expansion-panel-header');
      expect(panelHeaders.length).toBe(component.sections.length);
    });

    it('should have accessible close button', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const closeButton = compiled.querySelector('mat-dialog-actions button');
      expect(closeButton).toBeDefined();
    });
  });

  describe('Content Organization', () => {
    it('should have content organized in sections', () => {
      expect(component.sections.every(s => s.title && s.content)).toBe(true);
    });

    it('should have unique section titles', () => {
      const titles = component.sections.map(s => s.title);
      const uniqueTitles = new Set(titles);
      expect(titles.length).toBe(uniqueTitles.size);
    });
  });
});
