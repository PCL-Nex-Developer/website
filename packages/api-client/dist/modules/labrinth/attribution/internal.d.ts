import { AbstractModule } from '../../../core/abstract-module';
import type { Labrinth } from '../types';
export declare class LabrinthAttributionInternalModule extends AbstractModule {
    getModuleID(): string;
    /**
     * List attribution groups for a project
     * GET /_internal/attribution/{project_id}
     */
    listProjectAttribution(projectId: string): Promise<Labrinth.Attribution.Internal.AttributionGroup[]>;
    /**
     * Update an attribution group's attribution payload.
     * PATCH /_internal/attribution/group/{group_id}
     *
     * @param groupId - The base62 attribution group id (as returned from listProjectAttribution).
     */
    updateGroup(groupId: string, body: Labrinth.Attribution.Internal.UpdateGroupRequest): Promise<void>;
    /**
     * Delete an attribution group and all files inside it.
     * DELETE /_internal/attribution/group/{group_id}
     *
     * @param groupId - The base62 attribution group id (as returned from listProjectAttribution).
     */
    deleteGroup(groupId: string): Promise<void>;
    /**
     * Reassign a file (by sha1) to another attribution group within the same project.
     * POST /_internal/attribution/assign
     *
     * @param body.target_group_id - The base62 id of the attribution group to assign the file to.
     */
    assignFileToGroup(body: {
        sha1: string;
        target_group_id: string;
        project_id: string;
    }): Promise<void>;
    /**
     * Split a file (by sha1) out of its current attribution group into a new group.
     * POST /_internal/attribution/split
     */
    splitFile(body: Labrinth.Attribution.Internal.SplitRequest): Promise<void>;
    /**
     * Scan a file for attribution information.
     * POST /_internal/attribution/file/{file_id}/scan
     *
     * @param fileId - The file ID to scan.
     */
    scanFile(fileId: string): Promise<Labrinth.Attribution.Internal.FileScanResponse>;
}
