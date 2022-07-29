import React from "react";
import { Result } from "@arco-design/web-react";

const NoTokensMessage = ({ account }) => {
  return (
    <Result
      title="You don't have tokens to transfer"
      extra={<p
      >
        To get some tokens, open a terminal in the root of the repository and run:
        <br />
        <br />
        <p>For localhost: </p>
        <code>npx hardhat --network localhost faucet {account}</code>
        <p>For Goerli: </p>
        <code> https://goerlifaucet.com/</code>
      </p>}
    ></Result>
  );
}

export default NoTokensMessage;
