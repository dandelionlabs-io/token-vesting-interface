import React, { useState, useContext, createContext } from "react";
import { providers } from "ethers";
import WalletConnectProvider from "@walletconnect/web3-provider";
import detectEthereumProvider from "@metamask/detect-provider";

const AuthContext = createContext();

export default function AuthProvider({ children }) {
  const [showModalInfo, setShowModalInfo] = useState(true);

  const [address, setAddress] = useState(undefined);
  const [balance, setBalance] = useState(undefined);
  const [ethProvider, setETHProvider] = useState(undefined);
  const [wrongNetwork, setWrongNetwork] = useState(false);
  const [isMetamask, setIsMetamask] = useState(undefined);

  // const network = new NetworkConnector({
  //   urls: process.env.REACT_APP_RPC_URL,
  //   defaultChainId: 1,
  // });

  const connectWallet = async () => {
    // check if metamask is being used
    setIsMetamask(false);

    // initialize to Web3 backend (infura)
    const provider = new WalletConnectProvider({
      infuraId: process.env.REACT_APP_INFURA_ID,
    });

    //initialize address state
    setAddress(undefined);

    // disconnect if already connected
    await provider.disconnect();

    // make new connection
    await provider.enable();

    // connect to Web3 backend (infura)
    const web3Provider = new providers.Web3Provider(provider);
    setETHProvider(web3Provider);

    const signer = await web3Provider.getSigner();
    // console.log(signer);
    const address = await signer.getAddress();
    const balance = await signer.getBalance();
    setAddress(address);
    setBalance(balance);

    provider.on("accountsChanged", handleAccountsChanged);

    const network = await web3Provider.getNetwork();
    setWrongNetwork(
      !(process.env.REACT_APP_NETWORK_ID === "0x" + network.chainId.toString())
    );
  };

  async function handleAccountsChanged(accounts) {
    if (accounts.length === 0) {
      // MetaMask is locked or the user has not connected any accounts
      // console.log("Please connect to MetaMask.");
      setAddress(undefined);
      setBalance(undefined);
    } else if (accounts[0] !== address) {
      setAddress(accounts[0]);
      if (ethProvider) {
        const signer = await ethProvider.getSigner();
        const balance = await signer.getBalance();
        setBalance(balance);
      } else {
        // console.log("I am an error");
      }
    }
  }

  const connectMetaMask = async () => {
    // check if metamask is being used
    setIsMetamask(true);

    const provider = await detectEthereumProvider();
    provider
      .request({ method: "eth_requestAccounts" })
      .then(handleAccountsChanged)
      .catch((err) => {
        if (err.code === 4001) {
          // EIP-1193 userRejectedRequest error
          // If this happens, the user rejected the connection request.
          // console.log("Please connect to MetaMask.");
          setIsMetamask(undefined);
        } else {
          console.error(err);
        }
      });

    const web3Provider = new providers.Web3Provider(provider);

    provider.on("chainChanged", handleChainChanged);
    provider.on("accountsChanged", handleAccountsChanged);

    async function handleChainChanged(_chainId) {
      if (_chainId !== process.env.REACT_APP_NETWORK_ID) {
        setWrongNetwork(true);

        try {
          setAddress(undefined);
          provider
            .request({
              method: "wallet_switchEthereumChain",
              params: [{ chainId: process.env.REACT_APP_NETWORK_ID }],
            })
            .then(async () => {
              if (ethProvider) {
                const signer = await ethProvider.getSigner();
                const balance = await signer.getBalance();
                setBalance(balance);
              }
            });
        } catch (e) {}
      } else {
        setWrongNetwork(false);
      }
    }

    setETHProvider(web3Provider);

    const chainId = await provider.request({ method: "eth_chainId" });
    await handleChainChanged(chainId);
    const signer = await web3Provider.getSigner();
    const balance = await signer.getBalance();
    setBalance(balance);
  };

  const updateBalance = async () => {
    if (ethProvider) {
      const signer = await ethProvider.getSigner();
      const address = await signer.getAddress();
      const balance = await signer.getBalance();
      setAddress(address);
      setBalance(balance);
    }
  };

  const disconnectWallet = () => {
    setAddress(undefined);
    setBalance(undefined);
    setETHProvider(undefined);
    setWrongNetwork(false);
  };

  return (
    <AuthContext.Provider
      value={{
        address,
        showModalInfo,
        setShowModalInfo,
        connectWallet,
        connectMetaMask,
        disconnectWallet,
        ethProvider,
        balance,
        updateBalance,
        wrongNetwork,
        isMetamask,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  return useContext(AuthContext);
};
