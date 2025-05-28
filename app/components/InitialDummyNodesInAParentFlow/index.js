export const CustomParentNode = ({ data }) => (
  <div className="p-2 border border-dashed border-black h-full">
    <h3 className="font-bold bg-gray-200 rounded shadow mb-10">
      English to Spanish
    </h3>
  </div>
);

export const initialDummyNodesInAParentFlow = [
  {
    id: "A",
    type: "customParent",
    position: { x: 0, y: 0 },
    data: {
      label: "Language Combination",
    },
    style: {
      height: 100,
    },
  },
  {
    id: "A-1",
    type: "input",
    data: { label: "Child Node 1" },
    position: { x: 10, y: 50 },
    parentId: "A",
    extent: "parent",
    sourcePosition: "right",
  },
  {
    id: "A-2",
    data: { label: "Child Node 2" },
    position: { x: 300, y: 50 },
    parentId: "A",
    extent: "parent",
    sourcePosition: "right",
    targetPosition: "left",
  },
];
