const think = require('thinky');
const config = {
  thinky: {
    host: 'localhost',
    port: 28015,
    db: 'foodyfood_dev',
  },
};

module.exports = think(config.thinky);
