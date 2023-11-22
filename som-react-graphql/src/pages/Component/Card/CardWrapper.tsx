import React from 'react';
import Card from './Card';

const App: React.FC = () => {
  const handlePlusClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    alert('button clicked!');
  };

  return (
    <>
      <Card title="Card Example" hasPlus={true} onPlusClick={handlePlusClick} content={
        <p>
          Lorem ipsum dolor sit amet, conse ctetuer adipiscing elit. Aenean commodo
          ligula eget dolor. Aenean massa.
        </p>
      } />
    </>
  );
};

export default App;