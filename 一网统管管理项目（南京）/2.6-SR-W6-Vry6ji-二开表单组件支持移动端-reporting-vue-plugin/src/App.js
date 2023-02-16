import React from "react";
import PropTypes from "prop-types";

import Design from "./components/set";
import Add from "./components/add";
import Mobile from "./components/add/mobile";
import Child from "./components/child";
import ChildM from "./components/child/childM";
import Table from "./components/table";
import Preview from "./components/preview";
import DesignConfiguration from "./components/designConfiguration";

const renderHashMap = {
  set: Design,
  add: Add,
  Add: Mobile,
  insert: Mobile,
  Edit: Mobile,
  child: Child,
  Child: ChildM,
  table: Table,
  preview: Preview,
  Preview: Preview,
  designConfiguration: DesignConfiguration,
};

const App = ({ type, ...props }) => {
  let Comp = () => <></>;
  if (renderHashMap[type]) Comp = renderHashMap[type];
  return <Comp {...props} />;
};

App.propTypes = {
  type: PropTypes.string,
};

export default App;