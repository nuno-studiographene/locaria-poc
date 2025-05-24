const CustomControls = ({ handleClearCanvas, handleUndo, handleRedo }) => {
  return (
    <>
      <button
        onClick={handleClearCanvas}
        className="mt-2 bg-red-500 text-white px-4 py-2 rounded shadow"
      >
        🗑️
      </button>
      <button
        onClick={handleUndo}
        className="mt-2 ml-2 bg-blue-500 text-white px-4 py-2 rounded shadow"
      >
        Undo
      </button>
      <button
        onClick={handleRedo}
        className="mt-2 ml-2 bg-green-500 text-white px-4 py-2 rounded shadow"
      >
        Redo
      </button>
    </>
  );
};

export default CustomControls;
