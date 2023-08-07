import { Config as GeneratedTypes } from 'payload/generated-types';
import { MarkOptional } from 'ts-essentials';
import { Payload } from '../../../payload';
import { PayloadRequest, RequestContext } from '../../../express/types';
import { Document } from '../../../types';
import { File } from '../../../uploads/types';
export type Options<TSlug extends keyof GeneratedTypes['collections']> = {
    collection: TSlug;
    data: MarkOptional<GeneratedTypes['collections'][TSlug], 'id' | 'updatedAt' | 'createdAt' | 'sizes'>;
    depth?: number;
    locale?: string;
    fallbackLocale?: string;
    user?: Document;
    overrideAccess?: boolean;
    disableVerificationEmail?: boolean;
    showHiddenFields?: boolean;
    filePath?: string;
    file?: File;
    overwriteExistingFiles?: boolean;
    req?: PayloadRequest;
    draft?: boolean;
    /**
     * context, which will then be passed to req.context, which can be read by hooks
     */
    context?: RequestContext;
};
export default function createLocal<TSlug extends keyof GeneratedTypes['collections']>(payload: Payload, options: Options<TSlug>): Promise<GeneratedTypes['collections'][TSlug]>;
