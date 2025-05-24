export const Footer = ({ nodes, edges }) => {
  const submitDataToBackEnd = () => {
    const data = {
      nodes: nodes.map((node) => ({
        id: node.id,
        type: node.type,
        position: node.position,
      })),
      edges: edges.map((edge) => ({
        id: edge.id,
        source: edge.source,
        target: edge.target,
      })),
    };

    fetch("/api/save", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Success:", data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  return (
    <footer className="w-full bg-white border-t border-gray-300 p-4 text-center flex justify-between items-center">
      <button className="mr-2 px-4 py-2 bg-red-500 text-white rounded">
        Delete Draft
      </button>
      <div className="inline-flex space-x-2">
        <button className="px-4 py-2 bg-blue-500 text-white rounded">
          Save as template
        </button>
        <button
          className="px-4 py-2 bg-green-500 text-white rounded cursor-pointer"
          onClick={submitDataToBackEnd}
        >
          Publish Project
        </button>
      </div>
    </footer>
  );
};

export default Footer;
