import React from 'react';
import ReactDOM from 'react-dom/client';

function App() {
  return <h1>Hello, World! The frontend build is working.</h1>;
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);