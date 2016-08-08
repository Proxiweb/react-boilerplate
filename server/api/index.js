const express = require('express');
const router = express.Router(); // eslint-disable-line

require('./utilisateur')(router);

module.exports = router;
