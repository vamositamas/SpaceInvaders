import { test, expect } from '@playwright/test';

test.describe('Space Invaders E2E Gameplay & Navigation', () => {

  test.beforeEach(async ({ page }) => {
    // Print browser console logs and page errors to terminal stdout
    page.on('console', msg => console.log('BROWSER CONSOLE:', msg.type(), msg.text()));
    page.on('pageerror', err => console.log('BROWSER PAGEERROR:', err.message));

    // Log all network requests going through Playwright
    await page.route('**/*', async route => {
      console.log('E2E REQUEST:', route.request().method(), route.request().url());
      await route.fallback();
    });

    // Intercept config API
    await page.route(/\/api\/config/, async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          canvas: { width: 800, height: 600 },
          player: { speed: 5, fireRate: 500, lives: 3 },
          enemies: { rows: 5, columns: 11, baseSpeed: 1, speedIncrement: 0.1, fireRate: 2000 },
          difficulty: {
            easy: { speedMultiplier: 0.75, fireRateMultiplier: 1.5 },
            normal: { speedMultiplier: 1.0, fireRateMultiplier: 1.0 },
            hard: { speedMultiplier: 1.5, fireRateMultiplier: 0.5 }
          }
        })
      });
    });

    // Intercept settings API
    await page.route(/\/api\/settings/, async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          soundEnabled: true,
          musicEnabled: false,
          volume: 50,
          difficulty: 'NORMAL',
          controlScheme: 'KEYBOARD'
        })
      });
    });

    // Intercept highscores API (GET and POST unified)
    await page.route(/\/api\/highscores/, async route => {
      if (route.request().method() === 'POST') {
        const postData = route.request().postDataJSON();
        expect(postData.playerName).toBe('E2EPLAY');
        await route.fulfill({
          status: 201,
          contentType: 'application/json',
          body: JSON.stringify({
            id: '3',
            playerName: postData.playerName,
            score: postData.score || 1200,
            level: postData.level || 2,
            date: new Date().toISOString()
          })
        });
      } else {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify([
            { id: '1', playerName: 'LEGEND', score: 9999, level: 10, date: new Date().toISOString() },
            { id: '2', playerName: 'HERO', score: 5000, level: 5, date: new Date().toISOString() }
          ])
        });
      }
    });
  });

  test('should load main menu, verify title, and navigate pages', async ({ page }) => {
    // 1. Load the main menu
    await page.goto('/');
    
    // Verify title is visible
    const title = page.locator('h1.game-title');
    await expect(title).toBeVisible();
    await expect(title).toHaveText('SPACE INVADERS');

    // 2. Navigate to High Scores page
    const highScoresBtn = page.locator('button:has-text("HIGH SCORES")');
    await expect(highScoresBtn).toBeVisible();
    await highScoresBtn.click();

    // Verify we are on the high scores page
    await expect(page).toHaveURL(/\/high-scores/);
    const scoreTitle = page.locator('h1:has-text("High Scores")');
    await expect(scoreTitle).toBeVisible();

    // Verify custom mocked score exists in table
    const legendRow = page.locator('td.player-cell:has-text("LEGEND")');
    await expect(legendRow).toBeVisible();

    // Go back to main menu
    const backBtn = page.locator('button[aria-label="Back to main menu"]');
    await expect(backBtn).toBeVisible();
    await backBtn.click();
    await expect(page).toHaveURL(/\/menu|$/);
  });

  test('should start the game and run gameplay loop actions', async ({ page }) => {
    await page.goto('/');
    
    // Click start game button
    const startBtn = page.locator('button:has-text("START GAME")');
    await startBtn.click();

    // Verify navigation to /game
    await expect(page).toHaveURL(/\/game/);

    // Verify game board canvas exists
    const canvas = page.locator('canvas').first();
    await expect(canvas).toBeVisible();

    // Click the canvas to transfer focus to it
    await canvas.click();

    // Simulate key presses to move and shoot
    await page.keyboard.press('ArrowRight');
    await page.keyboard.press('ArrowLeft');
    await page.keyboard.press('Space');
    
    // Pause the game (simulating realistic duration press so game loop registers it)
    await page.keyboard.down('p');
    await page.waitForTimeout(100);
    await page.keyboard.up('p');
    
    // Verify paused overlay appears
    const pauseOverlay = page.locator('.pause-overlay');
    await expect(pauseOverlay).toBeVisible();

    // Resume the game by clicking Resume button
    const resumeBtn = page.locator('button.resume-btn');
    await expect(resumeBtn).toBeVisible();
    await resumeBtn.click();

    // Verify paused overlay is hidden
    await expect(pauseOverlay).not.toBeVisible();
  });

  test('should handle game over score submission flow', async ({ page }) => {
    // Navigate to game-over screen directly
    await page.goto('/game-over');
    await expect(page.locator('h1.game-over-title')).toBeVisible();

    // Fill in the player name
    const nameInput = page.locator('input[formControlName="playerName"]');
    await expect(nameInput).toBeVisible();
    await nameInput.fill('E2EPLAY');

    // Click submit
    const submitBtn = page.locator('button.submit-btn');
    await expect(submitBtn).toBeEnabled();
    await submitBtn.click();

    // Verify redirect to main menu
    await expect(page).toHaveURL(/\/menu|$/);
    await expect(page.locator('h1.game-title')).toBeVisible();
  });
});
