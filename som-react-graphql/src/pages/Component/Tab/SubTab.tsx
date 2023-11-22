import React, { FC, ReactNode } from 'react';

interface subTabAttr {
  tabName: string;
  tabHref: string;
}

interface SubTabProps {
  subTabAttrs: subTabAttr[];
  hasPlus?: boolean;
  onPlusClick?: (event: React.MouseEvent<HTMLAnchorElement>) => void;
  content: ReactNode;
  isNewArea?: boolean;
  currentItem?: any;
  setFunction?: any;
  navTab?: string;
}

const SubTab: FC<SubTabProps> = ({ subTabAttrs, hasPlus = true, onPlusClick, content, isNewArea, currentItem, setFunction, navTab = "" }) => {
  function onDeleteClick(i: number) {
    if (currentItem) {
      let areas: any;
      if (navTab === "departure") {
        areas = [...currentItem.departure_areas];
        areas.splice(i, 1);

        setFunction({
          ...currentItem,
          departure_areas: areas,
        });
      } else if (navTab === "navigation") {
        areas = [...currentItem.navigation_areas];
        areas.splice(i, 1);

        setFunction({
          ...currentItem,
          departure_areas: areas,
        });
      } else if (navTab === "arrived") {
        areas = [...currentItem.arrived_areas];
        areas.splice(i, 1);

        setFunction({
          ...currentItem,
          departure_areas: areas,
        });
      }
    }
    // alert(i);
  }

  return (
    <>
      <ul className="nav nav-tabs">
        {subTabAttrs.map((tab, i) => (
          <li className="nav-item" key={i}>
            <a
              data-toggle="tab"
              className={`nav-link ${(isNewArea && i === subTabAttrs.length - 1) ? 'active' : (!i && !isNewArea ? 'active' : '')}`}
              href={`#${tab.tabHref}`}
              id={`#${tab.tabHref}`}
            >
              {tab.tabName}
              {navTab !== "" &&
                <img className="lineTabRemove" src="/assets/images/btn_delete.svg" onClick={() => { onDeleteClick(i); }} alt="Area Delete"></img>
              }
            </a>
          </li>
        ))}

        {hasPlus &&
          <div className="d-flex plus-action ml-auto" style={{ height: '38px', }}>
            <a href="/" onClick={onPlusClick} style={{ margin: '8px 0px', }}>
              <i className="fa fa-fw fa-lg"></i>
            </a>
          </div>
        }
      </ul >

      <div className="tab-content">
        {content}
      </div>
    </>
  );
};

export default SubTab;