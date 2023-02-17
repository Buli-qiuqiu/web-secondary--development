import App from "./App.vue";
import {
  sysVariables,
  appVariables,
  customConfig,
  themeInfo
}

  from "@/components/mockData.js";
import './index.css'

function loadScript(url, callback){
    var script = document.createElement ("script")
    script.type = "text/javascript";
    if (script.readyState){ //IE
        script.onreadystatechange = function(){
            if (script.readyState == "loaded" || script.readyState == "complete"){
                script.onreadystatechange = null;
                callback();
            }
        };
    } else { //Others
        script.onload = function(){
            callback();
        };
    }
    script.src = url;
    document.head.appendChild(script);
}

// 动态记载样式
function loadStyle(url){
    var style=document.createElement("style");
    style.href=url;

    document.head.appendChild(style);
}

if (process.env.NODE_ENV !== "production") {
  window.eventCenter = {
    triggerEvent(componentId, eventName) {
      console.log(`${eventName} is triggered`);
    },
  }
  new Vue({
    render: h => {
      return <App
        customConfig={customConfig}
        themeInfo={themeInfo}
        sysVariables={sysVariables}
        appVariables={appVariables}
      />;
    },
  }).$mount("#app");
} else {
    if (!window.CUSTOM_PLUGIN) {
        window.CUSTOM_PLUGIN = new Map();
    }

    window.CUSTOM_PLUGIN.set(
        process.env.VUE_APP_CUSTOM_PLUGIN_ID,
        (dom, props) => {
            if(!window.Vue){
                loadScript('/static/vue.min.js', ()=>{
                    loadScript('/static/element-ui/index.js', ()=>{
                        run(dom, props)
                    })
                })
                loadStyle('/element-ui/theme-chalk/index.min.css')
            }else{
                run(dom, props)
            }
        }
    );
}

function run(dom, props){
    if (dom.childNodes.length > 0) {
        dom.removeChild(dom.childNodes[0]);
    }
    const div = document.createElement("div");
    dom.appendChild(div);
    new Vue({
        render: h => <App {...{ props }} />,
    }).$mount(div);
}
