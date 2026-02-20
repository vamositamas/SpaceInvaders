import { Injectable } from '@angular/core';
import { InputHandlerService } from './input-handler.service';
import { GameConfig } from '../models';

/**
 * Represents the player entity state
 */
export interface PlayerState {
  x: number;
  y: number;
  width: number;
  height: number;
  speedPxPerSec: number;
  isActive: boolean;
  lastFireTime: number;
  isInvincible: boolean;
  invincibilityEndTime: number;
}

/**
 * PlayerService - Manages player state, movement, and fire rate
 *
 * Handles:
 * - Player initialisation at canvas start position
 * - Frame-independent keyboard and mouse movement
 * - Canvas boundary clamping
 * - Fire-rate cooldown tracking
 * - Invincibility frames after taking damage
 */
@Injectable({
  providedIn: 'root'
})
export class PlayerService {
  static readonly PLAYER_WIDTH = 40;
  static readonly PLAYER_HEIGHT = 20;
  static readonly INVINCIBILITY_DURATION_MS = 2000;

  private player: PlayerState | null = null;

  /**
   * Initialise a new player at the canonical starting position.
   * @param canvasWidth  Canvas pixel width
   * @param canvasHeight Canvas pixel height
   * @param config       Active game configuration
   */
  initPlayer(canvasWidth: number, canvasHeight: number, config: GameConfig): void {
    this.player = {
      x: (canvasWidth - PlayerService.PLAYER_WIDTH) / 2,
      y: canvasHeight - 60,
      width: PlayerService.PLAYER_WIDTH,
      height: PlayerService.PLAYER_HEIGHT,
      speedPxPerSec: config.player.speed * 60,
      isActive: true,
      lastFireTime: 0,
      isInvincible: false,
      invincibilityEndTime: 0
    };
  }

  /**
   * Update player position and invincibility state for the current frame.
   * @param deltaTime    Time since last frame in milliseconds
   * @param inputHandler Current input state
   * @param canvasWidth  Canvas pixel width for boundary clamping
   * @param currentTime  performance.now() timestamp for invincibility tracking
   */
  update(
    deltaTime: number,
    inputHandler: InputHandlerService,
    canvasWidth: number,
    currentTime: number
  ): void {
    if (!this.player || !this.player.isActive) return;

    const moveAmount = this.player.speedPxPerSec * (deltaTime / 1000);

    // Mouse takes precedence when the mouse has actually moved onto the canvas (x > 0)
    const mousePos = inputHandler.getMousePosition();
    if (mousePos.x > 0) {
      this.player.x = mousePos.x - this.player.width / 2;
    } else {
      // Keyboard movement
      if (inputHandler.isKeyPressed('arrowleft') || inputHandler.isKeyPressed('a')) {
        this.player.x -= moveAmount;
      }
      if (inputHandler.isKeyPressed('arrowright') || inputHandler.isKeyPressed('d')) {
        this.player.x += moveAmount;
      }
    }

    // Clamp to canvas boundaries
    this.player.x = Math.max(0, Math.min(canvasWidth - this.player.width, this.player.x));

    // Expire invincibility
    if (this.player.isInvincible && currentTime >= this.player.invincibilityEndTime) {
      this.player.isInvincible = false;
    }
  }

  /** Returns true if the player can fire given the current time and fire-rate config. */
  canFire(currentTime: number, fireRateMs: number): boolean {
    if (!this.player) return false;
    return currentTime - this.player.lastFireTime >= fireRateMs;
  }

  /** Record that the player fired at `currentTime`. */
  recordFired(currentTime: number): void {
    if (this.player) {
      this.player.lastFireTime = currentTime;
    }
  }

  /**
   * Apply a hit to the player.
   * @returns true if damage was applied; false if the player was invincible.
   */
  takeDamage(currentTime: number): boolean {
    if (!this.player || this.player.isInvincible) return false;
    this.player.isInvincible = true;
    this.player.invincibilityEndTime = currentTime + PlayerService.INVINCIBILITY_DURATION_MS;
    return true;
  }

  /** Returns the current player state, or null if not initialised. */
  getPlayer(): PlayerState | null {
    return this.player;
  }

  /** Remove the player (call on game reset). */
  reset(): void {
    this.player = null;
  }
}
