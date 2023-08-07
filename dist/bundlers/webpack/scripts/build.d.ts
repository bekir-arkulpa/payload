import { SanitizedConfig } from '../../../config/types';
type BuildAdminType = (options: {
    payloadConfig: SanitizedConfig;
}) => Promise<void>;
export declare const buildAdmin: BuildAdminType;
export {};
