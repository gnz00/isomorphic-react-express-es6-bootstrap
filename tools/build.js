/*! React Starter Kit | MIT License | http://www.reactstarterkit.com/ */

import Task from '../src/shared/utils/Task';
import replace from 'replace';
import { copyFiles, makeDir } from '../src/shared/utils/fileUtils';

export default new Task('build', function() {
  return new Promise(async function(resolve, reject) {
    await makeDir('build/public');
    await makeDir('build/logs');
    await Promise.all([
      copyFiles('src/public', 'build/public'),
      copyFiles('package.json', 'build/package.json'),
    ]);
    resolve();
  });
});