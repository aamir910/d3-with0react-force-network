import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import { useLocation } from "react-router-dom";
import LegendData from "./LegendData";
import { Container, Row, Col } from "react-bootstrap";

const ForceDirectedGraph = () => {
  const location = useLocation();
  const { jsondata } = location.state;
  const svgRef = useRef();

  console.log("here is the jsondata ", jsondata);
  useEffect(() => {
    const width = 600;
    const height = 400;
    const uniqueClasses = new Set();
    let nodes = [];
    let uniqueNodes = new Set();
    jsondata.forEach((item) => {
      if (!uniqueClasses.has(item.entity_1_class)) {
        uniqueClasses.add(item.entity_1_class);
      }
      if (!uniqueNodes.has(item.entity_1)) {
        uniqueNodes.add(item.entity_1);
        nodes.push({ name: item.entity_1, class: item.entity_1_class, type: "entity_1" });
      }
      if (!uniqueNodes.has(item.entity_2)) {
        uniqueNodes.add(item.entity_2);
        nodes.push({ name: item.entity_2, class: item.entity_2_class, type: "entity_2" });
      }
    });

    console.log(nodes, "here are the nodes");
    console.log(uniqueClasses, "here are the unique classes");

    const links = jsondata.map((item) => ({
      source: item.entity_1,
      target: item.entity_2,
      value: item.link_strength,
    }));

    console.log(links, "here are the links");
    const svg = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", height)
      .style("display", "block")
      .style("margin", "auto");

    const colorScale = d3.scaleOrdinal().domain([...uniqueClasses]).range(d3.schemeCategory10);

    const simulation = d3
      .forceSimulation(nodes)
      .force(
        "link",
        d3.forceLink(links).id((d) => d.name).distance(100)
      )
      .force("charge", d3.forceManyBody().strength(-50))
      .force("center", d3.forceCenter(width , height ))
      .force("collide", d3.forceCollide().radius(10)); // Add forceCollide;

    const link = svg
      .selectAll("line")
      .data(links)
      .enter()
      .append("line")
      .attr("stroke", "#ccc")
      .attr("stroke-width", 2);

    let node;

    node = svg
      .selectAll(".node")
      .data(nodes)
      .enter()
      .append("g")
      .attr("class", "node")
      .call(d3.drag().on("start", dragstarted).on("drag", dragged).on("end", dragended));

    node
      .filter((d) => d.type === "entity_1")
      .append("rect")
      .attr("width", 30)
      .attr("height", 20)
      .attr("fill", (d) => colorScale(d.class));

    node
      .filter((d) => d.type === "entity_2")
      .append("circle")
      .attr("r", 10)
      .attr("fill", (d) => colorScale(d.class));

    node
      .append("text")
      .text((d) => d.name)
      .attr("dx", 6)
      .attr("dy", 0)
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
      node.attr("transform", (d) => `translate(${Math.max(0, Math.min(svgWidth, d.x))}
      ,${Math.max(0, Math.min(svgHeight, d.y))})`);
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

    return () => simulation.stop();
  }, []);

 
    return (
      <div className=" container mt-3  flex flex-col md:flex-row">
        {/* First column takes up 8/12 width on medium and larger screens */}
        <div className="w-full md:w-10/12">
          <h1 className=" text-3xl text-center md:text-left">Force Network Graph</h1>
          <svg ref={svgRef} className=" bg-orange-100 w-full h-auto"></svg>
        </div>
        {/* Second column takes up 4/12 width on medium and larger screens */}
        <div className=" container m-2 w-full md:w-2/12">
          <LegendData />
        </div>
      </div>
    );
};

export default ForceDirectedGraph;