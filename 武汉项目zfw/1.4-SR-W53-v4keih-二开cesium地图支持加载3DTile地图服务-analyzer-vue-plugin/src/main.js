import Vue from "vue";
import App from "./App.vue";
import MsgCompConfig from "./components/main/msgCompConfig.js";
import { Development } from "@/components/index.js";
import Utils from "@/utils/index.js";
import configJson from "../pluginTemp/config.json";
import "./Widgets/widgets.css"

Vue.config.productionTip = false;
Vue.config.devtools = true;


const mainInit = (Main) => {
  const { updateProcess, componentId } = Main;
  window?.componentCenter?.register(componentId, "comp", Main, MsgCompConfig);
  const customOptions = Main.options?.externalVariables || {};
  //内部使用，需求编号，不需要可去掉，用来将需求编号打到dom元素上，方便以后处理问题
  const requirementNum = configJson["requirement-number"] === "需求编号"
                         ? ""
                         : configJson["requirement-number"];
  const id = customOptions?.id
             ? `analyzer_secondary_${requirementNum}_${customOptions.id}`
             : `analyzer_secondary_${requirementNum}_${Utils.generateUUID()}`;
  //由于分析仪放置到大屏中切换显示隐藏有问题，此处用于初始化元素宽高，默认100%
  customOptions?.width && (Main.width = customOptions.width);

  customOptions?.height && (Main.height = customOptions.height);
  Main.id = id;
  updateProcess && updateProcess();
};


if (process.env.NODE_ENV !== "production") {
  new Vue({
    render: h => <Development mainInit={mainInit} />
  }).$mount("#app");
} else {
  if (!window.CUSTOM_PLUGIN) {
    window.CUSTOM_PLUGIN = new Map();
  }
  window.CUSTOM_PLUGIN.set(
    process.env.VUE_APP_CUSTOM_PLUGIN_ID,
    (dom, props, context, eventBus) => {
      if (dom.childNodes.length > 0) {
        dom.removeChild(dom.childNodes[0]);
      }
      props.eventBus = eventBus;
      props.mainInit = mainInit;
      const div = document.createElement("div");
      dom.appendChild(div);
      new Vue({
        render: h => <App {...{ props }} />
      }).$mount(div);
    }
  );
}
