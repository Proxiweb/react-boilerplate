/* eslint-disable global-require */
const express = require('express');
const httpProxy = require('http-proxy');
const proxy2 = require('express-http-proxy');
const path = require('path');
const logger = require('../logger');
const compression = require('compression');
const pkg = require(path.resolve(process.cwd(), 'package.json'));

const pxhost = process.env.npm_config_pxhost || '127.0.0.1';
const pxport = process.env.npm_config_pxport || '3312';

// Dev middleware
const addDevMiddlewares = (app, webpackConfig) => {
  const webpack = require('webpack');
  const webpackDevMiddleware = require('webpack-dev-middleware');
  const webpackHotMiddleware = require('webpack-hot-middleware');
  const compiler = webpack(webpackConfig);
  const middleware = webpackDevMiddleware(compiler, {
    noInfo: true,
    publicPath: webpackConfig.output.publicPath,
    silent: true,
    stats: 'errors-only',
  });

  app.use(middleware);
  app.use(webpackHotMiddleware(compiler));

  // Since webpackDevMiddleware uses memory-fs internally to store build
  // artifacts, we use it instead
  const fs = middleware.fileSystem;

  if (pkg.dllPlugin) {
    app.get(/\.dll\.js$/, (req, res) => {
      const filename = req.path.replace(/^\//, '');
      res.sendFile(path.join(process.cwd(), pkg.dllPlugin.path, filename));
    });
  }

  app.get('*', (req, res) => {
    fs.readFile(path.join(compiler.outputPath, 'index.html'), (err, file) => {
      if (err) {
        res.sendStatus(404);
      } else {
        res.send(file.toString());
      }
    });
  });
};

// Production middlewares
const addProdMiddlewares = (app, options) => {
  const publicPath = options.publicPath || '/';
  const outputPath = options.outputPath || path.resolve(process.cwd(), 'build');

  // compression middleware compresses your server responses which makes them
  // smaller (applies also to assets). You can read more about that technique
  // and other good practices on official Express.js docs http://mxs.is/googmy
  app.use(compression());
  app.use(publicPath, express.static(outputPath));

  app.get('*', (req, res) => res.sendFile(path.resolve(outputPath, 'index.html')));
};

/**
 * Front-end middleware
 */
module.exports = (app, options) => {
  const isProd = process.env.NODE_ENV === 'production';
  const targetUrl = `http://${pxhost}:${pxport}/`;

  console.log(`Proxy sur ${targetUrl}`); // eslint-disable-line
  const proxy = httpProxy.createProxyServer({
    target: targetUrl,
    ws: true,
  });

  proxy.on('error', (e) => {
    if (e.code === 'ECONNREFUSED') {
      logger.error('Erreur de connection avec le backend');
    }
  });


  app.use('/api', proxy2(targetUrl));
  app.use('/ws', (req, res) => proxy.web(req, res, { target: `${targetUrl}/ws` }));

  if (isProd) {
    addProdMiddlewares(app, options);
  } else {
    const webpackConfig = require('../../internals/webpack/webpack.dev.babel');
    addDevMiddlewares(app, webpackConfig);
  }


  return app;
};
