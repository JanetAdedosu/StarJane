import React from 'react';
import ReactDOM from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import App from './App';

import { HelmetProvider } from 'react-helmet-async';
import { StoreProvider } from './Store';
import { Auth0Provider } from '@auth0/auth0-react';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <StoreProvider>
      <HelmetProvider>
        <Auth0Provider
          domain="dev-0wntlerljr583syk.us.auth0.com"
          clientId="6RhQuTbbF4tK4n4UVZuAqL9OLsPGaQxj"
          authorizationParams={{
            redirect_uri: window.location.origin,
          }}
        >
          <PayPalScriptProvider deferLoading={true}>
            <App />
          </PayPalScriptProvider>
        </Auth0Provider>
      </HelmetProvider>
    </StoreProvider>
  </React.StrictMode>
);


