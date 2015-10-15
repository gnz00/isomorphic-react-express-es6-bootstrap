import Task from '../src/shared/utils/Task';
import Server from './serve';
import Bundler from './bundle';
import Builder from './build';
import BrowserSync from './browserSync';
import { watchFiles }  from '../src/shared/utils/fileUtils';
import path from 'path';

// Define globals
global.WATCH = process.argv.includes('watch') ? process.argv.includes('watch') : true;
global.DEBUG = !process.argv.includes('release');

// Register instances of Tasks that will perform async actions
let task = new Task('start', function() {
  return new Promise(async function(resolve, reject) {

    // Creates the build directory and copies static assets
    await Builder.run();
    // Runs webpack to build client.js and server.js in build directory
    await Bundler.run();
    // Runs a child process to spawn a server that will be proxied by BrowserSync
    let server = await Server.run();
    // Runs a BS server that proxies the dev server
    let bs = await BrowserSync.run();

    // Setup our watches
    if (global.WATCH) {
      // Webpack will rebuild server.js if it detects changes to src/server or src/shared
      // In which case we want to restart the server
      watchFiles(path.join(__dirname, '../build/server.js'))
      .then(function(watcher) {
        watcher.on('changed', async () => {
          server.kill('SIGTERM');
          server = await Server.run();
        });
      });
    }

    resolve();
  });
});

export default async function() {
  // Execute all our tasks
  return await task.run()
  .catch((err) => {
    console.error(err.stack);
  });
};