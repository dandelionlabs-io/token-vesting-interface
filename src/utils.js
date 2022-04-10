import { utils } from "ethers";

export const shortenAddress = (addr) => {
  if (addr !== undefined && addr.startsWith("0x")) {
    const length = addr.length;
    return addr.slice(0, 6) + "..." + addr.slice(length - 4);
  }
  return addr;
};

export const ethBalance = (balance) => {
  if (!balance) return undefined;
  let result = utils.formatEther(balance);
  result = parseInt(balance) / 1e18;

  return result;
};
