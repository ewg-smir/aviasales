import { StrictMode } from 'react';
import { Provider } from 'react-redux';
import { createRoot } from 'react-dom/client';
import './index.scss';
import App from './components/App/App';
import store from './store/store';

/* eslint-disable comma-dangle */
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>
);
/* eslint-enable comma-dangle */
