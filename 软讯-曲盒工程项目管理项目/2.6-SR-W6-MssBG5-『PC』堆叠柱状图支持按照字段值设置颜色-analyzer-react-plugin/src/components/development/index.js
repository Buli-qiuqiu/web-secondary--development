import React, { useState } from "react"
import "./development.less"
import {
  DesignConfiguration,
  Main
} from "../index.js"
import Options from "./options.js"
import {
  dataSource,
  mockCustomConfig,
  mockOptions,
  mockChangeOptions,
  mockChangeCustomConfig
} from "./mockData.js"
import { cloneDeep } from "lodash"
import Utils from "../../utils"
import { mainInit } from "../../App.js"

const Development = () => {
  const [options, setOptions] = useState(mockOptions)
  const [customConfig, setCustomConfig] = useState(mockCustomConfig)
  const changeOptions = (options) => {
    setOptions(cloneDeep(options))
    mockChangeOptions(options)
  }
  const changeCustomConfig = (customConfig) => {
    setCustomConfig(cloneDeep(customConfig))
    mockChangeCustomConfig(customConfig)
  }
  let props = {
    customConfig,
    dataSource,
    options,
    mainInit
  }
  return (
    <div id="development">
      <div id="main">
        <Main {...props} key={Utils.generateUUID()}/>
      </div>
      <div id="configuration">
        <Options
          options={options}
          setOptions={setOptions}
          changeOptions={changeOptions}
        />
        <DesignConfiguration
          customConfig={customConfig}
          dataSource={dataSource}
          changeCustomConfig={changeCustomConfig}
        />
      </div>

    </div>
  )
}


Development.propTypes = {}

export default Development
