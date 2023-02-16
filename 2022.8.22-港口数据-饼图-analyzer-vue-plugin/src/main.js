/*
 * @Author: zhangzhuo
 * @Email: zhangzhuo@njsdata.com
 * @LastEditors: Do not edit
 * @Date: 2021-10-21 19:40:39
 * @LastEditTime: 2021-10-22 10:34:09
 * @Description: 请描述文件作用
 */
import Vue from "vue";
import App from "./App.vue";

import { Table, TableColumn } from "element-ui";

Vue.config.productionTip = false;
Vue.use(Table);
Vue.use(TableColumn);

import config from "../pluginTemp/config.json";

let { domId } = Object.values(config)[0];

let dom = document.getElementById(domId);

if (dom) {
  if (dom.childNodes.length > 0) {
    dom.removeChild(dom.childNodes[0]);
  }

  const App = require("./App.vue").default;
  let wrapper = document.createElement("div");
  wrapper.style = "width: 100%; height: 100%";
  dom.appendChild(wrapper);

  new Vue({
    render: h => h(App),
  }).$mount(wrapper);
} else {
  if (process.env.NODE_ENV !== "production") {
    const dataSource = [
      ["月份","数值"],
      ["本月", "12"],
      ["1月", "12"],
      ["2月", "12"],
      ["3月", "12"],
      ["4月", "12"],
      ["5月", "12"],
      ["8月", "12"],
      ["六月","11"],
      ["七月","10"],
      ["平均","110"]
    ]
    
    const options = {
      externalVariables: {
        系列颜色: "#0778e5-#84e2e5-#51deac-#e6c77c-#e69146-#13d8ea",
        环形图高度: "10",
        环形图盒子高度: "160px",
        环形图盒子宽度: "400px",
        图例每项间隔: "20",
        图例文字数值间距: "80",
        图例名称颜色: "#a3c1de",
        图例名称大小: "14",
        图例名称字体: "serif",
        图例数值颜色: "#333",
        图例数值大小: "20",
        图例数值字体: "Arial",
        饼图左距离: "-130",
        饼图顶距离: "0",
        饼图缩放倍率: "2",
        图例右距离: "200",
        图例顶距离: "40",
        图例底距离: "40",
        选中后高度: "30", 
        色块透明度: "1",
        图形角度: "40"
      },
    };
    const props = {
      dataSource,
      options,
    };
    const App = require("./App.vue").default;
    new Vue({
      render: h => <App {...{ props }} />,
    }).$mount("#app");
  } else {
    if (!window.CUSTOM_PLUGIN) {
      window.CUSTOM_PLUGIN = new Map();
    }

    window.CUSTOM_PLUGIN.set(
      process.env.VUE_APP_CUSTOM_PLUGIN_ID,
      (dom, props) => {
        if (dom.childNodes.length > 0) {
          dom.removeChild(dom.childNodes[0]);
        }
        const div = document.createElement("div");
        dom.appendChild(div);
        new Vue({
          render: h => <App {...{ props }} />,
        }).$mount(div);
      }
    );
  }
}
