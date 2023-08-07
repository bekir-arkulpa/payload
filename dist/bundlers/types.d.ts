import type { PayloadHandler, SanitizedConfig } from 'payload/config';
import type { Payload } from '../payload';
export interface PayloadBundler {
    dev: (payload: Payload) => Promise<PayloadHandler>;
    build: (payloadConfig: SanitizedConfig) => Promise<void>;
    serve: (payload: Payload) => Promise<PayloadHandler>;
}
