import Draggable from "react-draggable";
import { useRef, useState } from "react";

const Sidebar = ({ onNodeDrop, onJobDragStart, onJobDrop }) => {
  const premiumRef = useRef(null);
  const bannerRef = useRef(null);
  const reviewRef = useRef(null);
  const qaRef = useRef(null);

  const [positions, setPositions] = useState({
    premium: { x: 0, y: 0 },
    banner: { x: 0, y: 0 },
    review: { x: 0, y: 0 },
    qa: { x: 0, y: 0 },
  });

  const handleStop = (e, data, nodeType, category, key) => {
    const position = { x: data.x, y: data.y };

    if (category === "job") {
      onJobDrop(nodeType);
    } else {
      onNodeDrop(nodeType, category, position);
    }

    setPositions((prev) => ({
      ...prev,
      [key]: { x: 0, y: 0 },
    }));
  };

  return (
    <div
      id="sidebar-container"
      className="absolute top-0 right-0 h-full w-80 bg-white border-l border-gray-300 p-4"
    >
      <div className="mb-4 border-b-1 border-gray-300 pb-2">
        <h3 className="font-bold mb-4">Suggested templates</h3>
        <Draggable
          nodeRef={premiumRef}
          position={positions.premium}
          onStop={(e, data) =>
            handleStop(e, data, "Premium localisation", "template", "premium")
          }
        >
          <div
            ref={premiumRef}
            className="p-2 bg-gray-200 rounded mb-2 cursor-pointer"
          >
            Premium localisation
          </div>
        </Draggable>
        <Draggable
          nodeRef={bannerRef}
          position={positions.banner}
          onStop={(e, data) =>
            handleStop(
              e,
              data,
              "Static banner adaptation",
              "template",
              "banner"
            )
          }
        >
          <div
            ref={bannerRef}
            className="p-2 bg-gray-200 rounded mb-2 cursor-pointer"
          >
            Static banner adaptation
          </div>
        </Draggable>
      </div>
      <div>
        <h3 className="font-bold mb-4">Available Jobs</h3>
        <Draggable
          nodeRef={reviewRef}
          position={positions.review}
          onStart={onJobDragStart}
          onStop={(e, data) => handleStop(e, data, "Review", "job", "review")}
        >
          <div
            ref={reviewRef}
            className="p-2 bg-gray-200 rounded mb-2 cursor-pointer"
          >
            Review Node
          </div>
        </Draggable>
        <Draggable
          nodeRef={qaRef}
          position={positions.qa}
          onStart={onJobDragStart}
          onStop={(e, data) => handleStop(e, data, "QA", "job", "qa")}
        >
          <div
            ref={qaRef}
            className="p-2 bg-gray-200 rounded mb-2 cursor-pointer"
          >
            QA Node
          </div>
        </Draggable>
      </div>
    </div>
  );
};

export default Sidebar;
