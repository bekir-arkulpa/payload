import { Field, TabAsField } from '../../config/types';
import { PayloadRequest, RequestContext } from '../../../express/types';
type Args = {
    data: Record<string, unknown>;
    doc: Record<string, unknown>;
    previousDoc: Record<string, unknown>;
    previousSiblingDoc: Record<string, unknown>;
    fields: (Field | TabAsField)[];
    operation: 'create' | 'update';
    req: PayloadRequest;
    siblingData: Record<string, unknown>;
    siblingDoc: Record<string, unknown>;
    context: RequestContext;
};
export declare const traverseFields: ({ data, doc, previousDoc, previousSiblingDoc, fields, operation, req, siblingData, siblingDoc, context, }: Args) => Promise<void>;
export {};
