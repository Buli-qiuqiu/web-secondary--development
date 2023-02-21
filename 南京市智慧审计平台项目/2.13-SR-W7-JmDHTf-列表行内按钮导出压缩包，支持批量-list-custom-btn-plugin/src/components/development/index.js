import React, { useState } from "react"
import "./development.less"
import {
  DesignConfiguration,
  Main
} from "../index.js"
import {
  mockCustomConfig,
  mockChangeCustomConfig
} from "./mockData.js"
import Utils from "../../utils"

const Development = () => {
  const [customConfig, setCustomConfig] = useState(mockCustomConfig)
  let [mainKey, setMainKey] = useState(Utils.generateUUID)
  const changeCustomConfig = (customConfig) => {
    setCustomConfig(JSON.parse(customConfig))
    setMainKey(Utils.tools.generateUUID())
    mockChangeCustomConfig(JSON.parse(customConfig))
  }
  return (
    <div id="development">
      <div id="main">
        <Main
          customConfig={customConfig}
          key={mainKey}
        />
      </div>
      <div id="configuration">
        <DesignConfiguration
          customConfig={customConfig}
          changeCustomConfig={changeCustomConfig}
        />
      </div>
    </div>
  )
}


Development.propTypes = {}

export default Development
