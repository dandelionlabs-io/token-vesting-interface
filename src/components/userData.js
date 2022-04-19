import React, { useEffect, useState } from "react";
import { shortenAddress, ethBalance } from "../utils";
import { useAuth } from "../providers/AuthProvider";
import ERC20 from "../abi-js/ERC20";
import Factory from "../abi-js/Factory";
import { ethers } from "ethers";
import { useError } from "../providers/ErrorProvider";
import CreatePoolModal from "./modals/CreatePoolModal";

const UserData = () => {
  const { address, balance, ethProvider } = useAuth();
  const [erc20Balance, setErc20Balance] = useState(null);
  const [factoryInstance, setFactoryInstance] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
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
        .catch((e) => showErrorModal(e.message));
    }
  }, [address]);

  const openCreatePoolModal = () => setIsCreateModalOpen(true);

  return (
    <>
      {(!address && (
        /* No wallet */
        <div className="row mt-4" id="disconnected">
          <div className="col-md-12">
            <div className="alert alert-warning" role="alert">
              No wallet connected. Connect wallet to show accounts and their ETH
              balances!
            </div>
          </div>
        </div>
      )) || (
        /* Wallet connected: show balance */
        <div className="row mt-4 mb-4" id="connected">
          <div className="col-7">
            <strong>Blockchain:</strong>{" "}
            <span id="network-name">Ethereum Testnet Rinkeby</span>
          </div>
          <div className="col-5 text-end">
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
                  {ethBalance(balance)?.toFixed(4)}
                </span>
              </li>
              <li className="list-group-item d-flex justify-content-between align-items-center">
                <strong>{process.env.REACT_APP_TOKEN_SYMBOL} Balance:</strong>
                <span
                  className="badge bg-primary rounded-pill"
                  id="erc20-balance"
                >
                  {ethBalance(erc20Balance)}
                </span>
              </li>
              {factoryInstance && (
                <li className="list-group-item d-flex justify-content-between align-items-center">
                  <button onClick={openCreatePoolModal}>Create new pool</button>
                </li>
              )}
            </ul>
          </div>
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
