import { Inject, Injectable, NgZone } from '@angular/core';
import { Platform } from '../../../utils/platform';
import { io, Socket } from 'socket.io-client';
import { SOCKET_CONNECTION_URI } from '../../../tokens/socket-connection-uri';

/** Socket service */
@Injectable({
  providedIn: 'root',
})
export class SocketService {
  /** Map of listeners by event name. The key is `eventName` */
  private _listenersMap: Map<string, (payload: any) => void> = new Map();

  /** Socket client */
  private _socket?: Socket;

  constructor(
    @Inject(SOCKET_CONNECTION_URI) private readonly _uri: string,
    private readonly _ngZone: NgZone,
  ) {
    if (Platform.isBrowser) {
      this._ngZone.runOutsideAngular(() => {
        this._socket = io(this._uri, {
          closeOnBeforeunload: true,
          autoConnect: true,
        });
      });
    }
  }

  /**
   * Start listening for `eventName`.
   * @param eventName - Event name.
   * @param listener - Listener to be called on event triggered.
   */
  on(eventName: string, listener: (...payload: any) => void): void {
    if (Platform.isBrowser) {
      // Switch on event.
      this._socket?.on(eventName, listener);

      // Add to map.
      this._listenersMap.set(eventName, listener);
    }
  }

  /**
   * Stop listening for `eventName`.
   * @param eventName - Event name.
   */
  off(eventName: string): void {
    if (Platform.isBrowser) {
      // Switch off event.
      this._socket?.off(eventName, this._listenersMap.get(eventName));

      // Remove from map.
      this._listenersMap.delete(eventName);
    }
  }

  /**
   * Emit event to server.
   * @param eventName - Event name.
   * @param payload - Any payload to pass.
   */
  emit(eventName: string, ...payload: any): void {
    if (Platform.isBrowser) {
      this._socket?.emit(eventName, ...payload);
    }
  }
}
