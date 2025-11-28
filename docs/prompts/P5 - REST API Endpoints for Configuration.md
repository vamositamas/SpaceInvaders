Create Express REST API endpoints for game configuration.

Requirements:
1. Create /src/routes/config.routes.js with routes:
   - GET /api/config - returns current configuration
   - PUT /api/config - updates configuration (validate input)
   - POST /api/config/reset - resets to default
2. Create /src/controllers/config.controller.js with handler functions
3. Create /src/middleware/validation.js for request validation
4. Update server.js to use config.routes with express.json() middleware
5. Add proper error handling middleware

TDD Approach:
- Create /tests/integration/config.routes.test.js
- Write tests using supertest:
  * GET /api/config returns 200 with config object
  * PUT /api/config with valid data returns 200 and updated config
  * PUT /api/config with invalid data returns 400 error
  * POST /api/config/reset returns 200 and default config
  * Routes return proper JSON content-type
- Implement routes, controller, and validation
- Wire everything in server.js
- Make all tests pass

Deliverable: Working config API endpoints with validation