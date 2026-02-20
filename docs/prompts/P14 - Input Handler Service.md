### Prompt 2.5: Input Handler Service

```
Create a service to handle keyboard and mouse input for game controls.

Requirements:
1. Create /src/app/core/services/input-handler.service.ts with:
   - enableKeyboard() - starts listening to keyboard events
   - enableMouse(canvasElement) - starts listening to mouse events
   - disable() - removes all event listeners
   - isKeyPressed(key: string): boolean
   - getMouseX(): number
   - isMouseButtonPressed(button: number): boolean
2. Track key states in a Map (key -> boolean)
3. Track mouse position relative to canvas
4. Support keys: ArrowLeft, ArrowRight, KeyA, KeyD, Space, KeyW, ArrowUp, KeyP, Escape
5. Handle mouse movement and click events

TDD Approach:
- Create input-handler.service.spec.ts
- Write tests for:
  * enableKeyboard registers keydown/keyup listeners
  * isKeyPressed returns true when key is down
  * isKeyPressed returns false when key is up
  * enableMouse registers mouse event listeners
  * getMouseX returns correct X position relative to canvas
  * isMouseButtonPressed tracks mouse button state
  * disable removes all event listeners
- Mock window.addEventListener and canvas element
- Simulate keyboard and mouse events in tests
- Implement service with proper cleanup

Deliverable: Input handler with keyboard and mouse support
```
