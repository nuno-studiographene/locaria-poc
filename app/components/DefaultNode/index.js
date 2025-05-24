const DefaultNode = ({ handleRemoveNode, nodeType }) => {
  return (
    <div className="border rounded shadow">
      <div className="bg-gray-200 p-2 flex justify-between items-center">
        <h3 className="font-bold">{nodeType}</h3>
        <button
          className="text-red-500"
          onClick={() => handleRemoveNode(`${nodeType}-${Date.now()}`)}
        >
          🗑️
        </button>
      </div>
      <div className="p-2">
        <h2 className="font-semibold">Details</h2>
        <p>Additional information about the {nodeType}.</p>
      </div>
    </div>
  );
};

export default DefaultNode;
