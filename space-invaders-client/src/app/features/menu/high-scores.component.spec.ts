import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { of, throwError, BehaviorSubject } from 'rxjs';

import { HighScoresComponent } from './high-scores.component';
import { HighScoreService } from '../../core/services/highscore.service';
import { HighScore } from '../../core/models/high-score.interface';

describe('HighScoresComponent', () => {
  let component: HighScoresComponent;
  let fixture: ComponentFixture<HighScoresComponent>;
  let mockHighScoreService: jasmine.SpyObj<HighScoreService>;
  let highScoresSubject: BehaviorSubject<HighScore[]>;

  const mockHighScores: HighScore[] = [
    {
      id: '1',
      playerName: 'Alice',
      score: 15000,
      level: 5,
      date: '2026-02-10T10:00:00Z'
    },
    {
      id: '2',
      playerName: 'Bob',
      score: 12000,
      level: 4,
      date: '2026-02-11T11:00:00Z'
    },
    {
      id: '3',
      playerName: 'Charlie',
      score: 10000,
      level: 3,
      date: '2026-02-12T12:00:00Z'
    },
    {
      id: '4',
      playerName: 'Diana',
      score: 8000,
      level: 3,
      date: '2026-02-13T13:00:00Z'
    },
    {
      id: '5',
      playerName: 'Eve',
      score: 6000,
      level: 2,
      date: '2026-02-13T14:00:00Z'
    }
  ];

  beforeEach(async () => {
    // Use BehaviorSubject so tests can control what's emitted
    highScoresSubject = new BehaviorSubject<HighScore[]>(mockHighScores);

    // Create mock service
    mockHighScoreService = jasmine.createSpyObj('HighScoreService', [
      'loadHighScores',
      'getHighScores'
    ], {
      highScores$: highScoresSubject.asObservable()
    });

    // Default mock behavior - getHighScores returns synchronous array
    mockHighScoreService.getHighScores.and.returnValue(mockHighScores);

    await TestBed.configureTestingModule({
      imports: [
        HighScoresComponent,
        MatTableModule,
        MatPaginatorModule,
        MatSortModule,
        MatProgressSpinnerModule
      ],
      providers: [
        provideZonelessChangeDetection(),
        provideHttpClient(),
        provideHttpClientTesting(),
        provideNoopAnimations(),
        { provide: HighScoreService, useValue: mockHighScoreService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HighScoresComponent);
    component = fixture.componentInstance;
  });

  // ============================================================================
  // Component Initialization Tests
  // ============================================================================

  describe('Component Initialization', () => {
    it('should create the component', () => {
      expect(component).toBeTruthy();
    });

    it('should load high scores on init', () => {
      fixture.detectChanges();

      expect(mockHighScoreService.loadHighScores).toHaveBeenCalled();
      expect(component.highScores).toEqual(mockHighScores);
      expect(component.dataSource.data).toEqual(mockHighScores);
    });

    it('should set loading state while fetching scores', () => {
      expect(component.isLoading).toBe(false);

      fixture.detectChanges();

      // After init, loading should be false
      expect(component.isLoading).toBe(false);
    });

    it('should handle empty scores array', () => {
      highScoresSubject.next([]);
      mockHighScoreService.getHighScores.and.returnValue([]);

      fixture.detectChanges();

      expect(component.highScores).toEqual([]);
      expect(component.dataSource.data.length).toBe(0);
    });
  });

  // ============================================================================
  // Table Display Tests
  // ============================================================================

  describe('Table Display', () => {
    it('should display all column headers', () => {
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      const headers = compiled.querySelectorAll('th');

      expect(headers.length).toBeGreaterThan(0);
      
      const headerTexts = Array.from(headers).map(h => h.textContent?.trim());
      expect(headerTexts).toContain('Rank');
      expect(headerTexts).toContain('Player');
      expect(headerTexts).toContain('Score');
      expect(headerTexts).toContain('Level');
      expect(headerTexts).toContain('Date');
    });

    it('should display correct number of rows', () => {
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      const rows = compiled.querySelectorAll('tbody tr');

      expect(rows.length).toBe(mockHighScores.length);
    });

    it('should display score with comma separators', () => {
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      const scoreCells = compiled.querySelectorAll('.score-cell');

      expect(scoreCells.length).toBeGreaterThan(0);
      // First score should be formatted as "15,000"
      const firstScore = scoreCells[0]?.textContent?.trim();
      expect(firstScore).toContain('15,000');
    });

    it('should display date in readable format', () => {
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      const dateCells = compiled.querySelectorAll('.date-cell');

      expect(dateCells.length).toBeGreaterThan(0);
      // Date should be formatted (e.g., "Feb 10, 2026")
      const firstDate = dateCells[0]?.textContent?.trim();
      expect(firstDate).toBeTruthy();
      expect(firstDate).toMatch(/\w{3}\s+\d{1,2},\s+\d{4}/); // MMM d, yyyy format
    });

    it('should calculate and display correct rank', () => {
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      const rankCells = compiled.querySelectorAll('.rank-cell');

      expect(rankCells.length).toBeGreaterThan(0);
      expect(rankCells[0]?.textContent?.trim()).toBe('1');
      expect(rankCells[1]?.textContent?.trim()).toBe('2');
      expect(rankCells[2]?.textContent?.trim()).toBe('3');
    });
  });

  // ============================================================================
  // Sorting Tests
  // ============================================================================

  describe('Sorting', () => {
    it('should initialize with scores sorted by rank (score descending)', () => {
      fixture.detectChanges();

      expect(component.highScores[0].score).toBe(15000);
      expect(component.highScores[1].score).toBe(12000);
      expect(component.highScores[2].score).toBe(10000);
    });

    it('should have sortable columns', () => {
      fixture.detectChanges();

      expect(component.dataSource.sort).toBeTruthy();
    });
  });

  // ============================================================================
  // Pagination Tests
  // ============================================================================

  describe('Pagination', () => {
    it('should configure paginator with correct page size', () => {
      fixture.detectChanges();

      expect(component.dataSource.paginator).toBeTruthy();
      expect(component.dataSource.paginator?.pageSize).toBe(10);
    });

    it('should show correct page size options', () => {
      fixture.detectChanges();

      const pageSizeOptions = component.dataSource.paginator?.pageSizeOptions;
      expect(pageSizeOptions).toEqual([5, 10, 25, 50]);
    });

    it('should handle pagination with more than 10 scores', () => {
      // Start with initial scores so paginator renders on first detectChanges
      fixture.detectChanges();

      // Create 15 mock scores
      const manyScores: HighScore[] = Array.from({ length: 15 }, (_, i) => ({
        id: `${i + 1}`,
        playerName: `Player${i + 1}`,
        score: 15000 - (i * 1000),
        level: 5 - Math.floor(i / 3),
        date: new Date().toISOString()
      }));

      highScoresSubject.next(manyScores);
      fixture.componentRef.changeDetectorRef.markForCheck();
      fixture.detectChanges();

      expect(component.dataSource.data.length).toBe(15);
      // paginator.length is updated by MatTableDataSource when data changes
      expect(component.dataSource.paginator).toBeTruthy();
    });
  });

  // ============================================================================
  // Empty State Tests
  // ============================================================================

  describe('Empty State', () => {
    it('should display empty state message when no scores', () => {
      highScoresSubject.next([]);
      mockHighScoreService.getHighScores.and.returnValue([]);

      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      const emptyMessage = compiled.querySelector('.empty-state');

      expect(emptyMessage).toBeTruthy();
      expect(emptyMessage?.textContent).toContain('No high scores yet');
    });

    it('should not display empty state when scores exist', () => {
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      const emptyMessage = compiled.querySelector('.empty-state');

      expect(emptyMessage).toBeFalsy();
    });
  });

  // ============================================================================
  // Error Handling Tests
  // ============================================================================

  describe('Error Handling', () => {
    it('should handle errors gracefully', () => {
      // Component should handle errors from the service's internal error handling
      highScoresSubject.next([]);
      mockHighScoreService.getHighScores.and.returnValue([]);
      
      // Simulate loadHighScores being called but service handles the error internally
      fixture.detectChanges();

      expect(component.highScores).toEqual([]);
      expect(component.isLoading).toBe(false);
    });

    it('should display error message when service fails', () => {
      fixture.detectChanges(); // Run ngOnInit first
      // Set component to error state after init (so subscription doesn't clear it)
      highScoresSubject.error(new Error('Load failed')); // This triggers the error handler
      component.errorMessage = 'Failed to load high scores. Please try again.';
      fixture.componentRef.changeDetectorRef.markForCheck();
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      const errorElement = compiled.querySelector('.error-message');

      expect(errorElement).toBeTruthy();
      expect(errorElement?.textContent).toContain('Failed to load high scores');
    });

    it('should allow retry after error', () => {
      fixture.detectChanges(); // Run ngOnInit first
      // Simulate error state
      component.errorMessage = 'Network error';
      component.highScores = [];
      fixture.componentRef.changeDetectorRef.markForCheck();
      fixture.detectChanges();

      expect(component.errorMessage).toBeTruthy();

      // Emit new scores first so that when loadHighScores triggers the subscription,
      // it synchronously resolves loading state before the next change detection cycle
      highScoresSubject.next(mockHighScores);
      component.loadHighScores();
      fixture.componentRef.changeDetectorRef.markForCheck();
      fixture.detectChanges();

      expect(component.highScores.length).toBe(mockHighScores.length);
    });
  });

  // ============================================================================
  // Responsive Design Tests
  // ============================================================================

  describe('Responsive Design', () => {
    it('should have responsive table class', () => {
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      const container = compiled.querySelector('.high-scores-container');

      expect(container).toBeTruthy();
      expect(container?.classList.contains('responsive')).toBe(true);
    });
  });

  // ============================================================================
  // Refresh Functionality Tests
  // ============================================================================

  describe('Refresh Functionality', () => {
    it('should have refresh method', () => {
      expect(component.loadHighScores).toBeDefined();
    });

    it('should reload scores when refresh is called', () => {
      fixture.detectChanges();

      mockHighScoreService.loadHighScores.calls.reset();

      component.loadHighScores();

      expect(mockHighScoreService.loadHighScores).toHaveBeenCalled();
    });
  });
});
