// App.jsx

import React from "react";
import SelectType from "./components/selecttype.jsx";
import {  Routes, Route } from "react-router-dom";
import ForceDirectedGraph from "./components/forcenetworkGraph/forcenetworkgrapgh.jsx";
import UploadFile from "./components/UploadFile.jsx";
import ForceGraph from "./components/forcenetworkGraph/Maingraph.jsx";
import YourComponent from "./components/forcenetworkGraph/dynamicslider.jsx";
function App() {
  return (
    <Routes>
          {/* <Route  path="/" element={ <SelectType/>} /> */}
          <Route path="upload-file" element={<UploadFile/>} />
          <Route path="force-directed-graph" element={<ForceDirectedGraph />} />
          
          {/* <Route path="/" element={<ForceGraph/>} /> */}
          
          <Route  path="/" element={ <YourComponent/>} />
    </Routes>
  );
}

export default App;
