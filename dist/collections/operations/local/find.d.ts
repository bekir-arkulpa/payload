import { Config as GeneratedTypes } from 'payload/generated-types';
import { PaginatedDocs } from '../../../mongoose/types';
import { Document, Where } from '../../../types';
import { Payload } from '../../../payload';
import { PayloadRequest, RequestContext } from '../../../express/types';
export type Options<T extends keyof GeneratedTypes['collections']> = {
    collection: T;
    depth?: number;
    currentDepth?: number;
    page?: number;
    limit?: number;
    locale?: string;
    fallbackLocale?: string;
    user?: Document;
    overrideAccess?: boolean;
    disableErrors?: boolean;
    showHiddenFields?: boolean;
    pagination?: boolean;
    sort?: string;
    where?: Where;
    draft?: boolean;
    req?: PayloadRequest;
    /**
     * context, which will then be passed to req.context, which can be read by hooks
     */
    context?: RequestContext;
};
export default function findLocal<T extends keyof GeneratedTypes['collections']>(payload: Payload, options: Options<T>): Promise<PaginatedDocs<GeneratedTypes['collections'][T]>>;
