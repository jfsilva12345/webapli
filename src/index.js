import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import 'bootstrap/dist/css/bootstrap.css';

import { BrowserRouter, Routes, Route } from "react-router-dom";

import Product from './pages/Product';
import Login from './pages/Login';
import Crud from './pages/Crud';


ReactDOM.render(
  <BrowserRouter>
    <Routes>
      <Route exact path="/" element={<Product />} />
      <Route exact path="/login" element={<Login />} />
      <Route exact path="/crud" element={<Crud />} />

      
    </Routes>
  </BrowserRouter>,
  document.getElementById('root'));