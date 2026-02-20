# P35 Implementation Plan - Main Menu Component

**Date:** February 13, 2026  
**Prompt:** P35 - Main Menu Component  
**Approach:** Test-Driven Development (TDD)

---

## 🎯 Objective

Create a main menu component that serves as the entry point to the application with navigation to all major screens.

---

## 📋 Requirements

### Functional Requirements
1. Display game title/logo
2. "Start Game" button → navigate to /game
3. "High Scores" button → navigate to /high-scores
4. "Settings" button → open settings dialog
5. "Instructions" button → open instructions dialog
6. Responsive layout (mobile, tablet, desktop)
7. Material Design styling

### Non-Functional Requirements
1. Keyboard navigation (Tab, Enter)
2. ARIA labels for accessibility
3. Loading state while fetching config
4. Error handling for API failures
5. Smooth animations/transitions

---

## 🧪 TDD Test Plan

### Test Suite: MainMenuComponent

```typescript
describe('MainMenuComponent', () => {
  // Rendering Tests
  it('should create the component')
  it('should display game title')
  it('should render all navigation buttons')
  
  // Navigation Tests
  it('should navigate to /game when Start Game clicked')
  it('should navigate to /high-scores when High Scores clicked')
  
  // Dialog Tests
  it('should open settings dialog when Settings clicked')
  it('should open instructions dialog when Instructions clicked')
  
  // Accessibility Tests
  it('should have proper ARIA labels on all buttons')
  it('should support keyboard navigation (Tab)')
  it('should activate button on Enter key')
  
  // State Tests
  it('should show loading state while initializing')
  it('should handle configuration load errors gracefully')
  
  // Styling Tests
  it('should apply Material Design classes')
  it('should be responsive (mobile/desktop)')
});
```

**Estimated Tests:** 14

---

## 🏗️ Implementation Steps

### Step 1: Create Test File (RED Phase)
**File:** `/src/app/features/menu/main-menu.component.spec.ts`
- Write all 14 tests
- All tests should fail (component doesn't exist yet)
- **Time:** 1 hour

### Step 2: Create Component Skeleton (GREEN Phase)
**Files:**
- `/src/app/features/menu/main-menu.component.ts`
- `/src/app/features/menu/main-menu.component.html`
- `/src/app/features/menu/main-menu.component.scss`

**Implementation:**
- Minimal code to make tests pass
- Stub methods for navigation
- Basic template with buttons
- **Time:** 1 hour

### Step 3: Implement Full Functionality (GREEN Phase)
- Wire up Angular Router for navigation
- Integrate Material Dialog for settings/instructions
- Add loading states
- Implement error handling
- **Time:** 1.5 hours

### Step 4: Refactor (REFACTOR Phase)
- Extract constants
- Improve code readability
- Optimize imports
- Add JSDoc comments
- **Time:** 30 minutes

### Step 5: Documentation
- Create P35_IMPLEMENTATION_SUMMARY.md
- Update COMPREHENSIVE_PROJECT_STATUS.md
- Document any issues/decisions
- **Time:** 30 minutes

**Total Time:** 4.5 hours

---

## 📦 Dependencies

### Required (Already Exist)
- ✅ Angular Router (configured)
- ✅ Angular Material (installed)
- ✅ MatButtonModule
- ✅ MatDialogModule
- ✅ MatCardModule
- ✅ ConfigService (for app initialization)

### To Be Created (Later)
- ⏳ SettingsDialogComponent (P36)
- ⏳ InstructionsDialogComponent (P38)

**Note:** For P35, we'll create placeholder/stub dialogs that can be enhanced in P36/P38.

---

## 🎨 UI Design

### Layout Structure
```
┌────────────────────────────────────┐
│                                    │
│         SPACE INVADERS             │
│                                    │
│    ┌────────────────────┐         │
│    │    START GAME      │         │
│    └────────────────────┘         │
│                                    │
│    ┌────────────────────┐         │
│    │   HIGH SCORES      │         │
│    └────────────────────┘         │
│                                    │
│    ┌────────────────────┐         │
│    │    SETTINGS        │         │
│    └────────────────────┘         │
│                                    │
│    ┌────────────────────┐         │
│    │   INSTRUCTIONS     │         │
│    └────────────────────┘         │
│                                    │
└────────────────────────────────────┘
```

### Responsive Breakpoints
- **Mobile (< 600px):** Full-width buttons, title smaller
- **Tablet (600-960px):** Centered buttons, medium title
- **Desktop (> 960px):** Centered buttons, large title

---

## ✅ Acceptance Criteria

- [ ] Component renders without errors
- [ ] All 14 tests pass
- [ ] 100% code coverage
- [ ] Start Game navigates to /game route
- [ ] High Scores navigates to /high-scores route
- [ ] Settings button opens dialog (placeholder OK)
- [ ] Instructions button opens dialog (placeholder OK)
- [ ] ARIA labels present on all interactive elements
- [ ] Keyboard navigation works (Tab, Enter)
- [ ] Loading state displays while initializing
- [ ] Error state handles API failures
- [ ] Responsive layout works on mobile/desktop
- [ ] No console errors
- [ ] Material Design styling applied
- [ ] Documentation complete

---

## 🚀 Next Steps After P35

1. **P36:** Settings Dialog Component (full implementation)
2. **P38:** Instructions Dialog Component (full implementation)
3. **P37:** High Scores Component (list view)
4. Continue with remaining Phase 4 components

---

**Ready to Implement:** ✅ Yes  
**TDD Approach:** RED → GREEN → REFACTOR → DOCUMENT  
**Estimated Completion:** 4.5 hours
