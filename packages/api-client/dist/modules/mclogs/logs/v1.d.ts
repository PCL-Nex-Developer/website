import { AbstractModule } from '../../../core/abstract-module';
import type { Mclogs } from '../types';
export declare class MclogsLogsV1Module extends AbstractModule {
    getModuleID(): string;
    create(content: string): Promise<Mclogs.Logs.v1.CreateResponse>;
}
