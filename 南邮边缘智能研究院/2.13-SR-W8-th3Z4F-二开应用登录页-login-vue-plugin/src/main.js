import Vue from "vue"
import App from "./App.vue"
import setAttributes from "@/utils/handlePlatform/setAttributes.js"

const configJson = require("../pluginTemp/config.json")
Vue.config.productionTip = false
Vue.config.devtools = true

if (process.env.NODE_ENV !== "production") {
  new Vue({
    render: h => <App type="main" />
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
      const div = document.createElement("div")
      dom.appendChild(div)
      new Vue({
        render: h => <App {...{ props }} />
      }).$mount(div)
    }
  )
}
