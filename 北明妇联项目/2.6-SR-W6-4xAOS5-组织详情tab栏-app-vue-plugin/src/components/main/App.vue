<template>
  <div :id="id" ref="app-secondary" class="tabs-secondary">
    <van-tabs 
      v-model="active" 
      line-width="30" 
      line-height="4" 
      color="#3296fa" 
      background="#fafafc" 
      title-active-color="#333333" 
      title-inactive-color="#999999"
      @click="tabClick"
    >
      <van-tab v-for="item in tabList" :key="item.data_id" :name="item.type">
        <template #title>
          <span :class="active == item.code ? 'actTabTitle' : 'tabTitle'">{{ item.type_name }}</span>
          <span :class="active == item.code ? 'actTabNum' : 'tabNum'">&nbsp;({{ item.num }})</span>
        </template>
      </van-tab>
    </van-tabs>
  </div>
</template>

<script>
import Vue from 'vue';
import { Tab, Tabs } from 'vant';
import { queryActiveTabs } from "../../api/asset"
Vue.use(Tab);
Vue.use(Tabs);


const getQueryString = name => {
  const reg = new RegExp(name + "=([^&]*)(&|$)", "i");
  const r = window.location.search.substr(1).match(reg);
  if (r != null) return r[1];
  return "";
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
      active: "001",
      tabList: []
    };
  },
  mounted() {
    //此方法封装了事件注册，不可删除
    this.mainInit(this);
    this.queryActiveTabList();
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
    // 点击标签
    tabClick(val) {
      console.log('点击标签', val);
      this.triggerEvent(
        "tabsChange",
        { code: val }
      );
    },
    // tab请求
    queryActiveTabList() {
      let params = {
        data_id: getQueryString("officeid")
      }
      queryActiveTabs(params).then(res=>{
        let { data } = res;
        // console.log("tab请求",data);
        this.tabList = data.filter(x=>{
          return x.type_name != ""
        });
      }).catch(err=>{
        console.log(err);
      })
    }
  },
  beforeDestroy() {
    window.componentCenter?.removeInstance(this.customConfig?.componentId);
  }
};
</script>

<style lang="less" scoped>
.tabs-secondary {
  width: 100%;
  .tabTitle {
    font-size: 14px;
    font-weight: 500;
    font-family: PingFangSC-Medium, PingFang SC;
  }
  .tabNum {
    font-size: 12px;
    color: #999999;
    font-family: PingFangSC-Medium, PingFang SC;
  }
  .actTabTitle {
    font-size: 15px;
    font-weight: 700;
    font-family: PingFangSC-Medium, PingFang SC;
  }

  .actTabNum {
    font-size: 12px;
    color: #999999;
    font-family: PingFangSC-Medium, PingFang SC;
  }
}
</style>
