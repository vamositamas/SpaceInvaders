import { Injectable } from '@angular/core';

/**
 * Input Handler Service
 * 
 * Manages keyboard and mouse input events for the game.
 * Tracks key states, mouse position, and mouse button states.
 * Provides clean initialization and cleanup of event listeners.
 * 
 * @example
 * ```typescript
 * constructor(private inputHandler: InputHandlerService) {}
 * 
 * ngOnInit() {
 *   this.inputHandler.initialize(this.canvasElement);
 * }
 * 
 * update() {
 *   if (this.inputHandler.isKeyPressed('ArrowLeft')) {
 *     // Move left
 *   }
 *   
 *   const mousePos = this.inputHandler.getMousePosition();
 *   // Use mouse position
 * }
 * 
 * ngOnDestroy() {
 *   this.inputHandler.cleanup();
 * }
 * ```
 */
@Injectable({
  providedIn: 'root'
})
export class InputHandlerService {
  /** Map of currently pressed keys (normalized to lowercase) */
  private keysPressed: Map<string, boolean> = new Map();
  
  /** Map of currently pressed mouse buttons */
  private mouseButtons: Map<number, boolean> = new Map();
  
  /** Current mouse position relative to canvas */
  private mousePosition: { x: number; y: number } = { x: 0, y: 0 };
  
  /** Reference to the canvas element for coordinate calculations */
  private canvas: HTMLCanvasElement | null = null;
  
  /** Mobile virtual button states */
  private mobileLeftPressed: boolean = false;
  private mobileRightPressed: boolean = false;
  private mobileFirePressed: boolean = false;
  
  /** Event listener references for cleanup */
  private keydownListener: ((e: KeyboardEvent) => void) | null = null;
  private keyupListener: ((e: KeyboardEvent) => void) | null = null;
  private mousemoveListener: ((e: MouseEvent) => void) | null = null;
  private mousedownListener: ((e: MouseEvent) => void) | null = null;
  private mouseupListener: ((e: MouseEvent) => void) | null = null;

  /**
   * Initialize input handling for the given canvas element.
   * Sets up all necessary event listeners.
   * 
   * @param canvas - The canvas element to track input for
   */
  initialize(canvas: HTMLCanvasElement): void {
    this.cleanup(); // Clean up any existing listeners
    
    this.canvas = canvas;
    
    // Keyboard event listeners
    this.keydownListener = (e: KeyboardEvent) => this.handleKeyDown(e);
    this.keyupListener = (e: KeyboardEvent) => this.handleKeyUp(e);
    
    window.addEventListener('keydown', this.keydownListener);
    window.addEventListener('keyup', this.keyupListener);
    
    // Mouse event listeners (attached to canvas)
    this.mousemoveListener = (e: MouseEvent) => this.handleMouseMove(e);
    this.mousedownListener = (e: MouseEvent) => this.handleMouseDown(e);
    this.mouseupListener = (e: MouseEvent) => this.handleMouseUp(e);
    
    canvas.addEventListener('mousemove', this.mousemoveListener);
    canvas.addEventListener('mousedown', this.mousedownListener);
    canvas.addEventListener('mouseup', this.mouseupListener);
  }

  /**
   * Clean up all event listeners and reset state.
   * Should be called when the service is no longer needed or before re-initialization.
   */
  cleanup(): void {
    // Remove keyboard event listeners
    if (this.keydownListener) {
      window.removeEventListener('keydown', this.keydownListener);
      this.keydownListener = null;
    }
    
    if (this.keyupListener) {
      window.removeEventListener('keyup', this.keyupListener);
      this.keyupListener = null;
    }
    
    // Remove mouse event listeners
    if (this.canvas) {
      if (this.mousemoveListener) {
        this.canvas.removeEventListener('mousemove', this.mousemoveListener);
        this.mousemoveListener = null;
      }
      
      if (this.mousedownListener) {
        this.canvas.removeEventListener('mousedown', this.mousedownListener);
        this.mousedownListener = null;
      }
      
      if (this.mouseupListener) {
        this.canvas.removeEventListener('mouseup', this.mouseupListener);
        this.mouseupListener = null;
      }
    }
    
    // Reset state
    this.keysPressed.clear();
    this.mouseButtons.clear();
    this.mousePosition = { x: 0, y: 0 };
    this.canvas = null;
  }

  /**
   * Check if a specific key is currently pressed.
   * Key names are case-insensitive.
   * Also checks mobile virtual buttons for arrow keys and space.
   * 
   * @param key - The key to check (e.g., 'ArrowLeft', 'Space', 'w')
   * @returns True if the key is currently pressed, false otherwise
   */
  isKeyPressed(key: string): boolean {
    const normalizedKey = key.toLowerCase();
    
    // Check mobile virtual buttons
    if (normalizedKey === 'arrowleft' && this.mobileLeftPressed) return true;
    if (normalizedKey === 'arrowright' && this.mobileRightPressed) return true;
    if (normalizedKey === ' ' && this.mobileFirePressed) return true;
    
    return this.keysPressed.get(normalizedKey) === true;
  }

  /**
   * Check if a specific mouse button is currently pressed.
   * 
   * @param button - The button number (0 = left, 1 = middle, 2 = right)
   * @returns True if the button is currently pressed, false otherwise
   */
  isMouseButtonPressed(button: number): boolean {
    return this.mouseButtons.get(button) === true;
  }

  /**
   * Get the current mouse position relative to the canvas.
   * 
   * @returns Object containing x and y coordinates
   */
  getMousePosition(): { x: number; y: number } {
    return { ...this.mousePosition };
  }

  /**
   * Handle keydown events.
   * @private
   */
  private handleKeyDown(event: KeyboardEvent): void {
    const key = event.key.toLowerCase();
    this.keysPressed.set(key, true);
  }

  /**
   * Handle keyup events.
   * @private
   */
  private handleKeyUp(event: KeyboardEvent): void {
    const key = event.key.toLowerCase();
    this.keysPressed.set(key, false);
  }

  /**
   * Handle mousemove events.
   * Updates mouse position relative to canvas.
   * @private
   */
  private handleMouseMove(event: MouseEvent): void {
    if (!this.canvas) {
      return;
    }
    
    const rect = this.canvas.getBoundingClientRect();
    this.mousePosition = {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    };
  }

  /**
   * Handle mousedown events.
   * @private
   */
  private handleMouseDown(event: MouseEvent): void {
    this.mouseButtons.set(event.button, true);
  }

  /**
   * Handle mouseup events.
   * @private
   */
  private handleMouseUp(event: MouseEvent): void {
    this.mouseButtons.set(event.button, false);
  }

  /**
   * Set mobile left button state.
   * Called by mobile control buttons.
   */
  setMobileLeft(pressed: boolean): void {
    this.mobileLeftPressed = pressed;
  }

  /**
   * Set mobile right button state.
   * Called by mobile control buttons.
   */
  setMobileRight(pressed: boolean): void {
    this.mobileRightPressed = pressed;
  }

  /**
   * Set mobile fire button state.
   * Called by mobile control buttons.
   */
  setMobileFire(pressed: boolean): void {
    this.mobileFirePressed = pressed;
  }
}
