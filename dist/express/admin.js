"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
async function initAdmin(ctx) {
    if (!ctx.config.admin.disable) {
        if (process.env.NODE_ENV === 'production') {
            ctx.express.use(ctx.config.routes.admin, await ctx.config.admin.bundler.serve(ctx));
        }
        else {
            ctx.express.use(ctx.config.routes.admin, await ctx.config.admin.bundler.dev(ctx));
        }
    }
}
exports.default = initAdmin;
//# sourceMappingURL=admin.js.map