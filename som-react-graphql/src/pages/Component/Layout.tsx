import React from 'react';
import PageTitle from '../PageTitle';
import { Outlet } from "react-router-dom";

function App() {
  return (
    <div className="app-main__inner">
      <PageTitle
        icon="share"
        title="Components"
        content="This is Components Page. You can see the contents of the Components Page here."
      />

      <Outlet />
    </div>
  );
};

export default App;