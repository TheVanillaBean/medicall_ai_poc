"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.storage = void 0;
const admin = require("firebase-admin");
admin.initializeApp();
exports.storage = admin.storage();
//# sourceMappingURL=config.js.map