<template>
  <div :id="id" ref="app-secondary" class="app-secondary">
    <el-button type="text" @click="popupShow" style="color: #000">全省<i class="el-icon-arrow-down"></i></el-button>
    <van-popup
      v-model="popShow"
      position="top"
      :style="{ padding: '20px', top: this.customConfig.弹出层顶部距离 || '40px', width: 'calc(100% - 10px)', left: '5px', borderRadius: '5px' }"
    >
      <van-tabs v-model="activeName" @click="handleClick" color="rgba(50, 150, 250, 1)" swipeable>
        <van-tab title="选择市" name="first">
          <el-button class="chooseCity" round v-for="(item, index) in cityArray" :class="{ selectItem: item.select }" :key="index" size="small" @click="choseCity(item)">{{
            item.cityname
          }}</el-button>
        </van-tab>
        <van-tab title="选择区" name="second">
          <el-button class="chooseCity" round v-for="(item, index) in districtArray" :class="{ selectItem: item.select }" :key="index" size="small" @click="choseDistrict(item)">{{
            item.cityname
          }}</el-button>
        </van-tab>
        <van-tab title="选择街道" name="third">
          <el-button class="chooseCity" round v-for="(item, index) in streetArray" :class="{ selectItem: item.select }" :key="index" size="small" @click="choseStreet(item)">{{
            item.cityname
          }}</el-button>
        </van-tab>
        <van-tab title="选择社区" name="fourth"
          ><el-button
            class="chooseCity"
            round
            v-for="(item, index) in communityArray"
            :class="{ selectItem: item.select }"
            :key="index"
            size="small"
            @click="choseCommunity(item)"
            >{{ item.cityname }}</el-button
          >
        </van-tab>
      </van-tabs>
      <div class="popupButton">
        <el-button size="mini" @click="cancelChoose">取消</el-button> <el-button size="mini" type="primary" style="margin-right: 30px" @click="sureChoose">确定</el-button>
      </div>
    </van-popup>
    <van-dialog
      width="280px"
      v-model="dialogShow"
      @confirm="confirmDialog"
      @cancel="cancelDialog"
      confirmButtonText="同意"
      confirmButtonColor="#3296FA"
      cancelButtonColor="#3296FA"
      show-cancel-button
      class="dialogSure"
    >
      <span>您当前属于{{ this.nowCity }}，是否需要切换到该城市</span>
    </van-dialog>
  </div>
</template>
<script>
import { areaList } from "../../utils/area";
import { Dialog } from "vant";
import Vue from "vue";
import { queryAddressByCoordinate, requeryAddressByCoordinate, jsSdkConfig, catalog } from "../../api/asset";
Vue.use(Dialog);
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
      popShow: false,
      dialogShow: false,
      activeName: "first",
      cityArray: [],
      districtArray: [],
      streetArray: [],
      communityArray: [],
      requeryAddressInfo: {},
      nowCity: "",
    };
  },
  async mounted() {
    await this.getaddress();
    if (window.localStorage.getItem("positionInfo")) {
      console.log(window.localStorage.getItem("positionInfo"));
      this.triggerEvent("positionChange", JSON.parse(window.localStorage.getItem("positionInfo")));
      this.cityArray.forEach((item) => {
        if (item.cityname == JSON.parse(window.localStorage.getItem("positionInfo")).city?.cityname) {
          item.select = true;
          this.areaList.forEach((element) => {
            if (element.parentcode == item.citycode) {
              element.select = false;
              this.districtArray.push(element);
            }
          });
          this.districtArray.forEach((item2) => {
            if (item2.cityname == JSON.parse(window.localStorage.getItem("positionInfo")).district?.cityname) {
              item2.select = true;
              this.areaList.forEach((element) => {
                if (element.parentcode == item2.citycode) {
                  element.select = false;
                  this.streetArray.push(element);
                }
              });
              this.streetArray.forEach((item3) => {
                if (item3.cityname == JSON.parse(window.localStorage.getItem("positionInfo")).street?.cityname) {
                  item3.select = true;
                  this.areaList.forEach((element) => {
                    if (element.parentcode == item3.citycode) {
                      element.select = false;
                      this.communityArray.push(element);
                    }
                  });
                  this.communityArray.forEach((item4) => {
                    if (item4.cityname == JSON.parse(window.localStorage.getItem("positionInfo")).community?.cityname) {
                      item4.select = true;
                    }
                  });
                }
              });
            }
          });
        }
      });
    } else {
      await this.getJSSDK();
    }
    //此方法封装了事件注册，不可删除
    this.mainInit(this);
  },
  methods: {
    async getaddress() {
      let res = await catalog();
      this.areaList = res.data.result;
      this.areaList.forEach((item) => {
        if (item.leval == 3) {
          this.cityArray.push(item);
        }
      });
    },
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
        jsApiList: ["getLocation"], // 必填，需要使用的 JS 接口列表
      });
      window.wx.ready(() => {
        window.wx.getLocation({
          type: "gcj02",
          success: (resp) => {
            this.reAddressAnalysis(resp);
          },
          fail(error) {},
        });
      });
    },
    // 选择市
    choseCity(item, type) {
      this.districtArray = [];
      this.streetArray = [];
      this.communityArray = [];
      this.areaList.forEach((element) => {
        if (element.parentcode == item.citycode) {
          element.select = false;
          this.districtArray.push(element);
        }
      });
      this.cityArray.forEach((element, index) => {
        element.select = false;
      });
      item.select = true;
      if (type) {
        window.localStorage.setItem("cityArray", JSON.stringify(this.cityArray));
      }
    },
    // 选择区
    choseDistrict(item, type) {
      this.streetArray = [];
      this.communityArray = [];
      this.areaList.forEach((element) => {
        if (element.parentcode == item.citycode) {
          element.select = false;
          this.streetArray.push(element);
        }
      });
      this.districtArray.forEach((element, index) => {
        element.select = false;
      });
      item.select = true;
      if (type) {
        window.localStorage.setItem("districtArray", JSON.stringify(this.districtArray));
      }
    },
    // 选择街道
    choseStreet(item, type) {
      this.communityArray = [];
      this.areaList.forEach((element) => {
        if (element.parentcode == item.citycode) {
          element.select = false;
          this.communityArray.push(element);
        }
      });
      this.streetArray.forEach((element, index) => {
        element.select = false;
      });
      item.select = true;
      if (type) {
        window.localStorage.setItem("streetArray", JSON.stringify(this.streetArray));
      }
    },
    // 选择社区
    choseCommunity(item, type) {
      this.communityArray.forEach((element, index) => {
        element.select = false;
      });
      item.select = true;
      if (type) {
        window.localStorage.setItem("communityArray", JSON.stringify(this.communityArray));
      }
      // this.communityArray = [];
      // areaList.forEach((element) => {
      //   if (element.parentcode == item.citycode) {
      //     this.communityArray.push(element);
      //   }
      // });
    },
    cancelChoose() {
      if (JSON.parse(window.localStorage.getItem("positionInfo"))?.city) {
        this.cityArray = JSON.parse(window.localStorage.getItem("cityArray"));
        this.activeName = "second";
      } else {
        this.cityArray.forEach((item) => {
          item.select = false;
        });
        this.activeName = "first";
      }
      if (JSON.parse(window.localStorage.getItem("positionInfo"))?.district) {
        this.activeName = "third";
      }
      if (JSON.parse(window.localStorage.getItem("positionInfo"))?.street) {
        this.activeName = "fourth";
      }
      this.districtArray = JSON.parse(window.localStorage.getItem("districtArray") || "[]") || [];
      this.streetArray = JSON.parse(window.localStorage.getItem("streetArray") || "[]") || [];
      this.communityArray = JSON.parse(window.localStorage.getItem("communityArray") || "[]") || [];
      this.popShow = false;
    },
    sureChoose() {
      window.localStorage.setItem("cityArray", JSON.stringify(this.cityArray));
      window.localStorage.setItem("streetArray", JSON.stringify(this.streetArray));
      window.localStorage.setItem("districtArray", JSON.stringify(this.districtArray));
      window.localStorage.setItem("communityArray", JSON.stringify(this.communityArray));
      let message = {};
      this.cityArray.forEach((item) => {
        if (item.select) {
          message.city = item;
        }
      });
      this.streetArray.forEach((item) => {
        if (item.select) {
          message.street = item;
        }
      });
      this.districtArray.forEach((item) => {
        if (item.select) {
          message.district = item;
        }
      });
      this.communityArray.forEach((item) => {
        if (item.select) {
          message.community = item;
        }
      });
      window.localStorage.setItem("positionInfo", JSON.stringify(message));
      this.triggerEvent("positionChange", JSON.parse(window.localStorage.getItem("positionInfo")));
      this.popShow = false;
    },
    // 逆地址解析
    reAddressAnalysis(resp) {
      let info = `${resp.latitude},${resp.longitude}`;
      let message = {
        coordinate: info,
      };
      requeryAddressByCoordinate(message).then((res) => {
        this.requeryAddressInfo = res.data;
        this.nowCity = res.data.address_component.city;
        this.dialogShow = true;
      });
    },
    // 地址解析
    addressAnalysis() {
      let message = {
        address: "江苏省南京市夫子庙",
      };
      queryAddressByCoordinate(message).then((res) => {
        console.log(res);
      });
    },
    // 确认
    confirmDialog() {
      this.cityArray.forEach((item) => {
        if (item.cityname == this.requeryAddressInfo.ad_info.city) {
          item.select = true;
          this.choseCity(item, 1);
          this.districtArray.forEach((item2) => {
            if (item2.cityname == this.requeryAddressInfo.ad_info.district) {
              this.choseDistrict(item2, 1);
              this.streetArray.forEach((item3) => {
                if (item3.cityname == this.requeryAddressInfo.address_reference.town.title) {
                  this.choseStreet(item3, 1);
                }
              });
            }
          });
        }
      });
      this.sureChoose();
    },
    cancelDialog() {
      this.cityArray = [];
      this.districtArray = [];
      this.streetArray = [];
      this.communityArray = [];
      this.areaList.forEach((item) => {
        if (item.leval == 3) {
          this.cityArray.push(item);
        }
      });
    },
    popupShow() {
      this.popShow = !this.popShow;
    },
    handleClick(tab, event) {
      console.log(tab, event);
    },
    /**
     * 封装的触发事件方法 必需，不可删除
     * @param {String} eventName 事件名
     * @param {Object} payload 事件传参
     *
     */
    triggerEvent(type, payload) {
      if (payload.community) {
        payload = payload.community.citycode;
      } else if (payload.street) {
        payload = payload.street.citycode;
      } else if (payload.district) {
        payload = payload.district.citycode;
      } else if (payload.city) {
        payload = payload.city.citycode;
      }
      window.eventCenter?.triggerEvent &&
        window.eventCenter.triggerEvent(this.customConfig.componentId, type, {
          value: payload,
        });
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
.popupButton {
  width: 100%;
  display: flex;
  justify-content: center;
  .el-button {
    border-radius: 2px;
    height: 28px;
    width: 60px;
  }
}
.dialogSure {
  height: 150.5px;
  text-align: center;
  /deep/.van-dialog__content {
    padding: 32px 41px 24px 44px;
  }
}
/deep/.chooseCity,
/deep/.chooseCity:focus,
/deep/.chooseCity:hover {
  height: 28px;
  width: 88px;
  line-height: 26px;
  padding: 0px 0px !important;
  margin: 0 20px 20px 0 !important;
}
/deep/.van-tabs__wrap {
  height: 26px !important;
  margin-bottom: 10px !important;
}
/deep/.van-button {
  line-height: 60px !important;
  height: 48px !important;
}
/deep/.van-dialog__footer {
  height: 60px !important;
}
/deep/.van-tab {
  -webkit-box-flex: unset !important;
  -webkit-flex: unset !important;
  flex: unset !important;
  -webkit-align-items: unset !important;
  -webkit-justify-content: unset !important;
  justify-content: unset !important;
  margin-right: 15px !important;
}
/deep/.van-tabs__line {
  width: 28px !important;
  // left: -22px !important;
}
/deep/.chooseCity:focus,
.selectItem {
  background-color: rgba(50, 150, 250, 1) !important;
  color: #fff !important;
}
</style>
<style lang="less">
.addressPoppver {
  width: calc(100% - 35px) !important;
  pointer-events: painted;
}
</style>
