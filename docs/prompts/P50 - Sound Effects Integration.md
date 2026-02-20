### Prompt 7.3: Sound Effects Integration

```
Add sound effects and music to game (optional but recommended).

Requirements:
1. Create /src/app/core/services/audio.service.ts with:
   - loadSound(name: string, url: string): void - preloads audio
   - playSound(name: string, volume?: number): void - plays effect
   - playMusic(url: string, loop: boolean): void - plays background music
   - stopMusic(): void - stops background music
   - setVolume(soundVolume, musicVolume): void - adjusts levels
2. Add sound effects for:
   - Player shoot
   - Enemy shoot
   - Enemy destroyed
   - Player hit
   - Level complete
   - Game over
3. Respect settings from settings dialog
4. Use Web Audio API for better performance

TDD Approach:
- Create audio.service.spec.ts:
  * loadSound preloads audio file
  * playSound plays loaded sound
  * playSound respects volume setting
  * playMusic starts looping background track
  * stopMusic stops music playback
  * setVolume adjusts all audio levels
  * Sounds only play if volume > 0
- Mock Web Audio API
- Implement audio service
- Add sound calls at appropriate game events

Deliverable: Game with sound effects and music
```
