import { memo } from "react";

export default memo(function CustomChildNode({
  id,
  data,
  selected,
  deleteNode,
}) {
  return (
    <div
      className={`relative bg-white border rounded shadow px-4 py-2 flex items-center ${
        selected ? "ring-2 ring-purple-400" : ""
      }`}
      style={{ minWidth: 120 }}
    >
      <span className="flex-1">{data.label}</span>
      <button
        onClick={(e) => {
          e.stopPropagation();
          deleteNode(id);
        }}
        title="Delete node"
        className="ml-2 text-gray-400 hover:text-red-500"
        style={{ background: "none", border: "none", cursor: "pointer" }}
      >
        {/* Trash SVG */}
        <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
          <path
            d="M6 7h12M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2m2 0v12a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V7h12z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
  );
});
