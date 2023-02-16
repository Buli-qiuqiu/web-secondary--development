import React from "react";
import App from "../src/App";
import { componentCenter, eventCenter } from "./mockComponentCenter";

const PreviewComponent = (props) => {
  const customConfig = {
    componentId: "111111",
    data: JSON.stringify({ list: [{ lngLat: [116.4783239, 31.7632747] }], type: 'point' }),
    onChange: (values) => {
      console.log(values);
      setState(values);
    },
    formConfig: {},
    component: {},
    configuration: '{"size":"large","placeholder":"33333","allowClear":true}',
    componentCenter,
    eventCenter,
  };

  const [state, setState] = React.useState(customConfig.data);

  return (
    <div>
      <App {...customConfig} type="Child" />
      <br />
      <br />
      <div>回填值: {customConfig.data}</div>
      <div>当前保存在后台的值: {state}</div>
    </div>
  );
};

PreviewComponent.propTypes = {};

export default PreviewComponent;
