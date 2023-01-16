<template>
  <div :id="id" ref="app-secondary" class="app-secondary">
    <!-- 背景图-接完 -->
    <div class="activeHead">
      <img :src="bannerImg" alt="" class="headBanner">
      <div class="headTitle">{{ activeMsg.title }}</div>
      <div class="concentInfo">
        <div class="liulanText">
          <div>
            浏览<span class="liulan">{{ activeMsg.browsing_number || 0 }}</span>次
          </div>
          <span class="line">|</span>
          <div>
            收藏<span class="shouCang">{{ activeMsg.collect_num || 0 }}</span>次
          </div>
        </div>
        <div class="paoMingBox">
          <div class="imgList">
            <img v-for="(item,index) in baoMingList" :key="index" :src="item.picture" alt="" class="userImg">
          </div>
          <div class="signUpBox">
            等<span class="signUp">{{ baoMingNum }}</span>人报名
          </div>
        </div>
      </div>
      <div class="lineBox"></div>
      <div class="publisherBox">
        <img class="publisherImg" src="../../../pluginTemp/images/shoucang.png" alt="">
        <div class="publisher">主办单位：{{ activeMsg.sponsor }}</div>
        <van-button class="guanzhuBtn" :style="{ background: isGuanZhu == 1 ? '#bbbbbb' : '#3296fa'}"  size="small" round type="default" @click="guanZhuHandel()">{{ isGuanZhu == 1 ? '已关注': '关注' }}</van-button>
      </div>
    </div>
    <!-- 活动信息-接完 -->
    <div class="activeMsg">
      <div class="msgItem">
        <span class="textTitle">报名起止时间：</span>
        <span class="textCon">{{ (activeMsg.start_time || "") +" - "+ (activeMsg.end_time || "") }}</span>
      </div>
      <div class="msgItem">
        <span class="textTitle">联系人电话 ：</span>
        <span class="textCon">{{ activeMsg.contact_person }} ｜ {{ activeMsg.contact_number }}</span>
        <a :href="'tel:' + activeMsg.contact_number">
          <van-icon class="phoneIcon" name="phone"/>
        </a>
      </div>
      <div class="msgItem">
        <span class="textTitle">报名人数：</span>
        <span class="textCon">{{ baoMingNum +'人/'+ (activeMsg.quota_limit || 0) }}</span>
      </div>
      <div class="msgItem">
        <span class="textTitle">活动地址：</span>
        <span class="textCon">{{ activeMsg.active_address }}</span>
        <img src="../../../pluginTemp/images/箭头_arrow591.png" alt="" class="mapArrow" @click="mapLocation()">
      </div>
    </div>
    <!-- 活动内容-接完 -->
    <div class="activeInfo">
      <div class="title">活动详情</div>
      <div class="activeCon" v-html="activeMsg.activity_details"></div>
    </div>
    <!-- 活动评论-接完 -->
    <div class="pingLunBox">
      <div class="pingLunBoTtitle">活动评论（{{ allPingLunLength }}）</div>
      <div class="pingLunList">
        <van-list v-model="loading" :finished="finished" :offset="5" finished-text="没有更多评论了" @load="onLoad">
          <div class="pingLunItem" v-for="(item,index) in pingLunList" :key="index">
            <img class="pingLunImg" :src="item.url" alt="">
            <div class="pingLunCon">
              <div class="userNameBox">
                <span class="userInfo">{{ item.critic }}</span>
                <span class="pingTime">{{ item.comment_time }}</span>
              </div>
              <div class="pngCon">{{ item.comment_content }}</div>
            </div>
          </div>
        </van-list>
      </div>
      <!-- <div class="notMore">没有更多评论了</div> -->
    </div>
    <!-- 活动总结-接完 -->
    <div v-if="activeMsg.report_status == 0" class="summarize">
      <div class="summarizeTtitle">活动总结</div>
      <div class="summarizeImgBox">
        <img class="imgSummarize" :src="headImg" alt="">
        <span class="imgTitle">{{ activeOverMsg.nickname }}</span>
      </div>
      <div class="summarizeMsg">{{ activeOverMsg.summary_content }}</div>
      <div class="summarizeSub">
        <span class="subTime">发布时间：{{ activeOverMsg.summarize_time }}</span>
      </div>
      <div  v-if="activeOverImgList.length > 1" class="summarizeInfoImgBox">
        <img v-for="(imgX,index) in activeOverImgList" :key="index" class="summarizeInfoImg" :src="imgX" alt="">
      </div>
      <div v-if="activeOverImgList.length == 1" class="overImgBox">
        <img class="overImg" :src="'http://10.15.110.25:18880/'+activeOverImgList[0]" alt="">
      </div>
    </div>
    <!-- 发布活动总结-接完 -->
    <div v-if="activeMsg.report_status == 1 && adminInfoId == createMemberId" class="summarizeOver">
      <div class="summarizeTtitle">活动总结</div>
      <div class="subOver" @click="subActiveOver">
        发布活动总结
        <img class="subOverImg" src="../../../pluginTemp/images/goon.png" alt="">
      </div>
    </div>
    <!-- 底部按钮-接完 -->
    <div class="bottomBox">
      <div class="btnBoxLeft">
        <div class="btnBox" @click="bottomBtnHand('collect')">
          <van-icon v-if="isCollect == 1" class="isCollectStar" name="star" />
          <van-icon v-if="isCollect == 0" class="collectStar" name="star" />
          <span class="collectText">收藏</span>
        </div>
        <div class="lineBox"></div>
        <div class="btnBox" @click="bottomBtnHand('praise')">
          <img v-if="isPraise == 1" class="isPraiseStar" src="../../../pluginTemp/images/isDianzan.png" alt="">
          <img v-if="isPraise == 0" class="isPraiseStar" src="../../../pluginTemp/images/noDianzan.png" alt="">
          <span class="collectText">点赞</span>
        </div>
        <div class="lineBox"></div>
        <div class="btnBox" @click="bottomBtnHand('pingLun')">
          <van-icon class="collectStar" name="chat-o" />
          <span class="collectText">评论</span>
        </div>
      </div>
      <van-button v-if="activeMsg.report_status == 1" class="paoMingBtn" type="default" color="#3296fb" @click="paoMing">{{ activeOver == 0 ? "立即报名": "取消报名" }}</van-button>
      <van-button v-if="activeMsg.report_status == 0" class="paoMingBtn" :disabled="true" type="default" color="#bdbabd">报名截止</van-button>
    </div>
    <!-- 评论弹窗-接完 -->
    <van-popup v-model="isPingLun" position="bottom" :style="{ height: '400px' }">
      <van-field v-model="pingLunMessage" rows="13" maxlength="300" autosize type="textarea" show-word-limit placeholder="评论内容需要等待管理员审核通过后才能显示" />
      <van-button class="fabuBtn" round size="mini" type="default" @click="addPingLun">发布</van-button>
    </van-popup>
  </div>
</template>
<script>
import Vue from 'vue';
import moment from 'moment';
import {
  queryUser, // 1 查询用户
  wxJsSdk, // 1 JS-SDK签名算法
  queryActiveMsg, // 1 查询活动
  queryBaoMing, // 1 查询报名
  queryPingLun, // 1 查询评论表
  queryActiveType, // 1 查询活动状态
  queryActiveOver,// 1 查询活动总结表
  queryPingLunNum, // 1 评论总条数
  queryAddGuanZhu, // 1 关注次数+1
  queryAddGuanZhuData,// 1 插入关注数据
  queryDelGuanZhuData,// 1 删除关注信息
  queryDelGuanZhu,// 1 关注次数-1
  queryAddCollect, // 1 插入后收藏+1
  queryCollectData, // 1 插入收藏数据
  queryDelCollectData,// 1 删除收藏信息
  queryDelCollect,// 1 收藏次数-1
  queryDianZanData,// 1 插入点赞表数据
  queryAddDianZan,// 1 点赞次数+1
  queryPingLunData, // 1 插入评论数据
  queryDelDianZan, // 1 点赞信息-1
  queryDelDianZanData, // 1 删除点赞信息
  queryAddBaoMing,// 1 插入报名信息
  queryAddBaoMingData,//1 插入后报名人数+1
  queryDelBaoMing,// 1 删除报名信息
  queryDelBaoMingData,// 1 删除后报名人数-1
  queryLiuLanNum,// 1 浏览次数+1
} from "../../api/asset.js";
import { Button, Icon, Popup, Field, List, Toast, Dialog } from 'vant';

Vue.use(Button);
Vue.use(Icon);
Vue.use(Popup);
Vue.use(Field);
Vue.use(List);
Vue.use(Toast);
Vue.use(Dialog);

const getQueryString = name => {
  const reg = new RegExp(name + "=([^&]*)(&|$)", "i");
  const r = window.location.search.substr(1).match(reg);
  if (r != null) return r[1];
  return "b0cef8e6c99744e0b6df57e042c4c415";
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
      cookeiId: "",
      adminInfo: {},
      adminInfoId: "",
      createMemberId: "",
      headImg: "data:image/png;base64,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",
      moment,
      isGuanZhu: 0, // 关注
      isCollect: 0, // 收藏
      isPraise: 0, // 点赞
      isPingLun: false, // 评论
      activeOver: 0, // 活动状态
      pingLunMessage: "",  // 评论
      bannerImg: "",
      activeMsg: {}, // 活动信息
      baoMingList: [], // 报名列表
      baoMingNum: 0, // 报名人数
      pageNum: 1, // 评论页数
      loading: false,
      finished: false,
      activeOverMsg: {}, //活动总结
      activeOverImgList: [], // 活动总结图片
      pingLunList: [],
      allPingLunLength: 0, // 评论总数
    };
  },
  mounted() {
    this.activeOverUrl = this.customConfig?.activeOverUrl ? this.customConfig?.activeOverUrl : "";
    this.avtivesId = getQueryString('activityid');
    this.cookeiId = this.getcookie('token');
    if (this.cookeiId) {
      this.queryUserInfo();
    }
    //此方法封装了事件注册，不可删除
    this.mainInit(this); 
    this.getActiveMsgs(this.avtivesId);
    this.getBaoMings(this.avtivesId);
    this.getPingLuns(this.avtivesId);
    this.queryLiuLanNum();
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

    // 获取cookei
    getcookie(objname) {//获取指定名称的cookie的值
      var arrstr = document.cookie.split("; ");
      for (var i = 0; i < arrstr.length; i++) {
        var temp = arrstr[i].split("=");
        if (temp[0] == objname) return unescape(temp[1]);
      }
    },
    // 获取用户信息
    queryUserInfo() {
      queryUser().then(res=>{
        let { data } = res;
        console.log('用户信息',data);
        if (data == false){
          this.adminInfo = {};
          this.adminInfoId = "";
        }else {
          this.adminInfo = data;
          this.adminInfoId = data.id;
        }
        this.getActiveType();
        this.getActiveOver(this.avtivesId);
      }).catch(err=>{
        this.adminInfo = {};
        this.adminInfoId = "";
      });
    },
    // 跳转小程序登录页
    toLogin(){
      // let appId = 'wx398192d4a9830f4d';
      // wx.miniProgram.redirectTo({ url: `../login/login&appId=${appId}` })
      wx.miniProgram.redirectTo({ url: `../login/login` })
    },

    // 活动总结跳转
    subActiveOver() {
      let urlA = this.activeOverUrl.indexOf('?')
      if (urlA != "-1") {
        // alert(`${window.location.origin}${this.activeOverUrl}&${dataIdKey}=${dataId}&pointName=${pointName}`)
        window.location.href = `${window.location.origin}${this.activeOverUrl}&activityid=${this.avtivesId}`;
      } else {
        // alert(`${window.location.origin}${this.activeOverUrl}?${dataIdKey}=${dataId}&pointName=${pointName}`)
        window.location.href = `${window.location.origin}${this.activeOverUrl}?activityid=${this.avtivesId}`;
      }
    },
    
    // 地图跳转
    async mapLocation(){
      let _that = this;
      let message = {
        url: encodeURIComponent(window.location.href.split("#")[0]),
      };
      let { data: res } = await wxJsSdk(message);
      console.log('JS-SDK签名算法',res);
      
      if (window.wx) {
        window.wx.config({
          debug: true, // 开启调试模式,调用的所有 api 的返回值会在客户端 alert 出来，若要查看传入的参数，可以在 pc 端打开，参数信息会通过 log 打出，仅在 pc 端时才会打印。
          appId: res.appId, // 必填，公众号的唯一标识
          timestamp: res.timestamp, // 必填，生成签名的时间戳
          nonceStr: res.nonceStr, // 必填，生成签名的随机串
          signature: res.signature, // 必填，签名
          jsApiList: ["openLocation"], // 必填，需要使用的 JS 接口列表
        });
        window.wx.ready(() => {
          let { latitude, longitude } = _that.activeMsg;
          if (latitude && longitude) {
            latitude = Number(latitude);
            longitude = Number(longitude);
            window.wx.openLocation({
              latitude: latitude ? latitude : 0,//维度
              longitude: longitude ? longitude : 0,//经度
              success: (resp) => {},
              fail(error) {
                Notify({ type: 'warning', message: '跳转失败' });
              },
            });
          } else {
            Notify({ type: 'warning', message: '经纬度缺失' });
          }
        });
      }else {
        Notify({ type: 'warning', message: '未找到WX' });
      }
    },

    // 关注
    guanZhuHandel(){
      if (this.adminInfoId == "") {
        Dialog.confirm({
          title: '请先登录',
          message: '点击确认跳转登录页',
        }).then(() => {
          // on confirm
          this.toLogin();
        }).catch(() => {
          // on cancel
        });
      }else {
        if (this.isGuanZhu == 0) {
          this.getGuanZhuData();
        }else {
          this.getDelGuanZhuData()
        }
      }
    },
    // 关注数据
    async getGuanZhuData() {
      const params = { 
        data_id: this.avtivesId,
        user_id: this.adminInfoId
      }
      let res = await queryAddGuanZhuData(params);
      if (res.status == 200) {
        this.isGuanZhu = 1;
        this.getAddGuanZhu();
        this.getActiveType();
      }else {
        // Notify({ type: 'warning', message: '关注失败' });
        Toast.fail('关注失败');
      }
      // console.log('增加关注数据', res);
    },
    // 关注+1
    getAddGuanZhu() {
      const params = {
        data_id: this.avtivesId,
        user_id: this.adminInfoId
      }
      queryAddGuanZhu(params);
    },
    //  删除关注数据
    async getDelGuanZhuData() {
      const params = {
        data_id: this.avtivesId,
        user_id: this.adminInfoId
      }
      let res = await queryDelGuanZhuData(params);
      if (res.status == 200) {
        this.isGuanZhu = 0;
        this.getDelGuanZhu();
        this.getActiveType();
      } else {
        // Notify({ type: 'warning', message: '关注失败' });
        Toast.fail('放弃关注失败');
      }
      // console.log('增加关注数据', res);
    },
    // 关注-1
    getDelGuanZhu() {
      const params = {
        data_id: this.avtivesId,
        user_id: this.adminInfoId
      }
      queryDelGuanZhu(params);
    },

    // 底部功能栏
    bottomBtnHand(type){
      switch (type) {
        case 'collect':
          if (this.isCollect == 0) {
            this.getCollectData();
          } else {
            this.getDelCollectData();
          }
          break;
        case 'praise':
          if (this.isPraise == 0) {
            this.getDianZanData();
          } else {
            this.getDelDianZanData();
          }
          break;
        case 'pingLun':
          if (this.adminInfoId == "") {
            Dialog.confirm({
              title: '请先登录',
              message: '点击确认跳转登录页',
            }).then(() => {
              this.toLogin();
            }).catch(() => {
            });
          } else {
            this.isPingLun = true;
          }
          break;
      }
    },
    // 收藏数据
    async getCollectData() {
      if (this.adminInfoId == "") {
        Dialog.confirm({
          title: '请先登录',
          message: '点击确认跳转登录页',
        }).then(() => {
          // on confirm
          this.toLogin();
          // console.log('1111111111111确认');
        }).catch(() => {
          // on cancel
          // console.log('22222222取消');
        });
      } else {
        const params = {
          data_id: this.avtivesId,
          user_id: this.adminInfoId
        }
        let res = await queryCollectData(params);
        if (res.status == 200) {
          this.isCollect = 1;
          this.getAddCollect();
          this.getActiveType();
        } else {
          // Notify({ type: 'warning', message: '关注失败' });
          Toast.fail('收藏失败');
        }
      }
    },
    // 收藏数据+1
    async getAddCollect() {
      const params = {
        data_id: this.avtivesId,
        user_id: this.adminInfoId
      }
      await queryAddCollect(params);
      // console.log('收藏数据+1', res);
    },
    // 收藏数据
    async getDelCollectData() {
      if (this.adminInfoId == "") {
        Dialog.confirm({
          title: '请先登录',
          message: '点击确认跳转登录页',
        }).then(() => {
          // on confirm
          this.toLogin();
          // console.log('1111111111111确认');
        }).catch(() => {
          // on cancel
          // console.log('22222222取消');
        });
      } else {
        const params = {
          data_id: this.avtivesId,
          user_id: this.adminInfoId
        }
        let res = await queryDelCollectData(params);
        if (res.status == 200) {
          this.isCollect = 0;
          this.getDelCollect();
          this.getActiveType();
        } else {
          // Notify({ type: 'warning', message: '关注失败' });
          Toast.fail('取消收藏失败');
        }
      }
    },
    // 收藏数据+1
    async getDelCollect() {
      const params = {
        data_id: this.avtivesId,
        user_id: this.adminInfoId
      }
      await queryDelCollect(params);
      // console.log('收藏数据+1', res);
    },

    // 点赞数据
    async getDianZanData() {
      if (this.adminInfoId == "") {
        Dialog.confirm({
          title: '请先登录',
          message: '点击确认跳转登录页',
        }).then(() => {
          // on confirm
          this.toLogin();
          // console.log('1111111111111确认');
        }).catch(() => {
          // on cancel
          // console.log('22222222取消');
        });
      } else {
        const params = {
          data_id: this.avtivesId,
          user_id: this.adminInfoId
        }
        let res = await queryDianZanData(params);
        if (res.status == 200) {
          this.isPraise = 1;
          this.getAddCollect();
          this.getActiveType();
        } else {
          // Notify({ type: 'warning', message: '关注失败' });
          Toast.fail('点赞失败');
        }
      }
    },
    // 点赞+1
    async getAddDianZan() {
      const params = {
        data_id: this.avtivesId,
        user_id: this.adminInfoId
      }
      await queryAddDianZan(params);
      // console.log('收藏数据+1', res);
    },
    // 删除点赞数据
    async getDelDianZanData() {
      if (this.adminInfoId == "") {
        Dialog.confirm({
          title: '请先登录',
          message: '点击确认跳转登录页',
        }).then(() => {
          this.toLogin();
        }).catch(() => {
        });
      } else {
        const params = {
          data_id: this.avtivesId,
          user_id: this.adminInfoId
        }
        let res = await queryDelDianZanData(params);
        if (res.status == 200) {
          this.isPraise = 0;
          this.getDelDianZan();
          this.getActiveType();
        } else {
          // Notify({ type: 'warning', message: '关注失败' });
          Toast.fail('取消点赞失败');
        }
      }
    },
    // 点赞-1
    getDelDianZan() {
      const params = {
        data_id: this.avtivesId,
        user_id: this.adminInfoId
      }
      queryDelDianZan(params);
      // console.log('收藏数据+1', res);
    },
    
    // 添加报名数据
    async paoMing() {
      if (this.adminInfoId == "") {
        Dialog.confirm({
          title: '请先登录',
          message: '点击确认跳转登录页',
        }).then(() => {
          // on confirm
          this.toLogin();
          // console.log('1111111111111确认');
        }).catch(() => {
          // on cancel
          // console.log('22222222取消');
        });
      } else {
        if (this.activeOver == 0) {
          const params = {
            data_id: this.avtivesId,
            user_id: this.adminInfoId
          }
          let res = await queryAddBaoMing(params);
          if (res.status == 200) {
            this.paoMingAddNum();
            this.getActiveType();
          } else {
            // Notify({ type: 'warning', message: '关注失败' });
            Toast.fail('报名失败');
          }
        }else {
          Dialog.confirm({
            message: '确认取消报名？',
          }).then(() => {
            this.paoMingDelNum();
          }).catch(() => {
          });
        }
      }
    },
    // 报名+1
    async paoMingAddNum() {
      const params = {
        data_id: this.avtivesId,
        user_id: this.adminInfoId
      }
      await queryAddBaoMingData(params);
      // console.log('收藏数据+1', res);
    },
    // 取消报名
    async paoMingDelNum() {
      const params = {
        data_id: this.avtivesId,
        user_id: this.adminInfoId
      }
      let res = await queryDelBaoMing(params);
      if (res.status == 200) {
        this.paoMingDelNum();
        this.getActiveType();
      } else {
        // Notify({ type: 'warning', message: '关注失败' });
        Toast.fail('取消报名失败');
      }
    },
    // 报名-1
    async paoMingDelNum() {
      const params = {
        data_id: this.avtivesId,
        user_id: this.adminInfoId
      }
      await queryDelBaoMingData(params);
      // console.log('收藏数据+1', res);
    },

    // 评论
    addPingLun() {
      if (this.pingLunMessage != "") {
        this.getPingLunData();
      }
    },
    // 评论数据
    async getPingLunData() {
      const params = {
        data_id: this.avtivesId,
        user_id: this.adminInfoId,
        content: this.pingLunMessage
      }
      let res = await queryPingLunData(params);
      if (res.status == 200) {
        this.isPingLun = false;
      } else {
        Toast.fail('评论失败');
      }
    },
    
    // 活动内容
    async getActiveMsgs(id) {
      const params = { data_id: id }
      let { data } = await queryActiveMsg(params);
      console.log('活动信息', data);
      this.activeMsg = data[0] || {};
      this.activeMsg.start_time = moment(this.activeMsg.start_time).format('YYYY/MM/DD HH:mm');
      this.activeMsg.end_time = moment(this.activeMsg.end_time).format('YYYY/MM/DD HH:mm');
      this.bannerImg = JSON.parse(this.activeMsg.picture)[0].url;
      this.createMemberId = data[0].create_member;
    },
    // 活动状态
    async getActiveType() {
      const params = { 
        data_id: this.avtivesId,
        user_id: this.adminInfoId
      }
      let { data } = await queryActiveType(params);
      // console.log('活动状态', data);
      this.activeStatus = data[0] || {};
      this.isGuanZhu = data[0]?.if_attention || 0; // 关注
      this.isCollect = data[0]?.if_collect || 0; // 收藏
      this.isPraise = data[0]?.if_like || 0; // 点赞
      this.activeOver = data[0]?.if_registration || 0; // 报名
    },
    // 报名列表
    async getBaoMings(id) {
      const params = { data_id: id }
      let { data } = await queryBaoMing(params);
      this.baoMingNum = data.length;
      this.baoMingList = data.map(x=>{
        x.picture = x.head_picture ? JSON.parse(x.head_picture)[0].url : this.headImg;
        return x;
      }).splice(0,5);
      // console.log('报名列表', this.baoMingList);
    },
    // 评论列表
    getPingLuns(id) {
      const params = {
        pageNum: 5,
        pageSize: this.pageNum,
        data_id: id
      }
      queryPingLun(params).then(res=>{
        let { data } = res;
        let arryList = data.map( x => {
          x.comment_time = moment(x.comment_time).format('YYYY/MM/DD HH:mm');
          x.url = x.head_picture ? JSON.parse(x.head_picture)[0].url : this.headImg;
          return x;
        })
        this.pingLunList = this.pingLunList.concat(arryList);
        // console.log('评论列表', this.pingLunList);
        // 加载状态结束
        this.loading = false;
        this.getPingLunNum(this.avtivesId);
      }).catch(err=>{
        // 加载状态结束
        this.finished = true;
        this.loading = false;
        console.log('评论列表err',err);
      });
    },
    // 评论列表
    onLoad() {
      this.pageNum = this.pageNum + 1;
      const params = {
        pageNum: 5,
        pageSize: this.pageNum,
        data_id: this.avtivesId
      }
      queryPingLun(params).then(res=>{
        let { data } = res;
        let arryList = data.map(x => {
          x.comment_time = moment(x.comment_time).format('YYYY/MM/DD HH:mm');
          x.url = x.head_picture ? JSON.parse(x.head_picture)[0].url : this.headImg;
          return x;
        })
        this.pingLunList = this.pingLunList.concat(arryList);
        // console.log('评论列表', this.pingLunList);
        // 加载状态结束
        this.loading = false;
        this.getPingLunNum(this.avtivesId);
      }).catch(err=>{
        // 加载状态结束
        this.finished = true;
        this.loading = false;
        this.pageNum = this.pageNum - 1;
        console.log('err',err);
      });
    },
    // 评论总条数
    async getPingLunNum() {
      const params = {
        data_id: this.avtivesId
      }
      let { data } = await queryPingLunNum(params);
      // console.log('评论总条数data', data);
      this.allPingLunLength = data[0].num;
      // 数据全部加载完成
      if (this.pingLunList.length >= this.allPingLunLength) {
        this.finished = true;
      }
    },
    // 活动总结表
    async getActiveOver() {
      const params = { data_id: this.avtivesId };
      let { data } = await queryActiveOver(params);
      // this.activeOverMsg = data[0];
      data.forEach(x => {
        this.activeOverImgList = x.picture ? JSON.parse(x.picture).map(imgs=>{
          return imgs.url;
        }) : '';
        x.summarize_time = moment(x.summarize_time).format('YYYY/MM/DD HH:mm');
        this.activeOverMsg = x;
      });
      // console.log('活动总结表', this.activeOverMsg);
    },
    // 浏览次数加一
    queryLiuLanNum(){
      const params = { data_id: this.avtivesId }
      queryLiuLanNum(params);
    },
  },
  beforeDestroy() {
    window.componentCenter?.removeInstance(this.customConfig?.componentId);
  }
};
</script>

<style lang="less" scoped>
.app-secondary {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100vh !important;
  background: #FAFAFC;
  overflow-y: scroll;
  &::-webkit-scrollbar {
    width: 0;
  }
  .activeHead {
    width: 100%;
    background: #FFFFFF;
    box-shadow: 0px 2px 10px 0px #F2F2F6;
    .headBanner {
      width: 100%;
      height: 162px;
    }
    .headTitle {
      margin: 11px 11px 0 10px;
      font-size: 16px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #333333;
      line-height: 22px;
      text-shadow: 0px 2px 10px #F2F2F6;
    }
    .concentInfo {
      margin: 13px 11px 13px 10px;
      display: flex;
      flex: 1;
      align-items: center;
      justify-content: space-between;
      .liulanText {
        display: flex;
        flex-wrap: nowrap;
        font-size: 12px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #999999;
        line-height: 17px;
        text-shadow: 0px 2px 10px #F2F2F6;
        .line {
          margin: 0 10px;
        }
      }
      .paoMingBox {
        display: flex;
        align-items: center;
        .imgList {
          display: flex;
          align-items: center;
          .userImg {
            margin-left: -6px;
            width: 22px;
            height: 22px;
            border-radius: 50%;
          }
        }
        .signUpBox {
          margin-left: 4px;
          width: 63px;
          height: 17px;
          font-size: 12px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #999999;
          line-height: 17px;
          text-shadow: 0px 2px 10px #F2F2F6;
          .signUp {
            color: #3296FA;
          }
        }
      }
    }
    .lineBox {
      margin: 0 10px;
      border-top: 1px solid #F0F0F0;
      box-shadow: 0px 2px 10px 0px #F2F2F6;
    }
    .publisherBox {
      margin: 16px 10px 14px 10px;
      display: flex;
      align-items: center;
      height: 20px;
      .publisherImg {
        width: 14px;
        height: 15px;
      }
      .publisher{
        margin-left: 3px;
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #333333;
        line-height: 20px;
      }
      .guanzhuBtn {
        color: #FFFFFF;
        width: 80px;
        margin-left: auto;
        font-size: 14px;
      }
    }
  }
  .activeMsg {
    margin-top: 10px;
    padding: 10px 13px;
    background: #FFFFFF;
    .msgItem {
      margin-top: 10px;
      display: flex;
      align-items: center;
      .textTitle {
        font-size: 14px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 600;
        color: #333333;
        line-height: 20px;
      }
      .textCon {
        font-weight: 500;
        color: #373737;
      }
      .phoneIcon {
        margin-left: 8px;
        font-size: 16px;
        color: #3296FA;
      }
      .mapArrow {
        margin-left: 8px;
        width: 12px;
        height: 12px;
      }
    }
  }
  .activeInfo {
    margin-top: 10px;
    padding: 15px 10px 10px 10px;
    background: #FFFFFF;
    .title {
      height: 22px;
      font-size: 16px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 600;
      color: #333333;
      line-height: 22px;
    }
    .activeCon {
      margin-top: 9px;
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #333333;
      line-height: 24px;
    }
  }
  .pingLunBox {
    width: 100%;
    margin-top: 10px;
    padding: 15px 10px 18px 10px;
    background: #FFFFFF;
    .pingLunBoTtitle {
      height: 22px;
      font-size: 16px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 600;
      color: #333333;
      line-height: 22px;
    }
    .pingLunList {
      width: 100%;
      margin-top: 17px;
      height: 360px;
      overflow-y: scroll;
      &::-webkit-scrollbar {
        width: 0;
      }
      .pingLunItem {
        width: 100%;
        margin-top: 16px;
        display: flex;
        .pingLunImg {
          width: 35px;
          height: 35px;
          border-radius: 50%;
        }
        .pingLunCon {
          width: calc(100% - 50px);
          margin-left: 10px;
          padding-bottom: 16px;
          border-bottom: 1px solid #F0F0F0;
          .userNameBox {
            display: flex;
            flex: 1;
            align-items: center;
            justify-content: space-between;
            .userInfo {
              width: 150px;
              height: 21px;
              font-size: 15px;
              font-family: PingFangSC-Medium, PingFang SC;
              font-weight: 500;
              color: #333333;
              line-height: 21px;
              overflow: hidden;
            }
            .pingTime {
              height: 17px;
              font-size: 12px;
              font-family: PingFangSC-Regular, PingFang SC;
              font-weight: 400;
              color: #999999;
              line-height: 17px;
            }
          }
          .pngCon {
            margin-top: 6px;
            font-size: 14px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #333333;
            line-height: 20px;
            white-space: pre-wrap;
            word-break: break-all;
          }
        }
      }
    }
    .notMore {
      margin-top: 30px;
      text-align: center;
      height: 17px;
      font-size: 12px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #999999;
      line-height: 17px;
    }
  }
  .summarize {
    margin-top: 10px;
    padding: 15px 10px 10px 10px;
    background: #FFFFFF;
    .summarizeTtitle {
      height: 22px;
      font-size: 16px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 600;
      color: #333333;
      line-height: 22px;
    }
    .summarizeImgBox {
      margin-top: 11px;
      display: inline-block;
      height: 30px;
      line-height: 30px;
      background: #FFF4F1;
      border-radius: 16px;
      .imgSummarize {
        width: 30px;
        height: 30px;
        border-radius: 50%;
        vertical-align: middle;
      }
      .imgTitle {
        display: inline-block;
        margin-left: 5px;
        margin-right: 15px;
        height: 30px;
        font-size: 14px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #333333;
        line-height: 30px;
        vertical-align: middle;
      }
    }
    .summarizeMsg {
      margin-top: 10px;
      height: 20px;
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #333333;
      line-height: 20px;
    }
    .summarizeSub {
      margin-top: 3px;
      display: flex;
      flex: 1;
      .subTime {
        height: 14px;
        font-size: 10px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #666666;
        line-height: 14px;
      }
    }
    .summarizeInfoImgBox {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      .summarizeInfoImg {
        margin-top: 10px;
        width: 32%;
        height: 84px;
        border-radius: 4px;
      }
    }
    .overImgBox {
      width: 100%;
      .overImg {
        width: 100%;
        margin-top: 10px;
        border-radius: 4px;
      }
    }
  }
  .summarizeOver {
    margin-top: 10px;
    min-height: 52px;
    padding: 10px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: #FFFFFF;
    .summarizeTtitle {
        height: 22px;
        font-size: 16px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 600;
        color: #333333;
        line-height: 22px;
      }
      .subOver {
        display: flex;
        align-items: center;
        height: 20px;
        font-size: 14px;
        font-family: PingFangSC-Semibold, PingFang SC;
        font-weight: 600;
        color: #3296FA;
        line-height: 20px;
    
        .subOverImg {
          margin-left: 4px;
          width: 16px;
          height: 16px;
        }
      }
  }
  .bottomBox {
    padding: 12px 11px 20px 15px;
    margin-top: 10px;
    display: flex;
    flex: 1;
    align-items: center;
    background: #FFFFFF;
    border-top: 1px solid #F0F0F0;
    .btnBoxLeft {
      display: flex;
      flex: 1;
      align-items: center;
      justify-content: space-between;
      .btnBox {
        display: flex;
        flex-direction: column;
        align-items: center;
        .collectStar {
          font-size: 25px;
          color: #bbbbbb;
        }
        .isCollectStar {
          font-size: 25px;
          color: #ff9000;
        }
        .collectText {
          margin-top: 10px;
          height: 20px;
          font-size: 14px;
          font-weight: 400;
          color: #6f6f6f;
          line-height: 20px;
        }
        .isPraiseStar {
          width: 25px;
          width: 25px;
        }
      }
      .lineBox {
        width: 1px;
        height: 21px;
        border-left: 1px solid #F0F0F0;
      }
    }
    .paoMingBtn {
      color: #FFFFFF;
      margin-left: 16px;
      width: 190px;
      min-width: 180px;
      height: 46px;
      font-size: 16px;
      /deep/.van-button__text {
        letter-spacing: 3px !important;
      }
    }
  }
  /deep/.van-popup{
    .van-field__word-limit {
      text-align: left !important;;
    }
    .fabuBtn {
      position: absolute;
      right: 10px;
      top: 320px;
      width: 72px;
      height: 24px;
      background: #BBBBBB;
      color: #FFFFFF;
    }
  }
}
</style>
