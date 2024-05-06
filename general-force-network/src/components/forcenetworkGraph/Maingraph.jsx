import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

const ForceGraph = ({ data, width, height }) => {
  const svgRef = useRef();
  const [selectedNodes, setSelectedNodes] = useState([]);

  const nodeClicked = (event, d) => {
    const index = selectedNodes.indexOf(d.id);
    if (index === -1) {
      setSelectedNodes([...selectedNodes, d.id]);
    } else {
      setSelectedNodes(selectedNodes.filter(node => node !== d.id));
    }
  };

  useEffect(() => {
    const svg = d3.select(svgRef.current);

    const simulation = d3.forceSimulation(data.nodes)
      .force('link', d3.forceLink(data.links).id(d => d.id))
      .force('charge', d3.forceManyBody().strength(-50))
      .force('center', d3.forceCenter(width / 2, height / 2));

    const link = svg.select('.links')
      .selectAll('line')
      .data(data.links)
      .enter().append('line')
      .attr('class', 'link')
      .attr('stroke', '#999')
      .attr('stroke-opacity', 0.6)
      .attr('stroke-width', d => Math.sqrt(d.value));

    const node = svg.select('.nodes')
      .selectAll('circle')
      .data(data.nodes)
      .enter().append('circle')
      .attr('class', 'node')
      .attr('r', 5)
      .attr('fill', d => selectedNodes.includes(d.id) ? '#d62728' : '#1f77b4')
      .call(d3.drag()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended))
      .on('click', nodeClicked);

    node.append('title')
      .text(d => d.id);

    simulation
      .nodes(data.nodes)
      .on('tick', () => {
        link
          .attr('x1', d => d.source.x)
          .attr('y1', d => d.source.y)
          .attr('x2', d => d.target.x)
          .attr('y2', d => d.target.y);

        node
          .attr('cx', d => d.x)
          .attr('cy', d => d.y);
      });

    simulation.force('link')
      .links(data.links);

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
  }, [data.links, data.nodes, height, selectedNodes, width]);

  useEffect(() => {
    d3.selectAll('.node')
      .style('display', d => selectedNodes.includes(d.id) ? 'none' : 'block');
    d3.selectAll('.link')
      .style('display', d => selectedNodes.includes(d.source.id) || selectedNodes.includes(d.target.id) ? 'none' : 'block');
  }, [selectedNodes]);

  return (
    <>
      <svg ref={svgRef} width={width} height={height}>
        <g className="links"></g>
        <g className="nodes"></g>
      </svg>
      <div id='legend'> 
        <h2>Legend</h2>
        <ul>
          {data.nodes.map(node =>
            <li 
              key={node.id} 
              style={{textDecoration: selectedNodes.includes(node.id) ? 'line-through' : 'none'}}
              onClick={e => nodeClicked(e, node)}
            >
              {node.id}
            </li>
          )}
        </ul>
      </div>
    </>
  );
};

const GraphContainer = () => {
  const data = {
    nodes: [
      { id: 'A' },
      { id: 'B' },
      { id: 'C' },
      { id: 'D' },
      { id: 'E' },
    ],
    links: [
      { source: 'A', target: 'B' },
      { source: 'B', target: 'C' },
      { source: 'C', target: 'D' },
      { source: 'D', target: 'E' },
      { source: 'E', target: 'A' },
    ],
  };

  return (
    <div>
      <h1>Force Directed Graph</h1>
      <ForceGraph data={data} width={600} height={400} />
    </div>
  );
};

export default GraphContainer;
