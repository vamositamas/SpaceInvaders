### Prompt 5.3: Settings Dialog Component

```
Create settings configuration dialog with Angular Material.

Requirements:
1. Create settings-dialog.component.ts in /src/app/features/menu with:
   - mat-dialog container
   - mat-slider for sound volume (0-100)
   - mat-slider for music volume (0-100)
   - mat-slide-toggle for control scheme (keyboard/mouse/both)
   - mat-select for difficulty (easy/normal/hard)
   - Save and Cancel buttons
2. Load settings from backend API on open
3. Save settings to backend on Save button
4. Close dialog with saved/cancelled state

TDD Approach:
- Create settings-dialog.component.spec.ts:
  * Dialog opens with current settings
  * Sliders update values correctly
  * Toggle switches between control schemes
  * Dropdown shows difficulty options
  * Save button calls API to persist settings
  * Cancel button closes without saving
  * Settings applied to game services
- Mock HttpClient for API calls
- Mock MatDialogRef for dialog control
- Implement component with form handling

Deliverable: Settings dialog with persistent configuration
```
