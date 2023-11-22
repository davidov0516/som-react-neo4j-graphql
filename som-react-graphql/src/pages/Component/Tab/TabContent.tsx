import React, { FC } from 'react';

interface TabContentProps {
  isActive?: boolean;
  tabID: string;
  content?: React.ReactNode;
};

const TabContent: FC<TabContentProps> = ({ isActive = false, tabID, content }) => {
  return (
    <div
      className={`tab-pane tabs-animation fade ${isActive ? 'active show' : ''}`}
      id={tabID}
      role="tabpanel"
    >
      {content}
    </div>
  );
};

export default TabContent;