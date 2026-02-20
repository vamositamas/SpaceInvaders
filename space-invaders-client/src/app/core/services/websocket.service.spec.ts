import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { EMPTY, firstValueFrom, take } from 'rxjs';
import { WebSocketService, SOCKET_FACTORY_TOKEN } from './websocket.service';

describe('WebSocketService', () => {
  let service: WebSocketService;

  // Collected event handlers so tests can trigger socket events
  const eventHandlers: Record<string, Function> = {};
  const mockSocket = {
    on: jasmine.createSpy('on').and.callFake((event: string, cb: Function) => {
      eventHandlers[event] = cb;
    }),
    emit: jasmine.createSpy('emit'),
    connect: jasmine.createSpy('connect'),
    disconnect: jasmine.createSpy('disconnect'),
    connected: false,
  };
  const mockSocketFactory = jasmine.createSpy('socketFactory').and.returnValue(mockSocket);

  beforeEach(() => {
    // Reset spies and state between tests
    Object.keys(eventHandlers).forEach(k => delete eventHandlers[k]);
    mockSocket.on.calls.reset();
    mockSocket.emit.calls.reset();
    mockSocket.connect.calls.reset();
    mockSocket.disconnect.calls.reset();
    mockSocket.connected = false;
    mockSocketFactory.calls.reset();

    TestBed.configureTestingModule({
      providers: [
        WebSocketService,
        { provide: SOCKET_FACTORY_TOKEN, useValue: mockSocketFactory },
        provideZonelessChangeDetection(),
      ],
    });

    service = TestBed.inject(WebSocketService);
  });

  afterEach(() => {
    service.disconnect();
  });

  // ── connect ───────────────────────────────────────────────────────────────

  describe('connect', () => {
    it('should return an observable', () => {
      const obs = service.connect();
      expect(obs).toBeDefined();
      expect(typeof obs.subscribe).toBe('function');
    });

    it('should call the socket factory to create a socket', () => {
      service.connect();
      expect(mockSocketFactory).toHaveBeenCalledTimes(1);
    });

    it('should call socket.connect()', () => {
      service.connect();
      expect(mockSocket.connect).toHaveBeenCalled();
    });

    it('should not create a second socket when already connected', () => {
      mockSocket.connected = true;
      service.connect();
      service.connect();
      expect(mockSocketFactory).toHaveBeenCalledTimes(1);
    });

    it('should register connect and disconnect handlers on the socket', () => {
      service.connect();
      expect(mockSocket.on).toHaveBeenCalledWith('connect', jasmine.any(Function));
      expect(mockSocket.on).toHaveBeenCalledWith('disconnect', jasmine.any(Function));
    });
  });

  // ── connection status observable ──────────────────────────────────────────

  describe('isConnected$', () => {
    it('should initially emit false', (done) => {
      service.isConnected$.pipe(take(1)).subscribe((connected) => {
        expect(connected).toBe(false);
        done();
      });
    });

    it('should emit true when socket fires connect event', (done) => {
      service.connect();
      let emissionCount = 0;
      service.isConnected$.subscribe((connected) => {
        emissionCount++;
        if (emissionCount === 2) {
          expect(connected).toBe(true);
          done();
        }
      });
      eventHandlers['connect']?.();
    });

    it('should emit false when socket fires disconnect event', (done) => {
      service.connect();
      eventHandlers['connect']?.(); // simulate connect first
      let emissionCount = 0;
      service.isConnected$.subscribe((connected) => {
        emissionCount++;
        if (emissionCount === 2) {
          expect(connected).toBe(false);
          done();
        }
      });
      eventHandlers['disconnect']?.();
    });
  });

  // ── disconnect ────────────────────────────────────────────────────────────

  describe('disconnect', () => {
    it('should call socket.disconnect()', () => {
      service.connect();
      service.disconnect();
      expect(mockSocket.disconnect).toHaveBeenCalled();
    });

    it('should set isConnected$ to false', (done) => {
      service.connect();
      eventHandlers['connect']?.();
      service.disconnect();
      service.isConnected$.pipe(take(1)).subscribe((connected) => {
        expect(connected).toBe(false);
        done();
      });
    });

    it('should be safe to call when not connected', () => {
      expect(() => service.disconnect()).not.toThrow();
    });
  });

  // ── sendInput ─────────────────────────────────────────────────────────────

  describe('sendInput', () => {
    it('should emit playerInput event on the socket', () => {
      service.connect();
      service.sendInput({ key: 'ArrowLeft' });
      expect(mockSocket.emit).toHaveBeenCalledWith('playerInput', { key: 'ArrowLeft' });
    });

    it('should not throw when socket is not connected', () => {
      expect(() => service.sendInput({ key: 'Space' })).not.toThrow();
    });
  });

  // ── onGameUpdate ──────────────────────────────────────────────────────────

  describe('onGameUpdate', () => {
    it('should return an observable', () => {
      service.connect();
      const obs = service.onGameUpdate();
      expect(obs).toBeDefined();
      expect(typeof obs.subscribe).toBe('function');
    });

    it('should register gameUpdate handler on the socket', () => {
      service.connect();
      service.onGameUpdate().subscribe();
      expect(mockSocket.on).toHaveBeenCalledWith('gameUpdate', jasmine.any(Function));
    });

    it('should emit game state when socket fires gameUpdate', (done) => {
      service.connect();
      const mockState = { score: 500, level: 2 };
      service.onGameUpdate().subscribe((state) => {
        expect(state).toEqual(mockState);
        done();
      });
      eventHandlers['gameUpdate']?.(mockState);
    });
  });

  // ── onLeaderboardUpdate ───────────────────────────────────────────────────

  describe('onLeaderboardUpdate', () => {
    it('should return an observable', () => {
      service.connect();
      const obs = service.onLeaderboardUpdate();
      expect(obs).toBeDefined();
    });

    it('should emit when socket fires leaderboardUpdate', (done) => {
      service.connect();
      const mockScores = [{ playerName: 'Alice', score: 1000 }];
      service.onLeaderboardUpdate().subscribe((scores) => {
        expect(scores).toEqual(mockScores);
        done();
      });
      eventHandlers['leaderboardUpdate']?.(mockScores);
    });
  });

  // ── reconnection ──────────────────────────────────────────────────────────

  describe('reconnection', () => {
    it('should re-emit false on reconnect_failed event', (done) => {
      service.connect();
      let count = 0;
      service.isConnected$.subscribe((connected) => {
        count++;
        if (count === 2) {
          expect(connected).toBe(false);
          done();
        }
      });
      eventHandlers['reconnect_failed']?.();
    });

    it('should register reconnect_failed handler', () => {
      service.connect();
      expect(mockSocket.on).toHaveBeenCalledWith('reconnect_failed', jasmine.any(Function));
    });
  });
});
