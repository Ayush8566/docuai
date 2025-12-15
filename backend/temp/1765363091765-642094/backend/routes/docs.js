const express = require('express');
const router = express.Router();
const openaiSvc = require('../services/openaiService');

router.post('/generate', async (req, res) => {
  try {
    const { repoSummary } = req.body;
    const doc = await openaiSvc.generateDocumentation(repoSummary);
    res.json({ documentation: doc });
  } catch (err) {
    res.status(500).json({ message: 'OpenAI error' });
  }
});

module.exports = router;
