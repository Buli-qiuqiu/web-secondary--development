import Utils from "../index.js"
import adapter from "./adapter.js"

export default function setAttributes(dom, props) {
  const isVue = process.env.CONFIG_JSON ? false : true
  const configJson = require("../../../pluginTemp/config.json")
  const pluginType = configJson.type === "app"
    ? configJson.props.type === "customize" ? "app" : configJson.props.type
    : configJson.type
  let { customConfig, customOptions } = adapter(props, pluginType)
  if (pluginType === "bigscreen" || pluginType === "analyzer") {
    customConfig = customOptions
  }
  //内部使用，需求编号，不需要可去掉，用来将需求编号和开发者打到dom元素上，方便以后处理问题
  const requirementNum = configJson["requirement-number"] === "需求编号"
    ? ""
    : `${configJson["requirement-number"]}-`

  const id = customConfig?.id
    ? `${pluginType}-secondary-${requirementNum}${customConfig.id}`
    : `${pluginType}-secondary-${requirementNum}${Utils.tools.generateUUID()}`
  const developers = process.env[`${isVue ? "VUE" : "REACT"}_APP_DEVELOPERS`]
  dom.setAttribute("id", id)
  dom.setAttribute("developers", developers)
  if (process.env.NODE_ENV === "production") {
    console.log(`%c需求编号:%c${requirementNum}%c,\n开发者：%c${developers}，\n%c二开区域：`, "font-size:20px;color:skyblue", "font-size:20px;color:lightpink", "font-size:20px;color:skyblue", "font-size:20px;color:red", "font-size:20px;color:skyblue", dom)
  }
}
