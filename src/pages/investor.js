import React, { useEffect, useState } from "react";
import { useAuth } from "../providers/AuthProvider";
import UserData from "../components/userData";
import { linearVestingConfig, tokenConfig } from "../linearVestingConfig";
import { ethers } from "ethers";
import Vesting from "../abi-js/Vesting";
import { ethBalance, shortenAddress } from "../utils";
import PoolSelector from "../components/poolSelector";

const InvestorPage = () => {
  const { address, ethProvider } = useAuth();
  const [pools, setPools] = useState(null);
  const [currentPool, setCurrentPool] = useState(null);
  const [claimable, setClaimable] = useState(0);

  useEffect(async () => {
    if (address) {
      setPools(await getAvailablePools());
      setCurrentPool(null);
    }
  }, [address]);

  const checkAndGetPool = async (pool, key) => {
    const contract = new ethers.Contract(
      pool.address,
      Vesting,
      ethProvider.getSigner()
    );

    let grant = await contract.getTokenGrant(address);
    let amount = ethBalance(grant.amount) + ethBalance(grant.totalClaimed);

    if (amount) {
      let blacklist = await contract.blacklist(address).catch((e) => {
        console.error(e);
        throw "RPC Error while validating Blacklisted Accounts in " + key;
      });

      if (blacklist !== "0x0000000000000000000000000000000000000000") {
        throw `Address ${address} was blacklisted and replaced by ${blacklist}. Use the new address please!`;
      }

      return { grant: grant, vesting: contract, name: pool.name };
    }
    return null;
  };

  const getAvailablePools = async () => {
    const availablePools = [];
    for (let i = 0; i < linearVestingConfig.length; i++) {
      const poolResult = await checkAndGetPool(
        linearVestingConfig[i],
        linearVestingConfig[i].name
      );
      if (poolResult) availablePools.push(poolResult);
    }
    return availablePools;
  };

  const claim = () => {
    currentPool.vesting.claimVestedTokens(address);
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
                      <span className="text-muted">{claimable}</span>
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
                  <strong>
                    Available Claimable/Locked ({tokenConfig.name}):
                  </strong>
                  <span id="label-claimable">0.0</span> /
                  <span id="label-locked">0.0</span>
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
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default InvestorPage;
