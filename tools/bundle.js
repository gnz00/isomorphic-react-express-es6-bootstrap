/*! React Starter Kit | MIT License | http://www.reactstarterkit.com/ */

import WebpackDevServer from "webpack-dev-server";
import webpack from "webpack";
import serverConfig from "../config/server.webpack.config";
import clientConfig from "../config/client.webpack.config";
import Task from '../src/shared/utils/Task';

let config = [serverConfig, clientConfig];

/**
 * Run Webpack on server and client configurations
 */
export default new Task('bundle', function() {
  return new Promise(function(resolve, reject) {
    const bundler = webpack(config);
    let bundlerRunCount = 0;

    function bundle(err, stats) {
      if (err) {
        return reject(err);
      }

      if (stats.stats !== undefined) {
        stats.stats.forEach((element, index) => {
          console.log(element.toString(config[index].stats));
        });
      } else {
        console.log(stats.toString(config[0].stats));
      }

      // Resolve promise if tall the bundle configurations have been processed
      if (++bundlerRunCount === (global.WATCH ? config.length : 1)) {
        return resolve();
      }
    }

    // Watch for changes
    if (global.WATCH) {
      bundler.watch(200, bundle);
    } else {
      bundler.run(bundle);
    }
  });
});
