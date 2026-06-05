import { Injectable, inject } from '@angular/core';
import { SettingsService } from './settings.service';

/**
 * AudioService - Programmatically synthesises 8-bit retro sound effects
 * using the browser's Web Audio API. This avoids standard HTML5 audio
 * latency, works completely offline, and does not require loaded assets.
 */
@Injectable({
  providedIn: 'root'
})
export class AudioService {
  private readonly settingsService = inject(SettingsService);
  private ctx: AudioContext | null = null;

  /**
   * Safe lazy initialization of the AudioContext to respect browser
   * autoplay and user interaction policies.
   */
  private initCtx(): void {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  /**
   * Helper that builds the base volume output node.
   * Clamps master volume to setting specifications. Returns null if sound is disabled.
   */
  private getVolumeNode(): GainNode | null {
    this.initCtx();
    if (!this.ctx) return null;

    const settings = this.settingsService.getCurrentSettings();
    if (!settings.soundEnabled) return null;

    const volume = settings.volume / 100;
    const gainNode = this.ctx.createGain();
    gainNode.gain.setValueAtTime(volume, this.ctx.currentTime);
    gainNode.connect(this.ctx.destination);
    return gainNode;
  }

  /** Play laser pew-pew sound effect */
  playShoot(): void {
    const gain = this.getVolumeNode();
    if (!gain || !this.ctx) return;

    const osc = this.ctx.createOscillator();
    osc.type = 'square';
    osc.frequency.setValueAtTime(440, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(80, this.ctx.currentTime + 0.15);

    const oscGain = this.ctx.createGain();
    oscGain.gain.setValueAtTime(0.2, this.ctx.currentTime);
    oscGain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.15);

    osc.connect(oscGain);
    oscGain.connect(gain);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.15);
  }

  /** Play deep noise-based explosion sound effect */
  playExplosion(): void {
    const gain = this.getVolumeNode();
    if (!gain || !this.ctx) return;

    const bufferSize = this.ctx.sampleRate * 0.4;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(800, this.ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(10, this.ctx.currentTime + 0.4);

    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(0.4, this.ctx.currentTime);
    noiseGain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.4);

    noise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(gain);

    noise.start();
    noise.stop(this.ctx.currentTime + 0.4);
  }

  /** Play low metal impact blip */
  playHit(): void {
    const gain = this.getVolumeNode();
    if (!gain || !this.ctx) return;

    const osc = this.ctx.createOscillator();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(150, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(40, this.ctx.currentTime + 0.1);

    const oscGain = this.ctx.createGain();
    oscGain.gain.setValueAtTime(0.3, this.ctx.currentTime);
    oscGain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.1);

    osc.connect(oscGain);
    oscGain.connect(gain);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.1);
  }

  /** Play upward arpeggio on level clearance */
  playLevelUp(): void {
    const gain = this.getVolumeNode();
    if (!gain || !this.ctx) return;

    const now = this.ctx.currentTime;
    const notes = [261.63, 329.63, 392.00, 523.25]; // C4, E4, G4, C5
    notes.forEach((freq, index) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + index * 0.1);

      const oscGain = this.ctx.createGain();
      oscGain.gain.setValueAtTime(0.15, now + index * 0.1);
      oscGain.gain.exponentialRampToValueAtTime(0.01, now + index * 0.1 + 0.25);

      osc.connect(oscGain);
      oscGain.connect(gain!);

      osc.start(now + index * 0.1);
      osc.stop(now + index * 0.1 + 0.25);
    });
  }

  /** Play descending saw-based sad tone */
  playGameOver(): void {
    const gain = this.getVolumeNode();
    if (!gain || !this.ctx) return;

    const now = this.ctx.currentTime;
    const notes = [392.00, 349.23, 311.13, 261.63]; // G4, F4, Eb4, C4
    notes.forEach((freq, index) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, now + index * 0.15);

      const oscGain = this.ctx.createGain();
      oscGain.gain.setValueAtTime(0.15, now + index * 0.15);
      oscGain.gain.exponentialRampToValueAtTime(0.01, now + index * 0.15 + 0.3);

      osc.connect(oscGain);
      oscGain.connect(gain!);

      osc.start(now + index * 0.15);
      osc.stop(now + index * 0.15 + 0.3);
    });
  }
}
