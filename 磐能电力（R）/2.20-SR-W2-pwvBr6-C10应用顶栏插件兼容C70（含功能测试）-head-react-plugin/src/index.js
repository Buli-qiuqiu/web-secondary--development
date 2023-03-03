/* 可以考虑在发布的代码里移除这个css */
import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
/**
 * 生产打包时为了减少体积，不引入 antd.css (可节约 2.5M左右的包体积)
 * 生产包是当做 onemind 主站插件使用的，页面里已经有一份 ant.css 了，所以这里可以省去
 * 从功能通过 webpack.IgnorePlugin 插件实现，如果想要打入此 css，请在 webpack 配置中做修改。
 */
if (process.env.NODE_ENV !== "production") {
  require("antd/dist/antd.css");
  // require("./jsencrypt");
  // require("./index.css");
  const { isLogin, login } = require("./api/asset");
  const account = {
    user: "admin",
    password: "sdy_23sZG",
  };
  // 添加 customConfig 进行测试
  let customConfig = {
    title: "数据构建",
    desc: "无码化应用搭建，弹指间即完成数据从无到有到收集和使用",
    url: "https://www.sdata1010.cn/",
    imgUrl:
      "https://www.baidu.com/img/PCtm_d9c8750bed0b3c7d089fa7d55720d6cf.png",
  };

  isLogin()
    .then((res) => {
      if (!res.data) {
        const PUBLIC_KEY =
          "MFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBANNmSJW87EE2Z3KDW5Kod8cL + 7lUBgfKLm86CGfMQxvc8w + JnOE7GV72DVyg2kCMGho5g9AR64BmrGobbG4xMZECAwEAAQ ==";
        const Encrypt = (text) => {
          if (!text) {
            return;
          }
          const encrypt = new window.JSEncrypt();
          encrypt.setPublicKey(
            "-----BEGIN PUBLIC KEY-----" +
              PUBLIC_KEY +
              "-----END PUBLIC KEY-----"
          );
          const encrypted = encrypt.encrypt(text);
          return encrypted.toString();
        };
        login({
          account: account.user,
          username: account.user,
          password: Encrypt(account.password),
        })
          .then((res) => {
            window.token = res.data;
          })
          .catch((err) => {
            console.log(err);
            console.error("登录失败，接口无法调用！");
          })
          .finally(() => {
            ReactDOM.render(
              <App customConfig={customConfig} />,
              document.getElementById("root")
            );
          });
      } else {
        ReactDOM.render(
          <App customConfig={customConfig} />,
          document.getElementById("root")
        );
      }
    })
    .catch((err) => {
      console.log("err", err);
      ReactDOM.render(
        <App customConfig={customConfig} />,
        document.getElementById("root")
      );
    });
} else {
  if (!window.CUSTOM_PLUGIN) {
    window.CUSTOM_PLUGIN = new Map();
  }
  window.CUSTOM_PLUGIN.set(process.env.CUSTOM_PLUGIN_ID, (dom, props) => {
    console.log(props,84);
    ReactDOM.render(<App {...props} />, dom);
  });
}
