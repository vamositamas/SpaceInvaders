### Prompt 9.3: Achievement System

```
Add achievement/trophy system with unlockables (optional enhancement).

Requirements:
1. Create /src/app/core/services/achievement.service.ts with:
   - defineAchievements(): Achievement[] - creates achievement list
   - checkAchievement(id, gameState): boolean - checks if unlocked
   - unlockAchievement(playerId, id): void - unlocks achievement
   - getPlayerAchievements(playerId): Achievement[] - retrieves unlocked
2. Achievement types:
   - Score milestones (10K, 50K, 100K points)
   - Accuracy achievements (90%+ hit rate)
   - Survival achievements (no hits for full level)
   - Speed achievements (complete level in under 2 mins)
   - Combo achievements (10+ combo)
3. Display achievements in player profile
4. Show notification when achievement unlocked
5. Track progress toward achievements

TDD Approach:
- Create achievement.service.spec.ts:
  * defineAchievements returns all achievements
  * checkAchievement detects when conditions met
  * unlockAchievement persists to backend
  * getPlayerAchievements retrieves correct list
  * Achievement progress tracked correctly
  * Notifications trigger on unlock
  * Duplicate unlocks prevented
- Implement achievement system
- Create achievement UI component
- Add backend persistence

Deliverable: Achievement system with tracking
```
