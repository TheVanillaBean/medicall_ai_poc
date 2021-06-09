"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.api = void 0;
const bodyParser = require("body-parser");
const cors = require("cors");
// Express
const express = require("express");
const functions = require("firebase-functions");
const app = express();
app.use(cors({ origin: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/ai', require('.././ai/ai'));
exports.api = functions.https.onRequest(app);
//# sourceMappingURL=api.js.map