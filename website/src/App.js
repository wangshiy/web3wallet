import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import TokenArtifact from "./abis/Token.json";
import contractAddress from "./abis/contract-address.json";

import ConnectWallet from "./pages/ConnectWallet";
import NoTokensMessage from "./pages/NoTokensMessage";
import Loading from "./pages/Loading";
import Transfer from "./pages/Transfer";
import WaitingForTransactionMessage from "./pages/WaitingForTransactionMessage";
import TransactionErrorMessage from "./pages/TransactionErrorMessage";
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

// This is an error code that indicates that the user canceled a transaction
const ERROR_CODE_TX_REJECTED_BY_USER = 4001;

const App = () => {
  const [appState, setAppState] = useState(INITIAL_STATE);

  const initialize = async () => {
    // load provider
    const provider = await new ethers.providers.Web3Provider(window.ethereum);
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
    window.location.reload();
  };

  const transferTokens = async (to, amount) => {
    try {

      // todo: fix tokenContract to non-state variable
      const tx = await appState.tokenContract.transfer(to, amount);
      setAppState({
        ...appState,
        txBeingSent: tx.hash,
      });

      // We use .wait() to wait for the transaction to be mined. This method
      // returns the transaction's receipt.
      const receipt = await tx.wait();

      // The receipt, contains a status flag, which is 0 to indicate an error.
      if (receipt.status === 0) {
        // We can't know the exact error that made the transaction fail when it
        // was mined, so we throw this generic one.
        throw new Error("Transaction failed");
      }

      // If we got here, the transaction was successful, so you may want to
      // update your state. Here, we update the user's balance.
      // todo: fix tokenContract to non-state variable
      Notification.success({ content: "Transfer Succeed!" });
      await updateBalance(appState.tokenContract, appState.account);
    } catch (error) {
      // We check the error code to see if this error was produced because the
      // user rejected a tx. If that's the case, we do nothing.
      if (error.code === ERROR_CODE_TX_REJECTED_BY_USER) {
        return;
      }

      // Other errors are logged and stored in the Dapp's state. This is used to
      // show them to the user, and for debugging.
      console.error(error);
      setAppState({
        ...appState,
        transactionError: error,
      });
    } finally {
      // If we leave the try/catch, we aren't sending a tx anymore, so we clear
      // this part of the state.
      setAppState((prevState, _) => {
        return {
          ...prevState,
          txBeingSent: undefined,
        };
      });
    }
  }

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
    if (window.ethereum === undefined) {
      return <NoWalletDetected />;
    }

    if (appState.account === undefined) {
      return (
        <ConnectWallet
          connectWallet={connectMetaMask}
          networkError={appState.networkError}
        />
      );
    }

    if (appState.balance && appState.balance.eq(0)) {
      return (
        <NoTokensMessage account={appState.account} />
      );
    }

    if (appState.txBeingSent) {
      return (<WaitingForTransactionMessage txHash={appState.txBeingSent} />);
    }

    if (appState.transactionError) {
      return (<TransactionErrorMessage transactionError={appState.transactionError} />);
    }

    if (appState.tokenData === undefined || appState.balance === undefined) {
      return (<Loading />);
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
        <Transfer
          transferTokens={transferTokens}
        />
      </div>
    );
  };

  return renderContent();
}

export default App;
