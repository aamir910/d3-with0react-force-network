// App.jsx

import React from "react";
import SelectType from "./components/selecttype.jsx";
import {  Routes, Route } from "react-router-dom";

function App() {
  return (
    <Routes>
          <Route  path="/" element={ <SelectType/>} />
    </Routes>
  );
}

export default App;
