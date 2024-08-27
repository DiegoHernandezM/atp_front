import "react-app-polyfill/stable";

import React from "react";
import { Provider } from "react-redux";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import "chart.js/auto";

import App from "./App";
import { store } from "./redux/store";
import reportWebVitals from "./utils/reportWebVitals";
import { ThemeProvider } from "./contexts/ThemeContext";

import * as serviceWorkerRegistration from "./serviceWorkerRegistration";

import "animate.css/animate.min.css";
import { AuthProvider } from "./contexts/JWTContext";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import { CLIENT_PAYPAL } from "./config";

const container = document.getElementById("root");
const root = createRoot(container);
const initialOptions = {
  "client-id": CLIENT_PAYPAL,
  currency: "MXN",
  locale: "es_MX",
  intent: "capture",
};

root.render(
  <AuthProvider>
    <BrowserRouter>
      <ThemeProvider>
        <PayPalScriptProvider options={initialOptions}>
          <Provider store={store}>
            <App />
          </Provider>
        </PayPalScriptProvider>
      </ThemeProvider>
    </BrowserRouter>
  </AuthProvider>
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.register();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
