import React, { useEffect } from "react";
import { ethBalance } from "../utils";

const PoolSelector = (props) => {
  const { address, pools, setClaimable, setCurrentPool, currentPool } = props;

  useEffect(async () => {
    if (address && currentPool) {
      updateErc20Balance(currentPool.vesting);
    }
  }, [address]);

  const updateErc20Balance = (contract) => {
    if (contract) {
      contract
        .calculateGrantClaim(address)
        .then((res) => setClaimable(ethBalance(res)));
    }
  };

  const poolItems = pools?.map((x, i) => {
    return (
      <button
        key={i}
        id={x.name}
        onClick={() => {
          updateErc20Balance(x.vesting);

          setCurrentPool(x);
        }}
      >
        {x.name}
      </button>
    );
  });

  return (
    <div className="col-md-12 ">
      <h1 className="h2">Select the pool</h1>
      <p className="text-muted">
        Working with pool requires wallet connection.
      </p>
      {poolItems}
    </div>
  );
};

export default PoolSelector;
