import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import BankAppLayout from "./layouts/BankAppLayout.tsx";
import './index.css'
import 'rsuite/dist/rsuite.min.css';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';

import { store, persistor } from './redux/store.ts';
import { PersistGate } from 'redux-persist/integration/react';

createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <BrowserRouter>
        <BankAppLayout>
          <App />
        </BankAppLayout>
      </BrowserRouter>
    </PersistGate>
  </Provider>,
)
