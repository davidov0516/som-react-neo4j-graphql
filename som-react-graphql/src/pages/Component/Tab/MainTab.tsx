import React, { FC, ReactNode } from 'react';

interface tabAttr {
  tabName: string;
  tabHref: string;
}

interface TabProps {
  tabAttrs: tabAttr[];
  content: ReactNode;
}

const Tab: FC<TabProps> = ({ tabAttrs, content }) => {
  return (
    <>
      <ul className="body-tabs body-tabs-layout tabs-animated body-tabs-animated nav">
        {tabAttrs.map((tab, i) => (
          <li className="nav-item" key={i}>
            <a
              role="tab"
              className={`nav-link ${i === 0 ? 'active' : ''}`}
              data-toggle="tab"
              href={`#${tab.tabHref}`}
              aria-selected="true"
            >
              <span>{tab.tabName}</span>
            </a>
          </li>
        ))}
      </ul>

      <div className="tab-content">
        {content}
      </div>
    </>
  );
};

export default Tab;