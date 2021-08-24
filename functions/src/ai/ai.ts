const querystring = require('querystring');
const express = require('express');
const router = express.Router();

const functions = require('firebase-functions');
const fs = require('fs');
const readline = require('readline');
const path = require('path');

const tf = require('@tensorflow/tfjs-node');

import { generateImageFiles } from '../helpers';

const app = express();

let objectDetectionModel;

async function loadModel() {
  // Warm up the model
  if (!objectDetectionModel) {
    objectDetectionModel = await tf.loadLayersModel('file://models/image_disease_classification/model.json');
    objectDetectionModel.summary();
  }

}

let qualityModel;

async function loadRegression() {
  // Warm up the model
  if (!qualityModel) {
    qualityModel = await tf.loadLayersModel('file://models/image_quality_regression/model.json');
    qualityModel.summary();
  }
}

async function processLineByLine(file) {
  let arr = [];
  const fileStream = fs.createReadStream(file);

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });
  // Note: we use the crlfDelay option to recognize all instances of CR LF
  // ('\r\n') in input.txt as a single line break.

  for await (const line of rl) {
    // Each line in input.txt will be successively available here as `line`.
    console.log(`Line from file: ${line}`);
    arr.push(line);
  }
  return arr;
}

router.get('/predict', async (req, res) => {
  // Write some magic Steven!
  
  const imagePaths = await generateImageFiles();

  console.log(imagePaths);
  let f;
  let fileBuffer = Buffer.from('');
  for (const file of imagePaths){
    await fs.readFile(file, function(err, data) {
        if (err) throw err // Fail if the file can't be read.
        else console.log('yes');
        fileBuffer = Buffer.concat([fileBuffer, data]);
        //f = data;
      }
    );
    f = fs.readFileSync(file);
  }
  
  //const uint8array = new Uint8Array(f);//ileBuffer);
  
  const imageTensor = await tf.node.decodeImage(f);
  //const imageTensor = await tf.node.decodeImage(f);
  
  const input = imageTensor.expandDims(0);
  const resized = tf.image.resizeBilinear(input, [224, 224]);
  await loadModel();
  //await loadRegression();
  let outputTensor = objectDetectionModel.predict(resized);
  //let outputTensor2 = qualityModel.predict(resized);
  const prediction = await outputTensor.argMax(1);
  const labels = await processLineByLine('models/image_disease_classification/labels.txt');
  const indexarr = await prediction.dataSync();
  const index = indexarr[0];
  console.log(labels[index]);
  //res.send(`${outputTensor2} ${labels[index]}`);
  //res.send(`Image 1: ${imagePaths[0]}`);
  
  //req.files = {file: []};
  //res.send('hello');
  
});

module.exports = router;
