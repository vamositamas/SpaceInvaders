const ConfigService = require('../../../src/services/config.service');
const FileStorageService = require('../../../src/services/file-storage.service');
const path = require('path');

// Mock FileStorageService
jest.mock('../../../src/services/file-storage.service');

describe('ConfigService', () => {
  let configService;
  let mockFileStorage;
  const defaultConfig = {
    canvas: { width: 800, height: 600 },
    player: { speed: 5, fireRate: 500, lives: 3 },
    enemies: { rows: 5, columns: 11, baseSpeed: 1, speedIncrement: 0.1, fireRate: 2000 },
    difficulty: {
      easy: { speedMultiplier: 0.75, fireRateMultiplier: 1.5 },
      normal: { speedMultiplier: 1.0, fireRateMultiplier: 1.0 },
      hard: { speedMultiplier: 1.5, fireRateMultiplier: 0.5 },
    },
  };

  beforeEach(() => {
    // Clear all mocks
    jest.clearAllMocks();
    
    // Create mock instance
    mockFileStorage = {
      readJSON: jest.fn(),
      writeJSON: jest.fn(),
    };
    
    // Mock the constructor
    FileStorageService.mockImplementation(() => mockFileStorage);
    
    // Create new config service instance
    configService = new ConfigService();
  });

  describe('loadConfig', () => {
    test('should return default config on first load when file does not exist', async () => {
      mockFileStorage.readJSON
        .mockRejectedValueOnce(new Error('File not found'))
        .mockResolvedValueOnce(defaultConfig);

      const config = await configService.loadConfig();

      expect(config).toEqual(defaultConfig);
      expect(mockFileStorage.readJSON).toHaveBeenCalledTimes(2);
    });

    test('should return saved config if file exists', async () => {
      const savedConfig = {
        ...defaultConfig,
        player: { ...defaultConfig.player, lives: 5 },
      };
      mockFileStorage.readJSON.mockResolvedValue(savedConfig);

      const config = await configService.loadConfig();

      expect(config).toEqual(savedConfig);
      expect(mockFileStorage.readJSON).toHaveBeenCalledWith(
        expect.stringContaining('game-config.json')
      );
    });

    test('should load default config if saved config is invalid', async () => {
      const invalidConfig = { invalid: 'config' };
      mockFileStorage.readJSON
        .mockResolvedValueOnce(invalidConfig)
        .mockResolvedValueOnce(defaultConfig);

      const config = await configService.loadConfig();

      expect(config).toEqual(defaultConfig);
    });
  });

  describe('getConfig', () => {
    test('should return current configuration', async () => {
      mockFileStorage.readJSON.mockResolvedValue(defaultConfig);
      await configService.loadConfig();

      const config = configService.getConfig();

      expect(config).toEqual(defaultConfig);
    });

    test('should throw error if config not loaded', () => {
      expect(() => configService.getConfig()).toThrow('Configuration not loaded');
    });
  });

  describe('updateConfig', () => {
    beforeEach(async () => {
      mockFileStorage.readJSON.mockResolvedValue(defaultConfig);
      await configService.loadConfig();
    });

    test('should merge partial updates correctly', async () => {
      const updates = {
        player: { lives: 5 },
      };
      mockFileStorage.writeJSON.mockResolvedValue();

      await configService.updateConfig(updates);

      const updatedConfig = configService.getConfig();
      expect(updatedConfig.player.lives).toBe(5);
      expect(updatedConfig.player.speed).toBe(5); // Original value preserved
      expect(mockFileStorage.writeJSON).toHaveBeenCalled();
    });

    test('should merge nested updates correctly', async () => {
      const updates = {
        canvas: { width: 1024 },
        player: { fireRate: 300 },
      };
      mockFileStorage.writeJSON.mockResolvedValue();

      await configService.updateConfig(updates);

      const updatedConfig = configService.getConfig();
      expect(updatedConfig.canvas.width).toBe(1024);
      expect(updatedConfig.canvas.height).toBe(600); // Original value preserved
      expect(updatedConfig.player.fireRate).toBe(300);
      expect(updatedConfig.player.speed).toBe(5); // Original value preserved
    });

    test('should reject invalid config updates', async () => {
      const invalidUpdates = {
        player: { lives: -1 },
      };

      await expect(configService.updateConfig(invalidUpdates)).rejects.toThrow();
      expect(mockFileStorage.writeJSON).not.toHaveBeenCalled();
    });

    test('should throw error if config not loaded', async () => {
      const newConfigService = new ConfigService();
      await expect(newConfigService.updateConfig({ player: { lives: 5 } }))
        .rejects
        .toThrow('Configuration not loaded');
    });
  });

  describe('resetToDefault', () => {
    test('should restore default configuration', async () => {
      mockFileStorage.readJSON.mockResolvedValue(defaultConfig);
      await configService.loadConfig();

      // Update config
      mockFileStorage.writeJSON.mockResolvedValue();
      await configService.updateConfig({ player: { lives: 10 } });

      // Reset to default
      mockFileStorage.readJSON.mockResolvedValue(defaultConfig);
      await configService.resetToDefault();

      const config = configService.getConfig();
      expect(config).toEqual(defaultConfig);
      expect(config.player.lives).toBe(3);
    });

    test('should save default config to file', async () => {
      mockFileStorage.readJSON.mockResolvedValue(defaultConfig);
      await configService.loadConfig();
      mockFileStorage.writeJSON.mockResolvedValue();

      await configService.resetToDefault();

      expect(mockFileStorage.writeJSON).toHaveBeenCalledWith(
        expect.stringContaining('game-config.json'),
        defaultConfig
      );
    });
  });

  describe('validation', () => {
    beforeEach(async () => {
      mockFileStorage.readJSON.mockResolvedValue(defaultConfig);
      await configService.loadConfig();
    });

    test('should reject invalid canvas width', async () => {
      await expect(
        configService.updateConfig({ canvas: { width: -1 } })
      ).rejects.toThrow('Canvas width must be a positive number');
    });

    test('should reject invalid player speed', async () => {
      await expect(
        configService.updateConfig({ player: { speed: 0 } })
      ).rejects.toThrow('Player speed must be a positive number');
    });

    test('should reject non-integer player lives', async () => {
      await expect(
        configService.updateConfig({ player: { lives: 3.5 } })
      ).rejects.toThrow('Player lives must be a positive integer');
    });

    test('should reject invalid enemies configuration', async () => {
      await expect(
        configService.updateConfig({ enemies: { rows: 0 } })
      ).rejects.toThrow('Enemies rows must be a positive integer');
    });

    test('should reject invalid difficulty multiplier', async () => {
      await expect(
        configService.updateConfig({ difficulty: { easy: { speedMultiplier: -1 } } })
      ).rejects.toThrow('speedMultiplier must be a positive number');
    });
  });
});
