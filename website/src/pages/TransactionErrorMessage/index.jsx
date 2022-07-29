import React from "react";
import { Result } from "@arco-design/web-react";

const TransactionErrorMessage = ({ transactionError }) => {
  return (
    <Result
      status='error'
      title="Transaction Error"
      extra={<p
      >
        Error sending transaction: {transactionError}
      </p>}
    ></Result>
  );
}

export default TransactionErrorMessage;
