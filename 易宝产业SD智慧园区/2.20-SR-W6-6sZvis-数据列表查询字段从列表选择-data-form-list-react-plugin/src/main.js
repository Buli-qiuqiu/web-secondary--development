import Vue from "vue";
import App from "./App.vue";
// 按需引入组件，引入方式见https://element.eleme.cn/#/zh-CN/component/quickstart#an-xu-yin-ru
import { Input, Form, FormItem } from "element-ui";
import "./index.css";
import Element from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
const configJson = require("../pluginTemp/config.json")
Vue.config.productionTip = false;

Vue.use(Input);
Vue.use(Form);
Vue.use(FormItem);

// Vue.use(Element);

if (process.env.NODE_ENV !== "production") {
  const appArr = [
    { title: "列表页", type: "list" },
    { title: "配置项", type: "designConfiguration" },
  ];

  const customConfig = {
    // 列数据
    columns: [],
    // 行数据
    data: [],
    // 配置项
    configuration: {
      assetId: '',
    },
  };

  new Vue({
    render: h => {
      return (
        <div class="app-container">
          {appArr.map((item, index) => {
            return (
              <div class="components">
                <span class="title">{item.title}:</span>
                <App
                  customConfig={customConfig}
                  type={item.type}
                />
              </div>
            );
          })}
        </div>
      );
    },
  }).$mount("#app");
} else {
  if (!window.CUSTOM_PLUGIN) {
    window.CUSTOM_PLUGIN = new Map();
  }

  window.CUSTOM_PLUGIN.set(
    configJson.id,
    (dom, props) => {
      // console.log('main-props', props);
      const div = document.createElement("div");
      div.className = "secondary_root"
      dom.appendChild(div);
        new Vue({
          render: h => <App platformProps={ {...props} }/>,
        }).$mount(div);

      props.setSetPluginProps((props)=>{
        if (dom.childNodes.length > 0) {
          dom.removeChild(dom.childNodes[0]);
        }
        const divs = document.createElement("div");
        dom.appendChild(divs);
        new Vue({
          render: h => <App platformProps={ {...props} }/>,
        }).$mount(divs);
      })
    }
  );
}
