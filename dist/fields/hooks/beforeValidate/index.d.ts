import { SanitizedCollectionConfig } from '../../../collections/config/types';
import { SanitizedGlobalConfig } from '../../../globals/config/types';
import { PayloadRequest, RequestContext } from '../../../express/types';
type Args<T> = {
    data: T | Record<string, unknown>;
    doc?: T | Record<string, unknown>;
    entityConfig: SanitizedCollectionConfig | SanitizedGlobalConfig;
    id?: string | number;
    operation: 'create' | 'update';
    overrideAccess: boolean;
    req: PayloadRequest;
    context: RequestContext;
};
export declare const beforeValidate: <T extends Record<string, unknown>>({ data: incomingData, doc, entityConfig, id, operation, overrideAccess, req, context, }: Args<T>) => Promise<T>;
export {};
