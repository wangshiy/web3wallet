import React from "react";
import { Alert, Button } from "@arco-design/web-react";

const ConnectWallet = ({ connectWallet, networkError }) => {
  return (
    <div>
      {/* Metamask network should be set to Localhost:8545. */}
      {networkError ? <Alert
        closable
        style={{ marginBottom: 20 }}
        type='error'
        title='Error'
        content={networkError}
      /> : null}
      <div>
        <Button
          type="primary"
          onClick={connectWallet}
        >
          Connect Wallet
        </Button>
      </div>
    </div>
  );
}

export default ConnectWallet;
