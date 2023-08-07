import type { Response, NextFunction } from 'express';
import type { PayloadRequest } from '../types';
declare function defaultPayload(req: PayloadRequest, res: Response, next: NextFunction): void;
export default defaultPayload;
