import React from "react"
import {
  DesignConfiguration,
  Main
} from "./components"

//封装平台方法
const App = ({ type, ...props }) => {
  if (type == "designConfiguration") {
    return <DesignConfiguration {...props} />
  } else {
    props.componentId = props.pluginId
    return <Main {...props} />
  }
}
App.propTypes = {}

export default App
