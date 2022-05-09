import React, { useState, useEffect } from "react";
import { Modal } from "react-bootstrap";
import MetaMaskLogo from "../../../assets/logo/metamask.png";
import WalletConnectLogo from "../../../assets/logo/walletconnect.png";

import { useAuth } from "../../../providers/AuthProvider";

import "./ProviderModal.scss";

const ProviderModal = (props) => {
  const { address, connectWallet, connectMetaMask } = useAuth();
  const { toggleConnect, setToggleConnect } = props;
  const handleClose = () => setToggleConnect(false);

  return (
    <Modal
      className="provider-modal"
      show={toggleConnect}
      centered
      onHide={handleClose}
    >
      <Modal.Body className="provider-content">
        <div style={{ textAlign: "center" }}>
          <p style={{ fontSize: "64px" }}>Connect</p>
          <p>
            Connect with one of our available wallet providers or create a new
            one.
          </p>
        </div>

        <div className="d-flex justify-content-center">
          <button className="wallet-btn" onClick={connectMetaMask}>
            <img src={MetaMaskLogo} alt="metamask icon" /> Metamask
          </button>

          <button className="wallet-btn" onClick={connectWallet}>
            <img src={WalletConnectLogo} alt="walletconnect icon" />
            WalletConnect
          </button>
        </div>
        <div style={{ textAlign: "center" }}>
          <p>
            By connecting your wallet, you agree to our Terms of Service and
            Privacy Policy.
          </p>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default ProviderModal;
