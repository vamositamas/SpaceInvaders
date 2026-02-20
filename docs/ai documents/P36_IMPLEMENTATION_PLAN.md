# P36 Implementation Plan - Settings Dialog Component

**Date:** February 13, 2026  
**Prompt:** P36 - Settings Dialog Component  
**Approach:** Test-Driven Development (TDD)

---

## 🎯 Objective

Create a settings dialog component that allows users to configure game preferences (sound, difficulty, controls) and persist them.

---

## 📋 Requirements

### Functional Requirements
1. **Sound Settings**
   - Toggle sound on/off
   - Toggle music on/off
   - Volume slider (0-100)

2. **Difficulty Settings**
   - Easy, Normal, Hard radio buttons
   - Affects enemy speed and fire rate

3. **Control Settings**
   - Keyboard vs Mouse radio buttons
   - Show control mappings

4. **Dialog Actions**
   - Save button → persist settings and close
   - Cancel button → discard changes and close
   - Reset to Defaults button

5. **Persistence**
   - Save settings to backend via ConfigService
   - Load current settings on open
   - Apply settings immediately on save

### Non-Functional Requirements
1. Material Dialog with proper styling
2. Form validation
3. Keyboard shortcuts (Escape to cancel, Enter to save)
4. Responsive layout
5. Accessibility (ARIA labels)
6. Loading state while saving

---

## 🧪 TDD Test Plan

### Test Suite 1: SettingsService (20 tests)

```typescript
describe('SettingsService', () => {
  // State Management Tests
  it('should create the service')
  it('should initialize with default settings')
  it('should load settings from ConfigService')
  
  // Sound Settings Tests
  it('should toggle sound on/off')
  it('should toggle music on/off')
  it('should set volume (0-100)')
  it('should clamp volume to valid range')
  
  // Difficulty Settings Tests
  it('should set difficulty to Easy')
  it('should set difficulty to Normal')
  it('should set difficulty to Hard')
  it('should emit settings changes')
  
  // Control Settings Tests
  it('should set control scheme to Keyboard')
  it('should set control scheme to Mouse')
  
  // Persistence Tests
  it('should save settings to ConfigService')
  it('should load settings from ConfigService on init')
  it('should reset to default settings')
  it('should handle save errors gracefully')
  
  // Observable Tests
  it('should expose settings as observable')
  it('should emit current settings on subscription')
  it('should update subscribers when settings change')
});
```

### Test Suite 2: SettingsDialogComponent (18 tests)

```typescript
describe('SettingsDialogComponent', () => {
  // Rendering Tests
  it('should create the component')
  it('should display current settings')
  it('should render all form controls')
  
  // Form Tests
  it('should populate form with current settings')
  it('should validate volume range (0-100)')
  it('should mark form as invalid if validation fails')
  it('should enable Save button when form is valid')
  it('should disable Save button when form is invalid')
  
  // Sound Settings Tests
  it('should toggle sound checkbox')
  it('should toggle music checkbox')
  it('should update volume slider')
  
  // Difficulty Tests
  it('should select difficulty radio button')
  
  // Controls Tests
  it('should select control scheme radio button')
  
  // Actions Tests
  it('should save settings and close dialog on Save')
  it('should close dialog without saving on Cancel')
  it('should reset to defaults on Reset button')
  it('should show loading state while saving')
  it('should handle save errors with error message')
});
```

**Total Tests:** 38 (20 service + 18 component)

---

## 🏗️ Implementation Steps

### Step 1: Create SettingsService (RED → GREEN → REFACTOR)

**File:** `/src/app/core/services/settings.service.ts`

**Time:** 3 hours
- Write 20 tests
- Implement service
- Test coverage 100%

### Step 2: Create SettingsDialogComponent (RED → GREEN → REFACTOR)

**Files:**
- `/src/app/features/menu/settings-dialog.component.ts`
- `/src/app/features/menu/settings-dialog.component.html`
- `/src/app/features/menu/settings-dialog.component.scss`
- `/src/app/features/menu/settings-dialog.component.spec.ts`

**Time:** 2 hours
- Write 18 tests
- Implement component with Material Dialog
- Create form with ReactiveFormsModule
- Style with Material theme

### Step 3: Update MainMenuComponent

**File:** `/src/app/features/menu/main-menu.component.ts`

**Time:** 30 minutes
- Replace placeholder dialog with real SettingsDialogComponent
- Update tests

### Step 4: Refactor & Document

**Time:** 30 minutes
- Code review and cleanup
- Add JSDoc comments
- Create implementation summary
- Update COMPREHENSIVE_PROJECT_STATUS.md

**Total Time:** 6 hours

---

## 📦 Dependencies

### Required (Already Exist)
- ✅ ConfigService (for persistence)
- ✅ Angular Material (MatDialog, MatFormField, etc.)
- ✅ ReactiveFormsModule (for forms)

### To Create
- ⚠️ SettingsService (new)
- ⚠️ Settings interface/model (new)

---

## 🎨 UI Design

### Dialog Layout
```
┌─────────────────────────────────────┐
│  Settings                      [X]  │
├─────────────────────────────────────┤
│                                     │
│  Sound & Music                      │
│  ☑ Sound Effects                    │
│  ☑ Background Music                 │
│  Volume: [========>-----] 75%       │
│                                     │
│  Difficulty                         │
│  ○ Easy   ⦿ Normal   ○ Hard         │
│                                     │
│  Controls                           │
│  ⦿ Keyboard   ○ Mouse               │
│                                     │
├─────────────────────────────────────┤
│  [Reset]      [Cancel]  [Save]     │
└─────────────────────────────────────┘
```

---

## ✅ Acceptance Criteria

- [ ] SettingsService created with 20 tests passing
- [ ] SettingsDialogComponent created with 18 tests passing
- [ ] 100% code coverage
- [ ] Sound toggle works
- [ ] Music toggle works
- [ ] Volume slider works (0-100 range)
- [ ] Difficulty selection works
- [ ] Control scheme selection works
- [ ] Save button persists settings
- [ ] Cancel button discards changes
- [ ] Reset button restores defaults
- [ ] Form validation works
- [ ] Loading state displays while saving
- [ ] Error handling for save failures
- [ ] Keyboard shortcuts work (Escape, Enter)
- [ ] Accessible (ARIA labels)
- [ ] Material Design styled
- [ ] Replaces placeholder from P35
- [ ] Documentation complete

---

**Ready to Implement:** ✅ Yes  
**TDD Approach:** RED → GREEN → REFACTOR → DOCUMENT  
**Estimated Completion:** 6 hours
