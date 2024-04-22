import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const ForceDirectedGraph = () => {
  const svgRef = useRef();

  useEffect(() => {
    const width = 600;
    const height = 400;

    const nodes = [
      { id: 0, name: 'Node 1' },
      { id: 1, name: 'Node 2' },
      { id: 2, name: 'Node 3' },
      { id: 3, name: 'Node 4' },
    ];

    const links = [
      { source: 0, target: 1 },
      { source: 1, target: 2 },
      { source: 2, target: 3 },
      { source: 3, target: 0 },
    ];

    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height)
      .style('display', 'block')
      .style('margin', 'auto');

    const simulation = d3.forceSimulation(nodes)
      .force('link', d3.forceLink(links).id(d => d.id).distance(100))
      .force('charge', d3.forceManyBody().strength(-100))
      .force('center', d3.forceCenter(width / 2, height / 2));

    const link = svg.selectAll('line')
      .data(links)
      .enter()
      .append('line')
      .attr('stroke', '#ccc')
      .attr('stroke-width', 2);

    const node = svg.selectAll('circle')
      .data(nodes)
      .enter()
      .append('circle')
      .attr('r', 20)
      .attr('fill', 'blue')
      .call(d3.drag()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended));

    node.append('title')
      .text(d => d.name);

    simulation.on('tick', () => {
      link
        .attr('x1', d => d.source.x)
        .attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x)
        .attr('y2', d => d.target.y);

      node
        .attr('cx', d => d.x)
        .attr('cy', d => d.y);
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

  return <svg ref={svgRef}></svg>;
};

export default ForceDirectedGraph;