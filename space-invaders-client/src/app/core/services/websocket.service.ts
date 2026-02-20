/**
 * WebSocketService — real-time communication with the backend via Socket.io.
 *
 * The service is built around an injectable socket factory token so the
 * socket can be replaced with a mock in unit tests.
 *
 * Usage:
 *   webSocketService.connect().subscribe(connected => { ... });
 *   webSocketService.sendInput({ key: 'ArrowLeft' });
 *   webSocketService.onGameUpdate().subscribe(state => { ... });
 *   webSocketService.onLeaderboardUpdate().subscribe(scores => { ... });
 *   webSocketService.disconnect();
 */

import { Injectable, InjectionToken, inject } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { io, Socket } from 'socket.io-client';
import { environment } from '../../../environments/environment';

// ── Injection token ──────────────────────────────────────────────────────────

/**
 * Factory that creates a Socket.io client instance.
 * Override this token in tests to inject a mock socket.
 */
export const SOCKET_FACTORY_TOKEN = new InjectionToken<() => Socket>(
  'SocketFactory',
  {
    factory: () => () =>
      io((environment as any).wsUrl ?? 'http://localhost:3000', {
        autoConnect: false,
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
      }),
  }
);

// ── Service ──────────────────────────────────────────────────────────────────

@Injectable({ providedIn: 'root' })
export class WebSocketService {
  private socket: Socket | null = null;
  private readonly connected$ = new BehaviorSubject<boolean>(false);
  private readonly socketFactory = inject(SOCKET_FACTORY_TOKEN);

  /** Observable of the current connection state. */
  get isConnected$(): Observable<boolean> {
    return this.connected$.asObservable();
  }

  /**
   * Establish a Socket.io connection and return the connection state observable.
   * Calling this while already connected returns the existing observable.
   */
  connect(): Observable<boolean> {
    if (this.socket?.connected) {
      return this.connected$.asObservable();
    }

    this.socket = this.socketFactory();

    this.socket.on('connect', () => this.connected$.next(true));
    this.socket.on('disconnect', () => this.connected$.next(false));
    this.socket.on('reconnect_failed', () => this.connected$.next(false));

    this.socket.connect();

    return this.connected$.asObservable();
  }

  /**
   * Close the connection and clean up internal state.
   */
  disconnect(): void {
    this.socket?.disconnect();
    this.socket = null;
    this.connected$.next(false);
  }

  /**
   * Emit a player input event to the server.
   * No-op if the socket has not been created yet.
   * @param input  Arbitrary input payload
   */
  sendInput(input: unknown): void {
    this.socket?.emit('playerInput', input);
  }

  /**
   * Observable of game state updates pushed by the server.
   * Subscribe after calling connect().
   */
  onGameUpdate(): Observable<unknown> {
    return new Observable((observer) => {
      this.socket?.on('gameUpdate', (data: unknown) => observer.next(data));
    });
  }

  /**
   * Observable of leaderboard (high-score list) updates pushed by the server.
   * Subscribe after calling connect().
   */
  onLeaderboardUpdate(): Observable<unknown> {
    return new Observable((observer) => {
      this.socket?.on('leaderboardUpdate', (data: unknown) => observer.next(data));
    });
  }
}
