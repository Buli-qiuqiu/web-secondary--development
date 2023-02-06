import Vue from "vue";
import App from "./App.vue";
import { Development } from "@/components/index.js";

Vue.config.productionTip = false;
Vue.config.devtools = true
if (process.env.NODE_ENV !== "production") {
  new Vue({
    render: h => <Development />
  }).$mount("#app");
} else {
  if (!window.CUSTOM_PLUGIN) {
    window.CUSTOM_PLUGIN = new Map();
  }
  window.CUSTOM_PLUGIN.set(
    process.env.VUE_APP_CUSTOM_PLUGIN_ID,
    (dom, props, context, eventBus) => {
      console.log(props,18);
      if (dom.childNodes.length > 0) {
        dom.removeChild(dom.childNodes[0]);
      }
      props.eventBus = eventBus;
      const div = document.createElement("div");
      dom.appendChild(div);
      new Vue({
        render: h => <App {...{ props }} />
      }).$mount(div);
    }
  );
}
