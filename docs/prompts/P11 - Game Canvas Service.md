### Prompt 2.2: Game Canvas Service

```
Create an Angular service to manage HTML5 Canvas rendering with testing.

Requirements:
1. Create /src/app/core/services/canvas.service.ts with methods:
   - initCanvas(canvasElement, width, height) - initializes canvas context
   - clearCanvas() - clears entire canvas
   - getContext() - returns 2D rendering context
   - drawRect(x, y, width, height, color) - draws filled rectangle
   - drawText(text, x, y, font, color) - renders text
2. Use CanvasRenderingContext2D for all drawing operations
3. Store canvas dimensions and context as private properties

TDD Approach:
- Create canvas.service.spec.ts
- Write tests for:
  * initCanvas stores canvas context correctly
  * clearCanvas clears entire canvas area
  * getContext returns stored 2D context
  * drawRect calls fillRect with correct parameters
  * drawText calls fillText with proper positioning
  * Methods throw error if canvas not initialized
- Mock CanvasRenderingContext2D in tests
- Implement canvas.service.ts to pass all tests
- Use TestBed for Angular service testing

Deliverable: Canvas service with full unit test coverage
```
