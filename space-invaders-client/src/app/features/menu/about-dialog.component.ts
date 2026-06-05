import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

/**
 * About Dialog Component
 * Displays credits, creators, and game background information
 */
@Component({
  selector: 'app-about-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './about-dialog.component.html',
  styleUrl: './about-dialog.component.scss'
})
export class AboutDialogComponent {
  constructor(
    private dialogRef: MatDialogRef<AboutDialogComponent>
  ) {}

  /**
   * Close the dialog
   */
  close(): void {
    this.dialogRef.close();
  }
}
