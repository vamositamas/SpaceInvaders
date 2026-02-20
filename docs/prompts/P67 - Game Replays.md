### Prompt 9.4: Game Replays

```
Add replay system to record and playback games (optional enhancement).

Requirements:
1. Create /src/app/core/services/replay.service.ts with:
   - startRecording(): void - begins recording inputs
   - recordInput(input, timestamp): void - saves input event
   - stopRecording(): Replay - finishes and returns replay data
   - playReplay(replay): void - plays back recorded game
   - saveReplay(replay, name): void - saves to backend
   - loadReplay(id): Replay - loads saved replay
2. Record game inputs and timestamps
3. Replay engine recreates gameplay exactly
4. Save replays of high scores automatically
5. Share replays with other players

TDD Approach:
- Create replay.service.spec.ts:
  * startRecording initializes replay buffer
  * recordInput saves input with timestamp
  * stopRecording returns complete replay data
  * playReplay recreates game state accurately
  * Replay matches original gameplay exactly
  * saveReplay persists to backend
  * loadReplay retrieves saved replay
- Implement deterministic replay system
- Test with various game scenarios
- Verify replay accuracy

Deliverable: Game replay recording and playback
```
