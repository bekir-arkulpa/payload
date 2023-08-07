import { Payload } from '../..';
import { MigrationData } from '../types';
export declare function getMigrations({ payload, }: {
    payload: Payload;
}): Promise<{
    existingMigrations: MigrationData[];
    latestBatch: number;
}>;
