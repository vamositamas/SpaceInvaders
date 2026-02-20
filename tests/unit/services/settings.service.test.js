const SettingsService = require('../../../src/services/settings.service');
const FileStorageService = require('../../../src/services/file-storage.service');

jest.mock('../../../src/services/file-storage.service');

const DEFAULT_SETTINGS = {
  soundEnabled: true,
  musicEnabled: true,
  volume: 75,
  difficulty: 'NORMAL',
  controlScheme: 'KEYBOARD'
};

describe('SettingsService', () => {
  let settingsService;
  let mockFileStorage;

  beforeEach(() => {
    jest.clearAllMocks();

    mockFileStorage = {
      readJSON: jest.fn(),
      writeJSON: jest.fn().mockResolvedValue(undefined),
    };

    FileStorageService.mockImplementation(() => mockFileStorage);

    settingsService = new SettingsService();
  });

  // ── loadSettings ────────────────────────────────────────────────────────

  describe('loadSettings', () => {
    test('should return default settings when file does not exist', async () => {
      mockFileStorage.readJSON
        .mockRejectedValueOnce(new Error('File not found'))
        .mockResolvedValueOnce(DEFAULT_SETTINGS);

      const settings = await settingsService.loadSettings();

      expect(settings).toEqual(DEFAULT_SETTINGS);
    });

    test('should return saved settings when file exists', async () => {
      const saved = { ...DEFAULT_SETTINGS, volume: 50, difficulty: 'HARD' };
      mockFileStorage.readJSON.mockResolvedValue(saved);

      const settings = await settingsService.loadSettings();

      expect(settings).toEqual(saved);
    });

    test('should return defaults when stored settings are invalid', async () => {
      mockFileStorage.readJSON
        .mockResolvedValueOnce({ invalid: 'data' })  // bad settings
        .mockResolvedValueOnce(DEFAULT_SETTINGS);    // fallback defaults

      const settings = await settingsService.loadSettings();

      expect(settings).toEqual(DEFAULT_SETTINGS);
    });

    test('should cache loaded settings', async () => {
      mockFileStorage.readJSON.mockResolvedValue(DEFAULT_SETTINGS);

      await settingsService.loadSettings();
      settingsService.getSettings(); // should not throw

      expect(mockFileStorage.readJSON).toHaveBeenCalledTimes(1);
    });
  });

  // ── getSettings ─────────────────────────────────────────────────────────

  describe('getSettings', () => {
    test('should return current settings after load', async () => {
      mockFileStorage.readJSON.mockResolvedValue(DEFAULT_SETTINGS);
      await settingsService.loadSettings();

      const settings = settingsService.getSettings();
      expect(settings).toEqual(DEFAULT_SETTINGS);
    });

    test('should throw if settings not loaded', () => {
      expect(() => settingsService.getSettings()).toThrow('Settings not loaded');
    });

    test('should return a copy (not a reference)', async () => {
      mockFileStorage.readJSON.mockResolvedValue(DEFAULT_SETTINGS);
      await settingsService.loadSettings();

      const s1 = settingsService.getSettings();
      s1.volume = 0;
      const s2 = settingsService.getSettings();

      expect(s2.volume).toBe(DEFAULT_SETTINGS.volume);
    });
  });

  // ── updateSettings ───────────────────────────────────────────────────────

  describe('updateSettings', () => {
    beforeEach(async () => {
      mockFileStorage.readJSON.mockResolvedValue(DEFAULT_SETTINGS);
      await settingsService.loadSettings();
    });

    test('should merge partial updates into current settings', async () => {
      const updated = await settingsService.updateSettings({ volume: 30 });

      expect(updated.volume).toBe(30);
      expect(updated.difficulty).toBe(DEFAULT_SETTINGS.difficulty);
    });

    test('should persist updated settings to file', async () => {
      await settingsService.updateSettings({ soundEnabled: false });

      expect(mockFileStorage.writeJSON).toHaveBeenCalledWith(
        expect.stringContaining('settings.json'),
        expect.objectContaining({ soundEnabled: false })
      );
    });

    test('should reject invalid difficulty value', async () => {
      await expect(
        settingsService.updateSettings({ difficulty: 'INSANE' })
      ).rejects.toThrow();
    });

    test('should reject volume out of range', async () => {
      await expect(
        settingsService.updateSettings({ volume: 150 })
      ).rejects.toThrow();
    });

    test('should reject negative volume', async () => {
      await expect(
        settingsService.updateSettings({ volume: -1 })
      ).rejects.toThrow();
    });

    test('should reject invalid controlScheme', async () => {
      await expect(
        settingsService.updateSettings({ controlScheme: 'GAMEPAD' })
      ).rejects.toThrow();
    });
  });

  // ── resetToDefault ───────────────────────────────────────────────────────

  describe('resetToDefault', () => {
    test('should restore default settings', async () => {
      mockFileStorage.readJSON
        .mockResolvedValueOnce({ ...DEFAULT_SETTINGS, volume: 10 }) // initial
        .mockResolvedValueOnce(DEFAULT_SETTINGS);                    // defaults file
      await settingsService.loadSettings();

      const reset = await settingsService.resetToDefault();

      expect(reset).toEqual(DEFAULT_SETTINGS);
    });

    test('should persist defaults to file', async () => {
      mockFileStorage.readJSON
        .mockResolvedValueOnce(DEFAULT_SETTINGS)  // initial
        .mockResolvedValueOnce(DEFAULT_SETTINGS); // defaults file
      await settingsService.loadSettings();

      await settingsService.resetToDefault();

      expect(mockFileStorage.writeJSON).toHaveBeenCalledWith(
        expect.stringContaining('settings.json'),
        DEFAULT_SETTINGS
      );
    });
  });
});
