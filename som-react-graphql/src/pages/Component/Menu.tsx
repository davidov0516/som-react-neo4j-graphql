import React from 'react';
import { useNavigate } from "react-router-dom";

function App() {
  let navigate = useNavigate();
  let menus = [
    { title: "Select", link: "/components/select" },
    { title: "Tab", link: "/components/tab" },
    { title: "Card", link: "/components/card" },
    { title: "Modal", link: "/components/modal" },
    { title: "Table", link: "/components/table" },
    { title: "Label Group", link: "/components/label-group" },
    { title: "CheckBox and Input", link: "/components/checkbox-and-input" },
    { title: "Carousel", link: "/components/carousel" },
    { title: "FileAttach", link: "/components/file-attachment" },
    { title: "SearchInput", link: "/components/search-input" },
  ];

  return (
    <ul className="vertical-nav-menu metismenu">
      <li className="app-sidebar__heading">Components</li>
      {menus.map((menu, i) => (
        <li key={i}>
          <a href="/" onClick={(e) => {
            e.preventDefault();
            if (menu.link) {
              navigate(menu.link);
            }
          }}>
            <i className="metismenu-icon pe-7s-plugin" />{menu.title}
          </a>
        </li>
      ))}
    </ul>
  );
};

export default App;