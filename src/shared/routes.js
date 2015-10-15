import React from "react";
import {Router} from 'react-routing';
import App from './components/App';

// Pages
import IndexPage from './components/pages/IndexPage';
import ErrorPage from './components/pages/ErrorPage';
import NotFoundPage from './components/pages/NotFoundPage';

const router = new Router(on => {

  // Wrap all the requests with App
  on('*', async (state, next) => {
    const component = await next();
    return component && <App context={state.context}>{component}</App>;
  });

  on('/', async () => {
    return <IndexPage/>
  });

  on('error', (state, error) => {
    if (console && typeof console.error == "function")
      console.error(error);
    return state.statusCode === 404 ?
      <App context={state.context} error={error}><NotFoundPage /></App> :
      <App context={state.context} error={error}><ErrorPage /></App>
    }
  );

});

export default router;