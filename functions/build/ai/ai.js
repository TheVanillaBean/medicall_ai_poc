"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
Object.defineProperty(exports, "__esModule", { value: true });
const querystring = require('querystring');
const express = require('express');
const router = express.Router();
const functions = require('firebase-functions');
const fs = require('fs');
const readline = require('readline');
const path = require('path');
const tf = require('@tensorflow/tfjs-node');
const helpers_1 = require("../helpers");
const app = express();
let objectDetectionModel;
function loadModel() {
    return __awaiter(this, void 0, void 0, function* () {
        // Warm up the model
        if (!objectDetectionModel) {
            objectDetectionModel = yield tf.loadLayersModel('file://models/image_disease_classification/model.json');
            objectDetectionModel.summary();
        }
    });
}
let qualityModel;
function loadRegression() {
    return __awaiter(this, void 0, void 0, function* () {
        // Warm up the model
        if (!qualityModel) {
            qualityModel = yield tf.loadLayersModel('file://models/image_quality_regression/model.json');
            qualityModel.summary();
        }
    });
}
function processLineByLine(file) {
    var e_1, _a;
    return __awaiter(this, void 0, void 0, function* () {
        let arr = [];
        const fileStream = fs.createReadStream(file);
        const rl = readline.createInterface({
            input: fileStream,
            crlfDelay: Infinity
        });
        try {
            // Note: we use the crlfDelay option to recognize all instances of CR LF
            // ('\r\n') in input.txt as a single line break.
            for (var rl_1 = __asyncValues(rl), rl_1_1; rl_1_1 = yield rl_1.next(), !rl_1_1.done;) {
                const line = rl_1_1.value;
                // Each line in input.txt will be successively available here as `line`.
                console.log(`Line from file: ${line}`);
                arr.push(line);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (rl_1_1 && !rl_1_1.done && (_a = rl_1.return)) yield _a.call(rl_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return arr;
    });
}
router.get('/predict', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Write some magic Steven!
    const imagePaths = yield helpers_1.generateImageFiles();
    console.log(imagePaths);
    let f;
    let fileBuffer = Buffer.from('');
    for (const file of imagePaths) {
        yield fs.readFile(file, function (err, data) {
            if (err)
                throw err; // Fail if the file can't be read.
            else
                console.log('yes');
            fileBuffer = Buffer.concat([fileBuffer, data]);
            //f = data;
        });
        f = fs.readFileSync(file);
    }
    //const uint8array = new Uint8Array(f);//ileBuffer);
    const imageTensor = yield tf.node.decodeImage(f);
    //const imageTensor = await tf.node.decodeImage(f);
    const input = imageTensor.expandDims(0);
    const resized = tf.image.resizeBilinear(input, [224, 224]);
    yield loadModel();
    //await loadRegression();
    let outputTensor = objectDetectionModel.predict(resized);
    //let outputTensor2 = qualityModel.predict(resized);
    const prediction = yield outputTensor.argMax(1);
    const labels = yield processLineByLine('models/image_disease_classification/labels.txt');
    const indexarr = yield prediction.dataSync();
    const index = indexarr[0];
    console.log(labels[index]);
    //res.send(`${outputTensor2} ${labels[index]}`);
    //res.send(`Image 1: ${imagePaths[0]}`);
    //req.files = {file: []};
    //res.send('hello');
}));
module.exports = router;
//# sourceMappingURL=ai.js.map