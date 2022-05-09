import React, { useEffect } from "react";
import { ethBalance, shortenAddress } from "../utils";
import DataGrid from "react-data-grid";
import moment from "moment";
import axios from "axios";
import { useError } from "../providers/ErrorProvider";

const PoolSelector = (props) => {
  const { address, pools, setCurrentPool, currentPool, setClaimHistory } =
    props;
  const { showErrorModal } = useError();

  const loadHistory = (poolAddress) => {
    const url = `${process.env.REACT_APP_SYNC_URL}${process.env.REACT_APP_NETWORK}/${poolAddress}/claims/${address}`;

    axios
      .get(url)
      .then((res) => setClaimHistory(res.data))
      .catch((e) => showErrorModal(e.error.message));
  };

  const poolItems = {
    columns: [
      { key: "name", name: "Name" },
      { key: "claimed", name: "Claimed amt." },
      { key: "remain", name: "Remain amt." },
      { key: "start", name: "Lock start" },
      { key: "end", name: "Lock end" },
      { key: "claim", name: "" },
    ],
    rows: pools
      ? pools.map((x) => {
          return {
            name: `${x.name} (${shortenAddress(x.address)})`,
            claimed: ethBalance(x.grant.totalClaimed).toFixed(4),
            remain: (
              ethBalance(x.grant.amount) - ethBalance(x.grant.totalClaimed)
            ).toFixed(4),
            start: moment(x.start).format("MMMM Do YYYY, h:mm a"),
            end: moment(x.end).format("MMMM Do YYYY, h:mm a"),
            claim: (
              <button
                className="claim-btn"
                style={{ zIndex: "999" }}
                onClick={() => {
                  setCurrentPool(x);
                  loadHistory(x.address);
                }}
              >
                Claim
              </button>
            ),
          };
        })
      : [],
  };
  return (
    <div className="col-md-12 ">
      <DataGrid
        className="pools-grid"
        columns={poolItems.columns}
        rows={poolItems.rows}
      />
    </div>
  );
};

export default PoolSelector;
