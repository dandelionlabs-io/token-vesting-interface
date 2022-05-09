import React, { useState } from "react";
import { MenuItems } from "./MenuItems";
import { GiHamburgerMenu } from "react-icons/gi";
import { AiOutlineClose } from "react-icons/ai";
import "./Navbar.scss";
import logo from "../../assets/logo/dandelion-logo.png";
import ProviderModal from "../modals/provider/ProviderModal";
import NormalButton from "../utils/buttons/NormalButton";
import { useAuth } from "../../providers/AuthProvider";
import { shortenAddress } from "../../utils";

const Navbar = () => {
  const { address, disconnectWallet } = useAuth();
  const [toggleMenu, setToggleMenu] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  window.addEventListener("resize", () => {
    setWindowWidth(window.innerWidth);
  });

  return (
    <>
      <nav className="navbar" style={{ backgroundColor: "#00142D" }}>
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
        {address && <div>{shortenAddress(address)}</div>}
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
