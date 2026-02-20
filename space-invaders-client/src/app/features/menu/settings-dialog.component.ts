/**
 * SettingsDialogComponent
 * Dialog for configuring game settings
 */

import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { MatSliderModule } from '@angular/material/slider';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { SettingsService } from '../../core/services/settings.service';
import { Difficulty, ControlScheme, DEFAULT_SETTINGS } from '../../core/models/settings.model';

/**
 * Settings dialog component for game configuration
 */
@Component({
  selector: 'app-settings-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatRadioModule,
    MatSliderModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './settings-dialog.component.html',
  styleUrls: ['./settings-dialog.component.scss']
})
export class SettingsDialogComponent implements OnInit {
  private readonly dialogRef = inject(MatDialogRef<SettingsDialogComponent>);
  private readonly settingsService = inject(SettingsService);
  private readonly fb = inject(FormBuilder);

  settingsForm!: FormGroup;
  isSaving = false;
  errorMessage: string | null = null;

  // Expose enums to template
  readonly Difficulty = Difficulty;
  readonly ControlScheme = ControlScheme;

  ngOnInit(): void {
    this.initializeForm();
  }

  /**
   * Initialize the form with current settings
   */
  private initializeForm(): void {
    const currentSettings = this.settingsService.getCurrentSettings();

    this.settingsForm = this.fb.group({
      soundEnabled: [currentSettings.soundEnabled],
      musicEnabled: [currentSettings.musicEnabled],
      volume: [currentSettings.volume, [Validators.required, Validators.min(0), Validators.max(100)]],
      difficulty: [currentSettings.difficulty, Validators.required],
      controlScheme: [currentSettings.controlScheme, Validators.required]
    });
  }

  /**
   * Save settings and close dialog
   */
  onSave(): void {
    if (this.settingsForm.invalid) {
      return;
    }

    this.isSaving = true;
    this.errorMessage = null;

    try {
      const formValue = this.settingsForm.value;

      // Update settings service
      this.settingsService.setVolume(formValue.volume);
      this.settingsService.setDifficulty(formValue.difficulty);
      this.settingsService.setControlScheme(formValue.controlScheme);

      // Handle boolean toggles if changed
      const currentSettings = this.settingsService.getCurrentSettings();
      if (formValue.soundEnabled !== currentSettings.soundEnabled) {
        this.settingsService.toggleSound();
      }
      if (formValue.musicEnabled !== currentSettings.musicEnabled) {
        this.settingsService.toggleMusic();
      }

      // Persist settings
      this.settingsService.saveSettings();

      this.isSaving = false;
      this.dialogRef.close(true);
    } catch (error) {
      this.errorMessage = 'An error occurred while saving settings. Please try again.';
      this.isSaving = false;
    }
  }

  /**
   * Close dialog without saving
   */
  onCancel(): void {
    this.dialogRef.close(false);
  }

  /**
   * Reset settings to defaults
   */
  onReset(): void {
    this.settingsService.resetToDefaults();
    this.settingsForm.patchValue(DEFAULT_SETTINGS);
  }

  /**
   * Format volume label for slider
   */
  formatVolumeLabel(value: number): string {
    return `${value}%`;
  }
}
