import * as React from 'react';
import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { UNIQUE_FRAMEWORKS } from '../constants';

interface FrameworkVisualizerProps {
  isActive: boolean;
}

const FrameworkVisualizer: React.FC<FrameworkVisualizerProps> = ({ isActive }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [activeNodeName, setActiveNodeName] = useState<string>('');

  useEffect(() => {
    if (!isActive || !svgRef.current) return;

    const width = 800;
    const height = 400;
    const svg = d3.select(svgRef.current);
    
    svg.selectAll("*").remove();

    const nodes = UNIQUE_FRAMEWORKS.map(f => ({
      id: f,
      group: Math.floor(Math.random() * 5)
    }));

    const links: any[] = [];
    // Create random connections to simulate a network
    for(let i = 0; i < nodes.length; i++) {
        const targets = Math.floor(Math.random() * 2) + 1;
        for(let j=0; j<targets; j++) {
            const targetIndex = Math.floor(Math.random() * nodes.length);
            if(targetIndex !== i) {
                links.push({ source: nodes[i].id, target: nodes[targetIndex].id });
            }
        }
    }

    const simulation = d3.forceSimulation(nodes as any)
      .force("link", d3.forceLink(links).id((d: any) => d.id).distance(50))
      .force("charge", d3.forceManyBody().strength(-30))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collide", d3.forceCollide().radius(10));

    const link = svg.append("g")
      .attr("stroke", "#333")
      .attr("stroke-opacity", 0.6)
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("stroke-width", 0.5);

    const node = svg.append("g")
      .attr("stroke", "#fff")
      .attr("stroke-width", 0.5)
      .selectAll("circle")
      .data(nodes)
      .join("circle")
      .attr("r", 3)
      .attr("fill", (d) => d3.schemeTableau10[d.group % 10] || "#666")
      .call(drag(simulation) as any);

    // Animation loop to highlight nodes
    let interval: any;
    if (isActive) {
      interval = setInterval(() => {
        const randomNode = nodes[Math.floor(Math.random() * nodes.length)];
        setActiveNodeName(randomNode.id);
        
        node.attr("fill", (d: any) => d.id === randomNode.id ? "#8b5cf6" : "#444")
            .attr("r", (d: any) => d.id === randomNode.id ? 8 : 3);
            
        link.attr("stroke", (d: any) => 
          d.source.id === randomNode.id || d.target.id === randomNode.id ? "#8b5cf6" : "#333"
        ).attr("stroke-width", (d: any) => 
          d.source.id === randomNode.id || d.target.id === randomNode.id ? 2 : 0.5
        ).attr("opacity", (d: any) => 
          d.source.id === randomNode.id || d.target.id === randomNode.id ? 1 : 0.1
        );

      }, 100);
    }

    simulation.on("tick", () => {
      link
        .attr("x1", (d: any) => d.source.x)
        .attr("y1", (d: any) => d.source.y)
        .attr("x2", (d: any) => d.target.x)
        .attr("y2", (d: any) => d.target.y);

      node
        .attr("cx", (d: any) => d.x)
        .attr("cy", (d: any) => d.y);
    });

    function drag(simulation: any) {
      function dragstarted(event: any) {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        event.subject.fx = event.subject.x;
        event.subject.fy = event.subject.y;
      }
      
      function dragged(event: any) {
        event.subject.fx = event.x;
        event.subject.fy = event.y;
      }
      
      function dragended(event: any) {
        if (!event.active) simulation.alphaTarget(0);
        event.subject.fx = null;
        event.subject.fy = null;
      }
      
      return d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended);
    }

    return () => {
      simulation.stop();
      clearInterval(interval);
    };
  }, [isActive]);

  return (
    <div className="w-full h-64 overflow-hidden relative glass-panel rounded-xl">
       <div className="absolute top-4 left-4 z-10 font-mono text-xs text-primary/80">
        SCANNING FRAMEWORKS: <span className="text-white">{activeNodeName}</span>
       </div>
      <svg ref={svgRef} viewBox="0 0 800 400" className="w-full h-full" />
    </div>
  );
};

export default FrameworkVisualizer;