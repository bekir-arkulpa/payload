import { Config as GeneratedTypes } from 'payload/generated-types';
import { InitOptions } from './config/types';
import { Payload as LocalPayload, BasePayload } from './payload';
import type { RequestContext } from './express/types';
export { getPayload } from './payload';
export declare class Payload extends BasePayload<GeneratedTypes> {
    init(options: InitOptions): Promise<LocalPayload>;
}
declare const payload: Payload;
export default payload;
export type { RequestContext };
