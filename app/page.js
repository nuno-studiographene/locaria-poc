////////////
"use client";
import { useState, useCallback } from "react";
import Draggable from "react-draggable";
import {
  ReactFlow,
  Background,
  Controls,
  applyNodeChanges,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import Footer from "./components/Footer";
import DefaultNode from "./components/DefaultNode";
import CustomControls from "./components/CustomControls";
import Sidebar from "./components/Sidebar";

export default function Home() {
  // Initial nodes and edges
  const initialNodes = [
    {
      id: "start",
      type: "input",
      data: { label: "START" },
      position: { x: 50, y: 100 },
    },
    {
      id: "language-combination",
      data: {
        label: (
          <div className="p-2">
            <h3 className="font-bold">Language Combination</h3>
            <select
              className="mt-2 p-1 border border-gray-300 rounded"
              onChange={(e) => handleLanguageChange(e.target.value)}
            >
              <option value="">Select</option>
              <option value="pt-en">Portuguese-English</option>
              <option value="es-en">Spanish-English</option>
            </select>
          </div>
        ),
      },
      position: { x: 250, y: 100 },
    },
  ];

  const initialEdges = [
    {
      id: "start-to-language-combination",
      source: "start",
      target: "language-combination",
      type: "straight",
    },
  ];

  // State for nodes, edges, and history
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);
  const [history, setHistory] = useState([
    { nodes: initialNodes, edges: initialEdges },
  ]);
  const [redoStack, setRedoStack] = useState([]);
  const [placeholderNode, setPlaceholderNode] = useState(null);

  // Update history when nodes or edges change
  const updateHistory = (newNodes, newEdges) => {
    setHistory((prevHistory) => [
      ...prevHistory,
      { nodes: newNodes, edges: newEdges },
    ]);
    setRedoStack([]); // Clear redo stack on new action
  };

  // Handle language selection
  const handleLanguageChange = (value) => {
    if (!value) return;
    const newNode = {
      id: "localisation",
      type: "default",
      position: { x: 450, y: 100 },
      data: {
        label: (
          <DefaultNode
            handleRemoveNode={handleRemoveNode}
            nodeType="Localisation"
          />
        ),
      },
    };

    const newEdge = {
      id: "language-combination-to-localisation",
      source: "language-combination",
      target: "localisation",
      type: "straight",
    };

    const newNodes = [...nodes, newNode];
    const newEdges = [...edges, newEdge];

    setNodes(newNodes);
    setEdges(newEdges);
    updateHistory(newNodes, newEdges);
  };

  // Handle node removal
  const handleRemoveNode = (nodeId) => {
    const newNodes = nodes.filter(
      (node) => node.id !== nodeId && node.id !== "placeholder" // Remove the placeholder as well
    );
    const newEdges = edges.filter(
      (edge) => edge.source !== nodeId && edge.target !== nodeId
    );

    setNodes(newNodes);
    setEdges(newEdges);
    updateHistory(newNodes, newEdges);
  };

  // Clear the entire canvas
  const handleClearCanvas = () => {
    setNodes([]);
    setEdges([]);
    updateHistory([], []);
  };

  // Undo functionality
  const handleUndo = () => {
    if (history.length > 1) {
      const lastState = history[history.length - 2];
      setRedoStack((prevRedo) => [history[history.length - 1], ...prevRedo]);
      setHistory((prevHistory) => prevHistory.slice(0, -1));
      setNodes(lastState.nodes);
      setEdges(lastState.edges);
    }
  };

  // Redo functionality
  const handleRedo = () => {
    if (redoStack.length > 0) {
      const nextState = redoStack[0];
      setRedoStack((prevRedo) => prevRedo.slice(1));
      setHistory((prevHistory) => [...prevHistory, nextState]);
      setNodes(nextState.nodes);
      setEdges(nextState.edges);
    }
  };

  // Handle drag start
  const handleDragStart = (
    event,
    nodeType,
    category,
    nodes = [],
    edges = []
  ) => {
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.setData("category", category); // Set the category
    event.dataTransfer.setData("nodes", JSON.stringify(nodes)); // Pass nodes
    event.dataTransfer.setData("edges", JSON.stringify(edges)); // Pass edges
    event.dataTransfer.effectAllowed = "move";
  };

  // Handle drop
  const handleDrop = (event) => {
    event.preventDefault();

    const reactFlowBounds = event.target.getBoundingClientRect();
    const nodeType = event.dataTransfer.getData("application/reactflow");
    const nodeCategory = event.dataTransfer.getData("category"); // Retrieve the category (template or job)

    if (nodeCategory === "template") {
      // Clear the canvas and apply the predefined set of nodes
      setNodes(premiumLocalisationTemplateNodes);
      setEdges(premiumLocalisationTemplateEdges);
      updateHistory(
        premiumLocalisationTemplateNodes,
        premiumLocalisationTemplateEdges
      );
    } else if (nodeCategory === "job") {
      // Handle job node creation
      const position = {
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      };

      const newNode = {
        id: `${nodeType}-${Date.now()}`,
        type: "default",
        position,
        data: {
          label: (
            <DefaultNode
              handleRemoveNode={handleRemoveNode}
              nodeType={nodeType}
            />
          ),
        },
      };

      const newNodes = [...nodes, newNode];
      setNodes(newNodes);
      updateHistory(newNodes, edges);
    }
  };

  // Allow drop
  const handleDragOver = (event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  };

  // Handle node changes (e.g., position updates)
  const onNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );

  // Handle node drop
  const handleNodeDrop = (nodeType, category, position) => {
    console.log("Node dropped:", nodeType, category, position);
    if (category === "template") {
      setNodes(premiumLocalisationTemplateNodes);
      setEdges(premiumLocalisationTemplateEdges);
      updateHistory(
        premiumLocalisationTemplateNodes,
        premiumLocalisationTemplateEdges
      );
    } else if (category === "job") {
      const newNode = {
        id: `${nodeType}-${Date.now()}`,
        type: "default",
        position,
        data: {
          label: (
            <DefaultNode
              handleRemoveNode={handleRemoveNode}
              nodeType={nodeType}
            />
          ),
        },
      };

      const newNodes = [...nodes, newNode];
      setNodes(newNodes);
      updateHistory(newNodes, edges);
    }
  };

  // Handle drag start for jobs
  const handleDragStartForJob = () => {
    // Find the last node
    const lastNode = nodes[nodes.length - 1];

    if (lastNode) {
      // Create a placeholder node to the right of the last node
      const placeholder = {
        id: "placeholder",
        type: "default",
        position: { x: lastNode.position.x + 200, y: lastNode.position.y },
        data: { label: <div className="bg-gray-300 w-20 h-20"></div> },
      };

      setPlaceholderNode(placeholder);
      setNodes((prevNodes) => [...prevNodes, placeholder]);
      /* setEdges((prevEdges) => [
        ...prevEdges,
        {
          id: `${lastNode.id}-to-placeholder`,
          source: lastNode.id,
          target: placeholder.id,
          type: "straight",
        },
      ]); */
    }
  };

  // Handle drop for jobs
  const handleDropForJob = (nodeType) => {
    if (placeholderNode) {
      // Replace the placeholder with the actual node
      const newNode = {
        id: `${nodeType}-${Date.now()}`,
        type: "default",
        position: placeholderNode.position,
        data: {
          label: (
            <DefaultNode
              handleRemoveNode={handleRemoveNode}
              nodeType={nodeType}
            />
          ),
        },
      };

      // Find the last node (before the placeholder)
      const lastNode = nodes[nodes.length - 2];

      // Create an edge connecting the last node to the new node
      const newEdge = {
        id: `${lastNode.id}-to-${newNode.id}`,
        source: lastNode.id,
        target: newNode.id,
        type: "straight",
      };

      // Update nodes and edges
      setNodes((prevNodes) =>
        prevNodes.filter((node) => node.id !== "placeholder").concat(newNode)
      );
      setEdges((prevEdges) => [...prevEdges, newEdge]);

      // Clear the placeholder
      setPlaceholderNode(null);

      // Update history
      updateHistory(
        nodes.filter((node) => node.id !== "placeholder").concat(newNode),
        [...edges, newEdge]
      );
    }
  };

  //template node
  const premiumLocalisationTemplateNodes = [
    {
      id: "start",
      type: "input",
      data: { label: "START" },
      position: { x: 50, y: 100 },
    },
    {
      id: "language-combination",
      data: {
        label: (
          <div className="p-2">
            <h3 className="font-bold">Language Combination</h3>
            <select
              className="mt-2 p-1 border border-gray-300 rounded"
              onChange={(e) => handleLanguageChange(e.target.value)}
            >
              <option value="">Select</option>
              <option value="pt-en">Portuguese-English</option>
              <option value="es-en">Spanish-English</option>
            </select>
          </div>
        ),
      },
      position: { x: 250, y: 100 },
    },
    {
      id: "localisation",
      type: "default",
      position: { x: 450, y: 100 },
      data: {
        label: (
          <DefaultNode
            handleRemoveNode={handleRemoveNode}
            nodeType="Localisation"
          />
        ),
      },
    },
    {
      id: "end",
      type: "output",
      data: { label: "END" },
      position: { x: 650, y: 100 },
    },
  ];

  const premiumLocalisationTemplateEdges = [
    {
      id: "start-to-language-combination",
      source: "start",
      target: "language-combination",
      type: "straight",
    },
    {
      id: "language-combination-to-localisation",
      source: "language-combination",
      target: "localisation",
      type: "straight",
    },
    {
      id: "localisation-to-end",
      source: "localisation",
      target: "end",
      type: "straight",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen text-gray-800">
      <main className="flex-1 bg-gray-100 relative" id="main-container">
        <div
          style={{ height: "calc(100vh - 75px)", width: "calc(100% - 300px)" }}
        >
          <ReactFlow
            nodes={nodes}
            edges={edges}
            fitView
            className="h-full w-full"
            nodesDraggable={true}
            onNodesChange={onNodesChange}
          >
            {nodes.length === 0 && edges.length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="text-gray-500 text-center">
                  Drag Templates or Jobs from the sidebar and drop them here to
                  begin.
                </p>
              </div>
            )}
            <Background />
            <Controls>
              <CustomControls
                handleClearCanvas={handleClearCanvas}
                handleUndo={handleUndo}
                handleRedo={handleRedo}
              />
            </Controls>
          </ReactFlow>
        </div>
        <Sidebar
          onNodeDrop={handleNodeDrop}
          onJobDragStart={handleDragStartForJob}
          onJobDrop={handleDropForJob}
        />
      </main>
      <Footer nodes={nodes} edges={edges} />
    </div>
  );
}
