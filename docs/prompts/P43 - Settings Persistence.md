### Prompt 6.2: Settings Persistence

```
Implement settings persistence between frontend and backend.

Requirements:
1. Create /src/app/core/services/settings-api.service.ts with:
   - getSettings(playerId: string): Observable<PlayerSettings>
   - saveSettings(settings: PlayerSettings): Observable<PlayerSettings>
   - HTTP calls to backend settings endpoints
2. Update settings-dialog.component.ts to:
   - Load settings from API when dialog opens
   - Save settings to API when Save clicked
   - Apply settings to game services immediately
3. Generate unique player ID in localStorage (fallback)
4. Handle new players with default settings

TDD Approach:
- Create settings-api.service.spec.ts:
  * getSettings calls GET /api/settings/:playerId
  * saveSettings calls PUT /api/settings/:playerId
  * 404 response returns default settings
  * API errors handled properly
- Update settings-dialog.component.spec.ts:
  * Settings loaded from API on open
  * Save button persists to backend
  * Settings applied to game services
  * Player ID generated if not exists
  * Default settings used for new players
- Mock HttpClient
- Implement settings persistence

Deliverable: Persistent settings across sessions
```
