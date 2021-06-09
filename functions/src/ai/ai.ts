const express = require('express');
const router = express.Router();
import { file } from 'tmp-promise';
import { storage } from '../config';

export async function downloadFile(fileName: any) {
  const { path, cleanup } = await file({ postfix: '.jpg' });
  await storage.bucket().file(fileName).download({ destination: path });
  return path;
}

export const generateImageFiles = async () => {
  const options = {
    prefix: `test-images/`,
  };

  // Lists files in the bucket
  const [files] = await storage.bucket().getFiles(options);

  let filePaths = [];
  for (const fileObj of files) {
    const path = await downloadFile(fileObj.name).catch(console.error);
    filePaths.push(path);
  }
  return filePaths;
};

router.get('/predict', async (req, res) => {
  const imagePaths = await generateImageFiles();

  console.log(imagePaths);
  res.send(`Image 1: ${imagePaths[0]}`);
});

module.exports = router;
