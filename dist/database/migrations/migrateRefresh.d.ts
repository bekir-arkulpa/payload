import { DatabaseAdapter } from '../types';
/**
 * Reset and re-run all migrations.
 */
export declare function migrateRefresh(this: DatabaseAdapter): Promise<void>;
