import React from 'react';
import ReactDOM from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
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

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
