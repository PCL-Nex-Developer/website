import { AbstractSyncClient, type SyncConnectOptions, type SyncEmitterEvents } from '../core/abstract-sync';
export declare class GenericSyncClient extends AbstractSyncClient {
    protected emitter: import("mitt").Emitter<SyncEmitterEvents>;
    safeConnectServer(serverId: string, options?: SyncConnectOptions): Promise<void>;
    disconnect(serverId: string): void;
    disconnectAll(): void;
    private runConnection;
    private consumeStream;
    private processParsedItems;
    private waitForReconnect;
    private closeConnection;
    private getReconnectDelay;
    private updateLastEventId;
    private intentToParam;
    private isAbortError;
}
