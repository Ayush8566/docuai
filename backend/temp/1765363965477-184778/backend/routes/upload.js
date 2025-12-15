const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const simpleGit = require('simple-git');
const { parseRepoToDocs } = require('../services/astParser');

const router = express.Router();
const upload = multer({ dest: path.join(__dirname, '..', 'uploads') });

router.post('/repo', upload.single('repo'), async (req, res) => {
  try {
    const filePath = req.file.path;
    const docs = await parseRepoToDocs(filePath);
    res.json({ docs });
  } catch (err) {
    res.status(500).json({ message: 'Failed to parse' });
  }
});

router.post('/clone', async (req, res) => {
  const { repoUrl } = req.body;
  const dest = path.join(__dirname, '..', 'temp', Date.now().toString());
  await fs.promises.mkdir(dest, { recursive: true });
  const git = simpleGit();
  try {
    await git.clone(repoUrl, dest);
    const docs = await parseRepoToDocs(dest);
    res.json({ docs });
  } catch (err) {
    res.status(500).json({ message: 'Clone or parse failed' });
  }
});

module.exports = router;
