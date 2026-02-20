import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { InputHandlerService } from './input-handler.service';

describe('InputHandlerService', () => {
  let service: InputHandlerService;
  let mockCanvas: HTMLCanvasElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [InputHandlerService, provideZonelessChangeDetection()]
    });
    service = TestBed.inject(InputHandlerService);
    
    // Create mock canvas element
    mockCanvas = document.createElement('canvas');
    mockCanvas.width = 800;
    mockCanvas.height = 600;
    document.body.appendChild(mockCanvas);
  });

  afterEach(() => {
    service.cleanup();
    document.body.removeChild(mockCanvas);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('Keyboard Event Handling', () => {
    it('should track when Arrow Left key is pressed', () => {
      service.initialize(mockCanvas);
      
      const event = new KeyboardEvent('keydown', { key: 'ArrowLeft' });
      window.dispatchEvent(event);
      
      expect(service.isKeyPressed('ArrowLeft')).toBe(true);
    });

    it('should track when Arrow Right key is pressed', () => {
      service.initialize(mockCanvas);
      
      const event = new KeyboardEvent('keydown', { key: 'ArrowRight' });
      window.dispatchEvent(event);
      
      expect(service.isKeyPressed('ArrowRight')).toBe(true);
    });

    it('should track when Space key is pressed', () => {
      service.initialize(mockCanvas);
      
      const event = new KeyboardEvent('keydown', { key: ' ' });
      window.dispatchEvent(event);
      
      expect(service.isKeyPressed(' ')).toBe(true);
    });

    it('should track when P key is pressed', () => {
      service.initialize(mockCanvas);
      
      const event = new KeyboardEvent('keydown', { key: 'p' });
      window.dispatchEvent(event);
      
      expect(service.isKeyPressed('p')).toBe(true);
    });

    it('should track when Escape key is pressed', () => {
      service.initialize(mockCanvas);
      
      const event = new KeyboardEvent('keydown', { key: 'Escape' });
      window.dispatchEvent(event);
      
      expect(service.isKeyPressed('Escape')).toBe(true);
    });

    it('should track WASD keys (W, A, S, D)', () => {
      service.initialize(mockCanvas);
      
      const eventW = new KeyboardEvent('keydown', { key: 'w' });
      const eventA = new KeyboardEvent('keydown', { key: 'a' });
      const eventD = new KeyboardEvent('keydown', { key: 'd' });
      
      window.dispatchEvent(eventW);
      window.dispatchEvent(eventA);
      window.dispatchEvent(eventD);
      
      expect(service.isKeyPressed('w')).toBe(true);
      expect(service.isKeyPressed('a')).toBe(true);
      expect(service.isKeyPressed('d')).toBe(true);
    });

    it('should handle key case insensitivity', () => {
      service.initialize(mockCanvas);
      
      const eventUpperP = new KeyboardEvent('keydown', { key: 'P' });
      window.dispatchEvent(eventUpperP);
      
      expect(service.isKeyPressed('p')).toBe(true);
      expect(service.isKeyPressed('P')).toBe(true);
    });

    it('should untrack key when released', () => {
      service.initialize(mockCanvas);
      
      const keydownEvent = new KeyboardEvent('keydown', { key: 'ArrowLeft' });
      const keyupEvent = new KeyboardEvent('keyup', { key: 'ArrowLeft' });
      
      window.dispatchEvent(keydownEvent);
      expect(service.isKeyPressed('ArrowLeft')).toBe(true);
      
      window.dispatchEvent(keyupEvent);
      expect(service.isKeyPressed('ArrowLeft')).toBe(false);
    });

    it('should return false for keys that were never pressed', () => {
      service.initialize(mockCanvas);
      
      expect(service.isKeyPressed('z')).toBe(false);
      expect(service.isKeyPressed('Tab')).toBe(false);
    });
  });

  describe('Mouse Event Handling', () => {
    it('should track mouse position relative to canvas', () => {
      service.initialize(mockCanvas);
      
      const rect = mockCanvas.getBoundingClientRect();
      const event = new MouseEvent('mousemove', {
        clientX: rect.left + 100,
        clientY: rect.top + 50
      });
      
      mockCanvas.dispatchEvent(event);
      
      const mousePos = service.getMousePosition();
      expect(mousePos.x).toBe(100);
      expect(mousePos.y).toBe(50);
    });

    it('should update mouse position on mouse move', () => {
      service.initialize(mockCanvas);
      
      const rect = mockCanvas.getBoundingClientRect();
      const event1 = new MouseEvent('mousemove', {
        clientX: rect.left + 200,
        clientY: rect.top + 100
      });
      const event2 = new MouseEvent('mousemove', {
        clientX: rect.left + 300,
        clientY: rect.top + 150
      });
      
      mockCanvas.dispatchEvent(event1);
      let mousePos = service.getMousePosition();
      expect(mousePos.x).toBe(200);
      expect(mousePos.y).toBe(100);
      
      mockCanvas.dispatchEvent(event2);
      mousePos = service.getMousePosition();
      expect(mousePos.x).toBe(300);
      expect(mousePos.y).toBe(150);
    });

    it('should track left mouse button clicks', () => {
      service.initialize(mockCanvas);
      
      const event = new MouseEvent('mousedown', { button: 0 });
      mockCanvas.dispatchEvent(event);
      
      expect(service.isMouseButtonPressed(0)).toBe(true);
    });

    it('should track right mouse button clicks', () => {
      service.initialize(mockCanvas);
      
      const event = new MouseEvent('mousedown', { button: 2 });
      mockCanvas.dispatchEvent(event);
      
      expect(service.isMouseButtonPressed(2)).toBe(true);
    });

    it('should untrack mouse button when released', () => {
      service.initialize(mockCanvas);
      
      const mousedownEvent = new MouseEvent('mousedown', { button: 0 });
      const mouseupEvent = new MouseEvent('mouseup', { button: 0 });
      
      mockCanvas.dispatchEvent(mousedownEvent);
      expect(service.isMouseButtonPressed(0)).toBe(true);
      
      mockCanvas.dispatchEvent(mouseupEvent);
      expect(service.isMouseButtonPressed(0)).toBe(false);
    });

    it('should return {x: 0, y: 0} if mouse never moved', () => {
      service.initialize(mockCanvas);
      
      const mousePos = service.getMousePosition();
      expect(mousePos.x).toBe(0);
      expect(mousePos.y).toBe(0);
    });
  });

  describe('Event Cleanup', () => {
    it('should remove all event listeners on cleanup', () => {
      service.initialize(mockCanvas);
      
      // Press some keys and move mouse
      const keyEvent = new KeyboardEvent('keydown', { key: 'ArrowLeft' });
      window.dispatchEvent(keyEvent);
      
      const rect = mockCanvas.getBoundingClientRect();
      const mouseEvent = new MouseEvent('mousemove', {
        clientX: rect.left + 100,
        clientY: rect.top + 50
      });
      mockCanvas.dispatchEvent(mouseEvent);
      
      // Cleanup
      service.cleanup();
      
      // Events after cleanup should not be tracked
      const keyEvent2 = new KeyboardEvent('keydown', { key: 'ArrowRight' });
      window.dispatchEvent(keyEvent2);
      
      expect(service.isKeyPressed('ArrowRight')).toBe(false);
    });

    it('should reset all tracked keys on cleanup', () => {
      service.initialize(mockCanvas);
      
      const keyEvent = new KeyboardEvent('keydown', { key: 'ArrowLeft' });
      window.dispatchEvent(keyEvent);
      expect(service.isKeyPressed('ArrowLeft')).toBe(true);
      
      service.cleanup();
      
      expect(service.isKeyPressed('ArrowLeft')).toBe(false);
    });

    it('should reset mouse position on cleanup', () => {
      service.initialize(mockCanvas);
      
      const rect = mockCanvas.getBoundingClientRect();
      const mouseEvent = new MouseEvent('mousemove', {
        clientX: rect.left + 100,
        clientY: rect.top + 50
      });
      mockCanvas.dispatchEvent(mouseEvent);
      
      service.cleanup();
      
      const mousePos = service.getMousePosition();
      expect(mousePos.x).toBe(0);
      expect(mousePos.y).toBe(0);
    });

    it('should reset mouse buttons on cleanup', () => {
      service.initialize(mockCanvas);
      
      const mouseEvent = new MouseEvent('mousedown', { button: 0 });
      mockCanvas.dispatchEvent(mouseEvent);
      expect(service.isMouseButtonPressed(0)).toBe(true);
      
      service.cleanup();
      
      expect(service.isMouseButtonPressed(0)).toBe(false);
    });

    it('should allow re-initialization after cleanup', () => {
      service.initialize(mockCanvas);
      service.cleanup();
      
      // Should not throw error
      expect(() => service.initialize(mockCanvas)).not.toThrow();
      
      // Should work after re-initialization
      const keyEvent = new KeyboardEvent('keydown', { key: 'Space' });
      window.dispatchEvent(keyEvent);
      
      expect(service.isKeyPressed('Space')).toBe(true);
    });
  });

  describe('Edge Cases', () => {
    it('should handle multiple keys pressed simultaneously', () => {
      service.initialize(mockCanvas);
      
      const event1 = new KeyboardEvent('keydown', { key: 'ArrowLeft' });
      const event2 = new KeyboardEvent('keydown', { key: 'Space' });
      const event3 = new KeyboardEvent('keydown', { key: 'w' });
      
      window.dispatchEvent(event1);
      window.dispatchEvent(event2);
      window.dispatchEvent(event3);
      
      expect(service.isKeyPressed('ArrowLeft')).toBe(true);
      expect(service.isKeyPressed('Space')).toBe(true);
      expect(service.isKeyPressed('w')).toBe(true);
    });

    it('should handle rapid key presses', () => {
      service.initialize(mockCanvas);
      
      for (let i = 0; i < 10; i++) {
        const keydownEvent = new KeyboardEvent('keydown', { key: 'Space' });
        const keyupEvent = new KeyboardEvent('keyup', { key: 'Space' });
        
        window.dispatchEvent(keydownEvent);
        window.dispatchEvent(keyupEvent);
      }
      
      expect(service.isKeyPressed('Space')).toBe(false);
    });

    it('should not throw error when checking keys before initialization', () => {
      expect(() => service.isKeyPressed('ArrowLeft')).not.toThrow();
      expect(service.isKeyPressed('ArrowLeft')).toBe(false);
    });

    it('should not throw error when calling cleanup before initialization', () => {
      expect(() => service.cleanup()).not.toThrow();
    });

    it('should handle calling cleanup multiple times', () => {
      service.initialize(mockCanvas);
      
      expect(() => {
        service.cleanup();
        service.cleanup();
        service.cleanup();
      }).not.toThrow();
    });
  });
});
