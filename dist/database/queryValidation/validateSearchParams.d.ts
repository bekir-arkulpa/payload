import { Field } from '../../fields/config/types';
import { PayloadRequest } from '../../express/types';
import { SanitizedCollectionConfig } from '../../collections/config/types';
import { SanitizedGlobalConfig } from '../../globals/config/types';
import { EntityPolicies } from './types';
type Args = {
    fields: Field[];
    path: string;
    val: unknown;
    operator: string;
    req: PayloadRequest;
    errors: {
        path: string;
    }[];
    policies: EntityPolicies;
    collectionConfig?: SanitizedCollectionConfig;
    globalConfig?: SanitizedGlobalConfig;
    versionFields?: Field[];
    overrideAccess: boolean;
};
/**
 * Validate the Payload key / value / operator
 */
export declare function validateSearchParam({ fields, path: incomingPath, versionFields, val, operator, collectionConfig, globalConfig, errors, req, policies, overrideAccess, }: Args): Promise<void>;
export {};
