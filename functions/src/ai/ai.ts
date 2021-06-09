const express = require('express');
const router = express.Router();
import { generateImageFiles } from '../helpers';

router.get('/predict', async (req, res) => {
  const imagePaths = await generateImageFiles();

  console.log(imagePaths);
  res.send(`Image 1: ${imagePaths[0]}`);
});

module.exports = router;
