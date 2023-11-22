import React from 'react';

const App: React.FC = () => {
  let buttonName = "Show Basic Modal";
  let targetModal = "basicModal";

  return (
    <button
      type="button"
      className="btn btn-primary"
      data-toggle="modal"
      data-target={`#${targetModal}`}
    >
      {buttonName}
    </button>
  );
};

export default App;
