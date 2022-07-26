import React from "react";
import { Result } from "@arco-design/web-react";

const WaitingForTransactionMessage = ({ txHash }) => {

    return <Result
        title='Waiting For Transaction'
        extra={<div>
            Waiting for transaction <strong>{txHash}</strong> to be mined
        </div>}
    ></Result>
}

export default WaitingForTransactionMessage;
