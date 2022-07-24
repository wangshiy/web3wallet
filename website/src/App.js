import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import TokenArtifact from "./abis/Token.json";
import contractAddress from "./abis/contract-address.json";

import ConnectWallet from "./pages/ConnectWallet";
import Transfer from "./pages/Transfer";
import NoWalletDetected from "./pages/NoWalletDetected";
import { Typography, Notification } from "@arco-design/web-react";
import "@arco-design/web-react/dist/css/arco.css";
import './App.css';

const INITIAL_STATE = {
  provider: undefined,
  account: undefined,
  tokenContract: undefined,
  // The info of the token (i.e. It's Name and symbol)
  tokenData: undefined,
  // The user's address and balance
  selectedAddress: undefined,
  balance: undefined,
  // The ID about transactions being sent, and any possible error with them
  txBeingSent: undefined,
  transactionError: undefined,
  networkError: undefined,
};

// This is the Hardhat Network id that we set in our hardhat.config.js.
// Here's a list of network ids https://docs.metamask.io/guide/ethereum-provider.html#properties
// to use when deploying to other networks.
const HARDHAT_NETWORK_ID = '1337';

// This is an error code that indicates that the user canceled a transaction
const ERROR_CODE_TX_REJECTED_BY_USER = 4001;

// This component is in charge of doing these things:
//   1. It connects to the user's wallet
//   2. Initializes ethers and the Token contract
//   3. Polls the user balance to keep it updated.
//   4. Transfers tokens by sending transactions
//   5. Renders the whole application
//
// Note that (3) and (4) are specific of this sample application, but they show
// you how to keep your Dapp and contract's state in sync,  and how to send a
// transaction.
const App = () => {
  const [appState, setAppState] = useState(INITIAL_STATE);

  const initialize = async () => {
    // load provider
    const provider = await new ethers.providers.Web3Provider(window.ethereum);
    const { chainId } = await provider.getNetwork();
    console.log(' provider.getSigner(0)', provider.getSigner(0));
    // load contract
    const tokenContract = await new ethers.Contract(
      contractAddress.Token,
      TokenArtifact.abi,
      provider.getSigner(0)
    );
    // connectMetaMask
    let accounts = [];
    let balance = undefined;
    try {
      accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      // update balance
      balance = await tokenContract.balanceOf(accounts[0]);
      console.log('balance', balance);
    } catch (error) {
      Notification.error({ content: error.message });
    }
    // load token data
    const name = await tokenContract.name();
    const symbol = await tokenContract.symbol();


    setAppState({
      ...appState,
      provider,
      tokenContract,
      tokenData: { name, symbol },
      account: accounts[0],
      balance,
    });
  }

  const connectMetaMask = async () => {
    console.log('connectMetaMask', connectMetaMask);
    let accounts = [];
    try {
      accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
    } catch (error) {
      Notification.error({ content: error.message });
    }
    setAppState({
      ...appState,
      account: accounts[0]
    });
  };

  const updateBalance = async (tokenContract, account) => {
    const balance = await tokenContract.balanceOf(account);
    console.log('balance', balance);
    setAppState({
      ...appState,
      balance
    });
  }

  const handleAccountsChanged = async (accounts) => {
    if (accounts.length === 0) {
      // MetaMask is locked or the user has not connected any accounts
      setAppState({
        ...appState,
        account: undefined,
      });
    } else if (accounts[0] !== appState.account) {
      setAppState({
        ...appState,
        account: accounts[0],
      });
    }
    initialize();
  }

  const handleChainChanged = (_chainId) => {
    console.log('handleChainChanged');
    window.location.reload();
  };

  useEffect(() => {
    initialize();

    window.ethereum.on("accountsChanged", handleAccountsChanged);
    window.ethereum.on("chainChanged", handleChainChanged);

    return () => {
      window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
      window.ethereum.removeListener("chainChanged", handleAccountsChanged);
    };
  }, []);

  // This method resets the state
  const resetState = () => {
    setAppState(INITIAL_STATE);
  }

  const renderContent = () => {
    console.log('appState', appState);
    if (window.ethereum === undefined) {
      return <NoWalletDetected />;
    }

    if (!appState.account) {
      return (
        <ConnectWallet 
          connectWallet={connectMetaMask} 
          networkError={appState.networkError}
        />
      );
    }

    return (
      <div className="App">
        <Typography.Title>
          {appState.tokenData && appState.tokenData.name}
        </Typography.Title>
        <Typography.Paragraph>
          Welcome <b>{appState.account}</b>, you have{" "}
          <b>
            {appState.balance && appState.balance.toString()} {appState.tokenData && appState.tokenData.symbol}
          </b>
          .
        </Typography.Paragraph>
        <Transfer />
      </div>
    );
  };

  return renderContent();
}

export default App;
