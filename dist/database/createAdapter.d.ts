import { MarkOptional } from 'ts-essentials';
import { DatabaseAdapter } from './types';
export declare function createDatabaseAdapter<T extends DatabaseAdapter>(args: MarkOptional<T, 'transaction' | 'migrate' | 'createMigration' | 'migrateStatus' | 'migrateDown' | 'migrateRefresh' | 'migrateReset' | 'migrateFresh' | 'migrationDir'>): T;
