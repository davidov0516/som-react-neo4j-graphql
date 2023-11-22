import React from 'react';
import { Outlet } from "react-router-dom";
import Sidebar from './Sidebar';
import ExampleModal from "./Modals/ExampleModal";
import DeleteConfirmModal from "./Modals/DeleteConfirmModal";
import ToCShipModal from "./Modals/ToCShipModal";
import ToCPersonalModal from "./Modals/ToCPersonalModal";
import CertShipModal from "./Modals/CertShipModal";
import CertPersonalModal from "./Modals/CertPersonalModal";
import WaterAreaModal from "./Modals/WaterAreaModal";
import ChartererModal from "./Modals/ChartererModal";

function App() {
  return (
    <div
      className="app-container app-theme-white body-tabs-shadow fixed-header fixed-sidebar"
    >
      <div className="app-header header-shadow bg-dark header-text-light">
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
        <div className="app-header__content">
          <div className="app-header-left">
            <div className="search-wrapper">
              <div className="input-holder">
                <input
                  type="text"
                  className="search-input"
                  placeholder="Type to search"
                />
                <button className="search-icon"><span /></button>
              </div>
              <button className="close" />
            </div>
          </div>
          <div className="app-header-right">
            <div className="header-dots">
              <div className="dropdown">
                <button
                  type="button"
                  aria-haspopup="true"
                  aria-expanded="false"
                  data-toggle="dropdown"
                  className="p-0 mr-2 btn btn-link"
                >
                  <span className="icon-wrapper icon-wrapper-alt rounded-circle">
                    <span className="icon-wrapper-bg bg-danger" />
                    <i
                      className="icon text-danger icon-anim-pulse ion-android-notifications"
                    />
                    <span className="badge badge-dot badge-dot-sm badge-danger"
                    >Notifications</span
                    >
                  </span>
                </button>
              </div>
            </div>
            <div className="header-btn-lg pr-0">
              <div className="widget-content p-0">
                <div className="widget-content-wrapper">
                  <div className="widget-content-left">
                    <div className="btn-group">
                      <div
                        aria-haspopup="true"
                        aria-expanded="false"
                        className="p-0 btn"
                      >
                        <img
                          width="42"
                          className="rounded-circle"
                          src="/assets/images/avatars/1.jpg"
                          alt=""
                        />
                        <i className="fa fa-angle-down ml-2 opacity-8" />
                      </div>
                    </div>
                  </div>
                  <div className="widget-content-left ml-3 header-user-info">
                    <div className="widget-heading">Team 4</div>
                    <div className="widget-subheading">React Som</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="app-main">
        <Sidebar />

        <div className="app-main__outer">
          <Outlet />

          <div className="app-wrapper-footer">
            <div className="app-footer">
              <div className="app-footer__inner" />
            </div>
          </div>
        </div>
      </div>


      <ExampleModal />
      <DeleteConfirmModal />
      <ToCShipModal />
      <ToCPersonalModal />
      <CertShipModal />
      <CertPersonalModal />
      <WaterAreaModal />
      <ChartererModal />
    </div>
  );
};

export default App;