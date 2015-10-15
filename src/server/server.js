
import 'babel/polyfill';
import express from "express";
import httpProxy from 'http-proxy';
import path from 'path';

import logger from '../shared/utils/logger';
import blocked from 'blocked';

// middleware
import morgan from 'morgan';

// React
import React from 'react';
import ReactDOM from 'react-dom/server';
import Router from '../shared/routes';
import Html from '../shared/components/Html';

// Let us know if we block the event loop
blocked(function(ms){
  logger.warn('BLOCKED FOR %sms', ms | 0);
});

const server = global.server = express();
const port = process.env.PORT || 5000;

server.use(express.static('build/public'));

// Register 3rd party middleware
//
server.use(morgan('combined'));

// Register API middleware
server.use('/api', require('./api'));

// Setup React
server.get('*', async (req, res, next) => {
  try {
    let statusCode = 200;
    const data = { title: '', description: '', css: '', body: '' };
    const css = [];
    const context = {
      onInsertCss: value => css.push(value),
      onSetTitle: value => data.title = value,
      onSetMeta: (key, value) => data[key] = value,
      onPageNotFound: () => statusCode = 404,
    };

    // Router is an instance of React Router.
    // Dispatch will retrieve the appropriate state and root component for the path provided.
    await Router.dispatch({ path: req.path, context }, (state, component) => {
      data.body = ReactDOM.renderToString(component);
      data.css = css.join('');
    });

    // Wrap our component with the root Html layout component
    const html = ReactDOM.renderToStaticMarkup(<Html {...data} />);
    res.status(statusCode).send('<!doctype html>\n' + html);
  } catch (err) {
    next(err);
  }
});

// Launch Server
server.listen(port, () => {
  logger.info('Listening on port: ' + port);
  if (process.send) {
    process.send('online');
  }
});

export default server;