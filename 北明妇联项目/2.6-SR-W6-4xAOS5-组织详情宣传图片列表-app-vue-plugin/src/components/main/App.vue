<template>
  <div :id="id" class="imgVioList">
    <van-tabs v-model="active" line-width="30" line-height="4" color="#3296fa" background="#fafafc">
      <van-tab title="组织视频">
        <div class="imgListBox">
          <van-list v-model="vioLoading" :finished="vioFinished" offset="20" finished-text="没有更多了" @load="vioOnLoad">
            <div class="imgBox">
              <video
                id="zuzhiVideo" 
                ref="zuzhiVideo" 
                class="videoCla"
                preload="metadata"
                controls
                controlsList="nodownload nofullscreen noremoteplayback noplaybackrate"
                disablepictureinpicture
                muted x5-playsinline playsinline webkit-playsinline
                v-for="item, index in videoList" 
                :key="index"
                :src="item.url"
              ></video>
            </div>
          </van-list>
        </div>
      </van-tab>
      <van-tab title="宣传图片">
        <div class="imgListBox">
          <van-list v-model="loading" :finished="finished" offset="20" finished-text="没有更多了" @load="imgOnLoad">
            <div class="imgBox">
              <img class="xuanchuanImg" v-for="item, index in imgList" :key="index" :src="item.url" alt="">
            </div>
          </van-list>
        </div>
      </van-tab>
    </van-tabs>
  </div>
</template>

<script>
import Vue from 'vue';
import { List, Tab, Tabs } from 'vant';
import { queryImgVio } from "../../api/asset"
import oneImg from "../../../pluginTemp/images/01.png";
import vioUrl from "../../../pluginTemp/images/vio.mp4";

Vue.use(List);
Vue.use(Tab);
Vue.use(Tabs);

const getQueryString = name => {
  const reg = new RegExp(name + "=([^&]*)(&|$)");
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
      active: 1,
      vioLoading: false,
      vioFinished: false,
      loading: false,
      finished: false,
      videoList: [],
      imgList: [],
      imgPage: 0,
      vioPage: 0,
      vioUrl,
      oneImg,
    };
  },
  mounted() {
    //此方法封装了事件注册，不可删除
    this.mainInit(this);
    this.active = Number(getQueryString("type"));
    console.log('this.active', this.active);
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
    // 图片
    imgOnLoad() {
      // 异步更新数据
      let params = {
        data_id: getQueryString("officeid")
      }
      queryImgVio(params).then(res => {
        let { data } = res;
        if (data && data.length > 0) {
          let { promotional_images } = data[0];
          this.imgList = JSON.parse(promotional_images);
        }else {
          this.imgList = []
        }
        
        // 加载状态结束
        this.loading = false;
        // 数据全部加载完成
        this.finished = true;
        // if (this.imgList.length >= 2) {
        // }
      }).catch(err => {
        console.log(err);
      })
    },
    // 视频
    vioOnLoad() {
      // 异步更新数据
      let params = {
        data_id: getQueryString("officeid")
      }
      queryImgVio(params).then(res => {
        let { data } = res;
        if (data && data.length > 0) {
          let { organize_videos } = data[0];
          this.videoList = JSON.parse(organize_videos);
        }else {
          this.videoList = []
        }
        // 加载状态结束
        this.vioLoading = false;

        // 数据全部加载完成
        this.vioFinished = true;
        // if (this.imgList.length >= 2) {
        // }
      }).catch(err => {
        console.log(err);
      })
    },
  },
  beforeDestroy() {
    window.componentCenter?.removeInstance(this.customConfig?.componentId);
  }
};
</script>

<style lang="less" scoped>
.imgVioList {
  // width: calc(100% - 20px);
  width: 100%;
  padding: 10px;
  background: #fafafc;
  .imgListBox {
    margin-top: 15px;
    width: 100%;
    min-height: 180px;
    max-height: calc(100vh - 85px);
    overflow-y: scroll;
    &::-webkit-scrollbar {
      width: 0;
    }
    .imgBox {
      width: 100%;
      height: 100%;
      .xuanchuanImg {
        margin-top: 15px;
        width: calc(50% - 8px);
        height: 170px;
        border-radius: 4px;
        &:nth-child(even) {
          margin-left: 16px;
        }
      }
      .videoCla {
        margin-top: 15px;
        width: 100%;
        height: 170px;
        border-radius: 4px;
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
