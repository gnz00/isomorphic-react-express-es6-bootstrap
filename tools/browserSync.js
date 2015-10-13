/*! React Starter Kit | MIT License | http://www.reactstarterkit.com/ */

import browserSync from 'browser-sync';
import webpack from 'webpack';
import Task from '../src/shared/utils/Task';

import clientWebpackConfig from '../config/client.webpack.config';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';

// Run a dev server with Browser Sync
/*
  ES5
  module.exports = new Task('browserSync', function() {
    return new Promise(function(resolve, reject) {
      ...
    });
  });

  ES6
  export default new Task('browserSync', () => new Promise((resolve, reject) => {
    ...
  });
 */
export default new Task('browserSync', () => new Promise((resolve, reject) => {
    let bundler = webpack(clientWebpackConfig);
    browserSync({
      proxy: {

        target: 'localhost:8080',

        middleware: [
          webpackDevMiddleware(bundler, {
            // IMPORTANT: dev middleware can't access config, so we should
            // provide publicPath by ourselves
            publicPath: clientWebpackConfig.output.publicPath,

            // Pretty colored output
            stats: clientWebpackConfig.stats,

            // For other settings see
            // http://webpack.github.io/docs/webpack-dev-middleware.html
          }),

          // bundler should be the same as above
          webpackHotMiddleware(bundler),
        ],
      },

      // no need to watch '*.js' here, webpack will take care of it for us,
      // including full page reloads if HMR won't work
      files: [
        'build/public/**/*.css',
        'build/public/**/*.html',
        'build/content/**/*.*',
        'build/templates/**/*.*',
      ],
    }, () => {
      resolve();
    });
  })
);