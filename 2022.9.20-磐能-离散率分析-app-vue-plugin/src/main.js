import Vue from "vue";
import App from "./App.vue";
import { sysVariables, appVariables, customConfig } from "@/components/mockData.js";

// 引入参考https://element.eleme.cn/#/zh-CN/component/quickstart
import { Button, DatePicker, Table, TableColumn, RadioGroup, RadioButton, Message, Pagination, Loading } from "element-ui";

Vue.use(Button);
Vue.use(DatePicker);
Vue.use(Table);
Vue.use(TableColumn);
Vue.use(RadioGroup);
Vue.use(RadioButton);
Vue.prototype.$message = Message;
Vue.use(Pagination);
Vue.use(Loading.directive);

if (process.env.NODE_ENV !== "production") {
   window.eventCenter = {
      triggerEvent(componentId, eventName) {
         console.log(`${eventName} is triggered`);
      },
   };
   new Vue({
      render: (h) => {
         return <App customConfig={customConfig} sysVariables={sysVariables} appVariables={appVariables} />;
      },
   }).$mount("#app");
} else {
   if (!window.CUSTOM_PLUGIN) {
      window.CUSTOM_PLUGIN = new Map();
   }
   window.CUSTOM_PLUGIN.set(process.env.VUE_APP_CUSTOM_PLUGIN_ID, (dom, props) => {
      if (dom.childNodes.length > 0) {
         dom.removeChild(dom.childNodes[0]);
      }
      const div = document.createElement("div");
      dom.appendChild(div);
      new Vue({
         render: (h) => <App {...{ props }} />,
      }).$mount(div);
   });
}
