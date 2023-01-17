<template>
  <div :id="id" ref="canvas-secondary" class="canvas-secondary">
    <div style="display: flex">
      <svg
        t="1673336118334"
        class="icon"
        viewBox="0 0 1024 1024"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        p-id="6576"
        :width="this.configuration?.form?.iconSize || '16px'"
        :height="this.configuration?.form?.iconSize || '16px'"
      >
        <path d="M1024 0l-447.7952 1024-118.016-458.1888L0 448.2048z" fill="#3798F5" p-id="6577"></path>
      </svg>
      <span style="margin-left: 5px" :style="{ fontSize: this.configuration?.form?.fontSize || '14px', lineHeight: this.configuration?.form?.fontSize || '14px' }">{{
        isNaN(this.getDistance(Number(this.value?.split(",")[0]), Number(this.value?.split(",")[1]), this.nowLat, this.nowLong))
          ? "距我  米"
          : this.getDistance(Number(this.value?.split(",")[0]), Number(this.value?.split(",")[1]), this.nowLat, this.nowLong)
      }}</span>
      <span
        style="margin-left: 15px; color: #3296fa; cursor: pointer"
        @click="goMap()"
        :style="{ fontSize: this.configuration?.form?.fontSize || '14px', lineHeight: this.configuration?.form?.fontSize || '14px' }"
        >查看地图导航</span
      >
    </div>
  </div>
</template>
<script>
import { jsSdkConfig } from "../../api/asset";
export default {
  name: "Main",
  props: {
    formListModelVariableList: Object,
    customConfig: Object,
    configuration: Object,
    componentId: String,
    record: Object,
    value: String,
    mainInit: Function,
  },
  computed: {},
  data() {
    return {
      //必需，不可删除
      id: "",
      nowLat: "",
      nowLong: "",
    };
  },
  async mounted() {
    await this.getJSSDK();
    //此方法封装了事件注册，不可删除
    this.mainInit(this);
    this.initData();
  },
  methods: {
    async getJSSDK() {
      let message = {
        url: encodeURIComponent(window.location.href.split("#")[0]),
      };
      let { data: res } = await jsSdkConfig(message);
      window.wx.config({
        debug: false, // 开启调试模式,调用的所有 api 的返回值会在客户端 alert 出来，若要查看传入的参数，可以在 pc 端打开，参数信息会通过 log 打出，仅在 pc 端时才会打印。
        appId: res.appId, // 必填，公众号的唯一标识
        timestamp: res.timestamp, // 必填，生成签名的时间戳
        nonceStr: res.nonceStr, // 必填，生成签名的随机串
        signature: res.signature, // 必填，签名
        jsApiList: ["openLocation", "getLocation"], // 必填，需要使用的 JS 接口列表
      });
      window.wx.ready(() => {
        console.log("ready");
        window.wx.getLocation({
          type: "gcj02",
          success: (resp) => {
            this.nowLat = resp.latitude;
            this.nowLong = resp.longitude;
          },
          fail(error) {},
        });
      });
    },
    goMap() {
      window.wx.getLocation({
        type: "gcj02",
        success: (resp) => {
          this.nowLat = resp.latitude;
          this.nowLong = resp.longitude;
          window.wx.openLocation({
            latitude: Number(this.value?.split(",")[0]),
            longitude: Number(this.value?.split(",")[1]),
            success(res) {},
            fail(error) {},
          });
        },
        fail(error) {},
      });
    },
    // 计算距离
    rad(d) {
      return (d * Math.PI) / 180.0;
    },
    // 计算距离
    getDistance(lat1, lng1, lat2, lng2) {
      var radLat1 = this.rad(lat1);
      var radLat2 = this.rad(lat2);
      var a = radLat1 - radLat2;
      var b = this.rad(lng1) - this.rad(lng2);
      var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
      s = s * 6378.137; // EARTH_RADIUS;
      s = Math.round(s * 10000) / 10000; //输出为公里

      var distance = s;
      var distance_str = "";

      if (parseInt(distance) >= 1) {
        distance_str = distance.toFixed(1) + "千米";
      } else {
        distance_str = distance * 1000 + "米";
      }
      return "距我" + distance_str;
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
    initData() {
      this.number = this.customConfig.number || 1;
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
