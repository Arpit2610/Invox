import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import 'antd/dist/reset.css';

// Add this code to handle ResizeObserver error
const reportWebVitals = onPerfEntry => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      getCLS(onPerfEntry);
      getFID(onPerfEntry);
      getFCP(onPerfEntry);
      getLCP(onPerfEntry);
      getTTFB(onPerfEntry);
    });
  }
};

// Create root and handle ResizeObserver error
const root = ReactDOM.createRoot(document.getElementById('root'));

// Prevent ResizeObserver error from showing in console
const resizeObserverError = window.ResizeObserver;
window.ResizeObserver = class ResizeObserver extends resizeObserverError {
  constructor(callback) {
    super(callback);
    this.disconnect = () => {
      super.disconnect();
    };
  }
};

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

reportWebVitals();
