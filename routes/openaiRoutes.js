const express = require('express');
const { codeHelper } = require('../controllers/openaiController');
const router = express.Router();

router.post('/codehelp', codeHelper);

module.exports = router;