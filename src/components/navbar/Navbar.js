import React, { useState } from "react";
import { MenuItems } from "./MenuItems";
import { GiHamburgerMenu } from "react-icons/gi";
import { AiOutlineClose } from "react-icons/ai";
import MainLayout from "../utils/layout/MainLayout";

import "./Navbar.scss";

import logo from "../../assets/logo/dandelion-logo.png";
import ProviderModal from "../modals/provider/ProviderModal";
import NormalButton from "../utils/buttons/NormalButton";

const Navbar = () => {
  const [toggleMenu, setToggleMenu] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [toggleConnect, setToggleConnect] = useState(false);
  window.addEventListener("resize", () => {
    setWindowWidth(window.innerWidth);
  });
  return (
    <>
      {/* <MainLayout id="navbar" className="navbarDiv"> */}
      <nav className="navbar bg-dark">
        <div className="logo">
          <a
            href="https://dandelionlabs.io/"
            alt="Linear Token Vesting"
            target="_blank"
            rel="noreferrer"
          >
            {" "}
            <img src={logo} alt="Dandelion Labs - Linear Token Vesting" />
          </a>
        </div>

        <div>
          <ul className="links">
            {MenuItems.map((item, index) => {
              return (
                <li className={item.cName} key={index}>
                  <a href={item.url}>{item.title}</a>
                </li>
              );
            })}
          </ul>
        </div>
        <div className="connectWallet">
          <NormalButton
            className="secondary"
            onClick={() => {
              setToggleConnect(true);
            }}
          >
            CONNECT
          </NormalButton>
          {toggleConnect && (
            <ProviderModal closeModal={setToggleConnect}></ProviderModal>
          )}
        </div>
        <div className="smallscreen">
          <GiHamburgerMenu
            color="#fff"
            fontSize={27}
            className="hamburger"
            onClick={() => {
              setToggleMenu(true);
            }}
          ></GiHamburgerMenu>
          {toggleMenu && (
            <div className="smallscreen_overlay flex__center slide-bottom">
              <AiOutlineClose
                fontSize={27}
                className="overlay__close"
                color="white"
                onClick={() => {
                  setToggleMenu(!toggleMenu);
                }}
              ></AiOutlineClose>
              <ul className="smallscreen-links">
                {MenuItems.map((item, index) => {
                  return (
                    <li
                      className={item.cName}
                      key={index}
                      onClick={() => {
                        setToggleMenu(false);
                      }}
                    >
                      <a href={item.url}>{item.title}</a>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>
      </nav>
      {/* </MainLayout> */}
    </>
  );
};

export default Navbar;
