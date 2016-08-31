/* eslint consistent-return:0 */

const express = require('express');
const bodyParser = require('body-parser');
const logger = require('./logger');
const routes = require('./api');

const argv = require('minimist')(process.argv.slice(2));
const setup = require('./middlewares/frontendMiddleware');
const isDev = process.env.NODE_ENV !== 'production';
const ngrok = (isDev && process.env.ENABLE_TUNNEL) || argv.tunnel ? require('ngrok') : false;
const resolve = require('path').resolve;
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// if (argv.proxy) {
  // const pxhost = process.env.npm_config_pxhost || '127.0.0.1';
  // const pxport = process.env.npm_config_pxport || '3312';
  //
  // console.log(`proxy sur http://${pxhost}:${pxport}`); // eslint-disable-line
  //
  // app.use('/api', proxy(`http://${pxhost}:${pxport}/`));
// } else {
app.use('/api', routes);
// }

app.use((err, req, res, next) => {  // eslint-disable-line
  if (err.name === 'UnauthorizedError') {
    res.status(401).send({ error: 'La session a expirée' });
  }
  res.status(500).send('Something broke!');
});

// In production we need to pass these values in instead of relying on webpack
setup(app, {
  outputPath: resolve(process.cwd(), 'build'),
  publicPath: '/',
});

// get the intended port number, use port 3000 if not provided
const port = argv.port || process.env.PORT || 3000;

// Start your app.
app.listen(port, (err) => {
  if (err) {
    return logger.error(err.message);
  }

  // Connect to ngrok in dev mode
  if (ngrok) {
    ngrok.connect(port, (innerErr, url) => {
      if (innerErr) {
        return logger.error(innerErr);
      }

      logger.appStarted(port, url);
    });
  } else {
    logger.appStarted(port);
  }
});
