"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.migrationsCollection = void 0;
exports.migrationsCollection = {
    slug: 'payload-migrations',
    admin: {
        hidden: true,
    },
    graphQL: false,
    fields: [
        {
            name: 'name',
            type: 'text',
        },
        {
            name: 'batch',
            type: 'number',
        },
        // TODO: determine how schema will impact migration workflow
        {
            name: 'schema',
            type: 'json',
        },
        // TODO: do we need to persist the indexes separate from the schema?
        // {
        //   name: 'indexes',
        //   type: 'array',
        //   fields: [
        //     {
        //       name: 'index',
        //       type: 'text',
        //     },
        //     {
        //       name: 'value',
        //       type: 'json',
        //     },
        //   ],
        // },
    ],
};
//# sourceMappingURL=migrationsCollection.js.map