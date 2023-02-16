<template>
  <div :id="id" ref="app-secondary" class="app-secondary" :style="{ display: 'flex', justifyContent: 'center'}">
    <div :style="{width:this.customConfig.宽度 || '100%'}">
      <div :style="{ display: 'flex', justifyContent: this.customConfig.标题位置 || 'start' }">
        <span class="articleTitle"> {{ this.articleInfo[this.customConfig.标题字段]  }}</span>
      </div>
      <div class="userInfo" :style="{ justifyContent: this.customConfig.信息位置 || 'start' }">
        <img class="userImg" v-show="!imgSrc" height="36px" width="36px" src="../../../pluginTemp/images/user.png" />
        <img class="userImg" v-show="imgSrc" height="36px" width="36px" :src="imgSrc" />
        <div>
          <span class="userName"> {{ this.articleInfo.userName }} </span>
          <br />
          <span class="articleTime"> 创建于{{ this.articleInfo[this.customConfig.创建时间字段] }} 阅读 {{ this.readNum }} </span>
        </div>
      </div>
      <div class="articleHtml" v-html="this.articleInfo[this.customConfig.正文字段]"></div>
    </div>
  </div>
</template>

<script>
import { handClickRecord, getAssetData } from "../../api/asset";
import Utils from "../../utils/index";
import moment from "moment";
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
      readNum: "",
      articleDataId: "",
      articleInfo: {},
      imgSrc: "",
      vhtml:
        "<p style='color:red'>        为迎接党的二十大胜利召开，今年以来，历下区委组织部聚焦“喜迎二十大，建功新时代”主题，深入开展系列活动，各级党组织和党员在政治建设中筑牢思想根基，在攻坚克难中凝聚磅礴力量，在践行宗旨中彰显初心使命，党员干部干事创业精气神全面提振，人民群众获得感幸福感明显提高。在党的二十大即将胜利召开之际，“历下先锋”微信公众号开设“党的二十大”特别专栏，展现各党（工）委“凝心聚力谋发展、奋发作为向未来”的良好精神风貌，以实际行动和优异成绩向党的二十大献礼。 济南历下城市发展集团聚焦“喜迎二十大，建功新时代”系列活动，勇于担当，奋发作为，以实际行动迎接党的二十大胜利召开。 开展“庆七一，喜迎二十大”主题教育系列活动，组织党员赴大峰山党性教育基地、陈叶翠同志事迹展馆等参观学习，让党员“动”起来，让党课“活”起来。扎实开展理论大学习，积极开展“励新党课”活动，集团党委书记带头，各级党组织书记累计讲党课10余次，教育党员130余人次。 组织6名青年党员，成立“疫情防控青年突击队”，投身疫情防控一线，参与社区核酸检测、重点人员排查等工作，以实干担当彰显党员本色。组织广大党员干部职工定期下沉“双报到”社区，开展“双创”活动，参加志愿服务活动160余人次，实现双向资源共享、互助共建。 扎实开展“转作风、抓落实、争一流、促发展”专项活动，策划实施“作风建设”大学习、“回望初心”政德教育等10余项特色活动，以优良作风推动各项工作高质量发展。组织观看《法治中国》《正风反腐就在身边》等警示教育片，筑牢干部职工拒腐防变思想防线。</p>",
    };
  },
  mounted() {
    //此方法封装了事件注册，不可删除
    this.mainInit(this);
    this.getArticleInfo();
  },
  methods: {
    getArticleInfo() {
      // this.appVariables = [
      //   {
      //     id: "dda34335-82af-4a5e-a022-9ce2657f823d",
      //     name: "sad",
      //     data_type: 0,
      //     default_value: "0218d1dbb1924b37b32e8332dfceff46",
      //   },
      // ];
      console.log(this.customConfig);
      this.appVariables.forEach((item, index) => {
        if (item.name == this.customConfig.变量名) {
          this.articleDataId = item.default_value;
          let paramsInfo = {
            assetId: this.customConfig.文章资产id,
          };
          let requestInfo = {
            filters: [
              {
                column: "data_id",
                datatype: 0,
                type: 10,
                compareObj: this.articleDataId,
              },
            ],
          };
          getAssetData(paramsInfo, requestInfo).then((respInfo) => {
            this.articleInfo = Utils.translatePlatformDataToJsonArray(respInfo)[0];
            this.articleInfo[this.customConfig.创建时间字段] = moment(this.articleInfo[this.customConfig.创建时间字段]).format("YYYY-MM-DD");
            console.log(Utils.translatePlatformDataToJsonArray(respInfo));
            this.getImg();
            this.handClickRecord();
          });
        }
      });
    },
    getImg() {
      let imgparams = {
        assetId: this.customConfig.sys_account资产,
      };
      let imgInfo = {
        filters: [
          {
            column: "code",
            datatype: 0,
            type: 10,
            compareObj: this.articleInfo[this.customConfig.创建人字段],
          },
        ],
      };
      getAssetData(imgparams, imgInfo).then((imgRes) => {
        this.imgSrc = Utils.translatePlatformDataToJsonArray(imgRes)[0].photo;
        this.articleInfo.userName = Utils.translatePlatformDataToJsonArray(imgRes)[0].name;
        console.log(this.imgSrc, this.articleInfo.userName);
      });
    },
    handClickRecord() {
      let message = {
        content_id: this.articleDataId,
        type: this.articleInfo[this.customConfig.type字段],
        title: this.articleInfo[this.customConfig.标题字段],
        user_id: window.currentUser.id,
        user_name: window.currentUser.name,
        inform: this.customConfig.inform资产,
        click_record_log: this.customConfig.click_record_log资产,
      };
      handClickRecord(message).then((res) => {
        let info = {
          assetId: this.customConfig.click_record_log资产,
        };
        let message2 = {
          filters: [
            {
              column: "content_id",
              datatype: 0,
              type: 10,
              compareObj: this.articleDataId,
            },
          ],
        };
        getAssetData(info, message2).then((resp) => {
          this.readNum = resp.data[2];
        });
      });
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
.articleTitle {
  font-size: 24px;
}
.userInfo {
  width: 100%;
  height: 50px;
  margin-top: 12px;
  display: flex;
  .userName {
    font-size: 14px;
  }
  .articleTime {
    font-size: 12px;
  }
  .userImg {
    border: 1px solid #f5f5f5;
    border-radius: 50%;
    margin-top: 4px;
    margin-right: 12px;
  }
}
</style>
