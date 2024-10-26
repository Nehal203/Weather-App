// src/main.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App'; // Ensure the correct path
import './index.css'; // If you have any CSS file

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
