import React, { useState, useEffect } from "react";

import Transfer from "./pages/Transfer";
import NoWalletDetected from "./pages/NoWalletDetected";
import { Spin, Typography } from "@arco-design/web-react";
import "@arco-design/web-react/dist/css/arco.css";
import './App.css';
import useWeb3 from "./contexts/web3-context";

const INITIAL_STATE = {
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
  const { provider, account, tokenContract } = useWeb3();
  const [appState, setAppState] = useState(INITIAL_STATE);

  const getTokenData = async (tokenContract) => {
    const name = await tokenContract.name();
    const symbol = await tokenContract.symbol();

    setAppState({
      ...appState,
      tokenData: { name, symbol }
    });
  }

  const updateBalance = async (tokenContract, account) => {
    const balance = await tokenContract.balanceOf(account);
    console.log('balance', balance);
    setAppState({
      ...appState,
      balance
    });
  }

  useEffect(() => {
    if (tokenContract && account) {
      getTokenData(tokenContract);
      updateBalance(tokenContract, account);
    }
  }, [tokenContract, account]);

  // useEffect(() => {
  //   if (account) {
  //     updateBalance();
  //   }
  // }, [account]);

  // This method resets the state
  const resetState = () => {
    setAppState(INITIAL_STATE);
  }

  const renderContent = () => {
    console.log('appState', appState);
    if (window.ethereum === undefined) {
      return <NoWalletDetected />;
    }

    return (
      <div className="App">
        <Typography.Title>
          {appState.tokenData && appState.tokenData.name}
        </Typography.Title>
        <Typography.Paragraph>
          Welcome <b>{account}</b>, you have{" "}
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
