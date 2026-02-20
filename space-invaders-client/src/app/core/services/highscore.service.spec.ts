import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { of, throwError } from 'rxjs';
import { HighScoreService } from './highscore.service';
import { ApiService } from './api.service';
import { HighScore } from '../models';

describe('HighScoreService', () => {
  let service: HighScoreService;
  let apiServiceSpy: jasmine.SpyObj<ApiService>;

  const mockScores: HighScore[] = [
    { id: '1', playerName: 'Player1', score: 1000, level: 5 },
    { id: '2', playerName: 'Player2', score: 800, level: 3 },
    { id: '3', playerName: 'Player3', score: 600, level: 2 }
  ];

  beforeEach(() => {
    const apiSpy = jasmine.createSpyObj('ApiService', [
      'getHighScores',
      'addHighScore'
    ]);

    TestBed.configureTestingModule({
      providers: [
        HighScoreService,
        { provide: ApiService, useValue: apiSpy },
        provideZonelessChangeDetection()
      ]
    });

    service = TestBed.inject(HighScoreService);
    apiServiceSpy = TestBed.inject(ApiService) as jasmine.SpyObj<ApiService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should have highScores$ observable that emits initial empty array', (done) => {
    service.highScores$.subscribe((scores: HighScore[]) => {
      expect(scores).toEqual([]);
      done();
    });
  });

  it('should call ApiService.getHighScores when loadHighScores is called', () => {
    apiServiceSpy.getHighScores.and.returnValue(of(mockScores));
    
    service.loadHighScores();
    
    expect(apiServiceSpy.getHighScores).toHaveBeenCalled();
  });

  it('should call ApiService.getHighScores with limit parameter', () => {
    const limit = 10;
    apiServiceSpy.getHighScores.and.returnValue(of(mockScores));
    
    service.loadHighScores(limit);
    
    expect(apiServiceSpy.getHighScores).toHaveBeenCalledWith(limit);
  });

  it('should update highScores$ observable after loadHighScores', (done) => {
    apiServiceSpy.getHighScores.and.returnValue(of(mockScores));
    
    // Subscribe first so we capture the transition from [] to mockScores
    let emissionCount = 0;
    service.highScores$.subscribe((scores: HighScore[]) => {
      emissionCount++;
      if (emissionCount === 2) {
        expect(scores).toEqual(mockScores);
        done();
      }
    });
    
    service.loadHighScores();
  });

  it('should call ApiService.addHighScore with correct data', (done) => {
    const newScore: HighScore = {
      playerName: 'NewPlayer',
      score: 1500,
      level: 7
    };
    const savedScore: HighScore = { ...newScore, id: '4' };
    apiServiceSpy.addHighScore.and.returnValue(of(savedScore));
    // addHighScore internally calls loadHighScores() after success, so getHighScores must be mocked
    apiServiceSpy.getHighScores.and.returnValue(of([]));
    
    service.addHighScore(newScore).subscribe((result: HighScore) => {
      expect(apiServiceSpy.addHighScore).toHaveBeenCalledWith(newScore);
      expect(result).toEqual(savedScore);
      done();
    });
  });

  it('should refresh local cache after addHighScore success', (done) => {
    const newScore: HighScore = {
      playerName: 'NewPlayer',
      score: 1500,
      level: 7
    };
    const savedScore: HighScore = { ...newScore, id: '4' };
    
    // Setup spy to return different values for different calls
    apiServiceSpy.addHighScore.and.returnValue(of(savedScore));
    apiServiceSpy.getHighScores.and.returnValue(of([...mockScores, savedScore]));
    
    service.addHighScore(newScore).subscribe(() => {
      expect(apiServiceSpy.getHighScores).toHaveBeenCalled();
      done();
    });
  });

  it('should check if score qualifies against lowest cached score', (done) => {
    apiServiceSpy.getHighScores.and.returnValue(of(mockScores));
    service.loadHighScores();
    
    // Give time for scores to load
    setTimeout(() => {
      service.isHighScore(700).subscribe((qualifies: boolean) => {
        expect(qualifies).toBeTrue();
        done();
      });
    }, 100);
  });

  it('should return true if cache has less than 100 scores', (done) => {
    apiServiceSpy.getHighScores.and.returnValue(of(mockScores));
    service.loadHighScores();
    
    setTimeout(() => {
      service.isHighScore(100).subscribe((qualifies: boolean) => {
        expect(qualifies).toBeTrue(); // Only 3 scores, so any score qualifies
        done();
      });
    }, 100);
  });

  it('should return cached scores synchronously with getHighScores', () => {
    apiServiceSpy.getHighScores.and.returnValue(of(mockScores));
    
    service.loadHighScores();
    
    setTimeout(() => {
      const scores = service.getHighScores();
      expect(scores).toEqual(mockScores);
    }, 100);
  });

  it('should handle errors when API calls fail', (done) => {
    const error = new Error('API Error');
    apiServiceSpy.getHighScores.and.returnValue(throwError(() => error));
    
    service.loadHighScores();
    
    // Scores should remain empty array on error
    setTimeout(() => {
      service.highScores$.subscribe((scores: HighScore[]) => {
        expect(scores).toEqual([]);
        done();
      });
    }, 100);
  });
});
