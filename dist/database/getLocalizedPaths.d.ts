import { Field } from '../fields/config/types';
import { PathToQuery } from './queryValidation/types';
import { Payload } from '..';
export declare function getLocalizedPaths({ payload, locale, collectionSlug, globalSlug, fields, incomingPath, overrideAccess, }: {
    payload: Payload;
    locale?: string;
    collectionSlug?: string;
    globalSlug?: string;
    fields: Field[];
    incomingPath: string;
    overrideAccess?: boolean;
}): Promise<PathToQuery[]>;
