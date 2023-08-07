"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const url_1 = __importDefault(require("url"));
const errors_1 = require("../../errors");
const getCookieExpiration_1 = __importDefault(require("../../utilities/getCookieExpiration"));
const getFieldsToSign_1 = require("./getFieldsToSign");
async function refresh(incomingArgs) {
    var _a;
    let args = incomingArgs;
    // /////////////////////////////////////
    // beforeOperation - Collection
    // /////////////////////////////////////
    await args.collection.config.hooks.beforeOperation.reduce(async (priorHook, hook) => {
        await priorHook;
        args = (await hook({
            args,
            operation: 'refresh',
            context: args.req.context,
        })) || args;
    }, Promise.resolve());
    // /////////////////////////////////////
    // Refresh
    // /////////////////////////////////////
    const { collection: { config: collectionConfig, }, req: { payload: { secret, config, }, }, } = args;
    if (typeof args.token !== 'string')
        throw new errors_1.Forbidden(args.req.t);
    const parsedURL = url_1.default.parse(args.req.url);
    const isGraphQL = parsedURL.pathname === config.routes.graphQL;
    const user = await args.req.payload.findByID({
        id: args.req.user.id,
        collection: args.req.user.collection,
        req: args.req,
        depth: isGraphQL ? 0 : args.collection.config.auth.depth,
    });
    const fieldsToSign = (0, getFieldsToSign_1.getFieldsToSign)({
        collectionConfig,
        user: (_a = args === null || args === void 0 ? void 0 : args.req) === null || _a === void 0 ? void 0 : _a.user,
        email: user === null || user === void 0 ? void 0 : user.email,
    });
    const refreshedToken = jsonwebtoken_1.default.sign(fieldsToSign, secret, {
        expiresIn: collectionConfig.auth.tokenExpiration,
    });
    const exp = jsonwebtoken_1.default.decode(refreshedToken).exp;
    if (args.res) {
        const cookieOptions = {
            path: '/',
            httpOnly: true,
            expires: (0, getCookieExpiration_1.default)(collectionConfig.auth.tokenExpiration),
            secure: collectionConfig.auth.cookies.secure,
            sameSite: collectionConfig.auth.cookies.sameSite,
            domain: undefined,
        };
        if (collectionConfig.auth.cookies.domain)
            cookieOptions.domain = collectionConfig.auth.cookies.domain;
        args.res.cookie(`${config.cookiePrefix}-token`, refreshedToken, cookieOptions);
    }
    let response = {
        user,
        refreshedToken,
        exp,
    };
    // /////////////////////////////////////
    // After Refresh - Collection
    // /////////////////////////////////////
    await collectionConfig.hooks.afterRefresh.reduce(async (priorHook, hook) => {
        await priorHook;
        response = (await hook({
            req: args.req,
            res: args.res,
            exp,
            token: refreshedToken,
            context: args.req.context,
        })) || response;
    }, Promise.resolve());
    // /////////////////////////////////////
    // Return results
    // /////////////////////////////////////
    return response;
}
exports.default = refresh;
//# sourceMappingURL=refresh.js.map