import { AbstractModule } from '../../../core/abstract-module';
import type { Labrinth } from '../types';
export declare class LabrinthStateModule extends AbstractModule {
    getModuleID(): string;
    /**
     * Build the complete generated state by fetching from multiple endpoints
     *
     * @returns Promise resolving to the generated state containing categories, loaders, etc.
     *
     * @example
     * ```typescript
     * const state = await client.labrinth.state.build()
     * console.log(state.categories) // Available categories
     * ```
     */
    build(): Promise<Labrinth.State.GeneratedState>;
}
