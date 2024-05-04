import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { useLocation } from "react-router-dom";
import Example from "./Navbar";
import '../../cssFiles/legend.css'

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
    link: null
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
    "violet"
  ];
  const color_link = [
    "grey",
    "pink",
    "cyan",
    "magenta",
    "lime",
    "teal",
    "brown",
    "navy"
  ];
  let node;
  let nodes = [];
  let uniqueClassesTemp = [];
  let uniqueClasses2Temp = [];
  let uniqLinkTemp = [];
  useEffect(() => {
    if(bool){

  
    const width = 600;
    const height = 400;
    let uniqueNodes = new Set();

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
          type: "entity_1"
        });
      }
      if (!uniqueNodes.has(item.entity_2)) {
        uniqueNodes.add(item.entity_2);
        nodes.push({
          name: item.entity_2,
          class: item.entity_2_class,
          type: "entity_2"
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
      type: item.Link_Type
    }));

    const svg = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", height)
      .style("display", "block")
      .style("margin", "auto");

      svg.selectAll('*').remove();
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
      link: colorScale_link
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
      .attr("stroke", (d) => colorScale_link(d.type))
      .attr('display', d => doneItems2.includes(d.target.class) ? 'none' : 'block');
; 

   

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
      node
        .attr(
          "transform",
          (d) =>
            `translate(${Math.max(0, Math.min(svgWidth, d.x))},${Math.max(
              0,
              Math.min(svgHeight, d.y)
            )})`
        )
     
    });

    function dragstarted(event) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    }

    function dragged(event) {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    }

    function dragended(event) {
      if (!event.active) simulation.alphaTarget(0);
      event.subject.fx = null;
      event.subject.fy = null;
    }
    bool =false;
    console.log('check1')
  }
  node
  .style("display", (d) =>
    doneItems2.includes(d.class) ? "none" : "block"
  );

    console.log(doneItems2, 'check2'); 
    // return () => simulation.stop();
  }, [jsondata, doneItems2]); // <-- Add doneItems2 as a dependency
 
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
          <div className='legend'>
            <h1 className='text-xl ml-2 font-bold'>Legend data</h1>
            <ul className='ml-1'>
              <li className='entity_1 font-semibold'> Entity 1 class</li>
              {uniqueClasses.map((entity_1_li, index) => (
                <li
                  key={index}
                  className='ml-6'
                  style={{
                    textDecoration: doneItems2.includes(entity_1_li) ? 'line-through' : 'none'
                  }}
                  onClick={() => handleClick(entity_1_li)}
                >
                  <span
                    className="circle"
                    style={{
                      backgroundColor: colorScales.entity_1(entity_1_li),
                      display: 'inline-block',
                      width: '10px',
                      height: '10px',
                      borderRadius: '50%',
                      marginRight: '5px'
                    }}
                  ></span>
                  {entity_1_li}
                </li>
              ))}
            </ul>
            <ul className='ml-1' >
              <li className='entity_2 font-semibold'> Entity 2 class</li>
              {uniqueClasses2.map((entity_2_li, index) => (
                <li
                  key={index}
                  className='ml-6'
                  style={{
                    textDecoration: doneItems2.includes(entity_2_li) ? 'line-through' : 'none'
                  }}
                  onClick={() => handleClick(entity_2_li)}
                >
                  <span
                    className="circle"
                    style={{
                      backgroundColor: colorScales.entity_2(entity_2_li),
                      display: 'inline-block',
                      width: '10px',
                      height: '10px',
                      borderRadius: '50%',
                      marginRight: '5px'
                    }}
                  ></span>
                  {entity_2_li}
                </li>
              ))}
            </ul>
            <ul className='ml-1'>
              <li className='entity_1 font-semibold'> Link Type</li>
              {uniqueLinks.map((link_type, index) => (
                <li
                  key={index}
                  className='ml-6'
                  style={{
                    textDecoration: doneItems2.includes(link_type) ? 'line-through' : 'none'
                  }}
                  onClick={() => handleClick(link_type)}
                >
                  <span
                    className="line"
                    style={{
                      backgroundColor: colorScales.link(link_type),
                      display: 'inline-block',
                      width: '10px',
                      height: '2px'
                    }}
                  ></span>
                  {link_type}
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
