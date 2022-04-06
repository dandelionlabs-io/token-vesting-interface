import React from "react";

export default function ManagerPage() {
  return (
    <div className="container">
      <div
        className="row mt-4"
        id="alert-error-https"
        style={{ display: "none" }}
      >
        <div className="col-md-12">
          <div className="alert alert-danger">
            To secure wallet connection, please run website on HTTPS connection.
          </div>
        </div>
      </div>
      <div className="row mt-4" id="disconnected">
        <div className="col-md-12">
          <div className="alert alert-warning" role="alert">
            No wallet connected. Connect wallet to show accounts and their ETH
            balances!
          </div>
        </div>
      </div>
      <div className="row mt-4 mb-4" id="connected" style={{ display: "none" }}>
        <div className="col-7">
          Blockchain:{" "}
          <strong>
            <span id="network-name"></span>
          </strong>
        </div>
        <div className="col-5 text-end">
          <ul className="list-group">
            <li className="list-group-item d-flex justify-content-between align-items-center list-group-item-primary">
              Account
              <strong>
                <span
                  className="badge bg-primary rounded-pill"
                  id="selected-account"
                ></span>
              </strong>
            </li>
            <li className="list-group-item d-flex justify-content-between align-items-center">
              ETH balance:
              <span className="badge bg-primary rounded-pill" id="eth-balance">
                0
              </span>
            </li>
            <li className="list-group-item d-flex justify-content-between align-items-center">
              XP balance:
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

      {/* Pool Info */}
      <div className="row mt-5">
        <div className="col-md-12">
          <h1 className="h2">
            <span id="pool-info-name"></span> pool info
          </h1>
          <p className="text-muted">
            Showing the pool info requires wallet connection.
          </p>
        </div>
        <div className="col-md-6">
          <p>
            Contract Address:{" "}
            <span id="pool-info-contract">
              <span className="text-muted">Connect wallet, pick a pool</span>
            </span>
          </p>
        </div>
        <div className="col-md-6">
          <p>
            Total pool size:{" "}
            <span id="pool-info-size">
              <span className="text-muted">Connect wallet, pick a pool</span>
            </span>
          </p>
        </div>
        <div className="col-md-6">
          <p>
            Remained:{" "}
            <span id="pool-info-remained">
              <span className="text-muted">Connect wallet, pick a pool</span>
            </span>
          </p>
        </div>
        <div className="col-md-6">
          <p>
            Claimed:{" "}
            <span id="pool-info-claimed">
              <span className="text-muted">Connect wallet, pick a pool</span>
            </span>
          </p>
        </div>
        <div className="col-md-6">
          <p>
            Lock start time:{" "}
            <span id="pool-info-start-time">
              <span className="text-muted">Connect wallet, pick a pool</span>
            </span>
          </p>
        </div>
        <div className="col-md-6">
          <p>
            Lock end time:{" "}
            <span id="pool-info-end-time">
              <span className="text-muted">Connect wallet, pick a pool</span>
            </span>
          </p>
        </div>
      </div>
      <hr />
      <ul className="nav nav-tabs" id="myTab" role="tablist">
        <li className="nav-item" role="presentation">
          <button
            className="nav-link h4 active"
            id="add-investor-tab"
            data-bs-toggle="tab"
            data-bs-target="#add-investor"
            type="button"
            role="tab"
            aria-controls="add-investor"
            aria-selected="true"
          >
            Add Investors
          </button>
        </li>
        <li className="nav-item" role="presentation">
          <button
            className="nav-link h4"
            id="change-investor-tab"
            data-bs-toggle="tab"
            data-bs-target="#change-investor"
            type="button"
            role="tab"
            aria-controls="change-investor"
            aria-selected="false"
          >
            Change Investor
          </button>
        </li>
        <li className="nav-item" role="presentation">
          <button
            className="nav-link h4"
            id="transfer-ownership-tab"
            data-bs-toggle="tab"
            data-bs-target="#transfer-ownership"
            type="button"
            role="tab"
            aria-controls="transfer-ownership"
            aria-selected="false"
          >
            Transfer Ownership
          </button>
        </li>
      </ul>
      <div className="tab-content mt-5 mb-5" id="myTabContent">
        {/*Add investor*/}
        <div
          className="tab-pane fade show active "
          id="add-investor"
          role="tabpanel"
          aria-labelledby="add-investor-tab"
        >
          <div className="row mt-5">
            <div className="col-md-12">
              <div className="input-group mb-3">
                <label className="input-group-text" for="csv-file">
                  Open .CSV
                </label>
                <input
                  type="file"
                  className="form-control"
                  id="csv-file"
                  name="files-csv"
                  accept=".csv"
                />
              </div>
            </div>
          </div>
          <div className="row mb-5">
            <div className="col-md-12">
              <div id="grid"></div>
            </div>
          </div>

          <div className="row">
            <div className="col-md-12 text-center">
              <p>
                Total Amount into Vesting contract:{" "}
                <strong>
                  <span id="total-pool-amount">0.0</span>
                </strong>{" "}
                XP
              </p>
            </div>
          </div>

          <div className="row mb-5">
            <div className="col-md-6 text-end">
              <button
                type="button"
                className="btn btn-primary"
                id="btn-approve"
              >
                Approve
              </button>
            </div>
            <div className="col-md-6 text-start">
              <button
                type="button"
                className="btn btn-success"
                id="btn-add"
                disabled
              >
                Add
              </button>
            </div>
          </div>

          <div className="row mb-5">
            <div className="col-md-12">
              <h1 className="h3">Already added investors</h1>
              <div id="list-grid"></div>
            </div>
          </div>
        </div>

        {/*Change investor*/}
        <div
          className="tab-pane mt-5 fade"
          id="change-investor"
          role="tabpanel"
          aria-labelledby="change-investor-tab"
        >
          <div className="row">
            <div className="col-md-12">
              <p>Change the hacked investor</p>
            </div>
            <div className="col-md-5">
              <label for="old-address">Old address:</label>
              <br />
              <input
                type="text"
                className="form-control "
                placeholder="Old address"
                id="old-address"
              />
            </div>
            <div className="col-md-5">
              <label for="new-address">New address:</label>
              <br />
              <input
                type="text"
                className="form-control "
                placeholder="New address"
                id="new-address"
              />
            </div>
            <div className="col-md-2">
              <button className="btn btn-primary" id="btn-change">
                Change
              </button>
            </div>
          </div>
        </div>

        {/*Transfer ownership*/}
        <div
          className="tab-pane mt-5 fade"
          id="transfer-ownership"
          role="tabpanel"
          aria-labelledby="transfer-ownership-tab"
        >
          <div className="row">
            <div className="col-md-12">
              <p>Change the owner of this pool</p>
            </div>
            <div className="col-md-6">
              <label for="new-address">New owner:</label>
              <br />
              <input
                type="text"
                className="form-control "
                placeholder="New owner address"
                id="new-owner"
              />
            </div>
            <div className="col-md-6">
              <button className="btn btn-primary" id="btn-transfer">
                Transfer
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
