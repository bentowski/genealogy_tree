import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/index.css';
import App from './App';
import { AuthProvider } from "./contexts/AuthProviderContext";
import { BrowserRouter, Routes, Route } from "react-router-dom";
//import {WebsocketUpdateProvider} from "./contexts/WebSocketContextUpdate";

const root: ReactDOM.Root = ReactDOM.createRoot(document.getElementById('root') as HTMLDivElement);
root.render(
  <React.StrictMode>
      <BrowserRouter>
          {/* <WebsocketUpdateProvider> */}
              <AuthProvider>
                  <Routes>
                      <Route path="/*" element={<App />} />
                  </Routes>
              </AuthProvider>
          {/* </WebsocketUpdateProvider> */}
      </BrowserRouter>
  </React.StrictMode>
);
