### Prompt 3.1: Enemy Entity Service

```
Create enemy entity management with different types and point values.

Requirements:
1. Create /src/app/core/services/enemy.service.ts with:
   - createEnemyGrid(rows, columns, canvasWidth): Enemy[] - creates full grid
   - getEnemyType(row): string - returns type based on row ('top', 'middle', 'bottom')
   - getPointValue(type): number - returns points (30, 20, or 10)
   - removeEnemy(enemies[], enemy): Enemy[] - removes specific enemy
   - getActiveEnemies(enemies[]): Enemy[] - filters active enemies
2. Enemy types: top row = 30pts, middle rows = 20pts, bottom rows = 10pts
3. Grid layout: 5 rows × 11 columns with spacing
4. Initial positioning centered on canvas

TDD Approach:
- Create enemy.service.spec.ts
- Write tests for:
  * createEnemyGrid returns 55 enemies (5×11)
  * Enemies positioned in correct grid formation
  * getEnemyType returns 'top' for row 0
  * getEnemyType returns 'middle' for rows 1-2
  * getEnemyType returns 'bottom' for rows 3-4
  * getPointValue returns correct points for each type
  * removeEnemy marks enemy as inactive
  * getActiveEnemies filters out inactive enemies
  * Grid is horizontally centered on canvas
- Implement enemy.service.ts
- Use consistent spacing between enemies

Deliverable: Enemy grid generation with types and scoring
```
