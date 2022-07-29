import React from "react";
import { Result, Alert, Button } from "@arco-design/web-react";

const ConnectWallet = ({ connectWallet, networkError }) => {
  return (
    <Result
      title="Please connect your wallet"
      extra={
        networkError ? <Alert
          closable
          style={{ marginBottom: 20 }
          }
          type='error'
          title='Error'
          content={networkError}
        /> : <Button
          type="primary"
          onClick={connectWallet}
        >
          Connect Wallet
        </Button>
      }
    ></Result >
  );
}

export default ConnectWallet;
