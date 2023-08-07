import { Config as GeneratedTypes } from 'payload/generated-types';
import { PayloadRequest, RequestContext } from '../../../express/types';
import { Document } from '../../../types';
import { Payload } from '../../../payload';
export type Options<T extends keyof GeneratedTypes['collections']> = {
    collection: T;
    id: string | number;
    depth?: number;
    currentDepth?: number;
    locale?: string;
    fallbackLocale?: string;
    user?: Document;
    overrideAccess?: boolean;
    showHiddenFields?: boolean;
    disableErrors?: boolean;
    req?: PayloadRequest;
    draft?: boolean;
    /**
     * context, which will then be passed to req.context, which can be read by hooks
     */
    context?: RequestContext;
};
export default function findByIDLocal<T extends keyof GeneratedTypes['collections']>(payload: Payload, options: Options<T>): Promise<GeneratedTypes['collections'][T]>;
