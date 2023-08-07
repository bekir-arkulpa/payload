import { PayloadRequest, Where } from '../../types';
import { SanitizedCollectionConfig } from '../../collections/config/types';
import { SanitizedGlobalConfig } from '../../globals/config/types';
import { Field } from '../../fields/config/types';
import { EntityPolicies } from './types';
type Args = {
    where: Where;
    errors?: {
        path: string;
    }[];
    policies?: EntityPolicies;
    req: PayloadRequest;
    versionFields?: Field[];
    overrideAccess: boolean;
} & ({
    collectionConfig: SanitizedCollectionConfig;
    globalConfig?: never | undefined;
} | {
    globalConfig: SanitizedGlobalConfig;
    collectionConfig?: never | undefined;
});
export declare function validateQueryPaths({ where, collectionConfig, globalConfig, errors, policies, versionFields, req, overrideAccess, }: Args): Promise<void>;
export {};
