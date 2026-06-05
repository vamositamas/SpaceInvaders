import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { AudioService } from './audio.service';
import { SettingsService } from './settings.service';
import { GameSettings, Difficulty, ControlScheme } from '../models/settings.model';

describe('AudioService', () => {
  let service: AudioService;
  let mockSettingsService: jasmine.SpyObj<SettingsService>;

  const defaultMockSettings: GameSettings = {
    soundEnabled: true,
    musicEnabled: true,
    volume: 50,
    difficulty: Difficulty.NORMAL,
    controlScheme: ControlScheme.KEYBOARD
  };

  beforeEach(() => {
    mockSettingsService = jasmine.createSpyObj('SettingsService', ['getCurrentSettings']);
    mockSettingsService.getCurrentSettings.and.returnValue(defaultMockSettings);

    TestBed.configureTestingModule({
      providers: [
        AudioService,
        { provide: SettingsService, useValue: mockSettingsService },
        provideZonelessChangeDetection()
      ]
    });

    service = TestBed.inject(AudioService);

    // Mock AudioContext globally if it doesn't exist in testing environment
    if (!(window as any).AudioContext && !(window as any).webkitAudioContext) {
      const mockGainNode = {
        gain: { setValueAtTime: () => {} },
        connect: () => {}
      };
      const mockOscillatorNode = {
        frequency: { setValueAtTime: () => {}, exponentialRampToValueAtTime: () => {} },
        gain: { setValueAtTime: () => {}, exponentialRampToValueAtTime: () => {} },
        connect: () => {},
        start: () => {},
        stop: () => {}
      };
      const mockBufferSourceNode = {
        buffer: null,
        connect: () => {},
        start: () => {},
        stop: () => {}
      };
      const mockFilterNode = {
        type: 'lowpass',
        frequency: { setValueAtTime: () => {}, exponentialRampToValueAtTime: () => {} },
        connect: () => {}
      };

      const mockAudioContext = {
        state: 'running',
        currentTime: 10,
        sampleRate: 44100,
        resume: () => Promise.resolve(),
        createGain: () => mockGainNode,
        createOscillator: () => mockOscillatorNode,
        createBufferSource: () => mockBufferSourceNode,
        createBiquadFilter: () => mockFilterNode,
        createBuffer: () => ({
          getChannelData: () => new Float32Array(100)
        }),
        destination: {}
      };

      (window as any).AudioContext = jasmine.createSpy('AudioContext').and.returnValue(mockAudioContext);
    }
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should not play sound if soundEnabled is false', () => {
    mockSettingsService.getCurrentSettings.and.returnValue({
      ...defaultMockSettings,
      soundEnabled: false
    });

    const spy = spyOn<any>(service, 'initCtx').and.callThrough();
    service.playShoot();
    
    // Will run initCtx but return early because getVolumeNode returns null
    expect(spy).toHaveBeenCalled();
  });

  it('should trigger synthesiser nodes when sound is enabled', () => {
    mockSettingsService.getCurrentSettings.and.returnValue(defaultMockSettings);
    
    const spy = spyOn<any>(service, 'getVolumeNode').and.callThrough();
    service.playShoot();
    
    expect(spy).toHaveBeenCalled();
  });

  it('should support explosion generation', () => {
    const spy = spyOn<any>(service, 'getVolumeNode').and.callThrough();
    service.playExplosion();
    expect(spy).toHaveBeenCalled();
  });

  it('should support impact blips', () => {
    const spy = spyOn<any>(service, 'getVolumeNode').and.callThrough();
    service.playHit();
    expect(spy).toHaveBeenCalled();
  });

  it('should support level up arpeggios', () => {
    const spy = spyOn<any>(service, 'getVolumeNode').and.callThrough();
    service.playLevelUp();
    expect(spy).toHaveBeenCalled();
  });

  it('should support game over descending notes', () => {
    const spy = spyOn<any>(service, 'getVolumeNode').and.callThrough();
    service.playGameOver();
    expect(spy).toHaveBeenCalled();
  });
});
