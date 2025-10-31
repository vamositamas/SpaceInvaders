const fs = require('fs/promises');
const path = require('path');
const FileStorageService = require('../../../src/services/file-storage.service');

// Mock fs/promises module
jest.mock('fs/promises');

describe('FileStorageService', () => {
  let service;

  beforeEach(() => {
    service = new FileStorageService();
    jest.clearAllMocks();
  });

  describe('readJSON', () => {
    test('should return parsed data for valid JSON file', async () => {
      const testData = { name: 'test', score: 100 };
      const jsonString = JSON.stringify(testData);
      fs.readFile.mockResolvedValue(jsonString);

      const result = await service.readJSON('/test/data.json');

      expect(fs.readFile).toHaveBeenCalledWith('/test/data.json', 'utf-8');
      expect(result).toEqual(testData);
    });

    test('should throw error for non-existent file', async () => {
      const error = new Error('ENOENT: no such file or directory');
      error.code = 'ENOENT';
      fs.readFile.mockRejectedValue(error);

      await expect(service.readJSON('/test/missing.json'))
        .rejects
        .toThrow('File not found: /test/missing.json');
    });

    test('should throw error for invalid JSON', async () => {
      fs.readFile.mockResolvedValue('{ invalid json }');

      await expect(service.readJSON('/test/invalid.json'))
        .rejects
        .toThrow('Invalid JSON in file: /test/invalid.json');
    });

    test('should throw generic error for other read failures', async () => {
      const error = new Error('Unknown error');
      error.code = 'UNKNOWN';
      fs.readFile.mockRejectedValue(error);

      await expect(service.readJSON('/test/data.json'))
        .rejects
        .toThrow('Failed to read file: /test/data.json');
    });
  });

  describe('writeJSON', () => {
    test('should create file with formatted JSON', async () => {
      const testData = { name: 'test', score: 100 };
      fs.writeFile.mockResolvedValue();

      await service.writeJSON('/test/data.json', testData);

      const expectedJSON = JSON.stringify(testData, null, 2);
      expect(fs.writeFile).toHaveBeenCalledWith('/test/data.json', expectedJSON, 'utf-8');
    });

    test('should create parent directories if needed', async () => {
      const testData = { test: 'data' };
      fs.writeFile.mockRejectedValueOnce({ code: 'ENOENT' })
        .mockResolvedValueOnce();
      fs.mkdir.mockResolvedValue();

      await service.writeJSON('/test/nested/dir/data.json', testData);

      expect(fs.mkdir).toHaveBeenCalledWith('/test/nested/dir', { recursive: true });
      expect(fs.writeFile).toHaveBeenCalledTimes(2);
    });

    test('should throw error for write failures', async () => {
      const error = new Error('Permission denied');
      error.code = 'EACCES';
      fs.writeFile.mockRejectedValue(error);

      await expect(service.writeJSON('/test/data.json', {}))
        .rejects
        .toThrow('Failed to write file: /test/data.json');
    });
  });

  describe('ensureDirectory', () => {
    test('should create nested directories', async () => {
      fs.mkdir.mockResolvedValue();

      await service.ensureDirectory('/test/nested/dir');

      expect(fs.mkdir).toHaveBeenCalledWith('/test/nested/dir', { recursive: true });
    });

    test('should not throw error if directory already exists', async () => {
      const error = new Error('Directory exists');
      error.code = 'EEXIST';
      fs.mkdir.mockRejectedValue(error);

      await expect(service.ensureDirectory('/test/dir')).resolves.not.toThrow();
    });

    test('should throw error for other failures', async () => {
      const error = new Error('Permission denied');
      error.code = 'EACCES';
      fs.mkdir.mockRejectedValue(error);

      await expect(service.ensureDirectory('/test/dir'))
        .rejects
        .toThrow('Failed to create directory: /test/dir');
    });
  });

  describe('backupFile', () => {
    test('should create copy with .backup extension', async () => {
      fs.copyFile.mockResolvedValue();
      fs.access.mockResolvedValue(); // File exists

      await service.backupFile('/test/data.json');

      expect(fs.access).toHaveBeenCalledWith('/test/data.json');
      expect(fs.copyFile).toHaveBeenCalledWith('/test/data.json', '/test/data.json.backup');
    });

    test('should throw error if source file does not exist', async () => {
      const error = new Error('ENOENT');
      error.code = 'ENOENT';
      fs.access.mockRejectedValue(error);

      await expect(service.backupFile('/test/missing.json'))
        .rejects
        .toThrow('Source file not found: /test/missing.json');
    });

    test('should throw error for copy failures', async () => {
      fs.access.mockResolvedValue();
      const error = new Error('Permission denied');
      error.code = 'EACCES';
      fs.copyFile.mockRejectedValue(error);

      await expect(service.backupFile('/test/data.json'))
        .rejects
        .toThrow('Failed to backup file: /test/data.json');
    });

    test('should re-throw error for other access failures', async () => {
      const error = new Error('Permission denied');
      error.code = 'EACCES';
      fs.access.mockRejectedValue(error);

      await expect(service.backupFile('/test/data.json'))
        .rejects
        .toThrow('Permission denied');
    });
  });
});
