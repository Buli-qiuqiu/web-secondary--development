import React from "react";
import App from "../src/App";
import "./mockComponentCenter";

const DesignConfiguration = (props) => {
  const customConfig = {
    componentId: "111111",
    data: JSON.stringify({list:[{lngLat: [116.4783239, 31.7632747]}],type:'point'}),
    formConfig: {},
    component: {},
    changeConfiguration: (values) => console.log(values),
    configuration:
      '{"size":"middle", "placeholder": "123", "allowClear": true }',
  };
  return <App {...customConfig} type="designConfiguration" />;
};

DesignConfiguration.propTypes = {};

export default DesignConfiguration;
