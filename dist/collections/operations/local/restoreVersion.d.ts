import { Config as GeneratedTypes } from 'payload/generated-types';
import { Payload } from '../../../payload';
import { RequestContext } from '../../../express/types';
import { Document } from '../../../types';
export type Options<T extends keyof GeneratedTypes['collections']> = {
    collection: T;
    id: string;
    depth?: number;
    locale?: string;
    fallbackLocale?: string;
    user?: Document;
    overrideAccess?: boolean;
    showHiddenFields?: boolean;
    draft?: boolean;
    /**
     * context, which will then be passed to req.context, which can be read by hooks
     */
    context?: RequestContext;
};
export default function restoreVersionLocal<T extends keyof GeneratedTypes['collections']>(payload: Payload, options: Options<T>): Promise<GeneratedTypes['collections'][T]>;
