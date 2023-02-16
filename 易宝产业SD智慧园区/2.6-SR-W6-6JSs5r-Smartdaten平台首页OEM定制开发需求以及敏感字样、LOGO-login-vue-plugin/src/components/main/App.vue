<template>
  <div :id="id" ref="app-secondary" class="app-secondary" style="height: 100%">
    <div class="mainLogin">
      <img src="../../../pluginTemp/images/logo.png" alt="" class="loginLogo" />
      <div class="bottomTip">{{ window?.configuration?.filings_Info || "" }}</div>
      <div class="loginIntroduce">
        <span style="font-size: 40px; height: 40px; color: #333333; display: inline-block">您好！</span>
        <br />
        <span style="font-size: 40px; height: 40px; color: #333333; display: inline-block; margin-top: 40px"
          >欢迎登录<span style="font-size: 40px; color: #bf1821; display: inline-block; height: 40px">智慧园区平台</span></span
        >
        <br />
        <span style="font-size: 26px; height: 26px; color: #333333; display: inline-block; margin-top: 88px">用创新科研提升企业能力</span>
        <br />
        <span style="font-size: 18px; height: 18px; color: #333333; display: inline-block; margin-top: 30px"
          >improving enterprise capability with innovative scientific research</span
        >
      </div>
      <div class="loginModel">
        <span class="loginText">用户登录</span>
        <el-input v-model="userName" class="loginInput" placeholder="账号"></el-input>
        <el-input v-model="password" class="loginInput" placeholder="密码" :type="passwordShow ? 'text' : 'password'">
          <i slot="suffix" style="display: flex; align-items: center; margin-top: 16px; margin-right: 16px; cursor: pointer" @click="passwordShow = !passwordShow">
            <img class="header-icon" v-show="passwordShow" style="width: 18px; height: 18px" src="../../../pluginTemp/images/eyeTrue.png" alt="" />
            <img class="header-icon" v-show="!passwordShow" style="width: 18px; height: 18px" src="../../../pluginTemp/images/eyeFalse.png" alt="" />
          </i>
        </el-input>
        <el-checkbox class="loginCheck" v-model="checked" @change="logChecked">记住密码</el-checkbox>
        <br />
        <el-button type="primary" class="loginButton" @click="login">登录</el-button>
      </div>
    </div>
  </div>
</template>
<script>
import Vue from "vue";
import { Input, Checkbox, Button } from "element-ui";
import { loginAccount, queryAll } from "../../api/asset";
import "../development/mockData";
import Cookies from "js-cookie";
import JSEncrypt from "./jsencrypt";
const Base64 = require("js-base64").Base64;
Vue.use(Input);
Vue.use(Checkbox);
Vue.use(Button);
export default {
  name: "Main",
  props: {
    customConfig: Object,
    info: Object,
    //应用变量和系统变量 2022.7.26 V8R4C50SPC220需求新加 之前版本取不到appVariables和sysVariables
    appVariables: Array,
    sysVariables: Array,
    //2022.8.11 V8R4C60SPC100需求新加，之前版本取不到themeInfo
    themeInfo: Object,
    //2022.10新加，之前取不到国际化方法
    intlGetKey: Function,
    history: Object,
    mainInit: Function,
  },
  computed: {},
  data() {
    return {
      //必需，不可删除
      id: "",
      userName: "",
      password: "",
      checked: false,
      passwordShow: false,
    };
  },
  mounted() {
    // 记住密码回显
    let username = localStorage.getItem("userName");
    if (username) {
      this.userName = localStorage.getItem("userName");
      this.password = Base64.decode(localStorage.getItem("pw")); // base64解密
      this.checked = true;
    }
    //此方法封装了事件注册，不可删除
    this.mainInit(this);
    // this.getLoginInfo();
  },
  methods: {
    logChecked(val) {
      // 记住密码
      if (this.checked) {
        let password = Base64.encode(this.password); // base64加密
        localStorage.setItem("userName", this.userName);
        localStorage.setItem("pw", password);
      } else {
        localStorage.removeItem("userName");
        localStorage.removeItem("pw");
      }
    },
    // 请求用户信息
    getLoginInfo() {
      queryAll().then((res) => {
        console.log(res);
      });
    },
    login() {
      this.logChecked()
      let message = {
        // account: this.userName,
        // username: this.userName,
        // password: this.Encrypt(this.password),
        userName: this.userName,
        password: this.password,
      };
      loginAccount(message)
        .then((res) => {
          console.log(res);
          // document.cookie = "token=" + res.data.tokenInfo;
          if (res.data) {
            window.location.href =
              window.location.origin +
              "/applicationview/content/view?appid=a9ddb359-6b22-c112-a9d9-d8f678c4e106&type=view&themeId=c40187f3-c420-49d5-b616-c320fff73934&menuId=5062792a-6810-2bdd-f353-137540fb6e55%233";
          } else {
            window.location.href =
              window.location.origin +
              "/applicationview/content/view?appid=06b0d811-d1ff-0333-65cc-52c0907ed8b2&type=view&themeId=52250e971ce3482491f75a7ae01af824&menuId=23e1bf3f-eb02-07ac-c530-1240f84bb60d%233";
          }

          if (res.status !== 200) {
            this.$message({
              message: "用户名或密码错误",
              type: "error",
            });
          }
        })
        .catch((err) => {
          this.$message({
            message: "用户名或密码错误",
            type: "error",
          });
        });
      console.log(message);
    },
    Encrypt(text) {
      const PUBLIC_KEY = "MFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBANNmSJW87EE2Z3KDW5Kod8cL + 7lUBgfKLm86CGfMQxvc8w + JnOE7GV72DVyg2kCMGho5g9AR64BmrGobbG4xMZECAwEAAQ ==";
      if (!text) {
        return;
      }
      const encrypt = new JSEncrypt();
      encrypt.setPublicKey("-----BEGIN PUBLIC KEY-----" + PUBLIC_KEY + "-----END PUBLIC KEY-----");
      const encrypted = encrypt.encrypt(text);
      return encrypted.toString();
    },
    /**
     * 封装的触发事件方法 必需，不可删除
     * @param {String} eventName 事件名
     * @param {Object} payload 事件传参
     *
     */
    triggerEvent(eventName, payload) {
      let { componentId, appId } = this.customConfig || {};
      componentId && appId && window.eventCenter?.triggerEvent(componentId, eventName, payload);
    },
    //必需，不可删除
    Event_Center_getName() {
      return this.id;
    },
  },
  beforeDestroy() {
    window.componentCenter?.removeInstance(this.customConfig?.componentId);
  },
};
</script>
<style lang="less" scoped>
.mainLogin {
  width: 100%;
  height: 100%;
  background-image: url("../../../pluginTemp/images/bg.png");
  background-size: 100% 100%;
  position: relative;
  .loginLogo {
    position: absolute;
    left: 3%;
    top: 3%;
  }
  .loginIntroduce {
    position: absolute;
    left: 21%;
    top: 17%;
  }
  .bottomTip {
    width: 100%;
    text-align: center;
    position: absolute;
    bottom: 10px;
    color: #fff;
  }
  .loginModel {
    height: 580px;
    width: 510px;
    background: #fff;
    position: absolute;
    right: 20%;
    top: 11%;
    padding: 98px 64px;
    .loginText {
      font-size: 24px;
      font-size: #333333;
    }
    .loginInput {
      margin-top: 40px;
      /deep/.el-input__inner {
        border-radius: 5px;
        height: 50px;
        width: 382px;
        border: 1px solid #dddddd;
        background: #f0f1f5;
        font-size: 20px;
        color: #666666 !important;
        &::-webkit-input-placeholder {
          color: #8f8f90;
        }
        &::-moz-input-placeholder {
          color: #8f8f90;
        }
        &::-ms-input-placeholder {
          color: #8f8f90;
        }
      }
    }
    .loginCheck {
      margin-top: 20px;
      /deep/.el-checkbox__inner {
        width: 16px;
        height: 16px;
        &::after {
          height: 9px;
          left: 5px;
        }
      }
      /deep/.el-checkbox__label {
        color: #cccccc;
      }
      /deep/.is-checked + .el-checkbox__label {
        color: #1a90fd !important;
      }
      /deep/.is-checked {
        span {
          background: #1a90fd !important;
        }
      }
    }
    .loginButton {
      height: 50px;
      width: 382px;
      border-radius: 5px;
      font-size: 20px;
      color: #ffffff;
      background: #1a90fd;
      margin-top: 40px;
    }
  }
}
</style>
<style>
.ant-spin-container {
  height: 100%;
}
</style>
