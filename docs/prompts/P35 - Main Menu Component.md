### Prompt 5.2: Main Menu Component

```
Create main menu with Angular Material components.

Requirements:
1. Create main-menu.component.ts in /src/app/features/menu with:
   - mat-card for game title and branding
   - mat-button for: Start Game, High Scores, Settings, Instructions
   - mat-icon for decorative elements
   - Router navigation to game on Start
2. Template with Material Design styling
3. Responsive layout
4. Add CSS animations for hover effects

TDD Approach:
- Create main-menu.component.spec.ts:
  * Component renders all menu buttons
  * Start Game navigates to /game route
  * High Scores button opens high scores view
  * Settings button opens settings dialog
  * Instructions button opens instructions dialog
  * Buttons have proper accessibility labels
- Mock Router for navigation testing
- Implement component with Material components
- Verify routing and dialog triggering

Deliverable: Main menu with Material Design UI
```
