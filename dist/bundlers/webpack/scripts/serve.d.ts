import type { PayloadHandler } from '../../../config/types';
import { Payload } from '../../../payload';
type ServeAdminType = (options: {
    payload: Payload;
}) => Promise<PayloadHandler>;
export declare const serveAdmin: ServeAdminType;
export {};
