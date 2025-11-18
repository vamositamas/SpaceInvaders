import { Injectable } from '@angular/core';

/**
 * CanvasService - Manages HTML5 Canvas rendering operations
 * 
 * This service provides methods for initializing and drawing on an HTML5 canvas.
 * All drawing operations require the canvas to be initialized first via initCanvas().
 */
@Injectable({
  providedIn: 'root'
})
export class CanvasService {
  private context: CanvasRenderingContext2D | null = null;
  private width: number = 0;
  private height: number = 0;

  /**
   * Initializes the canvas with specified dimensions
   * @param canvasElement - The HTML canvas element to initialize
   * @param width - Canvas width in pixels
   * @param height - Canvas height in pixels
   * @throws Error if 2D rendering context cannot be obtained
   */
  initCanvas(canvasElement: HTMLCanvasElement, width: number, height: number): void {
    canvasElement.width = width;
    canvasElement.height = height;
    
    const ctx = canvasElement.getContext('2d');
    if (!ctx) {
      throw new Error('Unable to get 2D rendering context');
    }
    
    this.context = ctx;
    this.width = width;
    this.height = height;
  }

  /**
   * Returns the stored 2D rendering context
   * @returns The CanvasRenderingContext2D instance
   * @throws Error if canvas has not been initialized
   */
  getContext(): CanvasRenderingContext2D {
    if (!this.context) {
      throw new Error('Canvas not initialized. Call initCanvas() first.');
    }
    return this.context;
  }

  /**
   * Clears the entire canvas area
   * @throws Error if canvas has not been initialized
   */
  clearCanvas(): void {
    const ctx = this.getContext();
    ctx.clearRect(0, 0, this.width, this.height);
  }

  /**
   * Draws a filled rectangle on the canvas
   * @param x - X coordinate of top-left corner
   * @param y - Y coordinate of top-left corner
   * @param width - Rectangle width
   * @param height - Rectangle height
   * @param color - Fill color (CSS color string)
   * @throws Error if canvas has not been initialized
   */
  drawRect(x: number, y: number, width: number, height: number, color: string): void {
    const ctx = this.getContext();
    ctx.fillStyle = color;
    ctx.fillRect(x, y, width, height);
  }

  /**
   * Renders text on the canvas
   * @param text - Text string to render
   * @param x - X coordinate for text baseline start
   * @param y - Y coordinate for text baseline
   * @param font - Font specification (e.g., "24px Arial")
   * @param color - Text color (CSS color string)
   * @throws Error if canvas has not been initialized
   */
  drawText(text: string, x: number, y: number, font: string, color: string): void {
    const ctx = this.getContext();
    ctx.font = font;
    ctx.fillStyle = color;
    ctx.fillText(text, x, y);
  }
}
