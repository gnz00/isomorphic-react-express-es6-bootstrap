import Task from '../src/shared/utils/Task';
import Server from './serve';
import Bundler from './bundle';
import Builder from './build';
import BrowserSync from './browserSync';

// Register instances of Tasks that will perform async actions
let task = new Task('start', function() {
  return new Promise(async function(resolve, reject) {
    // Creates the build directory and copies static assets
    await Builder.run();

    // Runs webpack to build client.js and server.js in build directory
    await Bundler.run();

    // Runs a child process to spawn a server that will be proxied by BrowserSync
    await Server.run();

    // Runs a BS server that proxies the dev server
    await BrowserSync.run();
    resolve();
  });
});

export default async function() {
  return await task.run().catch((err) => {
    console.error(err.stack);
  });
};