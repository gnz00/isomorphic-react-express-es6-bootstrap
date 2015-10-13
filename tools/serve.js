/*! React Starter Kit | MIT License | http://www.reactstarterkit.com/ */

import express from "express";
import path from 'path';
import cp from 'child_process';
import Task from '../src/shared/utils/Task';

export default new Task('server', function() {
  return new Promise(function(resolve, reject) {
    const server = cp.fork(path.join(__dirname, '../build/server.js'), {
      env: Object.assign({ NODE_ENV: 'development' }, process.env),
      silent: false,
    });

    server.once('message', message => {
      if (message.match(/^online$/)) {
        resolve();
      }
    });

    server.once('error', err => reject(err));

    process.on('exit', () => server.kill('SIGTERM'));
    return server;
  });
});