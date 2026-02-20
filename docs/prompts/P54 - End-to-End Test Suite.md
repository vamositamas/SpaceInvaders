### Prompt 8.1: End-to-End Test Suite

```
Create comprehensive E2E tests using Cypress.

Requirements:
1. Set up Cypress: npm install cypress --save-dev
2. Configure Cypress for Angular app
3. Create test suites in /cypress/e2e:
   - complete-gameplay.cy.ts - full game playthrough
   - menu-navigation.cy.ts - all menu interactions
   - high-score-submission.cy.ts - score submission flow
   - settings-persistence.cy.ts - settings save/load
   - error-scenarios.cy.ts - error handling
4. Test critical user journeys end-to-end
5. Include visual regression tests

TDD Approach:
- Create complete-gameplay.cy.ts:
  * Visit homepage, verify menu loads
  * Click Start Game, verify game canvas appears
  * Verify player can move left/right
  * Verify player can shoot projectiles
  * Verify enemies move and shoot back
  * Verify hitting enemy increases score
  * Verify getting hit reduces lives
  * Play until game over or level complete
  * Verify game over screen appears
- Create menu-navigation.cy.ts:
  * Navigate to each menu option
  * Open and close all dialogs
  * Verify routing works correctly
- Create high-score-submission.cy.ts:
  * Complete game with high score
  * Submit name for high score
  * Verify score appears in high scores list
- Create settings-persistence.cy.ts:
  * Change settings in dialog
  * Save settings
  * Reload page
  * Verify settings persisted
- Create error-scenarios.cy.ts:
  * Test with backend offline
  * Test with network errors
  * Verify error messages display
- Run E2E tests in CI pipeline
- Implement all E2E test scenarios

Deliverable: Complete E2E test coverage for critical flows
```
