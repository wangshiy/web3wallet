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
        <code>npx hardhat --network localhost faucet {account}</code>
      </p>}
    ></Result>
  );
}

export default NoTokensMessage;
