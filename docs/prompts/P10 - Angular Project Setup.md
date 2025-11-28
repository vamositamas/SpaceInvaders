### Prompt 2.1: Angular Project Setup

```
Create an Angular frontend project with Material Design and testing setup.

Requirements:
1. Generate new Angular project: ng new space-invaders-client --routing --style=scss
2. Install Angular Material: ng add @angular/material (choose theme)
3. Create folder structure in /src/app:
   - /core (services, models, guards)
   - /features (game, menu, game-over)
   - /shared (components, pipes, utils)
4. Configure proxy for API: create proxy.conf.json pointing /api to http://localhost:3000
5. Update angular.json to use proxy in serve configuration
6. Install testing dependencies: ensure Jasmine and Karma are configured
7. Create app routing with lazy-loaded feature modules

TDD Approach:
- Create app.component.spec.ts test that verifies component creates successfully
- Run ng test (should pass basic test)
- Create core.module.ts and shared.module.ts
- Generate feature modules: ng generate module features/game --route game --module app.module
- Verify routing works with a simple test
- Set up Material theme in styles.scss

Deliverable: Angular project structure with Material Design and routing
```