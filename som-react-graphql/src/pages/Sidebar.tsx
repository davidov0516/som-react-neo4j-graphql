import React from 'react';
import { useNavigate } from "react-router-dom";

function App() {
  let navigate = useNavigate();
  let menus = [
    { type: "heading", title: "Dashboard" },
    {
      type: "menu",
      title: "Dashboard",
      link: "/",
      icon: "helm",
    },
    { type: "heading", title: "Shipping" },
    {
      type: "menu",
      title: "Shippings",
      link: "/shipping",
      icon: "anchor",
    },
    {
      type: "menu",
      title: "Water Areas",
      link: "/water-area",
      icon: "target",
    },
    {
      type: "menu",
      title: "Charterers",
      link: "/charterer",
      icon: "id",
    },
    {
      type: "menu",
      title: "Certificates",
      link: "/certificate",
      icon: "credit",
    },
    { type: "heading", title: "Setting" },
    {
      type: "menu",
      title: "Ships",
      link: "/ship",
      icon: "helm",
    },
    {
      type: "menu",
      title: "Mariners",
      link: "/mariner",
      icon: "users",
    },
    {
      type: "menu",
      title: "Types of Certificate",
      link: "/type-of-certificate",
      icon: "box1",
    },
    {
      type: "menu",
      title: "Components",
      link: "/components",
      icon: "share",
    },
  ];

  return (
    <div className="app-sidebar sidebar-shadow bg-dark sidebar-text-light">
      <div className="app-header__logo">
        <div className="logo-src" />
        <div className="header__pane ml-auto">
          <div>
            <button
              type="button"
              className="hamburger close-sidebar-btn hamburger--elastic"
              data-class="closed-sidebar"
            >
              <span className="hamburger-box">
                <span className="hamburger-inner" />
              </span>
            </button>
          </div>
        </div>
      </div>
      <div className="app-header__mobile-menu">
        <div>
          <button
            type="button"
            className="hamburger hamburger--elastic mobile-toggle-nav"
          >
            <span className="hamburger-box">
              <span className="hamburger-inner" />
            </span>
          </button>
        </div>
      </div>
      <div className="app-header__menu">
        <span>
          <button
            type="button"
            className="btn-icon btn-icon-only btn btn-primary btn-sm mobile-toggle-header-nav"
          >
            <span className="btn-icon-wrapper">
              <i className="fa fa-ellipsis-v fa-w-6" />
            </span>
          </button>
        </span>
      </div>
      <div className="scrollbar-sidebar ps">
        <div className="app-sidebar__inner">
          <ul className="vertical-nav-menu metismenu">
            {
              menus.map((menu, i) => (
                menu.type === 'heading'
                  ?
                  <li className="app-sidebar__heading" key={i}>{menu.title}</li>
                  :
                  <li key={i}>
                    <a href="/" onClick={(e) => {
                      e.preventDefault();
                      if (menu.link) {
                        navigate(menu.link);
                      }
                    }}>
                      <i className={`metismenu-icon pe-7s-${menu.icon}`} />{menu.title}
                    </a>
                  </li>
              ))
            }
          </ul>
        </div>
      </div>
    </div>
  );
};

export default App;