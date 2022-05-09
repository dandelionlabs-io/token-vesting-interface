import React, { useEffect, useInsertionEffect, useState } from "react";
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
  const [claimHistory, setClaimHistory] = useState(null);
  const [claimable, setClaimable] = useState(null);

  const locked =
    currentPool &&
    ethBalance(currentPool.grant.amount.sub(currentPool.grant.totalClaimed));

  const totalClaimed =
    currentPool && ethBalance(currentPool.grant.totalClaimed);
  const totalAmount = currentPool && ethBalance(currentPool.grant.amount);

  useEffect(() => {
    if (currentPool)
      currentPool.vesting
        .calculateGrantClaim(address)
        .then((res) => setClaimable(ethBalance(res)));
  }, [currentPool]);

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
      };
    }
    return null;
  };

  const getAvailablePools = async () => {
    let availablePools = [];
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

    const url = `${process.env.REACT_APP_SYNC_URL}${process.env.REACT_APP_FACTORY_CONTRACT_ADDRESS}/pools`;
    const poolsData = (await axios.get(url)).data;

    availablePools.forEach((pool) => {
      const data = poolsData.find((x) => x.address == pool.address);
      pool.name = data.name;
      pool.start = data.start;
      pool.end = data.end;
    });

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

  const poolData = {
    columns: [
      { key: "name", name: "" },
      { key: "value", name: "" },
    ],
    rows: currentPool
      ? [
          {
            name: "Contract Address",
            value: shortenAddress(currentPool.address),
          },
          {
            name: "Lock Start Time",
            value: moment(currentPool.start).format("MMMM Do YYYY, h:mm a"),
          },
          {
            name: "Lock End Time",
            value: moment(currentPool.end).format("MMMM Do YYYY, h:mm a"),
          },
          { name: "Total Locked Amount", value: totalAmount },
        ]
      : [],
  };

  return (
    <div className="container" style={{ height: "100vh" }}>
      {/* HTTPS required */}

      <UserData
        className="pools-grid"
        columns={poolData.columns}
        rows={poolData.rows}
      />

      {/* Pools */}
      {(address && pools && (
        <>
          {(!currentPool && (
            <PoolSelector
              address={address}
              pools={pools}
              setClaimable={setClaimable}
              setCurrentPool={setCurrentPool}
              currentPool={currentPool}
              setClaimHistory={setClaimHistory}
            />
          )) || (
            <>
              <div className="row mt-5">
                <div className="col-md-6 current-pool-panel">
                  <strong style={{ color: "gold", fontSize: "30px" }}>
                    Details:
                  </strong>
                  <div className="row mt-3">
                    <div className="col-sm-6">
                      <p>Contract Address</p>
                      <p>Lock Start Time</p>
                      <p>Lock End Time</p>
                      <p>Total Locked Amount</p>
                    </div>
                    <div className="col-sm-6">
                      <p className="grey">
                        {shortenAddress(currentPool.address)}
                      </p>
                      <p className="grey">
                        {moment(currentPool.start).format(
                          "MMMM Do YYYY, h:mm a"
                        )}
                      </p>
                      <p className="grey">
                        {moment(currentPool.end).format("MMMM Do YYYY, h:mm a")}
                      </p>
                      <p className="grey">{totalAmount}</p>
                    </div>
                  </div>
                  <p>Progress detail</p>
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
                  {claimable > 0 && (
                    <button
                      className="claim-btn mt-3"
                      onClick={claim}
                      style={{ padding: "5px 20px 5px 20px" }}
                    >
                      Claim
                    </button>
                  )}
                  <div className="row mt-3">
                    <div className="col-sm-6">
                      <p className="gold">Claimed amt.</p>
                      <p className="green">Claimable amt.</p>
                      <p className="grey">Remaining balance</p>
                    </div>
                    <div className="col-sm-6">
                      <p className="gold">{totalClaimed?.toFixed(2)}</p>
                      <p className="green">{claimable?.toFixed(2)}</p>
                      <p className="grey">{locked?.toFixed(2)}</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-6 current-pool-panel">
                  <strong style={{ color: "gold", fontSize: "30px" }}>
                    History of Claims:
                  </strong>
                  {claimHistory && (
                    <div className="row mt-5">
                      <div className="col-md-12">
                        <DataGrid
                          className="pools-grid"
                          columns={claimHistoryTable.columns}
                          rows={claimHistoryTable.rows}
                          style={{ background: "transparent" }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </>
      )) || <div style={{ height: "100vh" }}></div>}
    </div>
  );
};

export default InvestorPage;
