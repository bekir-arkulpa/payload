import type { PayloadHandler } from '../../../config/types';
import { Payload } from '../../../payload';
type DevAdminType = (options: {
    payload: Payload;
}) => Promise<PayloadHandler>;
export declare const devAdmin: DevAdminType;
export {};
