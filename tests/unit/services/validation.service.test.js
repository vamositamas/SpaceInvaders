const {
  checkScoreRealistic,
  checkDurationRealistic,
  sanitizePlayerName,
  validateHighScore,
} = require('../../../src/services/validation.service');

describe('ValidationService', () => {
  // ── checkScoreRealistic ───────────────────────────────────────────────────

  describe('checkScoreRealistic', () => {
    test('should accept score of 0 for level 1', () => {
      expect(checkScoreRealistic(0, 1)).toBe(true);
    });

    test('should accept max score for level 1', () => {
      expect(checkScoreRealistic(5000, 1)).toBe(true);
    });

    test('should reject score exceeding max for level 1', () => {
      expect(checkScoreRealistic(5001, 1)).toBe(false);
    });

    test('should accept higher scores for higher levels', () => {
      expect(checkScoreRealistic(10000, 2)).toBe(true);
    });

    test('should reject impossibly high score for level', () => {
      expect(checkScoreRealistic(999999, 1)).toBe(false);
    });

    test('should scale max score with level', () => {
      expect(checkScoreRealistic(15000, 3)).toBe(true);
      expect(checkScoreRealistic(15001, 3)).toBe(false);
    });
  });

  // ── checkDurationRealistic ────────────────────────────────────────────────

  describe('checkDurationRealistic', () => {
    test('should accept sufficient duration for level 1', () => {
      expect(checkDurationRealistic(30, 1)).toBe(true);
    });

    test('should reject duration shorter than minimum for level 1', () => {
      expect(checkDurationRealistic(10, 1)).toBe(false);
    });

    test('should accept minimum exact duration for level 1', () => {
      expect(checkDurationRealistic(15, 1)).toBe(true);
    });

    test('should require proportionally longer duration for higher levels', () => {
      expect(checkDurationRealistic(60, 3)).toBe(true);   // 60 >= 3 × 15 = 45s
      expect(checkDurationRealistic(44, 3)).toBe(false);  // 44 < 45s
    });

    test('should reject duration of 0 for any level', () => {
      expect(checkDurationRealistic(0, 1)).toBe(false);
      expect(checkDurationRealistic(0, 5)).toBe(false);
    });
  });

  // ── sanitizePlayerName ────────────────────────────────────────────────────

  describe('sanitizePlayerName', () => {
    test('should allow alphanumeric names unchanged', () => {
      expect(sanitizePlayerName('Player1')).toBe('Player1');
    });

    test('should allow hyphens, underscores, and spaces', () => {
      expect(sanitizePlayerName('My-Player_1')).toBe('My-Player_1');
    });

    test('should remove XSS attempts', () => {
      const xss = '<script>alert("xss")</script>';
      const sanitized = sanitizePlayerName(xss);
      expect(sanitized).not.toContain('<');
      expect(sanitized).not.toContain('>');
      expect(sanitized).not.toContain('"');
    });

    test('should remove SQL injection attempts', () => {
      const sql = "'; DROP TABLE scores; --";
      const sanitized = sanitizePlayerName(sql);
      expect(sanitized).not.toContain("'");
      expect(sanitized).not.toContain(';');
    });

    test('should trim to max 20 characters', () => {
      const long = 'A'.repeat(30);
      const sanitized = sanitizePlayerName(long);
      expect(sanitized.length).toBeLessThanOrEqual(20);
    });

    test('should return empty string for non-string input', () => {
      expect(sanitizePlayerName(null)).toBe('');
      expect(sanitizePlayerName(undefined)).toBe('');
      expect(sanitizePlayerName(123)).toBe('');
    });

    test('should trim leading and trailing whitespace', () => {
      expect(sanitizePlayerName('  Player  ')).toBe('Player');
    });
  });

  // ── validateHighScore ─────────────────────────────────────────────────────

  describe('validateHighScore', () => {
    test('should accept a valid score and level', () => {
      expect(() => validateHighScore(1000, 2, 60)).not.toThrow();
    });

    test('should accept valid score with no duration', () => {
      expect(() => validateHighScore(1000, 2, undefined)).not.toThrow();
    });

    test('should throw for score exceeding level maximum', () => {
      expect(() => validateHighScore(999999, 1, 60)).toThrow();
    });

    test('should throw for duration shorter than minimum', () => {
      expect(() => validateHighScore(100, 1, 5)).toThrow();
    });

    test('should not throw when duration is null or undefined', () => {
      expect(() => validateHighScore(100, 1, null)).not.toThrow();
      expect(() => validateHighScore(100, 1, undefined)).not.toThrow();
    });

    test('should throw with a descriptive message for unrealistic score', () => {
      expect(() => validateHighScore(999999, 1, 60)).toThrow(/realistic|level|max/i);
    });
  });
});
