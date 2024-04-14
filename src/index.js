import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import Home from "./Home";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import App from "./App";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <>
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/chat" element={<App />} />
        {/* <Route path="/delete" element={<Add />} /> */}
      </Routes>
    </Router>
  </>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
