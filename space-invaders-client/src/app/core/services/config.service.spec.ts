import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { of, throwError } from 'rxjs';
import { ConfigService } from './config.service';
import { ApiService } from './api.service';
import { GameConfig } from '../models';

describe('ConfigService', () => {
  let service: ConfigService;
  let apiServiceSpy: jasmine.SpyObj<ApiService>;

  const mockConfig: GameConfig = {
    canvas: { width: 800, height: 600 },
    player: { speed: 5, fireRate: 500, lives: 3 },
    enemies: { rows: 5, columns: 11, baseSpeed: 1, speedIncrement: 0.1, fireRate: 2000 },
    difficulty: {
      easy: { speedMultiplier: 0.75, fireRateMultiplier: 1.5 },
      normal: { speedMultiplier: 1.0, fireRateMultiplier: 1.0 },
      hard: { speedMultiplier: 1.5, fireRateMultiplier: 0.5 }
    }
  };

  beforeEach(() => {
    const apiSpy = jasmine.createSpyObj('ApiService', [
      'getConfig',
      'updateConfig',
      'updateConfigProperty',
      'resetConfig'
    ]);

    TestBed.configureTestingModule({
      providers: [
        ConfigService,
        { provide: ApiService, useValue: apiSpy },
        provideZonelessChangeDetection()
      ]
    });

    service = TestBed.inject(ConfigService);
    apiServiceSpy = TestBed.inject(ApiService) as jasmine.SpyObj<ApiService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should have config$ observable that emits initial null', (done) => {
    service.config$.subscribe((config: GameConfig | null) => {
      expect(config).toBeNull();
      done();
    });
  });

  it('should call ApiService.getConfig when loadConfig is called', () => {
    apiServiceSpy.getConfig.and.returnValue(of(mockConfig));
    
    service.loadConfig();
    
    expect(apiServiceSpy.getConfig).toHaveBeenCalled();
  });

  it('should update config$ observable after loadConfig', (done) => {
    apiServiceSpy.getConfig.and.returnValue(of(mockConfig));
    
    service.loadConfig();
    
    service.config$.subscribe((config: GameConfig | null) => {
      if (config) {
        expect(config).toEqual(mockConfig);
        done();
      }
    });
  });

  it('should call ApiService.updateConfig with correct data', () => {
    const updates: Partial<GameConfig> = {
      player: { speed: 10, fireRate: 300, lives: 5 }
    };
    apiServiceSpy.updateConfig.and.returnValue(of(mockConfig));
    
    service.updateConfig(updates);
    
    expect(apiServiceSpy.updateConfig).toHaveBeenCalledWith(updates);
  });

  it('should update local cache after updateConfig', (done) => {
    const updates: Partial<GameConfig> = {
      player: { speed: 10, fireRate: 300, lives: 5 }
    };
    apiServiceSpy.updateConfig.and.returnValue(of(mockConfig));
    
    service.updateConfig(updates);
    
    service.config$.subscribe((config: GameConfig | null) => {
      if (config) {
        expect(config).toEqual(mockConfig);
        done();
      }
    });
  });

  it('should call ApiService.updateConfigProperty with correct parameters', () => {
    const property = 'player.speed';
    const value = 15;
    apiServiceSpy.updateConfigProperty.and.returnValue(of(mockConfig));
    
    service.updateConfigProperty(property, value);
    
    expect(apiServiceSpy.updateConfigProperty).toHaveBeenCalledWith(property, value);
  });

  it('should call ApiService.resetConfig when resetConfig is called', () => {
    apiServiceSpy.resetConfig.and.returnValue(of(mockConfig));
    
    service.resetConfig();
    
    expect(apiServiceSpy.resetConfig).toHaveBeenCalled();
  });

  it('should return cached config synchronously with getConfig', () => {
    apiServiceSpy.getConfig.and.returnValue(of(mockConfig));
    service.loadConfig(); // of() is synchronous — BehaviorSubject is updated immediately
    const config = service.getConfig();
    expect(config).toEqual(mockConfig);
  });

  it('should handle errors when API calls fail', (done) => {
    const error = new Error('API Error');
    apiServiceSpy.getConfig.and.returnValue(throwError(() => error));
    
    service.loadConfig();
    
    // Config should remain null on error
    service.config$.subscribe((config: GameConfig | null) => {
      expect(config).toBeNull();
      done();
    });
  });
});
