import React from "react";
import Navbar from "../components/navbar";

const InvestorPage = () => {
  return (
    <>
      <Navbar title={"Investor's Page"} />
      <div className="container">
        {/* HTTPS required */}
        <div
          className="row mt-4"
          id="alert-error-https"
          style={{ display: "none" }}
        >
          <div className="col-md-12">
            <div className="alert alert-danger">
              To secure wallet connection, please run website on HTTPS
              connection.
            </div>
          </div>
        </div>
        {/* No wallet */}
        <div className="row mt-4" id="disconnected">
          <div className="col-md-12">
            <div className="alert alert-warning" role="alert">
              No wallet connected. Connect wallet to show accounts and their ETH
              balances!
            </div>
          </div>
        </div>
        {/* Wallet connected: show balance */}
        <div
          className="row mt-4 mb-4"
          id="connected"
          style={{ display: "none" }}
        >
          <div className="col-7">
            <strong>Blockchain:</strong> <span id="network-name"></span>
          </div>
          <div className="col-5 text-end">
            <ul className="list-group">
              <li className="list-group-item d-flex justify-content-between align-items-center list-group-item-primary">
                <strong>Account:</strong>
                <span
                  className="badge bg-primary rounded-pill"
                  id="selected-account"
                ></span>
              </li>
              <li className="list-group-item d-flex justify-content-between align-items-center">
                <strong>ETH Balance:</strong>
                <span
                  className="badge bg-primary rounded-pill"
                  id="eth-balance"
                >
                  0
                </span>
              </li>
              <li className="list-group-item d-flex justify-content-between align-items-center">
                <strong>DCRED Balance:</strong>
                <span
                  className="badge bg-primary rounded-pill"
                  id="erc20-balance"
                >
                  0
                </span>
              </li>
            </ul>
          </div>
        </div>
        {/* Pools */}
        <div className="row mt-5" id="pool-selection">
          <div className="col-md-12">
            <h1 className="h2">Select the pool</h1>
            <p className="text-muted">
              Working with pool requires wallet connection.
            </p>
          </div>
        </div>

        {/* Investment info */}
        <div id="pool-information-panel" className="pool-disabled">
          <div className="row mt-5">
            <div className="col-md-12">
              <h1 className="h2">
                <span id="pool-info-name"></span> Pool Info:
              </h1>
              <p className="text-danger" id="pool-info-danger">
                Please connect your wallet to see Pool Info!
              </p>
            </div>
            <div className="col-md-6">
              <p>
                <strong>Contract Address:</strong>{" "}
                <span id="pool-info-contract">
                  <span className="text-muted">Connect wallet</span>
                </span>
              </p>
            </div>
            <div className="col-md-6">
              <p>
                <strong>Available Claimable:</strong>{" "}
                <span id="pool-info-accessible">
                  <span className="text-muted">Connect wallet</span>
                </span>
              </p>
            </div>
          </div>
          <div className="row mt-5">
            <div className="col-md-12">
              <h3>Vesting Progress:</h3>
            </div>
            <div className="col-md-12">
              <div
                className="progress"
                style={{ height: "40px", padding: "3px" }}
              >
                <div
                  className="progress-bar"
                  role="progressbar"
                  style={{ width: "15%" }}
                  aria-valuenow="15"
                  aria-valuemin="0"
                  aria-valuemax="100"
                  id="progress-claimed"
                >
                  Claimed
                </div>
                <div
                  className="progress-bar bg-success"
                  role="progressbar"
                  style={{ width: "30%" }}
                  aria-valuenow="30"
                  aria-valuemin="0"
                  aria-valuemax="100"
                  id="progress-claimable"
                >
                  Claimable
                </div>
                <div
                  className="progress-bar bg-info"
                  role="progressbar"
                  style={{ width: "20%" }}
                  aria-valuenow="20"
                  aria-valuemin="0"
                  aria-valuemax="100"
                  id="progress-remaining"
                >
                  Remaining
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col text-start">
              <strong className="text-muted">Start:</strong>
              <br />
              <span id="pool-info-start-time">
                <span className="text-muted">Connect wallet</span>
              </span>
            </div>
            <div className="col text-center">
              <strong className="text-muted">Remained:</strong>
              <br />
              <span id="pool-info-remained-time">
                <span className="text-muted">Connect wallet</span>
              </span>
            </div>
            <div className="col text-end">
              <strong className="text-muted">End:</strong>
              <br />
              <span id="pool-info-end-time">
                <span className="text-muted">Connect wallet</span>
              </span>
            </div>
          </div>

          <div className="row mt-5 mb-5">
            <div className="col-md-12 text-center">
              <strong>Available Claimable/Locked (DCRED):</strong>
              <span id="label-claimable">0.0</span> /
              <span id="label-locked">0.0</span>
            </div>
            <div className="col-md-12 text-center mt-2">
              <button type="button" className="btn btn-success" id="btn-claim">
                Claim
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default InvestorPage;
