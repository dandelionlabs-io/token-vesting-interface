import React, { useState, useEffect } from "react";
import Modal from "../../utils/modal/Modal";
import OutsideClickHandler from "react-outside-click-handler";
import MetaMaskLogo from "../../../assets/logo/metamask.png";
import WalletConnectLogo from "../../../assets/logo/walletconnect.png";

import { useAuth } from "../../../providers/AuthProvider";

import "./ProviderModal.scss";

const ProviderModal = (props) => {
  const { address, message, connectWallet, connectMetaMask } = useAuth();
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const { closeModal } = props;
  window.addEventListener("resize", () => {
    setWindowWidth(window.innerWidth);
  });
  useEffect(() => {
    if (address) closeModal(false);
  }, [address]);

  return (
    <Modal>
      <OutsideClickHandler
        onOutsideClick={() => {
          closeModal(false);
        }}
      >
        <div className="auth-container">
          <div className="header">
            <h2>Connect your wallet </h2>
          </div>

          <p>
            Connect with one of our available wallet providers or create a new
            one.
          </p>

          {message}

          <div className="wallet-provider-list">
            {windowWidth > 700 && (
              <button onClick={connectMetaMask}>
                <img src={MetaMaskLogo} alt="metamask icon" /> Metamask
              </button>
            )}

            <button onClick={connectWallet}>
              <img src={WalletConnectLogo} alt="walletconnect icon" />
              WalletConnect
            </button>
          </div>
        </div>
      </OutsideClickHandler>
    </Modal>
  );
};

export default ProviderModal;
