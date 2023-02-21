import Vue from "vue"
import App from "./App.vue"
import eventActionDefinitions from "./components/main/eventActionDefinitions.js"
import { Development } from "@/components/index.js"
import setAttributes from "@/utils/handlePlatform/setAttributes.js"

const configJson = require("../pluginTemp/config.json")

Vue.config.productionTip = false
Vue.config.devtools = true


const mainInit = (Main) => {
  const { updateProcess, componentId } = Main
  window?.componentCenter?.register(componentId, "comp", Main, eventActionDefinitions)
  const customOptions = Main.customOptions || {}
  customOptions?.width && (Main.width = customOptions.width)
  customOptions?.height && (Main.height = customOptions.height)
  updateProcess && updateProcess()
}

if (process.env.NODE_ENV !== "production") {
  new Vue({
    render: h => <Development mainInit={mainInit} />
  }).$mount("#app")
} else {
  if (!window.CUSTOM_PLUGIN) {
    window.CUSTOM_PLUGIN = new Map()
  }
  window.CUSTOM_PLUGIN.set(
    configJson.id,
    (dom, props, context, eventBus) => {
      if (dom.childNodes.length > 0) {
        dom.removeChild(dom.childNodes[0])
      }
      props = setAttributes(dom, props)
      props.eventBus = eventBus
      props.mainInit = mainInit
      const div = document.createElement("div")
      dom.appendChild(div)
      new Vue({
        render: h => <App {...{ props }} />
      }).$mount(div)
    }
  )
}
