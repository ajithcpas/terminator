import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import { Route, BrowserRouter, Routes, Navigate } from "react-router-dom";
import App from "./App";
import OrderBook from "./orders/OrderBook";
import PositionBook from "./positions/PositionBook";
import Dashboard from "./Dashboard";

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route path="" element={<Navigate to="dashboard" />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="orders" element={<OrderBook />} />
          <Route path="positions" element={<PositionBook />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById("root")
);
