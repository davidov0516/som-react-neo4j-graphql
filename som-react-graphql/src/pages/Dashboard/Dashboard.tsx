import React from 'react';
import PageTitle from '../PageTitle';

function App() {
  return (
    <div className="app-main__inner">
      <PageTitle
        icon="helm"
        title="Dashboard"
        content="This is Dashboard Page. You can see the contents of the Dashboard Page here."
      />

      <h1>Dashboard</h1>
    </div>
  )
}

export default App;