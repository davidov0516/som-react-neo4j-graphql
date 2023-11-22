import React, { FC } from 'react';

interface SubTabContentProps {
  isActive?: boolean;
  subTabID: string;
  content?: React.ReactNode;
};

const SubTabContent: FC<SubTabContentProps> = ({ isActive, subTabID, content }) => {
  return (
    <div
      className={`tab-pane ${isActive ? 'active show' : ''}`}
      id={subTabID}
      role="tabpanel"
    >
      {content}
    </div>
  );
};

export default SubTabContent;