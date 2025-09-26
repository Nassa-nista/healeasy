const express = require('express');
const router = express.Router();

router.get('/healthz', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

module.exports = router;
