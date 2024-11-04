/* @refresh reload */
import './index.css';

import { render } from 'solid-js/web';
import { Router, Route, Routes } from '@solidjs/router';
import App from './app';

import Sidebar from './components/Sidebar/Sidebar';
import Main from './components/Main/Main';





const root = document.getElementById('root');

if (import.meta.env.DEV && !(root instanceof HTMLElement)) {
  throw new Error(
    'Root element not found. Did you forget to add it to your index.html? Or maybe the id attribute got misspelled?',
  );
}

render(
  () => (
    <Router>
          <Main />
    </Router>
  ),
  root,
);
