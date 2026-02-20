### Prompt 4.4: Scoring System

```
Create comprehensive scoring system with combo tracking.

Requirements:
1. Create /src/app/core/services/score.service.ts with:
   - initScore(): ScoreState - initializes {score: 0, combo: 0, lastKillTime: 0}
   - addScore(scoreState, points, currentTime): ScoreState - adds points
   - calculateComboMultiplier(combo): number - returns multiplier (1x, 1.5x, 2x)
   - updateCombo(scoreState, currentTime, comboWindow): ScoreState - manages combo
   - resetCombo(scoreState): ScoreState - resets combo to 0
2. Combo system: killing enemies within 1 second maintains combo
3. Combo multiplier: 3+ combo = 1.5x, 5+ combo = 2x points
4. Combo resets if no kills for 1 second

TDD Approach:
- Create score.service.spec.ts:
  * initScore returns score 0 and combo 0
  * addScore increases score by points value
  * addScore increments combo counter
  * calculateComboMultiplier returns 1 for combo < 3
  * calculateComboMultiplier returns 1.5 for combo 3-4
  * calculateComboMultiplier returns 2 for combo >= 5
  * updateCombo maintains combo if within time window
  * updateCombo resets combo if exceeds time window
  * Score includes combo multiplier
- Implement score.service.ts with timing logic

Deliverable: Scoring system with combo multipliers
```
