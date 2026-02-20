/**
 * SettingsDialogComponent Test Suite
 * Tests the settings dialog UI and user interactions
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { MatSliderModule } from '@angular/material/slider';
import { MatButtonModule } from '@angular/material/button';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';

import { SettingsDialogComponent } from './settings-dialog.component';
import { SettingsService } from '../../core/services/settings.service';
import { Difficulty, ControlScheme, DEFAULT_SETTINGS, GameSettings } from '../../core/models/settings.model';

describe('SettingsDialogComponent', () => {
  let component: SettingsDialogComponent;
  let fixture: ComponentFixture<SettingsDialogComponent>;
  let mockDialogRef: jasmine.SpyObj<MatDialogRef<SettingsDialogComponent>>;
  let mockSettingsService: jasmine.SpyObj<SettingsService>;

  const mockSettings: GameSettings = {
    soundEnabled: true,
    musicEnabled: true,
    volume: 75,
    difficulty: Difficulty.NORMAL,
    controlScheme: ControlScheme.KEYBOARD
  };

  beforeEach(async () => {
    // Create mocks
    mockDialogRef = jasmine.createSpyObj('MatDialogRef', ['close']);
    mockSettingsService = jasmine.createSpyObj('SettingsService', [
      'getCurrentSettings',
      'setVolume',
      'setDifficulty',
      'setControlScheme',
      'toggleSound',
      'toggleMusic',
      'saveSettings',
      'resetToDefaults'
    ], {
      settings$: of(mockSettings)
    });

    mockSettingsService.getCurrentSettings.and.returnValue(mockSettings);

    await TestBed.configureTestingModule({
      imports: [
        SettingsDialogComponent,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatCheckboxModule,
        MatRadioModule,
        MatSliderModule,
        MatButtonModule,
        NoopAnimationsModule
      ],
      providers: [
        { provide: MatDialogRef, useValue: mockDialogRef },
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: SettingsService, useValue: mockSettingsService },
        provideZonelessChangeDetection()
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SettingsDialogComponent);
    component = fixture.componentInstance;
  });

  // ============================================================================
  // Rendering Tests
  // ============================================================================

  describe('Rendering', () => {
    it('should create the component', () => {
      expect(component).toBeTruthy();
    });

    it('should display current settings', () => {
      fixture.detectChanges();
      
      expect(component.settingsForm.value).toEqual(jasmine.objectContaining({
        soundEnabled: mockSettings.soundEnabled,
        musicEnabled: mockSettings.musicEnabled,
        volume: mockSettings.volume,
        difficulty: mockSettings.difficulty,
        controlScheme: mockSettings.controlScheme
      }));
    });

    it('should render all form controls', () => {
      fixture.detectChanges();
      const compiled = fixture.nativeElement;
      
      expect(compiled.querySelector('[formControlName="soundEnabled"]')).toBeTruthy();
      expect(compiled.querySelector('[formControlName="musicEnabled"]')).toBeTruthy();
      expect(compiled.querySelector('[formControlName="volume"]')).toBeTruthy();
      expect(compiled.querySelector('[formControlName="difficulty"]')).toBeTruthy();
      expect(compiled.querySelector('[formControlName="controlScheme"]')).toBeTruthy();
    });
  });

  // ============================================================================
  // Form Tests
  // ============================================================================

  describe('Form Validation', () => {
    it('should populate form with current settings', () => {
      fixture.detectChanges();
      
      expect(component.settingsForm.get('soundEnabled')?.value).toBe(mockSettings.soundEnabled);
      expect(component.settingsForm.get('musicEnabled')?.value).toBe(mockSettings.musicEnabled);
      expect(component.settingsForm.get('volume')?.value).toBe(mockSettings.volume);
      expect(component.settingsForm.get('difficulty')?.value).toBe(mockSettings.difficulty);
      expect(component.settingsForm.get('controlScheme')?.value).toBe(mockSettings.controlScheme);
    });

    it('should validate volume range (0-100)', () => {
      fixture.detectChanges();
      const volumeControl = component.settingsForm.get('volume');
      
      volumeControl?.setValue(-10);
      expect(volumeControl?.invalid).toBe(true);
      
      volumeControl?.setValue(150);
      expect(volumeControl?.invalid).toBe(true);
      
      volumeControl?.setValue(50);
      expect(volumeControl?.valid).toBe(true);
    });

    it('should mark form as invalid if validation fails', () => {
      fixture.detectChanges();
      
      component.settingsForm.get('volume')?.setValue(-10);
      expect(component.settingsForm.invalid).toBe(true);
    });

    it('should enable Save button when form is valid', () => {
      fixture.detectChanges();
      const saveButton = fixture.nativeElement.querySelector('button[type="submit"]');
      
      expect(saveButton.disabled).toBe(false);
    });

    it('should disable Save button when form is invalid', () => {
      fixture.detectChanges();
      
      component.settingsForm.get('volume')?.setValue(200);
      fixture.detectChanges();
      
      const saveButton = fixture.nativeElement.querySelector('button[type="submit"]');
      expect(saveButton.disabled).toBe(true);
    });
  });

  // ============================================================================
  // Sound Settings Tests
  // ============================================================================

  describe('Sound Settings', () => {
    it('should toggle sound checkbox', () => {
      fixture.detectChanges();
      
      component.settingsForm.get('soundEnabled')?.setValue(false);
      expect(component.settingsForm.get('soundEnabled')?.value).toBe(false);
    });

    it('should toggle music checkbox', () => {
      fixture.detectChanges();
      
      component.settingsForm.get('musicEnabled')?.setValue(false);
      expect(component.settingsForm.get('musicEnabled')?.value).toBe(false);
    });

    it('should update volume slider', () => {
      fixture.detectChanges();
      
      component.settingsForm.get('volume')?.setValue(85);
      expect(component.settingsForm.get('volume')?.value).toBe(85);
    });
  });

  // ============================================================================
  // Difficulty Tests
  // ============================================================================

  describe('Difficulty Selection', () => {
    it('should select difficulty radio button', () => {
      fixture.detectChanges();
      
      component.settingsForm.get('difficulty')?.setValue(Difficulty.HARD);
      expect(component.settingsForm.get('difficulty')?.value).toBe(Difficulty.HARD);
    });
  });

  // ============================================================================
  // Controls Tests
  // ============================================================================

  describe('Control Scheme Selection', () => {
    it('should select control scheme radio button', () => {
      fixture.detectChanges();
      
      component.settingsForm.get('controlScheme')?.setValue(ControlScheme.MOUSE);
      expect(component.settingsForm.get('controlScheme')?.value).toBe(ControlScheme.MOUSE);
    });
  });

  // ============================================================================
  // Actions Tests
  // ============================================================================

  describe('Dialog Actions', () => {
    it('should save settings and close dialog on Save', () => {
      fixture.detectChanges();
      
      component.settingsForm.patchValue({
        volume: 80,
        difficulty: Difficulty.HARD
      });
      
      component.onSave();
      
      expect(mockSettingsService.saveSettings).toHaveBeenCalled();
      expect(mockDialogRef.close).toHaveBeenCalledWith(true);
    });

    it('should close dialog without saving on Cancel', () => {
      fixture.detectChanges();
      
      component.onCancel();
      
      expect(mockSettingsService.saveSettings).not.toHaveBeenCalled();
      expect(mockDialogRef.close).toHaveBeenCalledWith(false);
    });

    it('should reset to defaults on Reset button', () => {
      fixture.detectChanges();
      
      component.onReset();
      
      expect(mockSettingsService.resetToDefaults).toHaveBeenCalled();
      expect(component.settingsForm.value).toEqual(jasmine.objectContaining(DEFAULT_SETTINGS));
    });

    it('should show loading state while saving', () => {
      fixture.detectChanges();
      
      // Call save
      component.onSave();
      
      // Verify settings service methods were called
      expect(mockSettingsService.setVolume).toHaveBeenCalled();
      expect(mockSettingsService.setDifficulty).toHaveBeenCalled();
      expect(mockSettingsService.setControlScheme).toHaveBeenCalled();
      expect(mockSettingsService.saveSettings).toHaveBeenCalled();
      
      // Dialog should close after save
      expect(mockDialogRef.close).toHaveBeenCalledWith(true);
    });
  });

  // ============================================================================
  // Error Handling Tests
  // ============================================================================

  describe('Error Handling', () => {
    it('should handle save errors with error message', () => {
      mockSettingsService.saveSettings.and.throwError('Save failed');
      fixture.detectChanges();
      
      component.onSave();
      
      expect(component.errorMessage).toBeTruthy();
      expect(component.errorMessage).toContain('error');
    });
  });
});
