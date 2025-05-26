const DefaultNode = ({ handleRemoveNode, nodeType, language }) => {
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
        {language && <p className="mt-2 font-bold">{language}</p>}
      </div>
      <a
        href="https://google.com"
        className="block p-2 bg-blue-500 text-white text-center"
        target="_blank"
        rel="noopener noreferrer"
      >
        View job
      </a>
    </div>
  );
};

export default DefaultNode;
