/**
 * SettingsService Test Suite
 * Tests game settings management and persistence
 */

import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { EMPTY, of } from 'rxjs';
import { SettingsService } from './settings.service';
import { ApiService } from './api.service';
import { 
  GameSettings, 
  Difficulty, 
  ControlScheme, 
  DEFAULT_SETTINGS
} from '../models/settings.model';

describe('SettingsService', () => {
  let service: SettingsService;
  let mockApiService: jasmine.SpyObj<Pick<ApiService, 'getSettings' | 'saveSettings' | 'resetSettings'>>;
  const STORAGE_KEY = 'space-invaders-settings';

  const mockSettings: GameSettings = {
    soundEnabled: false,
    musicEnabled: false,
    volume: 50,
    difficulty: Difficulty.HARD,
    controlScheme: ControlScheme.MOUSE
  };

  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();

    // Default mock: EMPTY so backend sync doesn't affect state
    mockApiService = {
      getSettings: jasmine.createSpy('getSettings').and.returnValue(EMPTY),
      saveSettings: jasmine.createSpy('saveSettings').and.returnValue(EMPTY),
      resetSettings: jasmine.createSpy('resetSettings').and.returnValue(EMPTY)
    };

    TestBed.configureTestingModule({
      providers: [
        SettingsService,
        { provide: ApiService, useValue: mockApiService },
        provideZonelessChangeDetection()
      ]
    });

    service = TestBed.inject(SettingsService);
  });

  afterEach(() => {
    localStorage.clear();
  });

  // ============================================================================
  // Initialization Tests
  // ============================================================================

  describe('Initialization', () => {
    it('should create the service', () => {
      expect(service).toBeTruthy();
    });

    it('should initialize with default settings', (done) => {
      service.settings$.subscribe((settings: GameSettings) => {
        expect(settings).toEqual(DEFAULT_SETTINGS);
        done();
      });
    });

    it('should load settings from localStorage on init', () => {
      // Store settings in localStorage
      localStorage.setItem(STORAGE_KEY, JSON.stringify(mockSettings));

      // Create new TestBed and service to trigger initialization
      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        providers: [
          SettingsService,
          { provide: ApiService, useValue: mockApiService },
          provideZonelessChangeDetection()
        ]
      });
      
      const newService: SettingsService = TestBed.inject(SettingsService);

      // Use first() to complete the observable after one emission
      newService.settings$.subscribe((settings: GameSettings) => {
        expect(settings).toEqual(mockSettings);
      });
    });
  });

  // ============================================================================
  // Sound Settings Tests
  // ============================================================================

  describe('Sound Settings', () => {
    it('should toggle sound on/off', (done) => {
      service.toggleSound();
      
      service.settings$.subscribe((settings: GameSettings) => {
        expect(settings.soundEnabled).toBe(false);
        done();
      });
    });

    it('should toggle music on/off', (done) => {
      service.toggleMusic();
      
      service.settings$.subscribe((settings: GameSettings) => {
        expect(settings.musicEnabled).toBe(false);
        done();
      });
    });

    it('should set volume (0-100)', (done) => {
      service.setVolume(85);
      
      service.settings$.subscribe((settings: GameSettings) => {
        expect(settings.volume).toBe(85);
        done();
      });
    });

    it('should clamp volume to valid range (below 0)', (done) => {
      service.setVolume(-10);
      
      service.settings$.subscribe((settings: GameSettings) => {
        expect(settings.volume).toBe(0);
        done();
      });
    });

    it('should clamp volume to valid range (above 100)', (done) => {
      service.setVolume(150);
      
      service.settings$.subscribe((settings: GameSettings) => {
        expect(settings.volume).toBe(100);
        done();
      });
    });
  });

  // ============================================================================
  // Difficulty Settings Tests
  // ============================================================================

  describe('Difficulty Settings', () => {
    it('should set difficulty to Easy', (done) => {
      service.setDifficulty(Difficulty.EASY);
      
      service.settings$.subscribe((settings: GameSettings) => {
        expect(settings.difficulty).toBe(Difficulty.EASY);
        done();
      });
    });

    it('should set difficulty to Normal', (done) => {
      service.setDifficulty(Difficulty.NORMAL);
      
      service.settings$.subscribe((settings: GameSettings) => {
        expect(settings.difficulty).toBe(Difficulty.NORMAL);
        done();
      });
    });

    it('should set difficulty to Hard', (done) => {
      service.setDifficulty(Difficulty.HARD);
      
      service.settings$.subscribe((settings: GameSettings) => {
        expect(settings.difficulty).toBe(Difficulty.HARD);
        done();
      });
    });

    it('should emit settings changes when difficulty updated', (done) => {
      let emissionCount = 0;
      
      service.settings$.subscribe(() => {
        emissionCount++;
        if (emissionCount === 2) { // Initial + after update
          done();
        }
      });

      service.setDifficulty(Difficulty.EASY);
    });
  });

  // ============================================================================
  // Control Settings Tests
  // ============================================================================

  describe('Control Settings', () => {
    it('should set control scheme to Keyboard', (done) => {
      service.setControlScheme(ControlScheme.KEYBOARD);
      
      service.settings$.subscribe((settings: GameSettings) => {
        expect(settings.controlScheme).toBe(ControlScheme.KEYBOARD);
        done();
      });
    });

    it('should set control scheme to Mouse', (done) => {
      service.setControlScheme(ControlScheme.MOUSE);
      
      service.settings$.subscribe((settings: GameSettings) => {
        expect(settings.controlScheme).toBe(ControlScheme.MOUSE);
        done();
      });
    });
  });

  // ============================================================================
  // Persistence Tests
  // ============================================================================

  describe('Persistence', () => {
    it('should save settings to localStorage', () => {
      service.setVolume(50);
      service.saveSettings();
      
      const saved = localStorage.getItem(STORAGE_KEY);
      expect(saved).toBeTruthy();
      
      if (saved) {
        const parsed = JSON.parse(saved);
        expect(parsed.volume).toBe(50);
      }
    });

    it('should reset to default settings', (done) => {
      service.setVolume(50);
      service.resetToDefaults();
      
      service.settings$.subscribe((settings: GameSettings) => {
        expect(settings).toEqual(DEFAULT_SETTINGS);
        done();
      });
    });

    it('should persist reset to localStorage', () => {
      service.setVolume(50);
      service.saveSettings();
      service.resetToDefaults();
      
      const saved = localStorage.getItem(STORAGE_KEY);
      expect(saved).toBeTruthy();
      
      if (saved) {
        const parsed = JSON.parse(saved);
        expect(parsed).toEqual(DEFAULT_SETTINGS);
      }
    });
  });

  // ============================================================================
  // Observable Tests
  // ============================================================================

  describe('Observable Behavior', () => {
    it('should expose settings as observable', () => {
      expect(service.settings$).toBeDefined();
    });

    it('should emit current settings on subscription', (done) => {
      service.settings$.subscribe((settings: GameSettings) => {
        expect(settings).toBeDefined();
        expect(settings.volume).toBeDefined();
        done();
      });
    });

    it('should update subscribers when settings change', (done) => {
      let emissionCount = 0;
      const values: number[] = [];

      service.settings$.subscribe((settings: GameSettings) => {
        values.push(settings.volume);
        emissionCount++;

        if (emissionCount === 3) {
          expect(values).toEqual([75, 80, 90]); // Initial, first update, second update
          done();
        }
      });

      setTimeout(() => service.setVolume(80), 10);
      setTimeout(() => service.setVolume(90), 20);
    });
  });

  // ============================================================================
  // Edge Cases
  // ============================================================================

  describe('Edge Cases', () => {
    it('should handle multiple rapid setting changes', (done) => {
      service.setVolume(10);
      service.setVolume(20);
      service.setVolume(30);
      service.setVolume(40);
      service.setVolume(50);

      service.settings$.subscribe((settings: GameSettings) => {
        expect(settings.volume).toBe(50);
        done();
      });
    });

    it('should maintain other settings when updating volume', (done) => {
      service.setVolume(60);

      service.settings$.subscribe((settings: GameSettings) => {
        expect(settings.soundEnabled).toBe(DEFAULT_SETTINGS.soundEnabled);
        expect(settings.musicEnabled).toBe(DEFAULT_SETTINGS.musicEnabled);
        expect(settings.difficulty).toBe(DEFAULT_SETTINGS.difficulty);
        expect(settings.controlScheme).toBe(DEFAULT_SETTINGS.controlScheme);
        done();
      });
    });

    it('should handle loading invalid settings from localStorage', () => {
      localStorage.setItem(STORAGE_KEY, '{"invalid": "data"}');

      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        providers: [
          SettingsService,
          { provide: ApiService, useValue: mockApiService },
          provideZonelessChangeDetection()
        ]
      });

      const newService: SettingsService = TestBed.inject(SettingsService);

      newService.settings$.subscribe((settings: GameSettings) => {
        // Should fall back to defaults for invalid data
        expect(settings.soundEnabled).toBe(DEFAULT_SETTINGS.soundEnabled);
        expect(settings.volume).toBe(DEFAULT_SETTINGS.volume);
      });
    });

    it('should handle corrupted localStorage data', () => {
      localStorage.setItem(STORAGE_KEY, 'not valid json');

      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        providers: [
          SettingsService,
          { provide: ApiService, useValue: mockApiService },
          provideZonelessChangeDetection()
        ]
      });

      const newService: SettingsService = TestBed.inject(SettingsService);

      newService.settings$.subscribe((settings: GameSettings) => {
        expect(settings).toEqual(DEFAULT_SETTINGS);
      });
    });
  });

  // ============================================================================
  // Helper Methods Tests
  // ============================================================================

  describe('Helper Methods', () => {
    it('should return current settings snapshot', () => {
      service.setVolume(42);
      const snapshot = service.getCurrentSettings();
      expect(snapshot.volume).toBe(42);
    });

    it('should check if settings have changed from defaults', () => {
      expect(service.hasChanges()).toBe(false);
      
      service.setVolume(50);
      expect(service.hasChanges()).toBe(true);
    });

    it('should restore settings from object', (done) => {
      service.restoreSettings(mockSettings);

      service.settings$.subscribe((settings: GameSettings) => {
        expect(settings).toEqual(mockSettings);
        done();
      });
    });
  });

  // ============================================================================
  // Backend Sync Tests
  // ============================================================================

  describe('Backend Sync', () => {
    it('should attempt to get settings from backend on init', () => {
      expect(mockApiService.getSettings).toHaveBeenCalled();
    });

    it('should update to backend settings when backend responds', (done) => {
      const backendSettings: GameSettings = {
        soundEnabled: false,
        musicEnabled: false,
        volume: 30,
        difficulty: Difficulty.EASY,
        controlScheme: ControlScheme.MOUSE
      };

      mockApiService.getSettings = jasmine.createSpy('getSettings').and.returnValue(of(backendSettings));

      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        providers: [
          SettingsService,
          { provide: ApiService, useValue: mockApiService },
          provideZonelessChangeDetection()
        ]
      });

      const newService = TestBed.inject(SettingsService);

      newService.settings$.subscribe((settings) => {
        expect(settings).toEqual(backendSettings);
        done();
      });
    });

    it('should keep localStorage settings when backend is unavailable', (done) => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(mockSettings));
      mockApiService.getSettings = jasmine.createSpy('getSettings').and.returnValue(EMPTY);

      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        providers: [
          SettingsService,
          { provide: ApiService, useValue: mockApiService },
          provideZonelessChangeDetection()
        ]
      });

      const newService = TestBed.inject(SettingsService);

      newService.settings$.subscribe((settings) => {
        expect(settings).toEqual(mockSettings);
        done();
      });
    });

    it('should call apiService.saveSettings when saveSettings is called', () => {
      service.setVolume(40);
      service.saveSettings();

      expect(mockApiService.saveSettings).toHaveBeenCalledWith(
        jasmine.objectContaining({ volume: 40 })
      );
    });

    it('should not throw when backend save fails', () => {
      mockApiService.saveSettings = jasmine.createSpy('saveSettings').and.returnValue(EMPTY);

      expect(() => {
        service.setVolume(40);
        service.saveSettings();
      }).not.toThrow();
    });
  });
});
