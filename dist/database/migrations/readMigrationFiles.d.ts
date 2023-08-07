import { Migration } from '../types';
import { Payload } from '../../index';
/**
 * Read the migration files from disk
 */
export declare const readMigrationFiles: ({ payload, }: {
    payload: Payload;
}) => Promise<Migration[]>;
