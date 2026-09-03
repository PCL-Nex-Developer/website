import { AbstractFeature, type FeatureConfig } from '../core/abstract-feature';
import type { RequestContext } from '../types/request';
export type VerboseLoggingConfig = FeatureConfig;
export declare class VerboseLoggingFeature extends AbstractFeature {
    execute<T>(next: () => Promise<T>, context: RequestContext): Promise<T>;
}
