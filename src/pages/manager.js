import React, { useState, useEffect } from "react";
import { useAuth } from "../providers/AuthProvider";
import UserData from "../components/userData";
import axios from "axios";
import DataGrid from "react-data-grid";
import CSVReader from "react-csv-reader";
import ERC20 from "../abi-js/ERC20";
import Vesting from "../abi-js/Vesting";
import { ethers, utils } from "ethers";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import { shortenAddress } from "../utils";
import { useLoading } from "../providers/LoadingProvider";
import { useError } from "../providers/ErrorProvider";
import moment from "moment";

import "react-tabs/style/react-tabs.css";

export default function ManagerPage() {
  const { address, ethProvider } = useAuth();
  const [investorList, setInvestorList] = useState(null);
  const [csvData, setCsvData] = useState(null);
  const [totalVestingAmount, setTotalVestingAmount] = useState(0);
  const [isApproved, setIsApproved] = useState(false);
  const [currentPool, setCurrentPool] = useState(null);
  const [currentPoolName, setCurrentPoolName] = useState("");
  const [newOwner, setNewOwner] = useState("");
  const [newInvestorAddr, setNewInvestorAddr] = useState("");
  const [oldInvestorAddr, setOldInvestorAddr] = useState("");
  const [poolsConfig, setPoolsConfig] = useState(null);
  const { setIsLoading } = useLoading();
  const { showErrorModal } = useError();

  const startTime =
    poolsConfig &&
    currentPoolName &&
    parseInt(poolsConfig.find((x) => x.name == currentPoolName)?.start) * 1000;
  const endTime =
    poolsConfig &&
    currentPoolName &&
    parseInt(poolsConfig.find((x) => x.name == currentPoolName)?.end) * 1000;

  useEffect(() => {
    axios
      .get(process.env.REACT_APP_SYNC_URL + "config/pools")
      .then((res) => setPoolsConfig(res.data));
  }, []);

  const poolItems = poolsConfig?.map((x, i) => {
    return (
      <button
        key={i}
        id={x.name}
        onClick={() => {
          axios.get(process.env.REACT_APP_SYNC_URL + x.name).then((res) => {
            setCurrentPool(
              new ethers.Contract(x.address, Vesting, ethProvider.getSigner())
            );
            setCurrentPoolName(x.name);
            setInvestorList(res.data);
          });
        }}
      >
        {x.name}
      </button>
    );
  });

  const addedInvestorsTable = {
    columns: [
      { key: "investor", name: "Investor" },
      { key: "amount", name: "Amount" },
      { key: "claimed", name: "Claimed" },
    ],
    rows: investorList
      ? Object.keys(investorList).map((x) => {
          return {
            investor: x,
            amount: investorList[x].amount,
            claimed: investorList[x].claimed,
          };
        })
      : [],
  };

  const newInvestorsTable = {
    columns: [
      { key: "investor", name: "Investor" },
      { key: "amount", name: "Amount" },
    ],
    rows: csvData
      ? csvData.map((x) => {
          return { investor: x[0], amount: x[1] };
        })
      : [{ investor: "Investor address", amount: "Amount to vest" }],
  };

  const approve = async () => {
    const contract = new ethers.Contract(
      process.env.REACT_APP_TOKEN_ADDRESS,
      ERC20,
      ethProvider.getSigner()
    );

    setIsLoading(true);

    const tx = await contract
      .approve(
        currentPool.address,
        utils.parseEther(totalVestingAmount.toString())
      )
      .catch((e) => {
        setIsLoading(false);
        if (e.code != 4001) showErrorModal(e.message);
      });

    tx?.wait().then(() => {
      setIsLoading(false);
      setIsApproved(true);
    });
  };

  const addInvestors = async () => {
    setIsLoading(true);
    const tx = await currentPool
      .addTokenGrants(
        csvData.map((x) => x[0]),
        csvData.map((x) => utils.parseEther(x[1].toString()))
      )
      .catch((e) => {
        setIsLoading(false);
        if (e.code != 4001) showErrorModal(e.message);
      });

    tx?.wait().then(() => setIsLoading(false));
  };

  const changeInvestor = async () => {
    if (!utils.isAddress(newInvestorAddr))
      return showErrorModal("New investor address is incorrect");
    if (!utils.isAddress(oldInvestorAddr))
      return showErrorModal("Old investor address is incorrect");

    setIsLoading(true);
    const tx = await currentPool
      .changeInvestor(oldInvestorAddr, newInvestorAddr)
      .catch((e) => {
        setIsLoading(false);
        if (e.code != 4001) showErrorModal(e.message);
      });

    tx?.wait().then(() => setIsLoading(false));
  };

  const transferOwnership = async () => {
    if (!utils.isAddress(newOwner))
      return showErrorModal("The address is incorrect");

    const tx = await currentPool.transferOwnership(newOwner).catch((e) => {
      setIsLoading(false);
      if (e.code != 4001) showErrorModal(e.message);
    });

    tx?.wait().then(() => setIsLoading(false));
  };

  const totalPoolsize =
    investorList &&
    Object.keys(investorList).reduce(
      (a, v) => (a = a + parseInt(investorList[v].amount)),
      0
    );

  const totalClaimed =
    investorList &&
    Object.keys(investorList).reduce(
      (a, v) => (a = a + investorList[v].claimed),
      0
    );

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
      <UserData />

      {/* Pools */}
      {address && (
        <>
          <div className="col-md-12 ">
            <h1 className="h2">Select the pool</h1>
            <p className="text-muted">
              Working with pool requires wallet connection.
            </p>
            {poolItems}

            {currentPool && (
              <>
                {/* Pool Info */}
                <div className="row mt-5">
                  <div className="col-md-12">
                    <h1 className="h2">
                      <span id="pool-info-name"></span> Pool info
                    </h1>
                    <p className="text-muted">
                      Showing the pool info requires wallet connection.
                    </p>
                  </div>
                  <div className="col-md-6">
                    <p>
                      Contract Address:{" "}
                      <span id="pool-info-contract">
                        <a
                          href={
                            process.env.REACT_APP_ETHERSCAN_URL +
                            "address/" +
                            currentPool.address
                          }
                          target="_blank"
                        >
                          {shortenAddress(currentPool.address)}
                        </a>
                      </span>
                    </p>
                  </div>
                  <div className="col-md-6">
                    <p>
                      Total pool size:{" "}
                      <span id="pool-info-size">
                        <span className="text-muted">{totalPoolsize}</span>
                      </span>
                    </p>
                  </div>
                  <div className="col-md-6">
                    <p>
                      Remained:{" "}
                      <span id="pool-info-remained">
                        <span className="text-muted">
                          {(totalPoolsize - totalClaimed)?.toFixed(4)}
                        </span>
                      </span>
                    </p>
                  </div>
                  <div className="col-md-6">
                    <p>
                      Claimed:{" "}
                      <span id="pool-info-claimed">
                        <span className="text-muted">
                          {totalClaimed?.toFixed(4)}
                        </span>
                      </span>
                    </p>
                  </div>
                  <div className="col-md-6">
                    <p>
                      Lock start time:{" "}
                      <span id="pool-info-start-time">
                        <span className="text-muted">
                          {moment(startTime).format("MMMM Do YYYY, h:mm a")}
                        </span>
                      </span>
                    </p>
                  </div>
                  <div className="col-md-6">
                    <p>
                      Lock end time:{" "}
                      <span id="pool-info-end-time">
                        <span className="text-muted">
                          {moment(endTime).format("MMMM Do YYYY, h:mm a")}
                        </span>
                      </span>
                    </p>
                  </div>
                </div>
                <hr />

                <Tabs>
                  <TabList>
                    <Tab>Add Investors</Tab>
                    <Tab>Change Investor</Tab>
                    <Tab>Transfer Ownership</Tab>
                  </TabList>

                  <TabPanel>
                    {/*Add investor*/}
                    <div
                      className="tab-pane fade show active "
                      id="add-investor"
                      role="tabpanel"
                      aria-labelledby="add-investor-tab"
                    >
                      <div className="row mt-5">
                        <div className="col-md-12">
                          <CSVReader
                            onFileLoaded={(data, fileInfo, originalFile) => {
                              setTotalVestingAmount(
                                data.reduce(
                                  (a, v) => (a = a + parseInt(v[1])),
                                  0
                                )
                              );
                              setCsvData(data);
                            }}
                          />
                        </div>
                      </div>
                      <div className="row mb-5">
                        <div className="col-md-12">
                          <DataGrid
                            columns={newInvestorsTable.columns}
                            rows={newInvestorsTable.rows}
                            onRowDoubleClick={(e) => {
                              navigator.clipboard.writeText(e.investor);
                            }}
                          />
                        </div>
                      </div>

                      <div className="row">
                        <div className="col-md-12 text-center">
                          <p>
                            Total Amount into Vesting contract:{" "}
                            <strong>
                              <span id="total-pool-amount">
                                {totalVestingAmount}
                              </span>
                            </strong>{" "}
                            {process.env.REACT_APP_TOKEN_SYMBOL}
                          </p>
                        </div>
                      </div>

                      <div className="row mb-5">
                        <div className="col-md-6 text-end">
                          <button
                            type="button"
                            className="btn btn-primary"
                            id="btn-approve"
                            onClick={approve}
                            disabled={!csvData}
                          >
                            Approve
                          </button>
                        </div>
                        <div className="col-md-6 text-start">
                          <button
                            type="button"
                            className="btn btn-success"
                            id="btn-add"
                            disabled={!isApproved}
                            onClick={addInvestors}
                          >
                            Add
                          </button>
                        </div>
                      </div>

                      <div className="row mb-5">
                        <div className="col-md-12">
                          <h1 className="h3">Already added investors</h1>
                          <DataGrid
                            columns={addedInvestorsTable.columns}
                            rows={addedInvestorsTable.rows}
                            onRowDoubleClick={(e) => {
                              navigator.clipboard.writeText(e.investor);
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </TabPanel>
                  <TabPanel>
                    {/*Change investor*/}
                    <div className="row">
                      <div className="col-md-12">
                        <p>Change the hacked investor</p>
                      </div>
                      <div className="col-md-5">
                        <label>Old address:</label>
                        <br />
                        <input
                          type="text"
                          className="form-control "
                          placeholder="Old address"
                          id="old-address"
                          onChange={(e) => {
                            setOldInvestorAddr(e.target.value);
                          }}
                        />
                      </div>
                      <div className="col-md-5">
                        <label>New address:</label>
                        <br />
                        <input
                          type="text"
                          className="form-control "
                          placeholder="New address"
                          id="new-address"
                          onChange={(e) => {
                            setNewInvestorAddr(e.target.value);
                          }}
                        />
                      </div>
                      <div className="col-md-2">
                        <button
                          className="btn btn-primary"
                          id="btn-change"
                          onClick={changeInvestor}
                        >
                          Change
                        </button>
                      </div>
                    </div>
                  </TabPanel>
                  <TabPanel>
                    {/*Transfer ownership*/}

                    <div className="row">
                      <div className="col-md-12">
                        <p>Change the owner of this pool</p>
                      </div>
                      <div className="col-md-6">
                        <label>New owner:</label>
                        <br />
                        <input
                          type="text"
                          className="form-control "
                          placeholder="New owner address"
                          id="new-owner"
                          onChange={(e) => {
                            setNewOwner(e.target.value);
                          }}
                        />
                      </div>
                      <div className="col-md-6">
                        <button
                          className="btn btn-primary"
                          id="btn-transfer"
                          onClick={transferOwnership}
                        >
                          Transfer
                        </button>
                      </div>
                    </div>
                  </TabPanel>
                </Tabs>
              </>
            )}
          </div>
        </>
      )}
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
    </div>
  );
}
