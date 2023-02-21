import React from "react"
import { createRoot } from "react-dom/client"
import App from "./App"
import { Development } from "./components"
import Utils from "./utils/index.js"
/**
 * 生产打包时为了减少体积，不引入 antd.css (可节约 2.5M左右的包体积)
 * 生产包是当做 onemind 主站插件使用的，页面里已经有一份 ant.css 了，所以这里可以省去
 * 从功能通过 webpack.IgnorePlugin 插件实现，如果想要打入此 css，请在 webpack 配置中做修改。
 */
if (process.env.NODE_ENV !== "production") {
  require("antd/dist/antd.min.css")
  const root = createRoot(document.getElementById("root"))
  root.render(<Development />)
} else {
  if (!window.CUSTOM_PLUGIN) {
    window.CUSTOM_PLUGIN = new Map()
  }
  window.CUSTOM_PLUGIN.set(process.env.CONFIG_JSON_ID, (dom, props, context, eventBus) => {
    console.log(props);
    //内部使用，需求编号，不需要可去掉，用来将需求编号和当前开发者打到dom元素上，方便以后定位问题
    if (props.type != "designConfiguration") {
      const requirementNum = process.env.CONFIG_JSON_REQUIREMENTNUM === ""
        ? ""
        : `${process.env.CONFIG_JSON_REQUIREMENTNUM}-`
      const customConfig = props.pluginConfig
      const pluginType = process.env.CONFIG_JSON.type
      const id = customConfig?.id
        ? `${pluginType}-secondary-${requirementNum}${customConfig.id}`
        : `${pluginType}-secondary-${requirementNum}${Utils.tools.generateUUID()}`
      const developers = process.env.REACT_APP_DEVELOPERS || ""
      dom.setAttribute("id", id)
      dom.setAttribute("developers", developers)
    }
    const root = createRoot(dom)
    props.eventBus = eventBus
    root.render(<App {...props} />)
  })
}
