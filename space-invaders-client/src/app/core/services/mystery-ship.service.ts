import { Injectable } from '@angular/core';

export interface MysteryShip {
  x: number;
  y: number;
  width: number;
  height: number;
  isActive: boolean;
  pointValue: number;
}

@Injectable({ providedIn: 'root' })
export class MysteryShipService {
  static readonly SHIP_WIDTH = 50;
  static readonly SHIP_HEIGHT = 20;
  static readonly SHIP_Y = 30;
  static readonly SPEED_PX_PER_SEC = 150;
  static readonly MIN_SPAWN_INTERVAL_MS = 20000;
  static readonly MAX_SPAWN_INTERVAL_MS = 40000;
  static readonly POINT_VALUES = [50, 100, 150, 200, 250, 300];

  private ship: MysteryShip = {
    x: 0,
    y: MysteryShipService.SHIP_Y,
    width: MysteryShipService.SHIP_WIDTH,
    height: MysteryShipService.SHIP_HEIGHT,
    isActive: false,
    pointValue: 0,
  };

  private nextSpawnTime = -1;

  getShip(): MysteryShip {
    return this.ship;
  }

  trySpawn(currentTime: number, canvasWidth: number): void {
    if (this.ship.isActive) return;

    if (this.nextSpawnTime < 0) {
      this.scheduleNextSpawn(currentTime);
      return;
    }

    if (currentTime >= this.nextSpawnTime) {
      const values = MysteryShipService.POINT_VALUES;
      this.ship.pointValue = values[Math.floor(Math.random() * values.length)];
      this.ship.x = canvasWidth;
      this.ship.y = MysteryShipService.SHIP_Y;
      this.ship.isActive = true;
    }
  }

  update(deltaTime: number, currentTime: number, canvasWidth: number): void {
    this.trySpawn(currentTime, canvasWidth);

    if (!this.ship.isActive) return;

    this.ship.x -= MysteryShipService.SPEED_PX_PER_SEC * (deltaTime / 1000);
    if (this.ship.x + this.ship.width < 0) {
      this.ship.isActive = false;
      this.scheduleNextSpawn(currentTime);
    }
  }

  hit(): number {
    if (!this.ship.isActive) return 0;
    const pts = this.ship.pointValue;
    this.ship.isActive = false;
    this.nextSpawnTime = -1;
    return pts;
  }

  reset(): void {
    this.ship.isActive = false;
    this.nextSpawnTime = -1;
  }

  private scheduleNextSpawn(currentTime: number): void {
    const interval = MysteryShipService.MIN_SPAWN_INTERVAL_MS
      + Math.random() * (MysteryShipService.MAX_SPAWN_INTERVAL_MS - MysteryShipService.MIN_SPAWN_INTERVAL_MS);
    this.nextSpawnTime = currentTime + interval;
  }
}
