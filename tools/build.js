/*! React Starter Kit | MIT License | http://www.reactstarterkit.com/ */

import Task from '../src/shared/utils/Task';
import replace from 'replace';

import copy from '../src/shared/utils/copy';
import fs from '../src/shared/utils/fs';

let task = new Task('build', function() {
  return new Promise(async function(resolve, reject) {
    await fs.makeDir('build/public');
    await Promise.all([
      copy('src/public', 'build/public'),
      copy('package.json', 'build/package.json'),
    ]);

    replace({
      regex: '"start".*',
      replacement: '"start": "node server.js"',
      paths: ['build/package.json'],
      recursive: false,
      silent: false,
    });
    resolve();
  });
});

export default task;