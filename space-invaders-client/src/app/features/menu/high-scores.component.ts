import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { HighScoreService } from '../../core/services/highscore.service';
import { HighScore } from '../../core/models/high-score.interface';

/**
 * HighScoresComponent - Displays high scores in a Material table
 * 
 * Features:
 * - Sortable columns (rank, name, score, level, date)
 * - Pagination (10 scores per page)
 * - Responsive design
 * - Empty state handling
 * - Error handling with retry
 * - Formatted scores (comma separators)
 * - Formatted dates (readable format)
 */
@Component({
  selector: 'app-high-scores',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './high-scores.component.html',
  styleUrl: './high-scores.component.scss'
})
export class HighScoresComponent implements OnInit {
  private readonly highScoreService = inject(HighScoreService);

  // Table configuration
  displayedColumns: string[] = ['rank', 'playerName', 'score', 'level', 'date'];
  dataSource = new MatTableDataSource<HighScore>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  // Component state
  highScores: HighScore[] = [];
  isLoading = false;
  errorMessage: string | null = null;

  ngOnInit(): void {
    this.loadHighScores();
    this.subscribeToHighScores();
  }

  ngAfterViewInit(): void {
    if (this.paginator) {
      // Configure paginator
      this.dataSource.paginator = this.paginator;
      this.dataSource.paginator.pageSize = 10;
      this.dataSource.paginator.pageSizeOptions = [5, 10, 25, 50];
    }

    // Configure sorting
    if (this.sort) {
      this.dataSource.sort = this.sort;
    }
  }

  /**
   * Load high scores from service
   */
  loadHighScores(): void {
    this.isLoading = true;
    this.errorMessage = null;
    this.highScoreService.loadHighScores(100);
  }

  /**
   * Subscribe to high scores observable
   */
  private subscribeToHighScores(): void {
    this.highScoreService.highScores$.subscribe({
      next: (scores) => {
        this.highScores = scores;
        this.dataSource.data = scores;
        this.isLoading = false;
        this.errorMessage = null;
      },
      error: (error) => {
        console.error('Error loading high scores:', error);
        this.errorMessage = 'Failed to load high scores. Please try again.';
        this.isLoading = false;
      }
    });
  }

  /**
   * Get rank for a score (1-based index)
   */
  getRank(index: number): number {
    const page = this.paginator?.pageIndex || 0;
    const pageSize = this.paginator?.pageSize || 10;
    return (page * pageSize) + index + 1;
  }

  /**
   * Format score with commas
   */
  formatScore(score: number): string {
    return score.toLocaleString();
  }

  /**
   * Format date to readable string
   */
  formatDate(date: string | undefined): string {
    if (!date) return 'N/A';
    
    const dateObj = new Date(date);
    return dateObj.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }
}
