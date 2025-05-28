"use client";
import { useCallback, useState, useRef, useEffect } from "react";
import {
  ReactFlow,
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  Background,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";

import { initialDummyNodesInAParentFlow } from "../components/InitialDummyNodesInAParentFlow";
import { initialEdgesInAParentFlow } from "../components/InitialEdgesInAParentFlow";
import { CustomParentNode } from "../components/InitialDummyNodesInAParentFlow";

const rfStyle = {
  backgroundColor: "#D0C0F7",
};

export default function ParentFlowTest() {
  const nodeTypes = { customParent: CustomParentNode };
  const reactFlowWrapper = useRef(null);
  const [nodes, setNodes] = useState(initialDummyNodesInAParentFlow);
  const [edges, setEdges] = useState(initialEdgesInAParentFlow);

  // --- Add this effect to auto-grow parent width ---
  useEffect(() => {
    // Find parent node
    const parentNode = nodes.find((n) => n.id === "A");
    if (!parentNode) return;

    // Find children of parent
    const children = nodes.filter((n) => n.parentId === "A");

    if (children.length === 0) return;

    // Calculate min/max X of children
    const minX = Math.min(...children.map((n) => n.position.x));
    const maxX = Math.max(
      ...children.map(
        (n) => n.position.x + (n.style?.width || 150) // fallback width
      )
    );
    const padding = 18; // Optional: add some padding

    const newWidth = maxX - minX + padding;

    // Only update if width changed
    if (parentNode.style?.width !== newWidth) {
      setNodes((nds) =>
        nds.map((n) =>
          n.id === "A"
            ? {
                ...n,
                style: {
                  ...n.style,
                  width: newWidth,
                },
              }
            : n
        )
      );
    }
  }, [nodes]);
  // --- End of effect ---

  const onNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [setNodes]
  );
  const onEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [setEdges]
  );
  const onConnect = useCallback(
    (connection) => setEdges((eds) => addEdge(connection, eds)),
    [setEdges]
  );

  // Helper to get the rightmost child node of parent "A"
  const getRightmostChild = () => {
    const children = nodes.filter((n) => n.parentId === "A");
    if (children.length === 0) return null;
    return children.reduce((rightmost, n) =>
      n.position.x > rightmost.position.x ? n : rightmost
    );
  };

  // Handler to add a new child node to the right of the last child
  const handlePaneClick = useCallback(
    (event) => {
      // Get rightmost child node
      const rightmost = getRightmostChild();
      const baseX = rightmost
        ? rightmost.position.x + (rightmost.style?.width || 150) + 40 // 40px gap
        : 100;
      const baseY = rightmost ? rightmost.position.y : 100;

      // Generate unique id
      const newId = `child-${Date.now()}`;

      // Add new node
      setNodes((nds) => [
        ...nds,
        {
          id: newId,
          type: "default",
          data: { label: `Child Node ${nds.length}` },
          position: { x: baseX, y: baseY },
          parentId: "A",
          sourcePosition: "right",
          targetPosition: "left",
        },
      ]);

      // Add edge if there is a rightmost node
      if (rightmost) {
        setEdges((eds) => [
          ...eds,
          {
            id: `e-${rightmost.id}-${newId}`,
            source: rightmost.id,
            target: newId,
            type: "default",
          },
        ]);
      }
    },
    [nodes]
  );

  return (
    <div className="flex flex-col min-h-screen text-gray-800">
      <main className="flex-1 bg-gray-100 relative" id="main-container">
        <h1 className="fixed top-5 z-10">
          Click anywhere on the canvas to create a new node
        </h1>
        <div
          style={{ height: "calc(100vh - 75px)", width: "calc(100% - 300px)" }}
          ref={reactFlowWrapper}
        >
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            fitView
            style={rfStyle}
            nodeTypes={nodeTypes}
            onPaneClick={handlePaneClick}
          >
            <Background />
          </ReactFlow>
        </div>
        {/* <Sidebar
          onNodeDrop={handleNodeDrop}
          onJobDragStart={handleDragStartForJob}
          onJobDrop={handleDropForJob}
        /> */}
      </main>
      <Footer nodes={nodes} edges={edges} />
    </div>
  );
}
