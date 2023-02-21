<template>
   <div class="outermest">
      <!-- 登录表单 -->
      <el-form class="login_frame" :rules="dataRule" ref="dataForm" :model="dataForm">
         <!-- 用户登录 -->
         <div class="frame_title">颐瑞健康智慧养老软件系统</div>
         <!-- 登录账号 -->
         <el-form-item class="frame_input" prop="account">
            <el-input v-model="dataForm.account" placeholder="请输入您的账号"> </el-input>
         </el-form-item>
         <!-- 登录密码 -->
         <el-form-item class="frame_input" prop="password">
            <el-input v-model="dataForm.password" placeholder="请输入您的密码" type="password"> </el-input>
         </el-form-item>
         <!-- 验证码 -->
         <el-form-item class="frame_input frame_input_code" prop="imageCode">
            <div class="frame_code">
               <el-input v-model="dataForm.imageCode" placeholder="验证码(不区分大小写)"> </el-input>
               <div class="frame_verification">
                  <img @click.stop="changeCode()" :src="verification" />
               </div>
            </div>
         </el-form-item>
         <!-- 登录按钮 -->
         <div class="frame_button">
            <el-button type="primary" @click="login()">登 录</el-button>
         </div>
      </el-form>
   </div>
</template>

<script>
// 引入组件
import Vue from "vue";
import { Input, Button, Form, FormItem, Checkbox, Message } from "element-ui";
Vue.use(Input);
Vue.use(Button);
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Checkbox);
Vue.prototype.$message = Message;

// 引入接口
import { getAuthPic, loginAccount, queryAll } from "../../api/asset";

// 加密
import { Encrypt } from "@/utils/Encrypt.js";
import { Base64 } from "js-base64";

export default {
   name: "App",

   props: {
      customConfig: Object,
   },

   data() {
      return {
         // 登录框图标
         verification: "",
         // 登录表单
         dataForm: {
            account: "",
            password: "",
            imageCode: "",
            username: "",
         },
         // 跳转地址
         loginInfo: "",
      };
   },

   mounted() {
      //  获取验证码
      this.changeCode();
      // 获取登录信息
      this.getLoginInfo();
   },

   computed: {
      // 表单校验
      dataRule() {
         return {
            account: [{ required: true, message: "请输入您的账号", trigger: "submit" }],
            password: [{ required: true, message: "请输入您的密码", trigger: "submit" }],
            imageCode: [{ required: true, message: "请输入验证码", trigger: "submit" }],
         };
      },
   },

   methods: {
      // 切换验证码
      changeCode() {
         getAuthPic()
            .then((response) => {
               const url = "data:image/png;base64," + btoa(new Uint8Array(response.data).reduce((data, byte) => data + String.fromCharCode(byte), ""));
               this.verification = url;
            })
            .catch((err) => {
               const url = "data:image/png;base64," + btoa(new Uint8Array(err.data).reduce((data, byte) => data + String.fromCharCode(byte), ""));
               this.verification = url;
            });
      },

      // 请求用户信息
      getLoginInfo() {
         queryAll().then((res) => {
            if (res.data.ANONYMOUS_LOGIN) {
               this.loginInfo = JSON.parse(res.data.ANONYMOUS_LOGIN);
            }
         });
      },

      // 登录
      login() {
         this.$refs["dataForm"].validate((valid) => {
            //  校验是否通过
            if (!valid) return false;
            // 接口参数
            let loginForm = {
               account: this.dataForm.account,
               username: this.dataForm.account,
               imageCode: this.dataForm.imageCode,
               password: Encrypt(this.dataForm.password),
            };

            // 登录
            loginAccount(loginForm.imageCode, loginForm)
               .then((res) => {
                  this.changeCode();
                  // 跳转页面
                  window.location.href = `${window.location.origin}/applicationview/content/view?appid=cbe00ef0-1468-e51e-c67a-598890822b6f&type=view`;
               })
               .catch((err) => {
                  this.changeCode();
                  if (err.data.message == "图片验证码校验失败") {
                     this.$message.error("图片验证码校验失败");
                  } else if (err.data.message == "Wrong user name or password!") {
                     this.$message.error("用户名或密码错误");
                  }
               });
         });
      },
   },
};
</script>

<style scoped lang="less">
.outermest {
   position: fixed;
   width: 100%;
   height: 100%;
   background: url("../../assets/背景图片.png") no-repeat;
   background-size: 100% 100%;

   // 登录框整体
   .login_frame {
      width: 580px;
      height: 568px;
      position: absolute;
      top: 18%;
      right: 8%;
      padding: 33px 32px;
      background: linear-gradient(134deg, #424933 0%, #1c2116 100%);
      box-shadow: 10px 10px 30px 0px rgba(0, 0, 0, 0.5);
      border-radius: 50px;
      text-align: center;
      box-sizing: border-box;
      z-index: 1;
   }

   // 用户登录标题
   .frame_title {
      width: 100%;
      font-size: 30px;
      font-family: SourceHanSansCN-Regular, SourceHanSansCN;
      font-weight: 400;
      color: #ffffff;
      letter-spacing: 2px;
      margin-bottom: 42px;
      padding-top: 50px;
      padding-bottom: 10px;
      box-sizing: border-box;
      border-bottom: 1px solid;
      border-image: linear-gradient(270deg, rgba(255, 255, 255, 0), rgba(255, 255, 255, 1), rgba(255, 255, 255, 0)) 1 1;
   }

   // 账号密码框
   .frame_input {
      margin-bottom: 25px;
      /deep/ .el-input__inner {
         border-radius: 10px;
         box-sizing: border-box;
         height: 50px;
         line-height: 50px;
         font-size: 16px;
         padding-top: 2px;
         padding-left: 30px;
         background: #ffffff;
         &:hover {
            border-color: #2e7bff;
         }
      }
   }

   // 验证码整体
   .frame_input_code {
      /deep/ .el-input__inner {
         border-radius: 10px 0 0 10px;
      }
      .frame_code {
         display: flex;
      }
   }

   // 验证码图标
   .frame_verification {
      height: 55px;
      display: flex;
      align-items: center;
      img {
         border-radius: 0 10px 10px 0;
         width: 100px;
         height: 100%;
         cursor: pointer;
         margin-left: 15px;
      }
   }

   // 登录按钮
   .frame_button {
      width: 100%;
      height: 55px;
      line-height: 55px;

      /deep/ .el-button {
         width: 100%;
         height: 100%;
         margin-top: 24px;
         padding-top: 13px;
         border-radius: 10px;
         background: linear-gradient(180deg, #c8b198 0%, #c59c6c 100%);
         font-size: 22px;
         border-color: #c8b198;
      }
   }
}
</style>
