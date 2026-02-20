import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { ScoreService } from './score.service';

describe('ScoreService', () => {
  let service: ScoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ScoreService, provideZonelessChangeDetection()]
    });
    service = TestBed.inject(ScoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('initial state', () => {
    it('should start with score of 0', () => {
      expect(service.getScore()).toBe(0);
    });

    it('should start with combo count of 0', () => {
      expect(service.getComboCount()).toBe(0);
    });
  });

  describe('addPoints', () => {
    it('should add base points without combo', () => {
      service.addPoints(10, 1000);
      expect(service.getScore()).toBe(10);
    });

    it('should apply 1.5x multiplier with 3 combo hits', () => {
      // Build up combo: hit 1 = base, hit 2 = base, hit 3 = 1.5x, ...
      service.addPoints(10, 1000);
      service.addPoints(10, 1200);
      service.addPoints(10, 1400); // 3rd hit → 1.5x
      // Scores: 10 + 10 + 15 = 35
      expect(service.getScore()).toBe(35);
    });

    it('should apply 2x multiplier with 5 combo hits', () => {
      service.addPoints(10, 1000);
      service.addPoints(10, 1200);
      service.addPoints(10, 1400);
      service.addPoints(10, 1600);
      service.addPoints(10, 1800); // 5th hit → 2x
      // Scores: 10 + 10 + 15 + 15 + 20 = 70
      expect(service.getScore()).toBe(70);
    });

    it('should reset combo when gap exceeds 1000ms', () => {
      service.addPoints(10, 1000);
      service.addPoints(10, 1200);
      // Gap > 1000ms resets combo
      service.addPoints(10, 3000); // 3rd hit but combo reset → base
      expect(service.getScore()).toBe(30);
      expect(service.getComboCount()).toBe(1);
    });

    it('should increment combo count on consecutive hits', () => {
      service.addPoints(10, 1000);
      service.addPoints(10, 1500);
      expect(service.getComboCount()).toBe(2);
    });

    it('should round points down to nearest integer', () => {
      service.addPoints(10, 1000);
      service.addPoints(10, 1200);
      service.addPoints(10, 1400); // 1.5x = 15 exactly
      expect(service.getScore()).toBe(35);
    });
  });

  describe('reset', () => {
    it('should reset score to 0', () => {
      service.addPoints(100, 1000);
      service.reset();
      expect(service.getScore()).toBe(0);
    });

    it('should reset combo count to 0', () => {
      service.addPoints(10, 1000);
      service.addPoints(10, 1200);
      service.reset();
      expect(service.getComboCount()).toBe(0);
    });
  });
});
