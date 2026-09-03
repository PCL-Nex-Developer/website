import { AbstractWebSocketClient } from '../core/abstract-websocket';
import type { Archon } from '../modules/archon/types';
type WSEventMap = {
    [K in Archon.Websocket.v0.WSEvent as `${string}:${K['event']}`]: K;
};
export declare class GenericWebSocketClient extends AbstractWebSocketClient {
    protected emitter: import("mitt").Emitter<WSEventMap>;
    connect(serverId: string, auth: Archon.Websocket.v0.WSAuth): Promise<void>;
    disconnect(serverId: string): void;
    private closeConnection;
    disconnectAll(): void;
    send(serverId: string, message: Archon.Websocket.v0.WSOutgoingMessage): void;
    private scheduleReconnect;
    private handleAuthExpiring;
}
export {};
