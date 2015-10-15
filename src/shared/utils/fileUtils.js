/*! React Starter Kit | MIT License | http://www.reactstarterkit.com/ */

import fs from 'fs';
import mkdirp from 'mkdirp';
import gaze from 'gaze';
import ncp from 'ncp';

export const writeFile = (file, contents) => new Promise((resolve, reject) => {
  fs.writeFile(file, contents, 'utf8', err => err ? reject(err) : resolve());
});

export const makeDir = (name) => new Promise((resolve, reject) => {
  mkdirp(name, err => err ? reject(err) : resolve());
});

export const watchFiles = (pattern) => new Promise((resolve, reject) => {
  gaze(pattern, (err, watcher) => err ? reject(err) : resolve(watcher));
});

export const copyFiles = (source, dest) => new Promise((resolve, reject) => {
  ncp(source, dest, err => err ? reject(err) : resolve());
});

export default {
  writeFile,
  makeDir,
  watchFiles,
  copyFiles
};
