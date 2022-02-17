import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import OrderBook from "./OrderBook";
import Positions from "./Positions";
import { Route, BrowserRouter, Routes } from "react-router-dom";

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route path="orders" element={<OrderBook />} />
          <Route path="positions" element={<Positions />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById("root")
);
