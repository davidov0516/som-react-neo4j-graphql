import React from 'react';
import PageTitle from '../PageTitle';
import MainTab from "../Component/Tab/MainTab";
import TabContent from "../Component/Tab/TabContent";
import ShipTab from "./ShipTab";
import PersonalTab from "./PersonalTab";

function App() {
  let tabAttrs = [
    {
      tabName: "Ship",
      tabHref: "tab-content-ship",
    },
    {
      tabName: "Personal",
      tabHref: "tab-content-personal",
    },
  ];

  return (
    <div className="app-main__inner">
      <PageTitle
        icon="credit"
        title="Certificates"
        content="This is Certificates Page. You can see the contents of the Certificates Page here."
      />

      <MainTab tabAttrs={tabAttrs} content={
        <>
          <TabContent tabID={tabAttrs[0].tabHref} isActive={true} content={
            <ShipTab title={tabAttrs[0].tabName} />
          } />

          <TabContent tabID={tabAttrs[1].tabHref} content={
            <PersonalTab title={tabAttrs[1].tabName} />
          } />
        </>
      } />
    </div>
  )
}

export default App;