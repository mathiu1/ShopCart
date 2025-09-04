import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {BrowserRouter} from "react-router-dom"
import { HelmetProvider } from 'react-helmet-async';
import {Provider} from "react-redux";
import store from "./store.js"



createRoot(document.getElementById('root')).render(

  <Provider store={store}>
  <HelmetProvider>
  <BrowserRouter>
    <App />
 </BrowserRouter>
 </HelmetProvider></Provider>
)
