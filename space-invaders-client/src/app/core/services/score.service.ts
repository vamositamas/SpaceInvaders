import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ScoreService {
  static readonly COMBO_WINDOW_MS = 1000;
  static readonly COMBO_THRESHOLD_1_5X = 3;
  static readonly COMBO_THRESHOLD_2X = 5;

  private score = 0;
  private comboCount = 0;
  private lastHitTime = 0;

  addPoints(points: number, currentTime: number): void {
    const withinWindow = this.comboCount > 0
      && (currentTime - this.lastHitTime) <= ScoreService.COMBO_WINDOW_MS;

    if (withinWindow) {
      this.comboCount++;
    } else {
      this.comboCount = 1;
    }

    const multiplier = this.comboCount >= ScoreService.COMBO_THRESHOLD_2X
      ? 2
      : this.comboCount >= ScoreService.COMBO_THRESHOLD_1_5X
        ? 1.5
        : 1;

    this.score += Math.floor(points * multiplier);
    this.lastHitTime = currentTime;
  }

  getScore(): number {
    return this.score;
  }

  getComboCount(): number {
    return this.comboCount;
  }

  reset(): void {
    this.score = 0;
    this.comboCount = 0;
    this.lastHitTime = 0;
  }
}
