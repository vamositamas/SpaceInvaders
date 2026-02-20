import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Subject, takeUntil } from 'rxjs';
import { ConfigService } from '../../core/services/config.service';
import { SettingsDialogComponent } from './settings-dialog.component';
import { InstructionsDialogComponent } from './instructions-dialog.component';

/**
 * Main Menu Component
 * Entry point for the application with navigation to all major screens
 */
@Component({
  selector: 'app-main-menu',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatDialogModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './main-menu.component.html',
  styleUrl: './main-menu.component.scss'
})
export class MainMenuComponent implements OnInit, OnDestroy {
  isLoading = false;
  hasError = false;
  errorMessage = '';

  private destroy$ = new Subject<void>();

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private configService: ConfigService
  ) {}

  ngOnInit(): void {
    this.loadConfiguration();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Load game configuration
   */
  loadConfiguration(): void {
    this.isLoading = true;
    this.hasError = false;

    this.configService.config$
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (config) => {
          if (config) {
            this.isLoading = false;
          }
        },
        error: (error) => {
          this.isLoading = false;
          this.hasError = true;
          this.errorMessage = 'Failed to load configuration. Please refresh the page.';
          console.error('Configuration load error:', error);
        }
      });

    // Load config from API
    this.configService.loadConfig();
  }

  /**
   * Navigate to game screen
   */
  startGame(): void {
    this.router.navigate(['/game']);
  }

  /**
   * Navigate to high scores screen
   */
  viewHighScores(): void {
    this.router.navigate(['/high-scores']);
  }

  /**
   * Open settings dialog
   */
  openSettings(): void {
    const dialogRef = this.dialog.open(SettingsDialogComponent, {
      width: '500px',
      maxWidth: '90vw',
      disableClose: false,
      autoFocus: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Settings were saved
        console.log('Settings updated');
      }
    });
  }

  /**
   * Open instructions dialog
   */
  openInstructions(): void {
    this.dialog.open(InstructionsDialogComponent, {
      width: '800px',
      maxWidth: '90vw',
      maxHeight: '90vh',
      disableClose: false,
      autoFocus: true
    });
  }
}
