import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

import { useLocation } from "react-router-dom";

const ForceDirectedGraph = () => {
  const location = useLocation();
  const { jsondata } = location.state;
  const svgRef = useRef();

  console.log("here is the jsondata ", jsondata);
  useEffect(() => {
    const width = 600;
    const height = 400;

    let nodes = [];
    let uniqueNodes = new Set();
    jsondata.forEach((item) => {
      if (!uniqueNodes.has(item.entity_1)) {
        uniqueNodes.add(item.entity_1);
        nodes.push({ name: item.entity_1, class: item.entity_1_class });
      }
      if (!uniqueNodes.has(item.entity_2)) {
        uniqueNodes.add(item.entity_2);
        nodes.push({ name: item.entity_2, class: item.entity_2_class });
      }
    });

    console.log(nodes, "here are the nodes");

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
      .force("center", d3.forceCenter(width / 2, height / 2));

    const link = svg
      .selectAll("line")
      .data(links)
      .enter()
      .append("line")
      .attr("stroke", "#ccc")
      .attr("stroke-width", 2);

    const node = svg
      .selectAll("circle")
      .data(nodes)
      .enter()
      .append("circle")
      .attr("r", 20)
      .attr("fill", function (d) {
        return d.class === "entity_1_class" ? "red" : "green";
      })
      .call(
        d3
          .drag()
          .on("start", dragstarted)
          .on("drag", dragged)
          .on("end", dragended)
      );

    node.append("title").text((d) => d.name);

    simulation.on("tick", () => {
      link
        .attr("x1", (d) => d.source.x)
        .attr("y1", (d) => d.source.y)
        .attr("x2", (d) => d.target.x)
        .attr("y2", (d) => d.target.y);

      node.attr("cx", (d) => d.x).attr("cy", (d) => d.y);
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
    <>
      <h1>force network graph</h1>
      <svg ref={svgRef}></svg>;
    </>
  );
};

export default ForceDirectedGraph;
