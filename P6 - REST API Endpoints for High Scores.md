
```REST API Endpoints for High Scores

Create Express REST API endpoints for high score management.

Requirements:
1. Create /src/routes/highscore.routes.js with routes:
   - GET /api/highscores?limit=10 - get top scores with pagination
   - POST /api/highscores - submit new high score
   - GET /api/highscores/:id - get specific score
   - DELETE /api/highscores/:id - delete score
2. Create /src/controllers/highscore.controller.js with handlers
3. Add validation middleware for POST requests
4. Update server.js to use highscore.routes

TDD Approach:
- Create /tests/integration/highscore.routes.test.js
- Write tests for:
  * GET /api/highscores returns array of scores
  * GET /api/highscores?limit=5 returns max 5 scores
  * POST /api/highscores with valid data returns 201 and created score
  * POST /api/highscores with invalid data returns 400
  * GET /api/highscores/:id returns specific score or 404
  * DELETE /api/highscores/:id returns 204 on success
- Implement controller methods using highscore.service
- Wire routes in server.js
- Verify all tests pass

Deliverable: Complete high score REST API with CRUD operations