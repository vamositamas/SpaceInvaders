import { Injectable } from '@angular/core';

/**
 * Game Loop Service
 * Manages the game loop using requestAnimationFrame for 60 FPS
 * Provides delta time calculation and FPS tracking
 */
@Injectable({
  providedIn: 'root'
})
export class GameLoopService {
  // Private properties
  private animationFrameId: number | null = null;
  private lastFrameTime: number = 0;
  private deltaTime: number = 0;
  private fps: number = 0;
  private isRunning: boolean = false;
  private isPaused: boolean = false;
  private updateCallback: ((deltaTime: number) => void) | null = null;

  // FPS calculation
  private fpsFrames: number[] = [];
  private readonly TARGET_FPS = 60;
  private readonly TARGET_FRAME_TIME = 1000 / 60; // ~16.67ms
  private readonly FPS_SAMPLE_SIZE = 60;
  private readonly MAX_DELTA_TIME = 100; // Cap at 100ms to prevent spiral of death

  /**
   * Start the game loop
   * @param updateCallback Function to call on each frame with delta time
   * @throws Error if callback is not provided
   */
  start(updateCallback: (deltaTime: number) => void): void {
    if (!updateCallback) {
      throw new Error('Update callback is required');
    }

    if (this.isRunning) {
      return; // Already running
    }

    this.updateCallback = updateCallback;
    this.isRunning = true;
    this.isPaused = false;
    this.lastFrameTime = performance.now();
    this.gameLoop(this.lastFrameTime);
  }

  /**
   * Stop the game loop
   * Cancels animation frame and resets all state
   */
  stop(): void {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }

    this.isRunning = false;
    this.isPaused = false;
    this.updateCallback = null;
    this.resetStats();
  }

  /**
   * Pause the game loop
   * Stops calling update callback but keeps loop running
   */
  pause(): void {
    if (!this.isRunning) {
      return;
    }
    this.isPaused = true;
  }

  /**
   * Resume the game loop from pause
   * Resets frame timing to prevent large delta time
   */
  resume(): void {
    if (!this.isRunning || !this.isPaused) {
      return;
    }
    this.isPaused = false;
    this.lastFrameTime = performance.now(); // Reset to prevent large delta
  }

  /**
   * Get delta time since last frame in milliseconds
   * @returns Delta time in milliseconds
   */
  getDeltaTime(): number {
    return this.deltaTime;
  }

  /**
   * Get current frames per second
   * Smoothed over multiple frames for stability
   * @returns Current FPS
   */
  getFPS(): number {
    return this.fps;
  }

  /**
   * Check if game loop is running
   * @returns True if loop is running
   */
  isLoopRunning(): boolean {
    return this.isRunning;
  }

  /**
   * Check if game loop is paused
   * @returns True if loop is paused
   */
  isLoopPaused(): boolean {
    return this.isPaused;
  }

  /**
   * Main game loop
   * Calculates delta time, FPS, and calls update callback
   * @param currentTime Current timestamp from requestAnimationFrame
   */
  private gameLoop(currentTime: number): void {
    if (!this.isRunning) {
      return;
    }

    // Calculate delta time
    this.deltaTime = currentTime - this.lastFrameTime;
    this.lastFrameTime = currentTime;

    // Cap delta time to prevent spiral of death
    if (this.deltaTime > this.MAX_DELTA_TIME) {
      this.deltaTime = this.MAX_DELTA_TIME;
    }

    // Calculate FPS
    this.calculateFPS();

    // Call update callback if not paused
    if (!this.isPaused && this.updateCallback) {
      try {
        this.updateCallback(this.deltaTime);
      } catch (error) {
        console.error('Error in game loop callback:', error);
      }
    }

    // Request next frame
    this.animationFrameId = requestAnimationFrame((time) => this.gameLoop(time));
  }

  /**
   * Calculate FPS using rolling average
   * Smooths FPS over FPS_SAMPLE_SIZE frames
   */
  private calculateFPS(): void {
    if (this.deltaTime > 0) {
      const currentFps = 1000 / this.deltaTime;
      this.fpsFrames.push(currentFps);

      if (this.fpsFrames.length > this.FPS_SAMPLE_SIZE) {
        this.fpsFrames.shift();
      }

      // Average FPS over sample
      const sum = this.fpsFrames.reduce((a, b) => a + b, 0);
      this.fps = Math.round(sum / this.fpsFrames.length);
    }
  }

  /**
   * Reset statistics
   * Clears delta time, FPS, and FPS samples
   */
  private resetStats(): void {
    this.deltaTime = 0;
    this.fps = 0;
    this.fpsFrames = [];
    this.lastFrameTime = 0;
  }
}
