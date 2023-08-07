"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.migrationTemplate = void 0;
exports.migrationTemplate = `
import payload, { Payload } from 'payload';

export async function up(payload: Payload): Promise<void> {
  // Migration code
};

export async function down(payload: Payload): Promise<void> {
  // Migration code
};
`;
//# sourceMappingURL=migrationTemplate.js.map