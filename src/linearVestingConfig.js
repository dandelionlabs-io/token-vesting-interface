export const tokenConfig = {
  name: "DCRED",
  address: "0xC41428f85cE939585AE8C31676c0e28Cd53a441b",
  abi: "erc20Abi",
};

export const linearVestingConfig = [
  // Chain ID, 1 for Ethereum Mainnet. 4 for Rinkeby Testnet.
  {
    name: "SeedPhase",
    address: "0xd969B94F2e07cD9dCd8378493BE835BB25C1A6E1",
    abi: "vestingAbi",
  },
  {
    name: "PrivateSale",
    address: "0x23e0De6be13ce4d1a57fE1faCB2F42Bd4702468a",
    abi: "vestingAbi",
  },
  {
    name: "PublicSale",
    address: "0x00658Ad8Bad1B93D2767CE88928AA39b13FD1a17",
    abi: "vestingAbi",
  },
];
