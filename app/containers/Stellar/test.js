const api = require('../../utils/stellarApi');

api.loadAccount('GCRN5SVVM72CYTBS3RM4GNDYBJFXR23DW6MRJZKDUQFAFIWNSGJDCAOV')
  .then(account => ({ account }))
  .catch(err => {
    throw new Error(err);
  });
