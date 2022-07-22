import React from "react";
import { Result } from "@arco-design/web-react";

const NoWalletDetected = () => {
  return (
    <Result
      title='No Ethereum wallet was detected. Please install'
      extra={<a
        href="http://metamask.io"
        target="_blank"
        rel="noopener noreferrer"
      >
        MetaMask
      </a>}
    ></Result>
  );
}

export default NoWalletDetected;
