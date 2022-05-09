import React, { useEffect, useState } from "react";
import { ethBalance } from "../utils";
import { useAuth } from "../providers/AuthProvider";
import ERC20 from "../abi-js/ERC20";
import Factory from "../abi-js/Factory";
import { ethers } from "ethers";
import { useError } from "../providers/ErrorProvider";
import CreatePoolModal from "./modals/CreatePoolModal";
import logo from "../assets/logo/landingLogo.png";
import ProviderModal from "./modals/provider/ProviderModal";

const UserData = () => {
  const { address, balance, ethProvider, disconnectWallet } = useAuth();
  const [erc20Balance, setErc20Balance] = useState(null);
  const [factoryInstance, setFactoryInstance] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [toggleConnect, setToggleConnect] = useState(false);
  const { showErrorModal } = useError();

  useEffect(async () => {
    if (address) {
      const contract = new ethers.Contract(
        process.env.REACT_APP_TOKEN_ADDRESS,
        ERC20,
        ethProvider
      );

      setErc20Balance(await contract.balanceOf(address));

      const factoryInstance = new ethers.Contract(
        process.env.REACT_APP_FACTORY_CONTRACT_ADDRESS,
        Factory,
        ethProvider.getSigner()
      );
      factoryInstance
        .owner()
        .then((owner) => {
          if (owner.toLowerCase() == address.toLowerCase())
            setFactoryInstance(factoryInstance);
          else setFactoryInstance(null);
        })
        .catch((e) => showErrorModal(e.error.message));
    }
  }, [address]);

  const openCreatePoolModal = () => setIsCreateModalOpen(true);

  return (
    <>
      {(!address && (
        /* No wallet */
        <div className="row mt-4">
          <div className="col-md-7" style={{ textAlign: "left" }}>
            <p style={{ color: "#CC3366" }}>A new way of</p>
            <p style={{ fontSize: "44px" }}>Token Linear Vesting</p>
            <p>
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum has been the industry's standard dummy text
              ever since the 1500s, when an unknown printer took a galley of
              type and scrambled it to make a type specimen book.
            </p>
            <div className="connectWallet">
              <button
                className="connect-btn"
                onClick={() => {
                  !address ? setToggleConnect(true) : disconnectWallet();
                }}
              >
                {!address ? "CONNECT" : "DISCONNECT"}
              </button>

              <ProviderModal
                toggleConnect={toggleConnect}
                setToggleConnect={setToggleConnect}
              ></ProviderModal>
            </div>
          </div>
          <div className="col-md-5">
            <img src={logo} alt="..." />
          </div>
          <div className="mt-5">
            <p>Get In Touch With Us</p>
            <p>4 Ngo 82 Dich Vong Hau, Cau Giay, Hanoi</p>
            <p>hello@dandelionlabs.io</p>
            <p>+84 0343 788923</p>
            <p>Copyright ©2021 Dandelion Labs Ltd.</p>
          </div>
        </div>
      )) || (
        /* Wallet connected: show balance */
        <div
          className="row mt-4 mb-4 d-flex justify-content-between"
          id="connected"
        >
          <div className="col-6 balance-div">
            <strong>ETH Balance</strong>
            <p id="network-name">{ethBalance(balance)?.toFixed(4)}</p>
          </div>
          <div className="col-6 balance-div">
            <strong>{process.env.REACT_APP_TOKEN_SYMBOL} Balance</strong>
            <p id="network-name">{ethBalance(erc20Balance)}</p>
          </div>

          {/* <div className="col-6 text-end">
            <ul className="list-group">
              <li className="list-group-item d-flex justify-content-between align-items-center list-group-item-primary">
                <strong>Account:</strong>
                <span
                  className="badge bg-primary rounded-pill"
                  id="selected-account"
                >
                  {shortenAddress(address)}
                </span>
              </li>
              <li className="list-group-item d-flex justify-content-between align-items-center">
                <strong>ETH Balance:</strong>
                <span
                  className="badge bg-primary rounded-pill"
                  id="eth-balance"
                >
                </span>
              </li>
              <li className="list-group-item d-flex justify-content-between align-items-center">
                <strong>{process.env.REACT_APP_TOKEN_SYMBOL} Balance:</strong>
                <span
                  className="badge bg-primary rounded-pill"
                  id="erc20-balance"
                >
                </span>
              </li>
              {factoryInstance && (
                <li className="list-group-item d-flex justify-content-between align-items-center">
                  <button onClick={openCreatePoolModal}>Create new pool</button>
                </li>
              )}
            </ul>
          </div>*/}
          <CreatePoolModal
            isOpen={isCreateModalOpen}
            setIsCreateModalOpen={setIsCreateModalOpen}
            ethProvider={ethProvider}
          />
        </div>
      )}
    </>
  );
};

export default UserData;
