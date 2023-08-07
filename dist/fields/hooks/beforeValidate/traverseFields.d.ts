import { PayloadRequest, RequestContext } from '../../../express/types';
import { Field, TabAsField } from '../../config/types';
type Args<T> = {
    data: T;
    doc: T;
    fields: (Field | TabAsField)[];
    id?: string | number;
    operation: 'create' | 'update';
    overrideAccess: boolean;
    req: PayloadRequest;
    siblingData: Record<string, unknown>;
    siblingDoc: Record<string, unknown>;
    context: RequestContext;
};
export declare const traverseFields: <T>({ data, doc, fields, id, operation, overrideAccess, req, siblingData, siblingDoc, context, }: Args<T>) => Promise<void>;
export {};
