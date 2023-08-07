import { SanitizedCollectionConfig } from '../../../collections/config/types';
import { SanitizedGlobalConfig } from '../../../globals/config/types';
import { PayloadRequest, RequestContext } from '../../../express/types';
type Args<T> = {
    data: T | Record<string, unknown>;
    doc: T | Record<string, unknown>;
    previousDoc: T | Record<string, unknown>;
    entityConfig: SanitizedCollectionConfig | SanitizedGlobalConfig;
    operation: 'create' | 'update';
    req: PayloadRequest;
    context: RequestContext;
};
export declare const afterChange: <T extends Record<string, unknown>>({ data, doc: incomingDoc, previousDoc, entityConfig, operation, req, context, }: Args<T>) => Promise<T>;
export {};
