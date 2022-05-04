import React, { useEffect, useState } from "react";
import { useAuth } from "../providers/AuthProvider";
import UserData from "../components/userData";
import { ethers } from "ethers";
import Vesting from "../abi-js/Vesting";
import Factory from "../abi-js/Factory";
import { ethBalance, shortenAddress } from "../utils";
import PoolSelector from "../components/poolSelector";
import { useLoading } from "../providers/LoadingProvider";
import { useError } from "../providers/ErrorProvider";
import DataGrid from "react-data-grid";
import axios from "axios";
import moment from "moment";

const InvestorPage = () => {
  const { address, ethProvider } = useAuth();
  const { setIsLoading } = useLoading();
  const { showErrorModal } = useError();
  const [pools, setPools] = useState(null);
  const [currentPool, setCurrentPool] = useState(null);
  const [claimable, setClaimable] = useState(0);
  const [claimHistory, setClaimHistory] = useState(null);

  const locked =
    currentPool &&
    ethBalance(currentPool.grant.amount.sub(currentPool.grant.totalClaimed));

  const totalClaimed =
    currentPool && ethBalance(currentPool.grant.totalClaimed);
  const totalAmount = currentPool && ethBalance(currentPool.grant.amount);

  useEffect(async () => {
    if (address) {
      setPools(await getAvailablePools());
      setCurrentPool(null);
    }
  }, [address]);

  const checkAndGetPool = async (pool) => {
    const contract = new ethers.Contract(
      pool,
      Vesting,
      ethProvider.getSigner()
    );

    let grant = await contract.getTokenGrant(address);
    let amount = ethBalance(grant.amount) + ethBalance(grant.totalClaimed);

    if (amount) {
      let blacklist = await contract.blacklist(address).catch((e) => {
        console.error(e);
        throw (
          "RPC Error while validating Blacklisted Accounts in " + pool.address
        );
      });

      if (blacklist !== "0x0000000000000000000000000000000000000000") {
        throw `Address ${address} was blacklisted and replaced by ${blacklist}. Use the new address please!`;
      }

      return {
        address: pool,
        grant: grant,
        vesting: contract,
        name: (await contract.pool()).name,
      };
    }
    return null;
  };

  const getAvailablePools = async () => {
    const availablePools = [];
    const factoryInstance = new ethers.Contract(
      process.env.REACT_APP_FACTORY_CONTRACT_ADDRESS,
      Factory,
      ethProvider
    );

    const poolsAddresses = await factoryInstance.getPools();

    for (let i = 0; i < poolsAddresses.length; i++) {
      const poolResult = await checkAndGetPool(poolsAddresses[i]);
      if (poolResult) availablePools.push(poolResult);
    }
    return availablePools;
  };

  const claim = async () => {
    setIsLoading(true);
    const tx = await currentPool.vesting
      .claimVestedTokens(address)
      .catch((e) => {
        setIsLoading(false);
        if (e.code != 4001) showErrorModal(e.error.message);
      });

    tx?.wait().then(() => window.location.reload());
  };

  const getPercent = (amount, total) => {
    return (amount * 100) / total;
  };

  const claimHistoryTable = {
    columns: [
      { key: "date", name: "Date" },
      { key: "claimed", name: "Claimed" },
    ],
    rows: claimHistory
      ? claimHistory.map((x) => {
          return {
            date: moment(x.timestamp).format("MMMM Do YYYY, h:mm a"),
            claimed: (parseInt(x.amountClaimed) / 1e18).toFixed(4),
          };
        })
      : [],
  };

  const loadHistory = () => {
    const url = `${process.env.REACT_APP_SYNC_URL}${process.env.REACT_APP_NETWORK}/${currentPool.address}/claims/${address}`;

    axios
      .get(url)
      .then((res) => setClaimHistory(res.data))
      .catch((e) => showErrorModal(e.error.message));
  };

  return (
    <div className="container">
      {/* HTTPS required */}
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
      <UserData />

      {/* Pools */}
      {address && pools && (
        <>
          <PoolSelector
            address={address}
            pools={pools}
            setClaimable={setClaimable}
            setCurrentPool={setCurrentPool}
            currentPool={currentPool}
          />
          {/* Investment info */}
          {currentPool && (
            <div id="pool-information-panel">
              <div className="row mt-5">
                <div className="col-md-12">
                  <h1 className="h2">
                    <span id="pool-info-name"></span> Pool Info:
                  </h1>
                </div>
                <div className="col-md-6">
                  <p>
                    <strong>Contract Address:</strong>{" "}
                    <span id="pool-info-contract">
                      <a
                        href={
                          process.env.REACT_APP_ETHERSCAN_URL +
                          "address/" +
                          currentPool.address
                        }
                        target="_blank"
                      >
                        {shortenAddress(currentPool.vesting.address)}
                      </a>
                    </span>
                  </p>
                </div>
                <div className="col-md-6">
                  <p>
                    <strong>Available Claimable:</strong>{" "}
                    <span id="pool-info-accessible">
                      <span className="text-muted">{claimable.toFixed(4)}</span>
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
                      style={{
                        width: `${getPercent(totalClaimed, totalAmount)}%`,
                      }}
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
                      style={{
                        width: `${getPercent(claimable, totalAmount)}%`,
                      }}
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
                      style={{
                        width: `${getPercent(
                          totalAmount - totalClaimed,
                          totalAmount
                        )}%`,
                      }}
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
                  <strong>
                    Available Claimable/Locked (
                    {process.env.REACT_APP_TOKEN_SYMBOL}):{" "}
                  </strong>
                  <span id="label-claimable">{claimable.toFixed(2)}</span> /
                  <span id="label-locked">{locked.toFixed(2)}</span>
                </div>
                <div className="col-md-12 text-center mt-2">
                  <button
                    type="button"
                    className="btn btn-success"
                    id="btn-claim"
                    onClick={claim}
                  >
                    Claim
                  </button>
                </div>
              </div>

              {(claimHistory && (
                <div className="row mt-5">
                  <div className="col-md-12">
                    <h3>Claim history:</h3>
                  </div>
                  <div className="col-md-12">
                    <DataGrid
                      columns={claimHistoryTable.columns}
                      rows={claimHistoryTable.rows}
                    />
                  </div>
                </div>
              )) || (
                <>
                  <button onClick={loadHistory}>Load claim history</button>
                  <br />
                  <br />
                  <br />
                  <br />
                </>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default InvestorPage;
