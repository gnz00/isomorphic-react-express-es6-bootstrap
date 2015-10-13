## Simple Isomorphic React/Express ES6 Bootstrap
This repo is a restructured and pared down version of [React Starter Kit][0]. <br/>
All credit goes to <b>Konstantin Tarkus</b> ([@koistya](https://twitter.com/koistya)) and [contributors](https://github.com/kriasoft/react-starter-kit/graphs/contributors). <br/>
<br/>
I learned React and Webpack using [React Starter Kit][0], but I found a few things confusing: <br/>
  * [How do I discern between client-side and server-side?](#isomorphic-structure) </br>
  * [What all is the build system doing?](#build-system) <br/>
  * [Where are routes defined?](#routing)

### Isomorphic Structure
I restructured the project bootstrap to clearly define the boundary between client/server.
##### Server
```javascript
// config/server.webpack.config.js
  ...
  include: [
    path.resolve(__dirname, '../src/server'),
    path.resolve(__dirname, '../src/shared'),
  ],
  ...
```
##### Client
```javascript
// config/client.webpack.config.js
  ...
  include: [
    path.resolve(__dirname, '../src/client'),
    path.resolve(__dirname, '../src/shared'),
  ],
  ...
```

### Build System
The primary entrypoint is in `package.json`:
```javascript
  ...
  "main": "index.js",
  "scripts": {
    "clean": "rm -rf build",
    "start": "babel-node --eval \"require('./tools/start')()\"",
    "serve": "babel-node --eval \"require('./tools/serve').run().catch(err => console.error(err.stack))\"",
    "build": "babel-node --eval \"require('./tools/build').run().catch(err => console.error(err.stack))\"",
    "browser-sync": "babel-node --eval \"require('./tools/browerSync').run().catch(err => console.error(err.stack))\"",
    "bundle": "babel-node --eval \"require('./tools/bundle').run().catch(err => console.error(err.stack))\""
  },
  ...
```

The npm commands use babel-node which allows us to use ES6 in our tools and webpack configurations. This invocation of babel-node <b>DOES NOT</b> transpile your src directory. Take a look at `tools/start.js`:
```javascript
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
```
The key here is that both the `Bundler` task and the `BrowserSync` task will use the webpack configurations to transpile to ES6. <br/><br/>
The `Bundler` task will run webpack with the 2 [configurations](./config/) and produce a build output that is ready to run, `node build/server.js` or by loading `build/client.js` as a script in your web application. <br/><br/>
The `BrowserSync` task will spin up a new webserver that proxies our existing server and injects the BrowserSync code snippet. We pass our webpack configuration as middleware to BrowserSync so that we can hot reloads on all our devices.
<br/>
### Routing
It is important to know that we're using 2 routing frameworks. Express and [@koistya](https://twitter.com/koistya)'s [React Routing][1], with Express handling our server side routing on Node and React Routing handling the routing on the client and also on the server.<br/>

It is important to understand that Express will not handle route transitions that originate from client.js. These will entirely be handled by the client. However, if a request does hit the Express server, we need to know what state and components to render.

We have a rule for wrapping all server requests in a logical "page" context and rendering our root `Html` layout component, see `src/server/server.js`:
```javascript
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

    await Router.dispatch({ path: req.path, context }, (state, component) => {
      data.body = ReactDOM.renderToString(component);
      data.css = css.join('');
    });

    const html = ReactDOM.renderToStaticMarkup(<Html {...data} />);
    res.status(statusCode).send('<!doctype html>\n' + html);
  } catch (err) {
    next(err);
  }
});
```
In this code snippet, `Router` is actually an instance of our [React Router][1]. Essentially, any request that comes into Express will check against our React routes to see if Express needs to provide an initial component to render. Express then wraps the appropriate component with our root `Html` layout component. <br/><br/>
<br/>

In `src/shared/routes.js` we've defined our React routes with the React Routing library.
```javascript
import React from "react";
import {Router} from 'react-routing';
import App from './components/App';

// Pages
import IndexPage from './components/pages/IndexPage';
import ErrorPage from './components/pages/ErrorPage';
import NotFoundPage from './components/pages/NotFoundPage';

const router = new Router(on => {
  on('*', async (state, next) => {
    const component = await next();
    return component && <App context={state.context}>{component}</App>;
  });

  on('/', async () => {
    return <IndexPage/>
  });

  on('error', (state, error) => {
    console.log(error);
    return state.statusCode === 404 ?
      <App context={state.context} error={error}><NotFoundPage /></App> :
      <App context={state.context} error={error}><ErrorPage /></App>
    }
  );

});

export default router;
```

The rule definitions are very similar to Express. You can fetch data and pass it to your components here depending on if you're using a Fluxible solution or not.

#### Todo
* Pick model framework implementation
* Pick Flux implementation
* Pick resource implementation
* Add Ember Data style serialzier/adapter (JSONAPI)
* Implement tracking pixel
* Add prod configurations
* Document decorators


[0]: http://www.reactstarterkit.com
[1]: https://github.com/kriasoft/react-routing
