import React from "react";
import { Result } from "@arco-design/web-react";
import { IconSync } from '@arco-design/web-react/icon';

const Loading = () => {
  return (
    <Result
      status={null}
      icon={<IconSync spin style={{ fontSize: 40 }} />}
      title='Loading...'
    ></Result>
  );
}

export default Loading;
