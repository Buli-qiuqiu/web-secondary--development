import React from "react"
import {
  DesignConfiguration,
  Main
} from "./components"

//封装平台方法
const App = ({ type, ...props }) => {
  if (type == "designConfiguration") {
    props.changeCustomConfig = props.changeConfiguration
    props.customConfig = JSON.parse(props.configuration)
    return <DesignConfiguration {...props} />
  } else {
    props.componentId = props.pluginId
    props.customConfig = props.pluginConfig
    return <Main {...props} />
  }
}
App.propTypes = {}

export default App
