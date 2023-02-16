<template>
  <div :id="id" class="btn-secondary-box">
    <el-button class="dianhuaBtn" type="text" icon="el-icon-phone">
      <a :href="'tel:' + phoneData.responsible_phone">
        电话咨询
      </a>
    </el-button>
    <el-button class="toPageBtn" type="primary" @click="toPage">参与的活动</el-button>
  </div>
</template>

<script>
import Vue from 'vue';
import { Button } from 'element-ui';
import {
  queryUser,
  queryDianHua
} from "../../api/asset";

Vue.use(Button);

const getQueryString = name => {
  const reg = new RegExp(name + "=([^&]*)(&|$)", "i");
  const r = window.location.search.substr(1).match(reg);
  if (r != null) return r[1];
  return "2d3ef2df5edf4150a5b018d98ebf8ca1";
};

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
    mainInit: Function
  },
  computed: {},
  data() {
    return {
      //必需，不可删除
      id: "",
      adminInfo: {},
      adminInfoId: "",
      offericeId: "",
      phoneData: {
        responsible_phone: ""
      }
    };
  },
  mounted() {
    //此方法封装了事件注册，不可删除
    this.mainInit(this);
    this.queryUserInfo();
    this.offericeId = getQueryString('officeid');
  },
  methods: {
    /**
     * 封装的触发事件方法 必需，不可删除
     * @param {String} eventName 事件名
     * @param {Object} payload 事件传参
     *
     */
    triggerEvent(eventName, payload) {
      let { componentId, appId } = this.customConfig || {};
      componentId && appId && window.eventCenter?.triggerEvent(
        componentId,
        eventName,
        payload
      );
    },
    //必需，不可删除
    Event_Center_getName() {
      return this.id;
    },
    // 获取用户信息
    queryUserInfo() {
      queryUser().then(res => {
        let { data } = res;
        // console.log('用户信息', data);
        if (data == false) {
          this.adminInfo = {};
          this.adminInfoId = "";
        } else {
          this.adminInfo = data;
          this.adminInfoId = data.id;
        }
        this.likeAddHandel();
      }).catch(err => {
        this.adminInfo = {};
        this.adminInfoId = "";
      });
    },
    likeAddHandel() {
      let params = {
        data_id: this.offericeId,
        user_id: this.adminInfoId
      }
      queryDianHua(params).then(res => {
        let { data } = res;
        this.phoneData = data[0];
        console.log('datadi电话', data);
      });
    },
    toPage() {
      console.log('点击参与的活动');
      this.triggerEvent(
        "btnClick",
        { keys: {
          user_id: this.adminInfoId,
          officeid: this.offericeId
        } }
      );
    },
  },
  beforeDestroy() {
    window.componentCenter?.removeInstance(this.customConfig?.componentId);
  }
};
</script>

<style lang="less" scoped>
.btn-secondary-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 10px;
  width: 100%;
  background: #FFFFFF;
  .dianhuaBtn {
    width: 50%;
    font-size: 15px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #666666;
    a {
        text-decoration: none;
        /* 去除默认的下划线 */
        color: #000;
        /* 去除默认的颜色和点击后变化的颜色 */
      }
  }
  .toPageBtn {
    width: 50%;
    font-size: 15px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #FFFFFF;
  }
}
</style>
