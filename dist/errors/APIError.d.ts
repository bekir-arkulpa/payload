declare class ExtendableError<TData extends object = {
    [key: string]: unknown;
}> extends Error {
    status: number;
    data: TData;
    isPublic: boolean;
    isOperational: boolean;
    constructor(message: string, status: number, data: TData, isPublic: boolean);
}
/**
 * Class representing an API error.
 * @extends ExtendableError
 */
declare class APIError<TData extends null | object = null | {
    [key: string]: unknown;
}> extends ExtendableError<TData> {
    /**
     * Creates an API error.
     * @param {string} message - Error message.
     * @param {number} status - HTTP status code of error.
     * @param {object} data - response data to be returned.
     * @param {boolean} isPublic - Whether the message should be visible to user or not.
     */
    constructor(message: string, status?: number, data?: TData, isPublic?: boolean);
}
export default APIError;
