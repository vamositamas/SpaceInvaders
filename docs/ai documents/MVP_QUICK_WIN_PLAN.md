# MVP Quick Win Plan - Phase 4 Implementation

**Date:** February 13, 2026  
**Strategy:** Implement Phase 4 (UI Components) to create a runnable application  
**Approach:** TDD with proper test coverage

---

## 🎯 Strategy: Phase 4 First (UI Components)

**Rationale:**
- UI components are easier to implement and test than game logic
- Provides visible progress quickly
- Creates navigation structure for the app
- Can demonstrate app flow to stakeholders
- Game logic (Phase 3) can be added incrementally after

**Trade-off:**
- App will have UI but no actual gameplay initially
- Will need to return to Phase 3 (game logic) later
- Acceptable as it provides quick, demonstrable progress

---

## 📋 Step 1: Clean Up Empty Files (BLOCKER)

### Files to Remove (Empty Test Files - Causing Build Failures)

**Services (13 files):**
1. `collision.service.spec.ts`
2. `enemy-movement.service.spec.ts`
3. `enemy-shooting.service.spec.ts`
4. `enemy.service.spec.ts`
5. `level.service.spec.ts`
6. `lives.service.spec.ts`
7. `mystery-ship.service.spec.ts`
8. `player.service.spec.ts`
9. `projectile.service.spec.ts`
10. `score.service.spec.ts`
11. `settings.service.spec.ts`
12. `shield.service.spec.ts`
13. `wave.service.spec.ts`

**Components (5 files):**
1. `game-canvas.component.spec.ts`
2. `game-canvas.component.game-over.spec.ts`
3. `game-hud.component.spec.ts`
4. `main-menu.component.spec.ts`
5. `settings-dialog.component.spec.ts`

**Total:** 18 empty test files to remove

**Action:** Delete these files to unblock test suite

---

## 📋 Step 2: Implement Phase 4 - UI Components (P35-P42)

### P35: Main Menu Component ⭐ **NEXT**

**Requirements:**
- Display game title/logo
- Start Game button → navigate to game
- High Scores button → open high scores component
- Settings button → open settings dialog
- Instructions button → open instructions dialog
- Material Design styled
- Responsive layout

**Dependencies:**
- ✅ ConfigService (already exists)
- ✅ Angular Material (already configured)
- ✅ Routing (already configured)

**Test Plan:**
1. Component renders correctly
2. All buttons present and labeled
3. Navigation works (Start Game → /game)
4. Dialogs open correctly (Settings, Instructions)
5. High Scores navigation works
6. Keyboard accessibility (Tab, Enter)
7. ARIA labels present

**Time Estimate:** 3-4 hours

---

### P36: Settings Dialog Component

**Requirements:**
- Modal dialog for game settings
- Sound toggle (on/off)
- Difficulty selection (Easy/Normal/Hard)
- Control scheme selection (Keyboard/Mouse)
- Save/Cancel buttons
- Persist settings to ConfigService

**Dependencies:**
- ⚠️ SettingsService (needs to be created)
- ✅ ConfigService (exists)
- ✅ Material Dialog (exists)

**Implementation Order:**
1. Create SettingsService with tests
2. Create settings-dialog component with tests
3. Integrate with ConfigService
4. Wire up to Main Menu

**Time Estimate:** 4-5 hours

---

### P37: High Scores Component

**Requirements:**
- Display top 10 high scores
- Show rank, player name, score, date
- Material table or list
- Loading state
- Empty state (no scores yet)
- Refresh button

**Dependencies:**
- ✅ HighScoreService (exists)
- ✅ Material Table/List (exists)

**Time Estimate:** 2-3 hours

---

### P38: Instructions Dialog Component

**Requirements:**
- Modal dialog with game instructions
- How to play (controls, objectives)
- Enemy types and point values
- Power-up explanations (if applicable)
- Close button
- Scrollable content

**Dependencies:**
- ✅ Material Dialog (exists)
- ✅ No service dependencies

**Time Estimate:** 2-3 hours

---

### P39: Game Over Screen Component

**Requirements:**
- Display final score
- Display high score comparison
- Player name input (if high score)
- Play Again button
- Return to Menu button
- Submit score to backend

**Dependencies:**
- ✅ HighScoreService (exists)
- ✅ GameStateService (exists)

**Time Estimate:** 3-4 hours

---

### P40: Pause Overlay Component

**Requirements:**
- Overlay on game canvas
- Semi-transparent background
- "PAUSED" message
- Resume button
- Quit to Menu button
- Keyboard support (P to resume, Escape to menu)

**Dependencies:**
- ✅ GameLoopService (pause exists)
- ✅ GameStateService (exists)

**Time Estimate:** 2-3 hours

---

### P41: Wave Indicator Component

**Requirements:**
- Display current wave/level number
- Animated transition between waves
- Brief display then fade out
- "Wave X Starting" message

**Dependencies:**
- ⚠️ WaveService (needs creation - but can stub for now)
- ✅ GameStateService (exists)

**Time Estimate:** 2-3 hours

---

### P42: Level Completion Screen

**Requirements:**
- Display level completion message
- Show statistics (enemies defeated, accuracy, bonus points)
- Continue to next level button
- Brief celebration animation

**Dependencies:**
- ⚠️ LevelService (needs creation - but can stub)
- ✅ GameStateService (exists)

**Time Estimate:** 3-4 hours

---

## 📊 Phase 4 Summary

**Total Prompts:** 8 (P35-P42)  
**Estimated Time:** 21-29 hours  
**Dependencies to Create:**
- SettingsService (for P36)
- Optional stubs: WaveService, LevelService (can defer)

**Deliverables:**
- Functional main menu
- Settings dialog (save preferences)
- High scores display
- Instructions screen
- Game over flow
- Pause overlay
- Wave transitions
- Level completion

**Result:** Fully navigable app with all UI screens, ready for game logic integration

---

## 🚀 Implementation Order

### Session 1: Foundation (4-5 hours)
1. ✅ Remove empty test files (30 min)
2. ✅ Create SettingsService with TDD (2-3 hours)
3. ✅ Implement P35: Main Menu Component (2 hours)

### Session 2: Dialogs (5-6 hours)
4. ✅ P36: Settings Dialog Component (2-3 hours)
5. ✅ P38: Instructions Dialog Component (2-3 hours)

### Session 3: Game Flow (6-7 hours)
6. ✅ P37: High Scores Component (2-3 hours)
7. ✅ P39: Game Over Screen Component (3-4 hours)

### Session 4: In-Game UI (4-5 hours)
8. ✅ P40: Pause Overlay Component (2-3 hours)
9. ✅ P41: Wave Indicator Component (2 hours)
10. ✅ P42: Level Completion Screen (3 hours)

**Total Time:** 19-23 hours over 4 sessions

---

## ✅ Success Criteria

After Phase 4 completion:
- ✅ All UI components implemented and tested
- ✅ 100% test coverage on new components
- ✅ Can navigate entire app (menu → game → game over → menu)
- ✅ Settings persist across sessions
- ✅ High scores display correctly
- ✅ All dialogs open/close properly
- ✅ Keyboard navigation works
- ✅ ARIA labels for accessibility
- ✅ No console errors
- ✅ Test suite passes (all new tests green)

**What Will Still Be Missing:**
- ❌ Actual gameplay (no player, enemies, collision)
- ❌ Score calculation during gameplay
- ❌ Lives system during gameplay
- ❌ Level progression logic

**Next Phase After P42:**
- Return to Phase 3 (P15-P23) to implement game logic
- Or continue to Phase 5+ if UI demo is sufficient

---

## 📝 Notes

**Why UI First:**
- Creates visible, demonstrable progress
- Easier to test than game physics
- Establishes navigation and flow
- Can show stakeholders "the app works"
- Game logic can be stubbed initially

**TDD Compliance:**
- All components will follow proper TDD
- Tests written before implementation
- 100% coverage maintained
- No violations of methodology

**Documentation:**
- Each prompt will have implementation summary
- COMPREHENSIVE_PROJECT_STATUS.md updated after each
- Test counts and coverage tracked

---

**Ready to Start:** ✅ Yes  
**First Task:** Remove empty test files  
**Then:** Implement P35 (Main Menu Component)
