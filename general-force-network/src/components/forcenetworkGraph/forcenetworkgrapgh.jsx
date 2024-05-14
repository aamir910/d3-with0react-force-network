import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { useLocation } from "react-router-dom";
import Example from "./Navbar";
import "../../cssFiles/legend.css";

const ForceDirectedGraph = () => {
  let bool = true;

  const location = useLocation();

  const { jsondata } = location.state;

  const svgRef = useRef();

  const [doneItems2, setDoneItems2] = useState([]);
  const [uniqueClasses, setUniqueClasses] = useState([]);
  const [uniqueClasses2, setUniqueClasses2] = useState([]);
  const [uniqueLinks, setUniqueLinks] = useState([]);
  const [colorScales, setColorScales] = useState({
    entity_1: null,
    entity_2: null,
    link: null,
  });

  const colors = [
    "red",
    "blue",
    "green",
    "yellow",
    "orange",
    "purple",
    "pink",
    "cyan",
    "magenta",
    "lime",
    "teal",
    "brown",
    "navy",
    "olive",
    "maroon",
    "aquamarine",
    "coral",
    "gold",
    "silver",
    "violet",
  ];
  const color_link = [
    "grey",
    "pink",
    "cyan",
    "magenta",
    "lime",
    "teal",
    "brown",
    "navy",
  ];
  let node;
  let nodes = [];
  let uniqueClassesTemp = [];
  let uniqueClasses2Temp = [];
  let uniqLinkTemp = [];
// here is the functionality of the double sided slider 

let linkStrengthValues = jsondata.map(item => parseFloat(item.link_strength));

// Find the minimum and maximum values
let minStrength = Math.min(...linkStrengthValues);
let maxStrength = Math.max(...linkStrengthValues);

const LinkGap = 0.1;


let Linkstep ;
if(maxStrength - minStrength >9 ){
  Linkstep = 1.0;
}
else{
  Linkstep = 0.1;
}


const [minPrice, setMinPrice] = useState(minStrength);
const [maxPrice, setMaxPrice] = useState(maxStrength);
const [minRange, setMinRange] = useState(minStrength);
const [maxRange, setMaxRange] = useState(maxStrength);



const handlePriceInputChange = (e) => {
  const inputName = e.target.className;
  const inputValue = parseFloat(e.target.value);

  if (inputName === "input-min") {
    if (maxPrice - inputValue >= LinkGap && inputValue >= parseFloat(minRange)) {
      setMinPrice(inputValue);
      setMinRange(inputValue);
    }
  } else {
    if (inputValue - minPrice >= LinkGap && inputValue <= parseFloat(maxRange)) {
      setMaxPrice(inputValue);
      setMaxRange(inputValue);
    }
  }
};

const handleRangeInputChange = (e) => {
  const inputName = e.target.className;
  const inputValue = parseFloat(e.target.value);

  if (inputName === "range-min") {
    if (maxPrice - inputValue >= LinkGap) {
      setMinRange(inputValue);
      setMinPrice(inputValue);
    }
  } else {
    if (inputValue - minPrice >= LinkGap) {
      setMaxRange(inputValue);
      setMaxPrice(inputValue);
    }
  }
};

const rangeStyle = {
  left: `${((minPrice / parseFloat(maxRange)) * 100)}%`,
  right: `${100 - ((maxPrice / parseFloat(maxRange)) * 100)}%`
};
// here is the functionality of the double sided slider ended 


  useEffect(() => {
    if (bool) {
      const width = 600;
      const height = 400;
      let uniqueNodes = new Set();
      console.log(jsondata, "here is the json data ");
    
      jsondata.forEach((item) => {
        if (!uniqueClassesTemp.includes(item.entity_1_class)) {
          uniqueClassesTemp.push(item.entity_1_class);
        }
        if (!uniqueClasses2Temp.includes(item.entity_2_class)) {
          uniqueClasses2Temp.push(item.entity_2_class);
        }
        if (!uniqLinkTemp.includes(item.Link_Type)) {
          uniqLinkTemp.push(item.Link_Type);
        }

        if (!uniqueNodes.has(item.entity_1)) {
          uniqueNodes.add(item.entity_1);
          nodes.push({
            name: item.entity_1,
            class: item.entity_1_class,
            type: "entity_1",
          });
        }
        if (!uniqueNodes.has(item.entity_2)) {
          uniqueNodes.add(item.entity_2);
          nodes.push({
            name: item.entity_2,
            class: item.entity_2_class,
            type: "entity_2",
          });
        }
      });

      setUniqueClasses(uniqueClassesTemp);
      setUniqueClasses2(uniqueClasses2Temp);
      setUniqueLinks(uniqLinkTemp);

      const links = jsondata.map((item) => ({
        source: item.entity_1,
        target: item.entity_2,
        value: item.link_strength,
        type: item.Link_Type,
      }));

      const svg = d3
        .select(svgRef.current)
        .attr("width", width)
        .attr("height", height)
        .style("display", "block")
        .style("margin", "auto");

      svg.selectAll("*").remove();
      const colorScale_entity_1 = d3
        .scaleOrdinal()
        .domain([...uniqueClassesTemp])
        .range(colors);

      const colorScale_entity_2 = d3
        .scaleOrdinal()
        .domain([...uniqueClasses2Temp])
        .range(colors);

      const colorScale_link = d3
        .scaleOrdinal()
        .domain([...uniqLinkTemp])
        .range(color_link);

      setColorScales({
        entity_1: colorScale_entity_1,
        entity_2: colorScale_entity_2,
        link: colorScale_link,
      });

      const simulation = d3
        .forceSimulation(nodes)
        .force(
          "link",
          d3
            .forceLink(links)
            .id((d) => d.name)
            .distance(100)
        )
        .force("charge", d3.forceManyBody().strength(-50))
        .force("center", d3.forceCenter(width, height))
        .force("collide", d3.forceCollide().radius(10));

      //creation of the links
      const link = svg
        .selectAll("line")
        .data(links)
        .enter()
        .append("line")
        .attr("stroke-width", 2)
        .attr("stroke", (d) => colorScale_link(d.type));

      //  link custom filteration here is
      // link.attr('display', d => doneItems2.includes(d.target.class) ? 'none' : 'block');

      //  link custom filteration here is ended
      node = svg
        .selectAll(".node")
        .data(nodes)
        .enter()
        .append("g")
        .attr("class", "node")
        .call(
          d3
            .drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended)
        );

      node
        .filter((d) => d.type === "entity_1")
        .append("rect")
        .attr("width", 30)
        .attr("height", 20)
        .attr("fill", (d) => colorScale_entity_1(d.class));

      node
        .filter((d) => d.type === "entity_2")
        .append("circle")
        .attr("r", 10)
        .attr("fill", (d) => colorScale_entity_2(d.class));

      node
        .append("text")
        .text((d) => d.name)
        .attr("dx", 6)
        .style("font-size", "12.208px")
        .style("font-family", "Arial")
        .attr("text-anchor", "middle")
        .style("fill", "black")
        .attr("dy", "1.5rem");

      const svgWidth = +svg.node().getBoundingClientRect().width;
      const svgHeight = +svg.node().getBoundingClientRect().height;
      simulation.on("tick", () => {
        link
          .attr("x1", (d) => d.source.x)
          .attr("y1", (d) => d.source.y)
          .attr("x2", (d) => d.target.x)
          .attr("y2", (d) => d.target.y);
        node.attr(
          "transform",
          (d) =>
            `translate(${Math.max(0, Math.min(svgWidth, d.x))},${Math.max(
              0,
              Math.min(svgHeight, d.y)
            )})`
        );
      });

      function dragstarted(event, d) {
        // if (d !== selectedNode) return; // Allow dragging only for the selected node
        if (!event.active) simulation.alphaTarget(0.3).restart();
      }

      function dragged(event, d) {
        // if (d !== selectedNode) return; // Allow dragging only for the selected node
        d.fx = event.x;
        d.fy = event.y;
      }

      function dragended(event, d) {
        // if (d !== selectedNode) return; // Allow dragging only for the selected node
        if (!event.active) simulation.alphaTarget(0);
      }

      bool = false;
    }

    console.log(doneItems2, "check2");
    // return () => simulation.stop();
  }, [jsondata]); // <-- Add doneItems2 as a dependency


  useEffect(() => {

  let filteredLinks = d3.selectAll("line").filter(link => {
      // Filter links with a value greater than 5
      return link.value < minRange || link.value > maxRange
    });

    d3.selectAll(".node").style("display", (d) =>
      doneItems2.includes(d.class) ? "none" : "block"
    );
  
    d3.selectAll("line").style("display", (d) => {
      console.log(d)
      if (doneItems2.includes(d.source.class) || doneItems2.includes(d.type) 
        || doneItems2.includes(d.target.class) 
       ) {
        return "none";
      } else {
        return "block";
      }
    });

     // Hide the filtered links
     filteredLinks.style("display", "none");

  }, [doneItems2 , minRange , maxRange ]); 



  const handleClick = (item) => {

    if (doneItems2.includes(item)) {
      setDoneItems2(doneItems2.filter((doneItem) => doneItem !== item));
    } else {
      setDoneItems2([...doneItems2, item]);
    }
  };


  
 

  return (
    <>
      <Example />
      <div className=" container mt-3  flex flex-col md:flex-row ">
        <div className="w-full md:w-10/12">
          <h1 className=" text-3xl text-center md:text-left">
            Force Network Graph
          </h1>
 

          <svg ref={svgRef} className="  w-full h-auto"></svg>
        </div>
        <div className=" container m-1 w-full md:w-2/12">
{/* here is the double slider  */}


<div className="your-component mt-1 mb-3"  >
      <div className="price-input">
        <div className="field">
          <span>Min</span>
          <input type="number" className="input-min" value={minPrice} step={ Linkstep }  onChange={handlePriceInputChange} />
        </div>
        <div className="separator">-</div>
        <div className="field">
          <span>Max</span>
          <input type="number" className="input-max" value={maxPrice} step={ Linkstep } onChange={handlePriceInputChange} />
        </div>
      </div>
      <div className="slider">
        <div className="progress" style={rangeStyle}></div>
      </div>
      <div className="range-input">
        <input id="min_slider" type="range" className="range-min" min={minStrength} max={maxStrength} step="0.1" value={minRange} onChange={handleRangeInputChange} />
        <input id="max_slider" type="range" className="range-max" min="4.0" max="9.0"
        step={Linkstep} value={maxRange} onChange={handleRangeInputChange} />
      </div>
    </div>

{/* ended double sider  */}

          <div className="legend">
            <h1 className="text-xl ml-2 font-bold">Legend data</h1>
            <ul className="ml-1">
              <li className="entity_1 font-semibold"> Entity 1 class</li>
              {uniqueClasses.map((entity_1_li, index) => (
                <li
                  key={index}
                  className="ml-6"
                  style={{
                    textDecoration: doneItems2.includes(entity_1_li)
                      ? "line-through"
                      : "none",
                  }}
                  onClick={() => handleClick(entity_1_li)}>
                  <span
                    className="circle"
                    style={{
                      backgroundColor: colorScales.entity_1(entity_1_li),
                      display: "inline-block",
                      width: "10px",
                      height: "10px",
                      borderRadius: "50%",
                      marginRight: "5px",
                    }}></span>
                  <span onClick={() => handleClick(entity_1_li)}>
                    {entity_1_li}
                  </span>
                </li>
              ))}
            </ul>
            <ul className="ml-1">
              <li className="entity_2 font-semibold"> Entity 2 class</li>
              {uniqueClasses2.map((entity_2_li, index) => (
                <li
                  key={index}
                  className="ml-6"
                  style={{
                    textDecoration: doneItems2.includes(entity_2_li)
                      ? "line-through"
                      : "none",
                  }}>
                  <span
                    className="circle"
                    style={{
                      backgroundColor: colorScales.entity_2(entity_2_li),
                      display: "inline-block",
                      width: "10px",
                      height: "10px",
                      borderRadius: "50%",
                      marginRight: "5px",
                    }}></span>
                  <span onClick={() => handleClick(entity_2_li)}>
                    {entity_2_li}
                  </span>
                </li>
              ))}
            </ul>
            <ul className="ml-1">
              <li className="entity_1 font-semibold"> Link Type</li>
              {uniqueLinks.map((link_type, index) => (
                <li
                  key={index}
                  className="ml-6"
                  style={{
                    textDecoration: doneItems2.includes(link_type)
                      ? "line-through"
                      : "none",
                  }}>
                  <span
                    className="line"
                    style={{
                      backgroundColor: colorScales.link(link_type),
                      display: "inline-block",
                      width: "10px",
                      height: "2px",
                    }}></span>
                  <span onClick={() => handleClick(link_type)}>
                    {link_type}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default ForceDirectedGraph;
