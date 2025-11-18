import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { ApiService } from './api.service';
import { GameConfig, HighScore } from '../models';

describe('ApiService', () => {
  let service: ApiService;
  let httpMock: HttpTestingController;
  const apiUrl = '/api';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        ApiService,
        provideZonelessChangeDetection()
      ]
    });
    service = TestBed.inject(ApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // Verify no outstanding HTTP requests
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('Config API', () => {
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

    it('should get config', (done) => {
      service.getConfig().subscribe((config) => {
        expect(config).toEqual(mockConfig);
        done();
      });

      const req = httpMock.expectOne(`${apiUrl}/config`);
      expect(req.request.method).toBe('GET');
      req.flush(mockConfig);
    });

    it('should update config', (done) => {
      const updateData: Partial<GameConfig> = {
        player: { speed: 10, fireRate: 300, lives: 5 }
      };

      service.updateConfig(updateData).subscribe((config) => {
        expect(config).toEqual(mockConfig);
        done();
      });

      const req = httpMock.expectOne(`${apiUrl}/config`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(updateData);
      req.flush(mockConfig);
    });

    it('should update config property', (done) => {
      const property = 'player.speed';
      const value = 10;

      service.updateConfigProperty(property, value).subscribe((config) => {
        expect(config).toEqual(mockConfig);
        done();
      });

      const req = httpMock.expectOne(`${apiUrl}/config/${property}`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ value });
      req.flush(mockConfig);
    });

    it('should reset config', (done) => {
      service.resetConfig().subscribe((config) => {
        expect(config).toEqual(mockConfig);
        done();
      });

      const req = httpMock.expectOne(`${apiUrl}/config/reset`);
      expect(req.request.method).toBe('POST');
      req.flush(mockConfig);
    });

    it('should handle config error', (done) => {
      service.getConfig().subscribe({
        next: () => fail('should have failed'),
        error: (error: any) => {
          expect(error.status).toBe(500);
          done();
        }
      });

      // Respond to all retry attempts (initial + 2 retries = 3 total)
      for (let i = 0; i < 3; i++) {
        const req = httpMock.expectOne(`${apiUrl}/config`);
        req.flush('Server error', { status: 500, statusText: 'Server Error' });
      }
    });
  });

  describe('High Score API', () => {
    const mockScore: HighScore = {
      id: '1',
      playerName: 'TestPlayer',
      score: 1000,
      level: 5,
      date: new Date().toISOString(),
      duration: 300
    };

    const mockScores: HighScore[] = [
      mockScore,
      { id: '2', playerName: 'Player2', score: 800, level: 3 }
    ];

    it('should get high scores without limit', (done) => {
      service.getHighScores().subscribe((scores) => {
        expect(scores).toEqual(mockScores);
        done();
      });

      const req = httpMock.expectOne(`${apiUrl}/highscores`);
      expect(req.request.method).toBe('GET');
      req.flush(mockScores);
    });

    it('should get high scores with limit', (done) => {
      const limit = 10;
      service.getHighScores(limit).subscribe((scores) => {
        expect(scores).toEqual(mockScores);
        done();
      });

      const req = httpMock.expectOne(`${apiUrl}/highscores?limit=${limit}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockScores);
    });

    it('should add high score', (done) => {
      const newScore: HighScore = {
        playerName: 'NewPlayer',
        score: 1500,
        level: 7
      };

      service.addHighScore(newScore).subscribe((score) => {
        expect(score).toEqual(mockScore);
        done();
      });

      const req = httpMock.expectOne(`${apiUrl}/highscores`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(newScore);
      req.flush(mockScore);
    });

    it('should get high score by id', (done) => {
      const id = '1';
      service.getHighScoreById(id).subscribe((score) => {
        expect(score).toEqual(mockScore);
        done();
      });

      const req = httpMock.expectOne(`${apiUrl}/highscores/${id}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockScore);
    });

    it('should delete high score', (done) => {
      const id = '1';
      service.deleteHighScore(id).subscribe(() => {
        done();
      });

      const req = httpMock.expectOne(`${apiUrl}/highscores/${id}`);
      expect(req.request.method).toBe('DELETE');
      req.flush(null);
    });

    it('should handle high score error', (done) => {
      service.getHighScores().subscribe({
        next: () => fail('should have failed'),
        error: (error: any) => {
          expect(error.status).toBe(404);
          done();
        }
      });

      // Respond to all retry attempts (initial + 2 retries = 3 total)
      for (let i = 0; i < 3; i++) {
        const req = httpMock.expectOne(`${apiUrl}/highscores`);
        req.flush('Not found', { status: 404, statusText: 'Not Found' });
      }
    });
  });

  describe('Error Handling and Retry', () => {
    it('should retry failed requests', (done) => {
      let attemptCount = 0;

      service.getConfig().subscribe({
        next: (config: any) => {
          expect(attemptCount).toBe(3); // Initial + 2 retries
          done();
        },
        error: () => fail('should have succeeded after retry')
      });

      // First attempt - fail
      const req1 = httpMock.expectOne(`${apiUrl}/config`);
      attemptCount++;
      req1.flush('Error', { status: 500, statusText: 'Server Error' });

      // First retry - fail
      const req2 = httpMock.expectOne(`${apiUrl}/config`);
      attemptCount++;
      req2.flush('Error', { status: 500, statusText: 'Server Error' });

      // Second retry - succeed
      const req3 = httpMock.expectOne(`${apiUrl}/config`);
      attemptCount++;
      req3.flush({
        canvas: { width: 800, height: 600 },
        player: { speed: 5, fireRate: 500, lives: 3 },
        enemies: { rows: 5, columns: 11, baseSpeed: 1, speedIncrement: 0.1, fireRate: 2000 },
        difficulty: {
          easy: { speedMultiplier: 0.75, fireRateMultiplier: 1.5 },
          normal: { speedMultiplier: 1.0, fireRateMultiplier: 1.0 },
          hard: { speedMultiplier: 1.5, fireRateMultiplier: 0.5 }
        }
      });
    });

    it('should fail after max retries', (done) => {
      let attemptCount = 0;

      service.getConfig().subscribe({
        next: () => fail('should have failed'),
        error: (error: any) => {
          expect(attemptCount).toBe(3); // Initial + 2 retries
          expect(error.status).toBe(500);
          done();
        }
      });

      // All attempts fail
      for (let i = 0; i < 3; i++) {
        const req = httpMock.expectOne(`${apiUrl}/config`);
        attemptCount++;
        req.flush('Error', { status: 500, statusText: 'Server Error' });
      }
    });
  });
});
