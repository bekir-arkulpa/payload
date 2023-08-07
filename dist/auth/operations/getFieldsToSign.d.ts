import { User } from '..';
import { CollectionConfig } from '../../collections/config/types';
export declare const getFieldsToSign: (args: {
    collectionConfig: CollectionConfig;
    user: User;
    email: string;
}) => Record<string, unknown>;
