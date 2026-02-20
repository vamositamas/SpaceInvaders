import { Injectable } from '@angular/core';

export interface ShieldEntity {
  x: number;
  y: number;
  width: number;
  height: number;
  isActive: boolean;
  health: number;
  maxHealth: number;
}

@Injectable({ providedIn: 'root' })
export class ShieldService {
  static readonly SHIELD_WIDTH = 60;
  static readonly SHIELD_HEIGHT = 40;
  static readonly SHIELD_MAX_HEALTH = 100;
  static readonly DAMAGE_PER_HIT = 10;
  static readonly NUM_SHIELDS = 4;

  private shields: ShieldEntity[] = [];

  initShields(canvasWidth: number, canvasHeight: number): void {
    const shieldY = canvasHeight - 150;
    const gap = canvasWidth / (ShieldService.NUM_SHIELDS + 1);
    this.shields = Array.from({ length: ShieldService.NUM_SHIELDS }, (_, i) => ({
      x: gap * (i + 1) - ShieldService.SHIELD_WIDTH / 2,
      y: shieldY,
      width: ShieldService.SHIELD_WIDTH,
      height: ShieldService.SHIELD_HEIGHT,
      isActive: true,
      health: ShieldService.SHIELD_MAX_HEALTH,
      maxHealth: ShieldService.SHIELD_MAX_HEALTH,
    }));
  }

  damageShield(shield: ShieldEntity): void {
    if (!shield.isActive) return;
    shield.health = Math.max(0, shield.health - ShieldService.DAMAGE_PER_HIT);
    if (shield.health === 0) {
      shield.isActive = false;
    }
  }

  getShields(): ShieldEntity[] {
    return this.shields;
  }

  getActiveShields(): ShieldEntity[] {
    return this.shields.filter(s => s.isActive);
  }

  reset(): void {
    this.shields = [];
  }
}
