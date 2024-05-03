import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { useLocation } from "react-router-dom";
import LegendData from "./LegendData";
import Example from "./Navbar";
import ForceDirectedGraph from "./forcenetworkgrapgh";
const Maingraph = () => {
    const location = useLocation();
    const { jsondata } = location.state;

  return (
    
    <div>
      <Example/>
      {/* <ForceDirectedGraph jsondata = {jsondata}/> */}
     <LegendData/>
    </div>
  )
}

export default Maingraph
