// App.jsx

import React from "react";
import SelectType from "./components/selecttype.jsx";
import {  Routes, Route } from "react-router-dom";
import ForceDirectedGraph from "./components/forcenetworkgrapgh.jsx";
import UploadFile from "./components/UploadFile.jsx";
function App() {
  return (
    <Routes>
          <Route  path="/" element={ <SelectType/>} />
          <Route path="upload-file" element={<UploadFile/>} />
          <Route path="force-directed-graph" element={<ForceDirectedGraph />} />
    </Routes>
  );
}

export default App;
