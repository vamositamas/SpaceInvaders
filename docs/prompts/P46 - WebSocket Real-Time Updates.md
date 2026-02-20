### Prompt 6.5: WebSocket Real-Time Updates

```
Implement WebSocket connection for real-time game state synchronization.

Requirements:
1. Create /src/websocket/game-room.js (backend) with:
   - joinRoom(socketId, playerId): void - adds player to room
   - leaveRoom(socketId): void - removes player
   - broadcastGameState(roomId, state): void - sends state to all
   - handlePlayerInput(socketId, input): void - processes input
2. Update server.js to initialize Socket.io
3. Create /src/app/core/services/websocket.service.ts (frontend) with:
   - connect(): Observable<boolean> - establishes connection
   - disconnect(): void - closes connection
   - sendInput(input): void - sends player input
   - onGameUpdate(): Observable<GameState> - receives state updates
4. Handle connection drops and reconnection

TDD Approach:
- Create game-room.test.js:
  * joinRoom adds socket to room
  * leaveRoom removes socket
  * broadcastGameState emits to all room members
  * handlePlayerInput processes input data
- Create websocket.service.spec.ts:
  * connect establishes socket connection
  * disconnect closes connection properly
  * sendInput emits data to server
  * onGameUpdate receives state updates
  * Reconnection attempted on disconnect
  * Connection status observable updates
- Mock socket.io for testing
- Implement WebSocket handling

Deliverable: Real-time WebSocket communication
```
