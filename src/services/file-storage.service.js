const fs = require('fs/promises');
const path = require('path');

/**
 * FileStorageService - Handles file-based JSON storage operations
 */
class FileStorageService {
  /**
   * Reads and parses a JSON file
   * @param {string} filepath - Path to the JSON file
   * @returns {Promise<any>} Parsed JSON data
   * @throws {Error} If file not found or JSON is invalid
   */
  async readJSON(filepath) {
    try {
      const data = await fs.readFile(filepath, 'utf-8');
      try {
        return JSON.parse(data);
      } catch (parseError) {
        throw new Error(`Invalid JSON in file: ${filepath}`);
      }
    } catch (error) {
      if (error.code === 'ENOENT') {
        throw new Error(`File not found: ${filepath}`);
      }
      // Re-throw if it's already our custom error
      if (error.message.startsWith('Invalid JSON')) {
        throw error;
      }
      throw new Error(`Failed to read file: ${filepath}`);
    }
  }

  /**
   * Writes data to a JSON file with pretty printing
   * @param {string} filepath - Path to the JSON file
   * @param {any} data - Data to write
   * @returns {Promise<void>}
   * @throws {Error} If write operation fails
   */
  async writeJSON(filepath, data) {
    const jsonString = JSON.stringify(data, null, 2);
    try {
      await fs.writeFile(filepath, jsonString, 'utf-8');
    } catch (error) {
      // If directory doesn't exist, create it and retry
      if (error.code === 'ENOENT') {
        const directory = path.dirname(filepath);
        await this.ensureDirectory(directory);
        await fs.writeFile(filepath, jsonString, 'utf-8');
      } else {
        throw new Error(`Failed to write file: ${filepath}`);
      }
    }
  }

  /**
   * Ensures a directory exists, creating it if necessary
   * @param {string} dirPath - Path to the directory
   * @returns {Promise<void>}
   * @throws {Error} If directory creation fails
   */
  async ensureDirectory(dirPath) {
    try {
      await fs.mkdir(dirPath, { recursive: true });
    } catch (error) {
      // EEXIST means directory already exists, which is fine
      if (error.code === 'EEXIST') {
        return;
      }
      throw new Error(`Failed to create directory: ${dirPath}`);
    }
  }

  /**
   * Creates a backup copy of a file with .backup extension
   * @param {string} filepath - Path to the file to backup
   * @returns {Promise<void>}
   * @throws {Error} If source file doesn't exist or backup fails
   */
  async backupFile(filepath) {
    try {
      // Check if source file exists
      await fs.access(filepath);
    } catch (error) {
      if (error.code === 'ENOENT') {
        throw new Error(`Source file not found: ${filepath}`);
      }
      throw error;
    }

    const backupPath = `${filepath}.backup`;
    try {
      await fs.copyFile(filepath, backupPath);
    } catch (error) {
      throw new Error(`Failed to backup file: ${filepath}`);
    }
  }
}

module.exports = FileStorageService;
