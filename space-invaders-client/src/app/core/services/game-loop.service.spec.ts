import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { GameLoopService } from './game-loop.service';

describe('GameLoopService', () => {
  let service: GameLoopService;
  let rafId: number;
  let rafCallbacks: ((time: number) => void)[];
  let currentTime: number;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        GameLoopService,
        provideZonelessChangeDetection()
      ]
    });
    service = TestBed.inject(GameLoopService);

    // Mock requestAnimationFrame
    rafId = 0;
    rafCallbacks = [];
    currentTime = 0;

    spyOn(window, 'requestAnimationFrame').and.callFake((callback: FrameRequestCallback) => {
      rafId++;
      rafCallbacks.push(callback);
      return rafId;
    });

    spyOn(window, 'cancelAnimationFrame').and.callFake((id: number) => {
      // Remove callback from queue
      rafCallbacks = [];
    });

    // Mock performance.now()
    spyOn(performance, 'now').and.callFake(() => currentTime);
  });

  describe('Service Creation', () => {
    it('should be created', () => {
      expect(service).toBeTruthy();
    });

    it('should have default state (not running, not paused)', () => {
      expect(service.isLoopRunning()).toBe(false);
      expect(service.isLoopPaused()).toBe(false);
    });

    it('should initialize with zero delta time and FPS', () => {
      expect(service.getDeltaTime()).toBe(0);
      expect(service.getFPS()).toBe(0);
    });
  });

  describe('start() Method', () => {
    it('should start the game loop', () => {
      const callback = jasmine.createSpy('updateCallback');
      service.start(callback);
      
      expect(service.isLoopRunning()).toBe(true);
    });

    it('should call updateCallback on each frame', () => {
      const callback = jasmine.createSpy('updateCallback');
      service.start(callback);
      
      // start() calls gameLoop() synchronously, which calls the callback once (call #1)
      expect(callback).toHaveBeenCalledTimes(1);
      
      // Simulate 3 more frames - each frame schedules the next
      currentTime = 16.67;
      rafCallbacks[rafCallbacks.length - 1](currentTime);
      expect(callback).toHaveBeenCalledTimes(2);
      
      currentTime = 33.34;
      rafCallbacks[rafCallbacks.length - 1](currentTime);
      expect(callback).toHaveBeenCalledTimes(3);
      
      currentTime = 50.01;
      rafCallbacks[rafCallbacks.length - 1](currentTime);
      expect(callback).toHaveBeenCalledTimes(4);
    });

    it('should use requestAnimationFrame', () => {
      const callback = jasmine.createSpy('updateCallback');
      service.start(callback);
      
      expect(window.requestAnimationFrame).toHaveBeenCalled();
    });

    it('should calculate delta time between frames', () => {
      const callback = jasmine.createSpy('updateCallback');
      currentTime = 1000;
      service.start(callback);
      
      currentTime = 1016.67;
      rafCallbacks[rafCallbacks.length - 1](currentTime);
      
      expect(service.getDeltaTime()).toBeCloseTo(16.67, 1);
    });

    it('should not start if already running', () => {
      const callback1 = jasmine.createSpy('callback1');
      const callback2 = jasmine.createSpy('callback2');
      
      service.start(callback1);
      const rafCallCountBefore = (window.requestAnimationFrame as jasmine.Spy).calls.count();
      
      service.start(callback2);
      const rafCallCountAfter = (window.requestAnimationFrame as jasmine.Spy).calls.count();
      
      // Should not call RAF again
      expect(rafCallCountAfter).toBe(rafCallCountBefore);
    });

    it('should throw error if no callback provided', () => {
      expect(() => service.start(null as any)).toThrowError('Update callback is required');
    });

    it('should set isRunning to true', () => {
      const callback = jasmine.createSpy('updateCallback');
      expect(service.isLoopRunning()).toBe(false);
      
      service.start(callback);
      
      expect(service.isLoopRunning()).toBe(true);
    });

    it('should reset pause state', () => {
      const callback = jasmine.createSpy('updateCallback');
      service.start(callback);
      service.pause();
      expect(service.isLoopPaused()).toBe(true);
      
      service.stop();
      service.start(callback);
      
      expect(service.isLoopPaused()).toBe(false);
    });
  });

  describe('stop() Method', () => {
    it('should stop the game loop', () => {
      const callback = jasmine.createSpy('updateCallback');
      service.start(callback);
      
      service.stop();
      
      expect(service.isLoopRunning()).toBe(false);
    });

    it('should cancel animation frame', () => {
      const callback = jasmine.createSpy('updateCallback');
      service.start(callback);
      
      service.stop();
      
      expect(window.cancelAnimationFrame).toHaveBeenCalled();
    });

    it('should set isRunning to false', () => {
      const callback = jasmine.createSpy('updateCallback');
      service.start(callback);
      expect(service.isLoopRunning()).toBe(true);
      
      service.stop();
      
      expect(service.isLoopRunning()).toBe(false);
    });

    it('should stop calling updateCallback', () => {
      const callback = jasmine.createSpy('updateCallback');
      service.start(callback);
      
      // start() already called it once
      expect(callback).toHaveBeenCalledTimes(1);
      
      currentTime = 16.67;
      rafCallbacks[rafCallbacks.length - 1](currentTime);
      expect(callback).toHaveBeenCalledTimes(2);
      
      service.stop();
      
      // Try to call next frame (should not call callback because isRunning is false)
      currentTime = 33.34;
      const lastCallback = rafCallbacks[rafCallbacks.length - 1];
      if (lastCallback) {
        lastCallback(currentTime);
      }
      
      // Should still be 2, not incremented
      expect(callback).toHaveBeenCalledTimes(2);
    });

    it('should be safe to call when not running', () => {
      expect(() => service.stop()).not.toThrow();
      expect(service.isLoopRunning()).toBe(false);
    });

    it('should reset FPS and delta time', () => {
      const callback = jasmine.createSpy('updateCallback');
      service.start(callback);
      
      currentTime = 16.67;
      rafCallbacks[rafCallbacks.length - 1](currentTime);
      
      service.stop();
      
      expect(service.getDeltaTime()).toBe(0);
      expect(service.getFPS()).toBe(0);
    });
  });

  describe('pause() Method', () => {
    it('should pause the game loop', () => {
      const callback = jasmine.createSpy('updateCallback');
      service.start(callback);
      
      service.pause();
      
      expect(service.isLoopPaused()).toBe(true);
    });

    it('should set isPaused to true', () => {
      const callback = jasmine.createSpy('updateCallback');
      service.start(callback);
      expect(service.isLoopPaused()).toBe(false);
      
      service.pause();
      
      expect(service.isLoopPaused()).toBe(true);
    });

    it('should stop calling updateCallback', () => {
      const callback = jasmine.createSpy('updateCallback');
      service.start(callback);
      
      // start() already called it once
      expect(callback).toHaveBeenCalledTimes(1);
      
      currentTime = 16.67;
      rafCallbacks[rafCallbacks.length - 1](currentTime);
      expect(callback).toHaveBeenCalledTimes(2);
      
      service.pause();
      
      currentTime = 33.34;
      rafCallbacks[rafCallbacks.length - 1](currentTime);
      
      // Should still be 2, not incremented while paused
      expect(callback).toHaveBeenCalledTimes(2);
    });

    it('should NOT cancel animation frame', () => {
      const callback = jasmine.createSpy('updateCallback');
      service.start(callback);
      
      (window.cancelAnimationFrame as jasmine.Spy).calls.reset();
      
      service.pause();
      
      expect(window.cancelAnimationFrame).not.toHaveBeenCalled();
    });

    it('should be idempotent (safe to call multiple times)', () => {
      const callback = jasmine.createSpy('updateCallback');
      service.start(callback);
      
      service.pause();
      expect(service.isLoopPaused()).toBe(true);
      
      service.pause();
      expect(service.isLoopPaused()).toBe(true);
      
      service.pause();
      expect(service.isLoopPaused()).toBe(true);
    });
  });

  describe('resume() Method', () => {
    it('should resume the game loop', () => {
      const callback = jasmine.createSpy('updateCallback');
      service.start(callback);
      service.pause();
      expect(service.isLoopPaused()).toBe(true);
      
      service.resume();
      
      expect(service.isLoopPaused()).toBe(false);
    });

    it('should set isPaused to false', () => {
      const callback = jasmine.createSpy('updateCallback');
      service.start(callback);
      service.pause();
      
      service.resume();
      
      expect(service.isLoopPaused()).toBe(false);
    });

    it('should resume calling updateCallback', () => {
      const callback = jasmine.createSpy('updateCallback');
      service.start(callback);
      
      // start() already called it once
      expect(callback).toHaveBeenCalledTimes(1);
      
      currentTime = 16.67;
      rafCallbacks[rafCallbacks.length - 1](currentTime);
      expect(callback).toHaveBeenCalledTimes(2);
      
      service.pause();
      
      currentTime = 33.34;
      rafCallbacks[rafCallbacks.length - 1](currentTime);
      expect(callback).toHaveBeenCalledTimes(2); // Still 2 while paused
      
      service.resume();
      
      currentTime = 50.01;
      rafCallbacks[rafCallbacks.length - 1](currentTime);
      expect(callback).toHaveBeenCalledTimes(3); // Incremented after resume
    });

    it('should recalculate delta time correctly', () => {
      const callback = jasmine.createSpy('updateCallback');
      currentTime = 1000;
      service.start(callback);
      
      currentTime = 1016.67;
      rafCallbacks[rafCallbacks.length - 1](currentTime);
      
      service.pause();
      
      // Time passes while paused
      currentTime = 2000;
      
      service.resume();
      
      // Next frame should have small delta, not 1000ms
      currentTime = 2016.67;
      rafCallbacks[rafCallbacks.length - 1](currentTime);
      
      expect(service.getDeltaTime()).toBeCloseTo(16.67, 1);
    });

    it('should do nothing if not paused', () => {
      const callback = jasmine.createSpy('updateCallback');
      service.start(callback);
      expect(service.isLoopPaused()).toBe(false);
      
      service.resume();
      
      expect(service.isLoopPaused()).toBe(false);
    });
  });

  describe('getDeltaTime() Method', () => {
    it('should return milliseconds since last frame', () => {
      const callback = jasmine.createSpy('updateCallback');
      currentTime = 1000;
      service.start(callback);
      
      currentTime = 1020;
      rafCallbacks[0](currentTime);
      
      expect(service.getDeltaTime()).toBe(20);
    });

    it('should return 0 initially', () => {
      expect(service.getDeltaTime()).toBe(0);
    });

    it('should update after each frame', () => {
      const callback = jasmine.createSpy('updateCallback');
      currentTime = 1000;
      service.start(callback);
      
      currentTime = 1016;
      rafCallbacks[0](currentTime);
      expect(service.getDeltaTime()).toBe(16);
      
      currentTime = 1033;
      rafCallbacks[1](currentTime);
      expect(service.getDeltaTime()).toBe(17);
      
      currentTime = 1049;
      rafCallbacks[2](currentTime);
      expect(service.getDeltaTime()).toBe(16);
    });

    it('should return approximate 16.67ms at 60 FPS', () => {
      const callback = jasmine.createSpy('updateCallback');
      currentTime = 1000;
      service.start(callback);
      
      currentTime = 1016.67;
      rafCallbacks[0](currentTime);
      
      expect(service.getDeltaTime()).toBeCloseTo(16.67, 1);
    });
  });

  describe('getFPS() Method', () => {
    it('should return current frames per second', () => {
      const callback = jasmine.createSpy('updateCallback');
      currentTime = 1000;
      service.start(callback);
      
      // Simulate several frames at 60 FPS
      for (let i = 0; i < 10; i++) {
        currentTime += 16.67;
        rafCallbacks[i](currentTime);
      }
      
      expect(service.getFPS()).toBeGreaterThan(0);
    });

    it('should return 0 initially', () => {
      expect(service.getFPS()).toBe(0);
    });

    it('should calculate FPS from delta time', () => {
      const callback = jasmine.createSpy('updateCallback');
      currentTime = 1000;
      service.start(callback);
      
      currentTime = 1016.67; // 16.67ms = 60 FPS
      rafCallbacks[0](currentTime);
      
      expect(service.getFPS()).toBeGreaterThan(0);
    });

    it('should return approximately 60 at target rate', () => {
      const callback = jasmine.createSpy('updateCallback');
      currentTime = 1000;
      service.start(callback);
      
      // Run 60 frames at perfect 60 FPS
      for (let i = 0; i < 60; i++) {
        currentTime += 16.67;
        rafCallbacks[i](currentTime);
      }
      
      expect(service.getFPS()).toBeCloseTo(60, 2);
    });

    it('should smooth FPS over multiple frames', () => {
      const callback = jasmine.createSpy('updateCallback');
      currentTime = 1000;
      service.start(callback);
      
      // Varying frame times
      currentTime += 16.67;
      rafCallbacks[0](currentTime);
      const fps1 = service.getFPS();
      
      currentTime += 20;
      rafCallbacks[1](currentTime);
      const fps2 = service.getFPS();
      
      currentTime += 16.67;
      rafCallbacks[2](currentTime);
      const fps3 = service.getFPS();
      
      // FPS should be smoothed, not jumping wildly
      expect(fps2).toBeLessThan(fps1);
      expect(fps3).toBeGreaterThan(fps2);
    });
  });

  describe('Frame Rate Control', () => {
    it('should target 60 FPS', () => {
      const callback = jasmine.createSpy('updateCallback');
      currentTime = 1000;
      service.start(callback);
      
      // Run 60 frames at 60 FPS
      for (let i = 0; i < 60; i++) {
        currentTime += 16.67;
        rafCallbacks[i](currentTime);
      }
      
      expect(service.getFPS()).toBeCloseTo(60, 2);
    });

    it('should handle variable frame rates', () => {
      const callback = jasmine.createSpy('updateCallback');
      currentTime = 1000;
      service.start(callback);
      
      // Varying frame times
      currentTime += 16.67;
      rafCallbacks[0](currentTime);
      
      currentTime += 33.34; // Slow frame
      rafCallbacks[1](currentTime);
      
      currentTime += 8.33; // Fast frame
      rafCallbacks[2](currentTime);
      
      currentTime += 16.67; // Normal frame
      rafCallbacks[3](currentTime);
      
      expect(service.getFPS()).toBeGreaterThan(0);
    });

    it('should cap delta time to prevent spiral of death', () => {
      const callback = jasmine.createSpy('updateCallback');
      currentTime = 1000;
      service.start(callback);
      
      // Huge lag spike
      currentTime += 500;
      rafCallbacks[rafCallbacks.length - 1](currentTime);
      
      // Delta should be capped at 100ms
      expect(service.getDeltaTime()).toBeLessThanOrEqual(100);
    });

    it('should maintain consistent timing', () => {
      const callback = jasmine.createSpy('updateCallback');
      const deltaTimes: number[] = [];
      
      callback.and.callFake(() => {
        const delta = service.getDeltaTime();
        if (delta > 0) { // Skip the first delta (which is 0)
          deltaTimes.push(delta);
        }
      });
      
      currentTime = 1000;
      service.start(callback);
      
      // Run several frames at 60 FPS
      for (let i = 0; i < 10; i++) {
        currentTime += 16.67;
        rafCallbacks[rafCallbacks.length - 1](currentTime);
      }
      
      // All delta times should be similar (averaging around 16.67)
      const avgDelta = deltaTimes.reduce((a, b) => a + b, 0) / deltaTimes.length;
      expect(avgDelta).toBeCloseTo(16.67, 0);
    });
  });

  describe('Error Handling', () => {
    it('should handle missing callback gracefully', () => {
      expect(() => service.start(null as any)).toThrowError();
      expect(() => service.start(undefined as any)).toThrowError();
    });

    it('should handle callback errors without crashing', () => {
      const callback = jasmine.createSpy('updateCallback').and.callFake(() => {
        throw new Error('Callback error');
      });
      
      spyOn(console, 'error');
      
      currentTime = 1000;
      service.start(callback);
      
      currentTime = 1016.67;
      expect(() => rafCallbacks[rafCallbacks.length - 1](currentTime)).not.toThrow();
      
      expect(console.error).toHaveBeenCalled();
    });

    it('should continue loop after callback error', () => {
      let errorOnce = true;
      const callback = jasmine.createSpy('updateCallback').and.callFake(() => {
        if (errorOnce) {
          errorOnce = false;
          throw new Error('Callback error');
        }
      });
      
      spyOn(console, 'error');
      
      currentTime = 1000;
      service.start(callback);
      
      // start() already called it once (and threw error)
      expect(callback).toHaveBeenCalledTimes(1);
      
      currentTime = 1016.67;
      rafCallbacks[rafCallbacks.length - 1](currentTime); // Should still work
      
      currentTime = 1033.34;
      rafCallbacks[rafCallbacks.length - 1](currentTime); // Should still work
      
      expect(callback).toHaveBeenCalledTimes(3);
      expect(service.isLoopRunning()).toBe(true);
    });
  });
});
