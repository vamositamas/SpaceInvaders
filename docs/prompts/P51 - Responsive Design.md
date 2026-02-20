### Prompt 7.4: Responsive Design

```
Make game responsive across different screen sizes.

Requirements:
1. Update game-canvas.component.ts to:
   - Detect screen size on init and resize
   - Scale canvas to fit available space
   - Maintain aspect ratio (4:3)
   - Scale game coordinates accordingly
   - Handle window resize events
2. Update UI components for mobile:
   - Touch controls for mobile devices
   - Responsive menu layout
   - Adjusted button sizes for touch
3. Add CSS media queries for breakpoints
4. Test on tablet and large mobile devices

TDD Approach:
- Update game-canvas.component.spec.ts:
  * Canvas scales to fit container
  * Aspect ratio maintained during resize
  * Game coordinates scaled correctly
  * Resize listener added on init
  * Resize listener removed on destroy
- Add responsive UI tests:
  * Menu readable on small screens
  * Buttons touchable on mobile
  * HUD doesn't overlap canvas
  * Dialogs fit in viewport
- Implement responsive scaling
- Test on multiple screen sizes

Deliverable: Responsive game playable on tablets
```
