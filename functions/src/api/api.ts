import * as bodyParser from 'body-parser';
import * as cors from 'cors';
// Express
import * as express from 'express';
import * as functions from 'firebase-functions';

const app = express();
app.use(cors({ origin: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/ai', require('.././ai/ai'));

export const api = functions.https.onRequest(app);
