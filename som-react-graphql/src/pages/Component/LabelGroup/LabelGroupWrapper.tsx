import React from 'react';
import { useNavigate } from "react-router-dom";

import LabelGroup from './LabelGroup';

const App: React.FC = () => {
  let navigate = useNavigate();

  const onLinkClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    navigate("/components");
  };

  return (
    <>
      <LabelGroup
        leftLabel="S-Number"
        rightLabel="Ship name"
        hasLink={true}
        fontSize={14}
        onLinkClick={onLinkClick}
      />
      <p>&nbsp;</p>
      <LabelGroup leftLabel="S-Number" rightLabel="Ship name" />
      <p>&nbsp;</p>
      <LabelGroup
        leftLabel="S-Number"
        rightLabel="Ship name"
        isOrange={true}
      />

    </>
  );
};

export default App;