import React from "react"
import adapter from "./utils/handlePlatform/adapter.js"

import {
  Add,
  Detail,
  DesignConfiguration,
  Design,
  Child,
  List,
  Query
} from "./components"
import PropTypes from "prop-types"

const renderMap = {
  set: Design,
  add: Add,
  child: Child,
  table: List,
  preview: Detail,
  designConfiguration: DesignConfiguration,
  query: Query
}
const App = (props) => {
  const configJson = require("../pluginTemp/config.json")
  const pluginType = configJson.type === "app"
    ? configJson.props.type === "customize" ? "app" : configJson.props.type
    : configJson.type
  props = adapter(props, pluginType)
  let Comp = () => <></>
  if (renderMap[props.type]) Comp = renderMap[props.type]
  return <Comp {...props} />
}
App.propTypes = {
  type: PropTypes.string
}

export default App
