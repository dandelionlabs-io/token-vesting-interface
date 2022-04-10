import React, { useEffect, useState } from "react";
import { shortenAddress, ethBalance } from "../utils";
import { useAuth } from "../providers/AuthProvider";
import { tokenConfig } from "../linearVestingConfig";
import ERC20 from "../abi-js/ERC20";
import { ethers } from "ethers";

const UserData = () => {
  const { address, balance, ethProvider } = useAuth();
  const [erc20Balance, setErc20Balance] = useState(null);

  useEffect(async () => {
    if (address) {
      const contract = new ethers.Contract(
        tokenConfig.address,
        ERC20,
        ethProvider
      );

      setErc20Balance(await contract.balanceOf(address));
    }
  }, [address]);

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
                <strong>DCRED Balance:</strong>
                <span
                  className="badge bg-primary rounded-pill"
                  id="erc20-balance"
                >
                  {ethBalance(erc20Balance)}
                </span>
              </li>
            </ul>
          </div>
        </div>
      )}
    </>
  );
};

export default UserData;
