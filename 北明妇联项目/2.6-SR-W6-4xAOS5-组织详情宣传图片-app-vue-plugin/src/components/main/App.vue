<template>
  <div :id="id" ref="app-secondary" class="app-secondary">
    <div class="xuanchuanBox">
      <span class="xuanchuanTitle">宣传图片</span>
      <div class="imgBox">
        <img v-if="oneImg" class="xuanchuanImg" :src="oneImg" alt="">
        <img v-if="twoImg" class="xuanchuanImg" :src="twoImg" alt="">
      </div>
    </div>
    <div class="xuanchuanBox" style="margin-top: 20px">
      <span class="xuanchuanTitle">组织视频</span>
      <div class="videoBox">
        <!-- <img v-show="videoRefPlay" class="playPng" src="../../../pluginTemp/images/play.png" alt="" @click="playFun"> -->
        <video 
          v-if="vioUrl"
          :src="vioUrl"
          id="zuzhiVideo"
          ref="zuzhiVideo" 
          class="videoCla"
          preload="metadata"
          controls
          controlsList="nodownload nofullscreen noremoteplayback noplaybackrate"
          disablepictureinpicture
          muted x5-playsinline playsinline webkit-playsinline
        ></video>
        <!-- <div class="videoTime">
          <span class="texxt">{{videoTimes}}</span>
        </div> -->
      </div>
    </div>
  </div>
</template>

<script>
import {
  isLogin, // 查询用户是否登录
  queryUser, // 1 查询用户
  queryImgVio,
} from "../../api/asset.js";

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
      videoRef: null,
      videoRefPlay: true,
      oneImg: "",
      twoImg: "",
      vioUrl: "",
      videoTimes: "00:00"
    };
  },
  mounted() {
    //此方法封装了事件注册，不可删除
    this.mainInit(this);
    this.videoRef = this.$refs.zuzhiVideo;
    // this.videoRef.onclick = this.videoFun;
    // this.getVidDur();
    this.queryImgVioList();
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
    // 接口
    queryImgVioList() {
      let params = {
        data_id: getQueryString("officeid") || '2d3ef2df5edf4150a5b018d98ebf8ca1'
      }
      queryImgVio(params).then(res=>{
        let { data } = res;
        console.log("tab请求", data);
        let { promotional_images, organize_videos } = data[0];
        promotional_images = JSON.parse(promotional_images);
        organize_videos = JSON.parse(organize_videos);
        this.oneImg = promotional_images[0] ? promotional_images[0].url : "";
        this.twoImg = promotional_images[1] ? promotional_images[1].url : "";
        this.vioUrl = organize_videos[0] ? organize_videos[0].url : "";
        console.log();
      }).catch(err=>{
        console.log(err);
      })
    },
    // 播放
    playFun() {
      if (this.videoRef.paused == true) {
        this.videoRef.play()
        this.videoRefPlay = false;
      }
    },
    // 暂停
    videoFun() {
      if (this.videoRef.paused == false) {
        this.videoRef.pause();
        this.videoRefPlay = true;
      }
    },
    // 获取视频时长
    getVidDur() {
      this.videoTimes = this.formatSeconds(this.videoRef.duration);
      console.log('视频时长', this.videoTimes);
    },
    // 转换时间格式
    formatSeconds(value) {
      let secondTime = parseInt(value); // 秒
      let minuteTime = 0; // 分
      let hourTime = 0;
      if (secondTime > 60) {
        minuteTime = parseInt(secondTime / 60);
        secondTime = parseInt(secondTime % 60);
        if (minuteTime > 60) {
          hourTime = parseInt(minuteTime / 60);
          minuteTime = parseInt(minuteTime % 60);
        }
      }
      let result = "" + parseInt(secondTime);
      if (parseInt(secondTime) < 60) {
        result = "00:" + parseInt(secondTime);
      }
      if (minuteTime > 0) {
        if (parseInt(minuteTime) < 10) {
          result = "0" + parseInt(minuteTime) + ":" + result;
        } else {
          result = "" + parseInt(minuteTime) + ":" + result;
        }
      }
      if (hourTime > 0) {
        if (parseInt(minuteTime) < 10) {
          result = "0" + parseInt(hourTime) + ":" + result;
        } else {
          result = "" + parseInt(hourTime) + ":" + result;
        }
      }
      console.log("result", result);
      return result;
    },
  },
  beforeDestroy() {
    window.componentCenter?.removeInstance(this.customConfig?.componentId);
  }
};
</script>

<style lang="less" scoped>
.app-secondary {
  padding: 0 10px;
  // width: calc(100% - 20px);
  width: 100%;
  background: #fafafc;
  .xuanchuanBox {
    width: 100%;
    .xuanchuanTitle {
      display: inline-block;
      margin-bottom: 10px;
      height: 21px;
      font-size: 15px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #333333;
      line-height: 21px;
    }
    .imgBox {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .xuanchuanImg {
        width: calc(50% - 8px);
        height: 170px;
        border-radius: 4px;
        background: #D8D8D8;
      }
    }
    .videoBox {
      position: relative;
      width: 100%;
      height: 170px;
      max-height: 170px;
      background: #000000;
      border-radius: 4px;
      overflow: hidden;
      .playPng {
        top: 62px;
        left: 50%;
        transform: translateX(-50%);
        position: absolute;
        width: 46px;
        height: 46px;
        z-index: 99;
      }
      .videoTime {
        position: absolute;
        bottom: 10px;
        right: 10px;
        width: 42px;
        height: 22px;
        line-height: 22px;
        border-radius: 30px;
        background: rgba(000, 000, 000, 0.4);
        .texxt {
          font-size: 10px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #ffffff;
        }
      }
      .videoCla {
        width: 100%;
        height: 100%;
        background: #080808;
        /*video隐藏全屏按钮*/
        &::-webkit-media-controls-fullscreen-button {
          display: none !important;
        }
      
        /*video隐藏音量控制*/
        &::-webkit-media-controls-volume-control-container {
          display: none !important;
        }
      }
    }
  }
}
</style>
