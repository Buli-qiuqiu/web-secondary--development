<template>
  <div :id="id" class="activity-secondary">
    <div class="listBox">
      <van-list v-model="loading" :finished="finished" offset="10" finished-text="没有更多了" :immediate-check="false" @load="queryActive">
        <div class="activityBox" v-for="item,index in activityList" :key="item.data_id">
          <img class="headImg" :src="item.headImage" alt="">
          <div class="cardBox">
            <div class="cardTitle-right">
              <span class="card-name">{{ item.microhome_name }}</span>
              <span class="card-time">{{ moment(item.creation_time).format("YYYY-MM-DD hh:mm") }}</span>
            </div>
            <div class="cardContent">
              <!-- <div class="textContent" v-html="item.publish_content"></div>
              <span class="textMore">全文</span>
              <span class="textMore">收起</span> -->
              <PublishCom :concent="item.publish_content" :keyRef="item.data_id"/>
              <div v-if="item.publish_image.length > 1" class="imgContent">
                <img class="conentImg" v-for="imgs,inx in item.publish_image" :key="inx" :src="imgs.url" alt="">
              </div>
              <div v-else class="imgContent">
                <img class="conentImgOnly" v-for="imgs,inx in item.publish_image" :key="inx" :src="imgs.url" alt="">
              </div>
            </div>
            <div class="belikeBox">
              <div class="handelbar">
                <img v-if="item.currentuser_status == 0" class="handekImg" src="../../../pluginTemp/images/noLike.png" alt="">
                <img v-if="item.currentuser_status == 1" class="handekImg" src="../../../pluginTemp/images/beLike.png" alt="">
                <span @click="likeAddHandel(item, index)">点赞&nbsp;&nbsp;({{ item.likenum }})</span>
              </div>
              <div class="handelbar">
                <img class="handekImg" src="../../../pluginTemp/images/pinglun.png" alt="">
                <span @click="pinglunHandel(item.data_id, '')">评论&nbsp;&nbsp;({{ item.replynum }})</span>
              </div>
            </div>
            <div class="bottomBox">
              <div v-show="item.likeList.length > 0" class="likePeople">
                <img class="likeImg" src="../../../pluginTemp/images/beLike.png" alt="">
                <span class="likePeoName" v-for="peo,peoind in item.likeList" :key="peo.data_id">{{ peo.like_people_name }}{{ peoind !== item.likeList.length - 1 ? '、' : '' }}</span>
              </div>
              <div v-show="item.replynum > 0" class="commentBox">
                <div v-for="rep in item.replyList" :key="rep.data_id" class="conmentItem" @click="pinglunHandelFun(rep, item.data_id)">
                  <span class="commPeo">{{ rep.reply_people_name }}</span>
                  <span v-if="rep.reply_body_name">回复</span>
                  <span v-if="rep.reply_body_name" class="commPeo">{{ rep.reply_body_name}}</span>
                  <span class="comcomtent">：{{ rep.publish_content }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </van-list>
    </div>
    <van-popup v-model="isPingLun" position="bottom">
      <div class="fieldBox">
        <van-field v-model="pingLunMessage" rows="1" maxlength="200" autosize type="textarea" placeholder="" />
        <van-button class="fabuBtn" round size="mini" type="default" @click="addPingLun">发布</van-button>
      </div>
    </van-popup>
    <van-popup v-model="isDelPingLun" position="bottom">
      <div class="fieldBox">
        <van-button class="delBtn" block type="default" @click="delPingLun()">删除</van-button>
      </div>
    </van-popup>
  </div>
</template>

<script>
import Vue from 'vue';
import moment from 'moment';
import { List, Popup, Button, Field } from 'vant';
import PublishCom from "./publishCon.vue"
// import oneImg from "../../../pluginTemp/images/adminIcon.png";

import { 
  isLogin,
  queryUser,
  queryActiveInfo,
  queryActiveLength,
  queryDianZanData,
  queryAddDianZan,
  queryDelDianZanData,
  queryDelDianZan,
  queryPingData,
  queryAddPing,
  queryDelPingData,
  queryDelPing,
  queryPingLunData,
 } from "../../api/asset";

Vue.use(List);
Vue.use(Popup);
Vue.use(Button);
Vue.use(Field);

const getQueryString = name => {
  const reg = new RegExp(name + "=([^&]*)(&|$)", "i");
  const r = window.location.search.substr(1).match(reg);
  if (r != null) return r[1];
  return "";
};

export default {
  name: "Main",
  components: { PublishCom },
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
      adminInfoId: {},
      moment, 
      isPingLun: false, // 评论弹窗
      isDelPingLun: false,
      isDelPingLunId: "",
      pingLunMessage: "",  // 评论内容
      isActiveId: "", // 评论ID
      isPingLunBody: "",
      pageSize: 10,
      pageNum: 1,
      loading: false,
      finished: false,
      activityList: [
        // {
        //   data_id: "001",
        //   microhome_name: "四季微春家",
        //   creation_time: new Date(),
        //   publish_content: "<p>9月22日，千秋镇开展了“强国复兴有我-绿色阅读 放飞梦想”护苗2022绿书签宣传进校园。黄沙港镇洋中村党总支组织志愿者开展了“迎佳节 送温暖”活动，送上党的关怀与温暖。</p><p>新安村开展“庆元宵，送温暖”活动，邀请村民、孩子们一起一起体验节日魅力。</p>",
        //   publish_image: [{ url: oneImg }],
        //   currentuser_status: "0",
        //   likenum: 3,
        //   likeList: [
        //     {
        //       data_id: "001",
        //       like_people_name: "奥妈",
        //       creation_time: new Date(),
        //     },
        //     {
        //       data_id: "002",
        //       like_people_name: "雨后的彩虹",
        //       creation_time: new Date(),
        //     },
        //     {
        //       data_id: "003",
        //       like_people_name: "sixianjiang",
        //       creation_time: new Date(),
        //     },
        //     {
        //       data_id: "004",
        //       like_people_name: "绿色阅读",
        //       creation_time: new Date(),
        //     },
        //     {
        //       data_id: "005",
        //       like_people_name: "千秋镇",
        //       creation_time: new Date(),
        //     },
        //     {
        //       data_id: "006",
        //       like_people_name: "黄沙港",
        //       creation_time: new Date(),
        //     },
        //     {
        //       data_id: "007",
        //       like_people_name: "迎佳节",
        //       creation_time: new Date(),
        //     },
        //     {
        //       data_id: "008",
        //       like_people_name: "送温暖",
        //       creation_time: new Date(),
        //     }
        //   ],
        //   replynum: 10,
        //   replyList: [
        //     {
        //       data_id: "001",
        //       reply_people_name: "奥妈",
        //       reply_body_name: "雨后的彩虹",
        //       creation_time: new Date(),
        //       publish_content: "感谢群众的支持，以 后我们会做的更好，更好服务群众。"
        //     },
        //     {
        //       data_id: "002",
        //       reply_people_name: "雨后的彩虹",
        //       reply_body_name: "雨后的彩虹",
        //       creation_time: new Date(),
        //       publish_content: "感谢群众的支持，以 后我们会做的更好，更好服务群众。"
        //     },
        //     {
        //       data_id: "003",
        //       reply_people_name: "千秋镇",
        //       reply_body_name: "",
        //       creation_time: new Date(),
        //       publish_content: "感谢群众的支持，以 后我们会做的更好，更好服务群众。"
        //     }
        //   ]
        // }
      ],
      paramsList: []
    };
  },
  mounted() {
    //此方法封装了事件注册，不可删除
    this.mainInit(this);
    this.queryUserInfo();
    this.paramsList = this.customConfig?.paramsList ? this.customConfig.paramsList : [];
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
        this.queryActive();
      }).catch(err => {
        this.adminInfo = {};
        this.adminInfoId = "";
      });
    },
    // 获取活动信息
    queryActive() {
      let params = {
        pageSize: this.pageSize,
        pageNum: this.pageNum,
        current_user: this.adminInfoId,
      }
      this.paramsList.forEach(x=>{
        params[x] = getQueryString(x);
      })
      this.loading = true;
      // 活动总条数
      // queryActiveLength({ data_id: params['officeid'] }).then(res=>{
      //   let { dynamic_num } = res.data[0];
      //   this.loading = true;
      //   queryActiveInfo(params).then(info => {
      //     let { data } = info
      //     if (data) {
      //       data.forEach(x=>{
      //         x.publish_image = JSON.parse(x.publish_image);
      //       })
      //       // this.activityList = this.activityList.concat(data);
      //       this.loading = true;
      //       this.activityList = data;
      //       // 数据全部加载完成
      //       if (this.activityList.length > dynamic_num) {
      //         this.finished = true;
      //       }
      //       this.loading = false;
      //     }
      //   })
      // }).catch(err=>{
      //   console.log(err);
      // })
      queryActiveInfo(params).then(info => {
        let { data } = info
        if (data) {
          data.forEach(x => {
            x.publish_image = x.publish_image != undefined ? JSON.parse(x.publish_image) : []
            x.headImage = x.microhome_image != undefined ? JSON.parse(x.microhome_image)[0].url : ""
          })
          this.loading = true;
          this.activityList = this.activityList.concat(data);
          // 数据全部加载完成
          this.loading = false;
          this.pageNum += 1;
          if (data.length < this.pageSize) {
            this.finished = true;
            this.pageNum -= 1;
          }
        }
      }).catch(err=>{
        console.log(err);
      })
    },
    // 点赞如表
    likeAddHandel(val,index) {
      console.log('val', val);
      let params = {
        data_id: val.data_id,
        user_id: this.adminInfoId
      }
      if (val.currentuser_status == 0) {
        queryDianZanData(params).then(res=>{
          console.log("点赞", res);
          if (res.status == 200) {
            this.activityList[index].currentuser_status = 1;
            this.activityList[index].likenum = this.activityList[index].likenum + 1;
            let obj = {
              like_people: this.adminInfoId,
              like_people_name: this.adminInfo.name
            }
            this.activityList[index].likeList.push(obj);
          }
        });
        this.likeAdd(params.data_id);
      }else {
        queryDelDianZanData(params).then(res => {
          console.log("取消点赞", res);
          if (res.status == 200) {
            this.activityList[index].currentuser_status = 0;
            this.activityList[index].likenum = this.activityList[index].likenum - 1;
            let list = this.activityList[index].likeList;
            list.forEach((x,inx)=>{
              if (x['like_people'] == this.adminInfoId) {
                list.splice(inx,1)
              }
            });
            this.activityList[index].likeList = list;
          }
        });
        this.likeDel(params.data_id);
      }
    },
    // 点赞+1
    async likeAdd(val) {
      await queryAddDianZan({ data_id: val})
    },
    // 点赞-1
    async likeDel(val) {
      await queryDelDianZan({ data_id: val })
    },
    // 评论
    pinglunHandel(id,body) {
      this.isPingLun = true;
      this.isActiveId = id;
      this.isPingLunBody = body;
    },
    // 点击评论
    pinglunHandelFun(val,id) {
      console.log(val);
      if (val.reply_people == this.adminInfoId) {
        this.isDelPingLun = true;
        this.isDelPingLunId = val.data_id;
        this.isActiveId = id;
      }else {
        console.log('1111111111');
        this.pinglunHandel(id, val.reply_body);
      }
    },
    // 评论入表
    addPingLun(){
      let params = {
        reply_body: this.isPingLunBody,
        content: this.pingLunMessage,
        data_id: this.isActiveId,
        user_id: this.adminInfoId,
      }
      queryPingData(params).then( res =>{
        console.log("插入评论",res);
        if (res.status == 200) {
          queryAddPing({ data_id: this.isActiveId });
          this.queryPingLunDataFun();
          this.isPingLun = false;
          this.pingLunMessage = "";
        }
      }).catch(err=>{
        console.log(err);
      })
    },
    // 单个活动评论数量
    queryPingLunDataFun(){
      queryPingLunData({ data_id: this.isActiveId }).then(res=>{
        console.log("looklook",res);
        let {data} = res;
        this.activityList.forEach(x=>{
          if (x == this.isActiveId) {
            this.activityList.replyList = data;
          }
        })
        this.isActiveId = "";
        this.isDelPingLunId = "";
      })
    },
    // 删除
    delPingLun(){
      queryDelPingData({ data_id: this.isDelPingLunId }).then(res=>{
        if (res.status == 200) {
          this.isDelPingLun = false;
          this.queryPingLunDataFun();
          queryDelPing({ data_id: this.isDelPingLunId });
        }
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
.activity-secondary {
  width: 100%;
  height: 100%;
  background: #fafafc;
  display: flex;
  flex-direction: column;
  .listBox {
    padding: 10px;
    width: 100%;
    height: 100%;
    flex: 1;
    overflow-y: scroll;
    &::-webkit-scrollbar {
      width: 0;
    }
    .activityBox {
      padding: 10px;
      margin-top: 10px;
      // width: calc(100% - 40px);
      width: 100%;
      display: flex;
      background: #FFFFFF;
      border-radius: 8px;
      .headImg {
        width: 38px;
        height: 38px;
        border-radius: 50%;
        margin-right: 8px;
      }
      .cardBox {
        width: calc(100% - 68px);
        .cardTitle-right {
          display: flex;
          height: 38px;
          line-height: 38px;
          flex-direction: column;
          .card-name {
            height: 20px;
            font-size: 14px;
            font-family: PingFangSC-Medium, PingFang SC;
            font-weight: 500;
            color: #333333;
            line-height: 20px;
          }
          .card-time {
            height: 14px;
            font-size: 10px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #999999;
            line-height: 14px;
          }
        }
        .cardContent {
          margin-top: 10px;
          .textContent {
            font-size: 14px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #333333;
            line-height: 20px;
            overflow: hidden;
            text-overflow: ellipsis;
            -webkit-line-clamp: 5;
            display: -webkit-box;
            -webkit-box-orient: vertical;
          }
          .textMore {
            font-size: 14px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #3d72a6;
            line-height: 20px;
          }
          .imgContent {
            margin-top: 8px;
            width: 100%;
            display: flex;
            flex-wrap: wrap;
            .conentImg {
              margin-top: 8px;
              width: 80px;
              height: 80px;
              border-radius: 4px;
              &:nth-child(2) {
                margin-left: 8px;
                margin-right: 8px;
              }
              &:nth-child(5) {
                margin-left: 8px;
                margin-right: 8px;
              }
              &:nth-child(8) {
                margin-left: 8px;
                margin-right: 8px;
              }
            }
            .conentImgOnly {
              margin-top: 8px;
              width: 100%;
              height: 100%;
              border-radius: 4px;
            }
          }
        }
        .belikeBox {
          margin-top: 8px;
          display: flex;
          align-items: center;
          .handelbar {
            display: flex;
            align-items: center;
            margin-right: 15px;
            height: 17px;
            font-size: 12px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #666666;
            line-height: 17px;
            .handekImg {
              margin-right: 4px;
              width: 12px;
              height: 12px;
            }
          }
        }
        .bottomBox {
          margin-top: 10px;
          width: 100%;
          border-radius: 2px;
          background: #F5F5F5;
          .likePeople {
            padding: 10px;
            font-size: 12px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #396FA4;
            line-height: 12px;
            border-bottom: 1px solid #EBEBEB;
            overflow: hidden;
            text-overflow: ellipsis;
            -webkit-line-clamp: 5;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            .likeImg {
              margin-right: 4px;
              width: 12px;
              height: 12px;
            }
          }
          .commentBox {
            padding: 8px;
            .conmentItem {
              margin-top: 5px;
              font-size: 14px;
              font-family: PingFangSC-Regular, PingFang SC;
              font-weight: 400;
              color: #333333;
              line-height: 20px;
              .commPeo {
                color: #3296FA;
              }
              .comcomtent {
                word-break: break-all;
                white-space: pre-wrap;
              }
            }
          }
        }
      }
    }
  }
  /deep/.van-popup {
    min-height: 40px;
    .fieldBox {
      display: flex;
      align-items: flex-end;
      .van-field__word-limit {
        text-align: left !important;
      }
      .fabuBtn {
        margin-bottom: 10px;
        width: 72px;
        height: 24px;
        background: #BBBBBB;
        color: #FFFFFF;
      }
    }
  }
}
</style>
