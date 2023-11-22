import React from 'react';
import MainTab from './MainTab';
import TabContent from './TabContent';
import Card from '../Card/Card';
import SubTab from './SubTab';
import SubTabContent from './SubTabContent';

const App: React.FC = () => {
  let tabAttrs: { tabName: string, tabHref: string }[] = [
    {
      tabName: "Departure",
      tabHref: "tab-content-departure",
    },
    {
      tabName: "Navigation",
      tabHref: "tab-content-navigation",
    },
    {
      tabName: "Arrived",
      tabHref: "tab-content-arrived",
    },
  ];

  let subTabAttrs: { tabName: string, tabHref: string }[] = [
    {
      tabName: "Area 01",
      tabHref: "tab-content-area01",
    },
    {
      tabName: "Area 02",
      tabHref: "tab-content-area02",
    },
  ];

  const handlePlusClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    alert('button clicked!');
  };

  return (
    <>
      <MainTab
        tabAttrs={tabAttrs}
        content={
          <>
            <TabContent tabID={tabAttrs[0].tabHref} isActive={true} content={
              <Card title={tabAttrs[0].tabHref} content={
                <SubTab subTabAttrs={subTabAttrs} hasPlus={true} onPlusClick={handlePlusClick} content={
                  <>
                    <SubTabContent subTabID={subTabAttrs[0].tabHref} isActive={true} content={
                      <div>{subTabAttrs[0].tabHref}</div>
                    } />

                    <SubTabContent subTabID={subTabAttrs[1].tabHref} content={
                      <div>{subTabAttrs[1].tabHref}</div>
                    } />
                  </>
                } />
              } />
            } />

            <TabContent tabID={tabAttrs[1].tabHref} content={
              <Card title={tabAttrs[1].tabHref} content={
                <div>{tabAttrs[1].tabHref}</div>
              } />
            } />

            <TabContent tabID={tabAttrs[2].tabHref} content={
              <Card title={tabAttrs[2].tabHref} content={
                <div>{tabAttrs[2].tabHref}</div>
              } />
            } />

          </>
        }
      />
    </>
  );
};

export default App;