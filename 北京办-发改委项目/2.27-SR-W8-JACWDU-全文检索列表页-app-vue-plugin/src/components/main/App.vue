<template>
  <div :id="id" ref="app-secondary" style="height: 100%; overflow-y: auto">
    <div class="main_Assembly" :style="{ height: isSearch ? '1967px' : '1529px' }">
      <div class="main_Assembly_Center">
        <img src="../../../pluginTemp/images/logoTitle.png" class="main_Assembly_Center_LogoTitle" alt="" />
        <img src="../../../pluginTemp/images/people.png" class="main_Assembly_Center_People" alt="" />
        <el-input placeholder="请输入您要查询的信息" v-model="searchData" class="input-with-select main_Assembly_Center_Search">
          <div slot="prepend" style="width: 100%; height: 100%; display: flex">
            <el-select v-model="selectData" class="main_Assembly_Center_Select" placeholder="全部" style="pointer-events: none"> </el-select>
            <i class="el-icon-caret-bottom"></i>
            <div class="main_Assembly_Center_Line"></div>
          </div>
          <img src="../../../pluginTemp/images/searchBtn.png" @click="searchList" class="main_Assembly_Center_Search_Btn" slot="append" alt="" />
        </el-input>
        <div class="main_Assembly_Center_Radio">
          <el-radio v-model="radioData" @change="searchList" class="firstRadio" label="0">精准搜索</el-radio>
          <el-radio v-model="radioData" @change="searchList" label="1">模糊搜索</el-radio>
        </div>
        <el-card class="main_Assembly_Center_Card" :style="{ height: isSearch ? '1334px' : '928px' }">
          <img v-show="!isSearch" src="../../../pluginTemp/images/listTitle.png" width="1120px" height="80px" alt="" />
          <div v-show="isSearch" class="main_Assembly_Center_Card_Select">
            <div class="Center_Card_Select">
              <div class="Center_Card_Select_Left">
                <img src="../../../pluginTemp/images/position.png" alt="" />
                <span>位置：</span>
              </div>
              <div class="Center_Card_Select_Right">
                <div :class="{ selectedItem: item.selected }" @click="selectItem(item, 'position')" v-for="(item, index) in positionSelectList" :key="index">{{ item.name }}</div>
              </div>
            </div>
            <div class="Center_Card_Select">
              <div class="Center_Card_Select_Left">
                <img src="../../../pluginTemp/images/home.png" alt="" />
                <span>场合：</span>
              </div>
              <div class="Center_Card_Select_Right">
                <div :class="{ selectedItem: item.selected }" @click="selectItem(item, 'occasion')" v-for="(item, index) in occasionSelectList" :key="index">{{ item.name }}</div>
              </div>
            </div>
            <div class="Center_Card_Select">
              <div class="Center_Card_Select_Left">
                <img src="../../../pluginTemp/images/all.png" alt="" />
                <span>主题：</span>
              </div>
              <div class="Center_Card_Select_Right">
                <div :class="{ selectedItem: item.selected }" @click="selectItem(item, 'theme')" v-for="(item, index) in themeSelectList" :key="index">{{ item.name }}</div>
              </div>
            </div>
            <div class="Center_Card_Select">
              <div class="Center_Card_Select_Left">
                <img src="../../../pluginTemp/images/history.png" alt="" />
                <span>时间：</span>
              </div>
              <div class="Center_Card_Select_Right">
                <div :class="{ selectedItem: item.selected }" @click="selectItem(item, 'time')" v-for="(item, index) in timeSelectList" :key="index">{{ item.name }}</div>
              </div>
            </div>
            <div class="Center_Card_Select">
              <div class="Center_Card_Select_Left">
                <img src="../../../pluginTemp/images/source.png" alt="" />
                <span>来源：</span>
              </div>
              <div class="Center_Card_Select_Right">
                <div
                  :style="{ width: item.name == '不限' ? '56px' : '96px' }"
                  :class="{ selectedItem: item.selected }"
                  @click="selectItem(item, 'source')"
                  v-for="(item, index) in sourceSelectList"
                  :key="index"
                >
                  {{ item.name }}
                </div>
              </div>
            </div>
          </div>
          <div v-show="isSearch" class="main_Assembly_Center_Card_Result">
            <div class="Center_Card_Result_Left">
              <span
                >检索&nbsp;&nbsp;<span class="Center_Card_Result_Left_Red">{{ this.showSearchData }}</span
                >&nbsp;&nbsp;&nbsp;关键词，共<span class="Center_Card_Result_Left_Red">{{ this.total }}</span
                >条结果</span
              >
            </div>
            <div class="Center_Card_Result_Right">
              <div class="Center_Card_Result_Right_Time" @click="sortClick('left')">
                按时间排序<img src="../../../pluginTemp/images/default.png" v-show="leftSortShow == null" alt="" />
                <img src="../../../pluginTemp/images/sort.png" v-show="leftSortShow == true" alt="" /><img
                  v-show="leftSortShow == false"
                  src="../../../pluginTemp/images/sort.png"
                  alt=""
                  class="topSort"
                />
              </div>
              &nbsp; 丨 &nbsp;
              <div class="Center_Card_Result_Right_Num" @click="sortClick('right')">
                按频次排序<img src="../../../pluginTemp/images/default.png" v-show="rightSortShow == null" alt="" />
                <img src="../../../pluginTemp/images/sort.png" alt="" v-show="rightSortShow == true" /><img
                  v-show="rightSortShow == false"
                  src="../../../pluginTemp/images/sort.png"
                  alt=""
                  class="topSort"
                />
              </div>
            </div>
          </div>
          <div v-show="!isSearch" class="main_Assembly_Center_Card_List">
            <div class="main_Assembly_Center_Card_List_Item" v-for="(item, index) in startList" @click="addLook(item)" :key="index">
              <div class="Card_List_item_Left">
                <img src="../../../pluginTemp/images/flag.png" width="13px" height="15px" alt="" />
                <span class="Card_List_item_Left_Title">{{ item.title }}</span>
              </div>
              <div class="Card_List_item_Right">
                <span class="Card_List_item_Right_Source">{{ item.source }}</span>
                <span class="Card_List_item_Right_Time">{{ item.startTime }}</span>
              </div>
            </div>
          </div>
          <div v-show="isSearch" class="main_Assembly_Center_Card_ListResult">
            <div class="Center_Card_ListResult_Item" v-for="(item, index) in resultList" :key="index" @click="addLook(item)">
              <div class="Center_Card_ListResult_Item_Title">
                <div class="ListResult_Item_Title_Left" v-html="item.title"></div>
                <div class="ListResult_Item_Title_Right">（关键词：{{ item.count }}次）</div>
              </div>
              <div class="Center_Card_ListResult_Item_Content" v-html="item.episode"></div>
              <div class="Center_Card_ListResult_Item_Source">
                <div class="ListResult_Item_Source_Left">{{ item.source }}</div>
                <div class="ListResult_Item_Source_Right">{{ item.startTime }}</div>
              </div>
            </div>
          </div>
          <el-pagination
            class="main_Assembly_Center_Card_Page"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="pageNum"
            :page-sizes="isSearch ? searchSize : defalutSize"
            :page-size="pageSize"
            layout="  prev, pager, next,sizes, jumper"
            :total="total"
            popper-class="pagePop"
          >
          </el-pagination>
        </el-card>
        <div class="main_Assembly_Center_Look">
          <el-popover placement="top-start" width="360" popper-class="collectPop" trigger="manual" v-model="collotShow">
            <div class="collotPop_Title">
              <span style="color: #373a55; font-size: 16px; line-height: 24px">收藏夹</span>
              <img src="../../../pluginTemp/images/close.png" @click="collotShow = false" alt="" style="float: right" />
            </div>
            <div class="collotPop_List">
              <div v-for="(item, index) in colletList" :key="index" class="collotPop_List_Item" @click="clickRowPop(item)">
                <div>
                  <img src="../../../pluginTemp/images/logo.png" alt="" height="12px" width="12px" /> <span>{{ item.title }}</span>
                </div>
                <img src="../../../pluginTemp/images/star.png" height="12px" width="12px" alt="" />
              </div>
            </div>
            <img src="../../../pluginTemp/images/collect.png" slot="reference" @click="showCollect" alt="" />
          </el-popover>
          <!-- 历史 -->
          <el-popover placement="top-start" width="360" :popper-class="collotShow ? 'historyPop' : 'historyPop2'" trigger="manual" v-model="historyShow">
            <div class="historyPop_Title">
              <span style="color: #373a55; font-size: 16px; line-height: 24px">历史记录</span>
              <img src="../../../pluginTemp/images/close.png" @click="historyShow = false" alt="" style="float: right" />
            </div>
            <div class="historyPop_List">
              <div class="historyPop_List_Six">
                <span style="font-weight: 700; color: #000">最近</span>
                <div v-for="(item, index) in historyRecently" :key="index" class="historyPop_List_Six_Item" @click="clickRowPop(item)">
                  <div>
                    <img src="../../../pluginTemp/images/logo.png" alt="" height="12px" width="12px" /> <span>{{ item.title }}</span>
                  </div>
                  <p>{{ item.time }}</p>
                </div>
              </div>
              <div class="historyPop_List_Week">
                <span style="font-weight: 700; color: #000">最近一周</span>
                <div v-for="(item, index) in historyWeek" :key="index" class="historyPop_List_Six_Item">
                  <div>
                    <img src="../../../pluginTemp/images/logo.png" alt="" height="12px" width="12px" /> <span>{{ item.title }}</span>
                  </div>
                  <p>{{ item.time }}</p>
                </div>
              </div>
              <div class="historyPop_List_Later">
                <span style="font-weight: 700; color: #000">一周前</span>
                <div v-for="(item, index) in historyLater" :key="index" class="historyPop_List_Six_Item">
                  <div>
                    <img src="../../../pluginTemp/images/logo.png" alt="" height="12px" width="12px" /> <span>{{ item.title }}</span>
                  </div>
                  <p>{{ item.time }}</p>
                </div>
              </div>
            </div>
            <img src="../../../pluginTemp/images/historylook.png" slot="reference" @click="showHistory" alt="" />
          </el-popover>
        </div>
        <div v-show="isSearch" class="main_Assembly_Center_Download">
          <img src="../../../pluginTemp/images/allword.png" @click="downloadWord(0)" alt="" />
          <img src="../../../pluginTemp/images/paragraph.png" @click="downloadWord(1)" alt="" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { defalutListApi, downloadWord, searchListApi, addLook, getHistoryList, getColletList } from "../../api/asset";
import { parseTime } from "./time";
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
      searchData: "",
      searchDataList: [],
      selectData: "",
      radioData: "0",
      positionSelectList: [
        {
          name: "不限",
          id: 0,
          selected: true,
        },
        {
          name: "标题",
          id: 1,
          selected: false,
        },
        {
          name: "内容",
          id: 2,
          selected: false,
        },
      ],
      occasionSelectList: [
        {
          name: "不限",
          id: "",
          selected: true,
        },
        {
          name: "讲话",
          id: "讲话",
          selected: false,
        },
        {
          name: "会议",
          id: "会议",
          selected: false,
        },
        {
          name: "活动",
          id: "活动",
          selected: false,
        },
        {
          name: "考察",
          id: "考察",
          selected: false,
        },
        {
          name: "会见",
          id: "会见",
          selected: false,
        },
        {
          name: "出访",
          id: "出访",
          selected: false,
        },
        {
          name: "函电",
          id: "函电",
          selected: false,
        },
        {
          name: "其他",
          id: "其他",
          selected: false,
        },
      ],
      themeSelectList: [
        {
          name: "不限",
          id: "",
          selected: true,
        },
        {
          name: "经济",
          id: "经济",
          selected: false,
        },
        {
          name: "政治",
          id: "政治",
          selected: false,
        },
        {
          name: "文化",
          id: "文化",
          selected: false,
        },
        {
          name: "社会",
          id: "社会",
          selected: false,
        },
        {
          name: "生态",
          id: "生态",
          selected: false,
        },
        {
          name: "生态",
          id: "生态",
          selected: false,
        },
        {
          name: "国防",
          id: "国防",
          selected: false,
        },
        {
          name: "外交",
          id: "外交",
          selected: false,
        },
      ],
      timeSelectList: [
        {
          name: "不限",
          id: "",
          selected: true,
        },
      ],
      sourceSelectList: [
        {
          name: "不限",
          id: "",
          selected: true,
        },
        {
          name: "《人民日报》",
          id: "《人民日报》",
          selected: false,
        },
        {
          name: "《求是》",
          id: "《求是》",
          selected: false,
        },
      ],
      positionSelectData: "",
      occasionSelectData: "",
      themeSelectData: "",
      timeSelectData: "",
      sourceSelectData: "",
      showSearchData: "",
      resultList: [],
      startList: [],
      historyStartList: [],
      historyRecently: [],
      historyWeek: [],
      historyLater: [],
      colletList: [],
      leftSortShow: null,
      rightSortShow: null,
      isSearch: false,
      pageNum: 1,
      pageSize: 10,
      total: 0,
      defalutSize: [10, 20, 50, 100],
      searchSize: [5, 20, 50, 100],
      collotShow: false,
      historyShow: false,
    };
  },
  mounted() {
    this.getDefalutList();
    this.getHistoryList();
    this.getColletList();
    //此方法封装了事件注册，不可删除
    this.mainInit(this);
    // 初始化年份筛选条件
    for (let k = new Date().getFullYear(); k > new Date().getFullYear() - 12; k--) {
      let message = {
        name: k,
        id: k,
        selected: false,
      };
      this.timeSelectList.push(message);
    }
    this.$nextTick(() => {
      let dom = document.createElement("sapn");
      dom.innerText = "跳至";
      let dom2 = document.createElement("sapn");
      dom2.innerText = "页";
      dom.classList.add("pageSpan");
      dom2.classList.add("pageSpan2");
      document.querySelectorAll(".el-pagination__jump")[0].prepend(dom);
      document.querySelectorAll(".el-pagination__jump")[0].append(dom2);
    });
  },
  methods: {
    changeColor(result) {
      result.map((item, index) => {
        if (this.searchDataList.length > 0) {
          this.searchDataList.forEach((element) => {
            let replaceReg = new RegExp(element, "ig");
            let replaceString = `<span style="color: #ed4014">${element}</span>`;
            result[index].title = item.title.replace(replaceReg, replaceString);
            result[index].content = item.content.replace(replaceReg, replaceString);
          });
        }
        /**
         * 使用正则表达式进行全文匹配关键词
         * ig : 表示 全文查找 ,忽略大小写
         *  i : 忽略大小写
         *  g : 全文查找
         *
         * 使用字符串的replace方法进行替换
         * stringObject.replace('被替换的值',替换的值)
         */
      });
    },
    clickRowPop(item) {
      item.id = item.article_id;
      let message = {
        article_id: item.id,
        title: item.title,
      };
      addLook(message).then((res) => {});
      if (this.customConfig.跳转URL && this.customConfig.跳转URL.includes("?")) {
        window.open(`${this.customConfig.跳转URL}&article_id=${item.id}&article_name=${item.title}`);
      } else if (this.customConfig.跳转URL && !this.customConfig.跳转URL.includes("?")) {
        window.open(`${this.customConfig.跳转URL}?article_id=${item.id}&article_name=${item.title}`);
      }
      // this.triggerEvent("titleClick", item);
    },
    getDefalutList() {
      let message = {
        asset_id: this.customConfig.asset_id || "ad1cc731-417c-306e-43c8-db7b0a24eaf5",
        pageNum: this.pageNum,
        pageSize: this.pageSize,
      };
      defalutListApi(message).then((res) => {
        this.startList = res.data.dataList;
        this.total = res.data.totalSize;
      });
    },
    getColletList() {
      getColletList().then((res) => {
        this.colletList = res.data;
        console.log(res);
      });
    },
    searchList() {
      if (!this.searchData.trim()) {
        this.isSearch = false;
        this.pageSize == 5 ? (this.pageSize = 10) : this.pageSize;
        this.getDefalutList();
        return;
      }
      this.positionSelectData = "";
      this.occasionSelectData = "";
      this.themeSelectData = "";
      this.timeSelectData = "";
      this.sourceSelectData = "";
      this.positionSelectList.forEach((ele) => {
        if (ele.selected) {
          this.positionSelectData += ele.id + ",";
        }
      });
      this.positionSelectData = this.positionSelectData.slice(0, this.positionSelectData.length - 1);
      this.occasionSelectList.forEach((ele) => {
        if (ele.selected) {
          this.occasionSelectData += ele.id + ",";
        }
      });
      this.occasionSelectData = this.occasionSelectData.slice(0, this.occasionSelectData.length - 1);
      this.themeSelectList.forEach((ele) => {
        if (ele.selected) {
          this.themeSelectData += ele.id + ",";
        }
      });
      this.themeSelectData = this.themeSelectData.slice(0, this.themeSelectData.length - 1);
      this.timeSelectList.forEach((ele) => {
        if (ele.selected) {
          this.timeSelectData += ele.id + ",";
        }
      });
      this.timeSelectData = this.timeSelectData.slice(0, this.timeSelectData.length - 1);
      this.sourceSelectList.forEach((ele) => {
        if (ele.selected) {
          this.sourceSelectData += ele.id + ",";
        }
      });
      this.sourceSelectData = this.sourceSelectData.slice(0, this.sourceSelectData.length - 1);
      this.showSearchData = this.searchData;
      this.searchDataList = this.searchData.trim().split(" ");

      this.searchData = "";
      this.searchDataList.forEach((item) => {
        if (item != "") {
          this.searchData += item.trim() + " ";
        }
      });
      this.searchData = this.searchData.trim();
      console.log(this.searchData);

      this.isSearch = true;
      this.pageSize == 10 ? (this.pageSize = 5) : this.pageSize;
      let params = {
        asset_id: this.customConfig.asset_id || "ad1cc731-417c-306e-43c8-db7b0a24eaf5",
      };

      let message = {
        articleType: this.occasionSelectData,
        domain: this.themeSelectData,
        year: this.timeSelectData,
        orderByFiled: 0,
        orderByType: "desc",
        position: this.positionSelectData,
        type: Number(this.radioData),
        source: this.sourceSelectData,
        keywords: this.searchData,
        pageNum: this.pageNum,
        pageSize: this.pageSize,
      };
      if (this.leftSortShow == null && this.rightSortShow == null) {
        message.orderByFiled = 0;
        message.orderByType = "desc";
      } else if (this.leftSortShow == true && this.rightSortShow == null) {
        message.orderByFiled = 0;
        message.orderByType = "desc";
      } else if (this.leftSortShow == false && this.rightSortShow == null) {
        message.orderByFiled = 0;
        message.orderByType = "asc";
      } else if (this.leftSortShow == null && this.rightSortShow == true) {
        message.orderByFiled = 1;
        message.orderByType = "desc";
      } else if (this.leftSortShow == null && this.rightSortShow == false) {
        message.orderByFiled = 1;
        message.orderByType = "asc";
      }
      searchListApi(params, message).then((res) => {
        this.resultList = res.data.dataList;
        this.total = res.data.totalSize;
      });
      // this.changeColor(this.resultList);
    },
    getHistoryList() {
      let params = {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
      };
      getHistoryList().then((res) => {
        res.data.forEach((item) => {
          item.time = parseTime(item.record_time, "{h}:{s}");
        });
        this.historyStartList = res.data.sort((a, b) => b.record_time - a.record_time);
        this.historyRecently = this.historyStartList.slice(0, 6);
        let aweek = +new Date() - 604800000;
        this.historyStartList.forEach((item) => {
          if (item.record_time > aweek) {
            this.historyWeek.push(item);
          } else {
            this.historyLater.push(item);
          }
        });
      });
    },
    addLook(item) {
      let message = {
        article_id: item.id,
        title: item.title,
      };
      addLook(message).then((res) => {});
      if (this.customConfig.跳转URL && this.customConfig.跳转URL.includes("?")) {
        window.open(`${this.customConfig.跳转URL}&article_id=${item.id}&article_name=${item.title}`);
      } else if (this.customConfig.跳转URL && !this.customConfig.跳转URL.includes("?")) {
        window.open(`${this.customConfig.跳转URL}?article_id=${item.id}&article_name=${item.title}`);
      }
      this.triggerEvent("wordClick", item);
    },
    selectItem(item, type) {
      if (type == "position") {
        if (item.name != "不限") {
          item.selected = !item.selected;
          this.positionSelectList.forEach((ele) => {
            if (ele.name == "不限") {
              ele.selected = false;
            }
          });
        } else {
          this.positionSelectList.forEach((ele) => {
            ele.selected = false;
          });
          item.selected = true;
        }
        // 判断除了不限如果没选了 就把不限选上
        if (
          this.positionSelectList.filter((ele) => {
            return ele.selected == true;
          }).length == 0
        ) {
          this.positionSelectList.forEach((ele) => {
            if (ele.name == "不限") {
              ele.selected = true;
            }
          });
        }
      } else if (type == "occasion") {
        if (item.name != "不限") {
          item.selected = !item.selected;
          this.occasionSelectList.forEach((ele) => {
            if (ele.name == "不限") {
              ele.selected = false;
            }
          });
        } else {
          this.occasionSelectList.forEach((ele) => {
            ele.selected = false;
          });
          item.selected = true;
        }
        if (
          this.occasionSelectList.filter((ele) => {
            return ele.selected == true;
          }).length == 0
        ) {
          this.occasionSelectList.forEach((ele) => {
            if (ele.name == "不限") {
              ele.selected = true;
            }
          });
        }
      } else if (type == "theme") {
        if (item.name != "不限") {
          item.selected = !item.selected;
          this.themeSelectList.forEach((ele) => {
            if (ele.name == "不限") {
              ele.selected = false;
            }
          });
        } else {
          this.themeSelectList.forEach((ele) => {
            ele.selected = false;
          });
          item.selected = true;
        }
        if (
          this.themeSelectList.filter((ele) => {
            return ele.selected == true;
          }).length == 0
        ) {
          this.themeSelectList.forEach((ele) => {
            if (ele.name == "不限") {
              ele.selected = true;
            }
          });
        }
      } else if (type == "time") {
        if (item.name != "不限") {
          item.selected = !item.selected;
          this.timeSelectList.forEach((ele) => {
            if (ele.name == "不限") {
              ele.selected = false;
            }
          });
        } else {
          this.timeSelectList.forEach((ele) => {
            ele.selected = false;
          });
          item.selected = true;
        }
        if (
          this.timeSelectList.filter((ele) => {
            return ele.selected == true;
          }).length == 0
        ) {
          this.timeSelectList.forEach((ele) => {
            if (ele.name == "不限") {
              ele.selected = true;
            }
          });
        }
      } else {
        if (item.name != "不限") {
          item.selected = !item.selected;
          this.sourceSelectList.forEach((ele) => {
            if (ele.name == "不限") {
              ele.selected = false;
            }
          });
        } else {
          this.sourceSelectList.forEach((ele) => {
            ele.selected = false;
          });
          item.selected = true;
        }
        if (
          this.sourceSelectList.filter((ele) => {
            return ele.selected == true;
          }).length == 0
        ) {
          this.sourceSelectList.forEach((ele) => {
            if (ele.name == "不限") {
              ele.selected = true;
            }
          });
        }
      }
      this.searchList();
    },
    showCollect() {
      this.collotShow = !this.collotShow;
    },
    showHistory() {
      this.historyShow = !this.historyShow;
    },
    downloadWord(type) {
      let params = {
        asset_id: this.customConfig.asset_id || "ad1cc731-417c-306e-43c8-db7b0a24eaf5",
      };
      let message = {
        download_type: type,
        download_info: [],
      };
      this.resultList.forEach((item) => {
        let info = {
          id: item.id,
          fields: item.fields,
        };
        message.download_info.push(info);
      });
      downloadWord(params, message).then((res) => {
        window.open(`${window.location.origin}${res.data}`);
      });
    },
    sortClick(type) {
      if (type == "left") {
        this.leftSortShow == null ? (this.leftSortShow = true) : (this.leftSortShow = !this.leftSortShow);
        this.rightSortShow = null;
      } else {
        this.rightSortShow == null ? (this.rightSortShow = true) : (this.rightSortShow = !this.rightSortShow);
        this.leftSortShow = null;
      }
      this.searchList();
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.pageSize = val;
      this.isSearch ? this.searchList() : this.getDefalutList();
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.pageNum = val;
      this.isSearch ? this.searchList() : this.getDefalutList();
    },
    /**
     * 用于触发事件的方法，window.eventCenter?.triggerEvent封装了一层，
     * @param {String} eventName 事件名
     * @param {Object} payload 事件传参
     * @example triggerEvent("click",{value:"123"})
     *
     */
    triggerEvent(eventName, payload) {
      let { componentId, appId } = this.customConfig || {};
      componentId && appId && window.eventCenter?.triggerEvent(componentId, eventName, { value: payload });
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
.main_Assembly {
  width: 100%;
  overflow: hidden;
  background: url("../../../pluginTemp/images/homePage.png") no-repeat;
  background-color: #fef8ea;
  background-size: 100%;
  display: flex;
  justify-content: center;
  font-family: "PingFang SC" !important;
  .main_Assembly_Center {
    width: 1200px;
    height: 100%;
    position: relative;
    .main_Assembly_Center_LogoTitle {
      position: absolute;
      top: 108px;
    }
    .main_Assembly_Center_People {
      position: absolute;
      right: 20px;
    }
    .main_Assembly_Center_Search {
      position: absolute;
      top: 385px;
      height: 80px;
      border-radius: 12px;
      /deep/.el-input-group__prepend {
        border-top-left-radius: 12px;
        border-bottom-left-radius: 12px;
        width: 115px;
        background: #fff;
        padding: 0px;
      }
      /deep/.el-input-group__append {
        border-top-right-radius: 12px;
        border-bottom-right-radius: 12px;
        background: #fff;
        padding: 4px 8px 0px;
        .main_Assembly_Center_Search_Btn {
          cursor: pointer;
        }
      }
      /deep/.el-input__inner {
        height: 80px;
        font-size: 24px;
        font-weight: 400;
        border-left-width: 0px;
        border-right-width: 0px;
        &:focus,
        &:hover {
          border: 1px solid #dcdfe6;
          border-left-width: 0px;
          border-right-width: 0px;
        }
        &::placeholder {
          color: rgba(149, 156, 166, 1);
          font-weight: 400;
        }
      }
      .main_Assembly_Center_Select {
        width: 70%;
        margin: -2px 0px;
        /deep/.el-input__suffix {
          display: none;
        }
        /deep/.el-input__inner {
          border-color: transparent !important;
          padding-right: 0px;
          padding-left: 24px;
          &:hover {
            border-top-left-radius: 12px;
            border-bottom-left-radius: 12px;
          }
          &::placeholder {
            color: rgba(55, 58, 85, 1);
            font-weight: 400;
          }
        }
      }
      .main_Assembly_Center_Line {
        height: 20px;
        border-right: 1px solid rgba(0, 0, 0, 0.1);
        position: relative;
        top: 31px;
        left: 15px;
      }
      /deep/.el-icon-caret-bottom {
        font-size: 20px;
        position: relative;
        top: 29px;
      }
    }
    .main_Assembly_Center_Radio {
      position: absolute;
      top: 482px;
      right: 0px;
      .firstRadio {
        margin-right: 16px;
      }
      /deep/.el-radio {
        color: #fff !important;
      }
      /deep/.el-radio__inner::after {
        background: #b73837;
        width: 6px;
        height: 6px;
      }
      /deep/ .el-radio__label {
        font-size: 14px;
        padding-left: 5px;
      }
      /deep/.el-radio__input.is-checked .el-radio__inner {
        border-color: #fee6bb;
        background: #fee6bb;
      }
      /deep/.el-radio__input.is-checked + .el-radio__label {
        color: #fff !important;
      }
    }
    .main_Assembly_Center_Card {
      position: absolute;
      width: 1200px;
      top: 521px;
      border-radius: 16px;
      /deep/.el-card__body {
        padding: 40px;
        height: calc(100% - 80px);
      }
      .main_Assembly_Center_Card_Select {
        height: 224px;
        width: 100%;
        .Center_Card_Select {
          height: 32px;
          display: flex;
          margin-bottom: 20px;
          .Center_Card_Select_Left {
            height: 32px;
            img {
              margin-top: 8px;
              margin-left: 24px;
              margin-right: 8px;
            }
            span {
              line-height: 32px;
              font-family: "PingFang SC";
              font-style: normal;
              font-weight: 400;
              font-size: 16px;
              vertical-align: top;
              color: #373a55;
            }
          }
          .Center_Card_Select_Right {
            display: flex;
            div {
              width: 56px;
              height: 32px;
              border-radius: 20px;
              line-height: 32px;
              color: #373a55;
              margin: 0 10px;
              cursor: pointer;
              text-align: center;
              &:hover {
                background: rgba(205, 22, 25, 0.1);
                border-radius: 20px;
                color: #cd1619;
              }
              &:focus {
                background: #cd1619;
                border-radius: 20px;
                color: #fff !important;
              }
            }
            .selectedItem {
              background: #cd1619 !important;
              border-radius: 20px;
              color: #fff !important;
            }
          }
        }
      }
      .main_Assembly_Center_Card_Result {
        width: 1120px;
        height: 34px;
        background: #fff5e6;
        border-radius: 4px;
        margin-top: 32px;
        display: flex;
        justify-content: space-between;
        .Center_Card_Result_Left {
          line-height: 34px;
          padding-left: 16px;
          .Center_Card_Result_Left_Red {
            color: #cd1619;
          }
        }
        .Center_Card_Result_Right {
          display: flex;
          line-height: 34px;
          padding-right: 16px;
          font-size: 14px;
          .Center_Card_Result_Right_Time,
          .Center_Card_Result_Right_Num {
            cursor: pointer;
            img {
              vertical-align: -3px;
            }
            .topSort {
              transform: rotate(180deg);
            }
          }
        }
      }
    }
    .main_Assembly_Center_Card_List {
      margin-top: 23px;
      height: 710px;
      overflow-y: auto;
      overflow-x: hidden;
      .main_Assembly_Center_Card_List_Item {
        width: 1120px;
        height: 56px;
        display: flex;
        cursor: pointer;

        margin-bottom: 15px;
        justify-content: space-between;
        &:hover {
          background: #fef7e9;
          span {
            color: #cd1619 !important;
          }
        }
        img {
          margin-left: 17px;
          margin-top: 22px;
        }
        span {
          line-height: 56px;
          margin-left: 10px;
          font-family: "PingFang SC";
          font-style: normal;
          font-weight: 400;
          font-size: 20px;
        }
        .Card_List_item_Left {
          display: flex;
          .Card_List_item_Left_Title {
            color: #373a55;
            font-family: "PingFang SC";
            display: block; //成为“块级”元素(block-level)；span元素的默认display属性值为“inline”，
            max-width: 34em; //限制字数
            overflow: hidden; //对溢出内容的隐藏
            white-space: nowrap; //只保留一个空白，文本不会换行，会在在同一行上继续，直到遇到br标签为止。
            text-overflow: ellipsis;
          }
        }
        .Card_List_item_Right_Source {
          color: #626973;
          font-family: "PingFang SC";
        }
        .Card_List_item_Right_Time {
          color: #959ca6;
          font-family: "DIN";
          margin-right: 5px;
        }
      }
    }
    .main_Assembly_Center_Card_ListResult {
      height: 885px;
      width: 100%;
      overflow-y: auto;
      overflow-x: hidden;
      margin-top: 16px;
      border-top: 1px solid rgba(0, 0, 0, 0.1);
      .Center_Card_ListResult_Item {
        margin-top: 16px;
        padding: 16px;
        height: 160px;
        border-bottom: 1px solid rgba(0, 0, 0, 0.1);
        &:hover {
          background: rgba(205, 22, 25, 0.05);
        }
        .Center_Card_ListResult_Item_Title {
          display: flex;
          justify-content: space-between;
          .ListResult_Item_Title_Left {
            font-family: "PingFang SC";
            font-style: normal;
            font-weight: 500;
            font-size: 20px;
            color: #373a55;
            cursor: pointer;
            max-width: 40em; //限制字数
            overflow: hidden; //对溢出内容的隐藏
            white-space: nowrap; //只保留一个空白，文本不会换行，会在在同一行上继续，直到遇到br标签为止。
            text-overflow: ellipsis;
          }
          .ListResult_Item_Title_Right {
            color: #cd1619;
            font-family: "PingFang SC";
            font-style: normal;
            font-weight: 400;
            font-size: 16px;
          }
        }
        .Center_Card_ListResult_Item_Content {
          margin-top: 8px;
          font-family: "PingFang SC";
          font-style: normal;
          font-weight: 400;
          font-size: 16px;
          color: #626973;
          height: 72px;
          width: 100%;
          cursor: pointer;
          line-height: 24px;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 3;
          overflow: hidden;
        }
        .Center_Card_ListResult_Item_Source {
          display: flex;
          margin-top: 4.5px;
          font-family: "PingFang SC";
          font-style: normal;
          font-weight: 400;
          font-size: 14px;
          color: #626973;
          height: 20px;
          width: 100%;
          .ListResult_Item_Source_Left {
            margin-right: 8px;
            color: #959ca6;
          }
          .ListResult_Item_Source_Right {
            font-weight: 600;
            color: #959ca6;
          }
        }
      }
    }
    .main_Assembly_Center_Card_Page {
      display: flex;
      justify-content: center;
      position: absolute;
      bottom: 40px;
      width: 100%;
      /deep/.btn-prev,
      /deep/.btn-next {
        border: 1px solid rgba(0, 0, 0, 0.1);
        border-radius: 32px;
        min-width: unset;
        height: 32px;
        padding: 0 9px;
        margin: 0 5px;
        &:hover {
          color: #000;
        }
      }

      /deep/.el-pager li {
        margin: 0px 5px;
        border: 1px solid rgba(0, 0, 0, 0.1);
        border-radius: 32px;
        height: 32px;
        min-width: 32px;
        padding: 0 9px;
        &:hover {
          color: #000;
        }
      }
      /deep/.el-pager {
        .active {
          background: #cd1619;
          color: #fff;
          &:hover {
            color: #fff;
          }
        }
      }
      /deep/.more {
        border: 0px !important;
      }
      /deep/.el-pagination__sizes {
        margin-left: 10px;
        .el-input__inner {
          height: 32px;
          line-height: 32px;
          border-radius: 32px;
          border-color: #dcdfe6 !important;
          &:hover {
            border-color: #dcdfe6;
          }
        }
      }
      /deep/.el-pagination__jump {
        color: transparent;
        margin-left: 0px;
        .el-pagination__editor {
          left: -28px;
        }
        .el-input__inner {
          height: 32px;
          width: 32px;
          border-radius: 32px;
          &:focus {
            border-color: #dcdfe6;
          }
        }
      }
    }
    .main_Assembly_Center_Download {
      position: absolute;
      width: 100%;
      display: flex;
      bottom: 43px;
      justify-content: center;
      img {
        margin-right: 34px;
        cursor: pointer;
      }
    }
    .main_Assembly_Center_Look {
      img {
        margin-right: 8px;
        cursor: pointer;
      }
    }
  }
}
</style>
<style lang="less">
#tip-arrow-bottom,
#trans-tooltip,
#tip-arrow-top {
  display: none;
}
.pageSpan,
.pageSpan2 {
  color: #626973 !important;
}
.pageSpan2 {
  position: relative;
  display: inline-block;
  left: -40px;
}
.pagePop {
  .selected {
    color: #b73837 !important;
  }
}
</style>
<style lang="less">
.collectPop {
  height: 624px;
  padding: 24px !important;
}
.historyPop {
  height: 676px;
  left: 765px !important;
  padding: 24px !important;
}
.historyPop2 {
  height: 676px;
  left: 464px !important;
  padding: 24px !important;
}
.historyPop_Title,
.collotPop_Title {
  height: 40px;
  img {
    cursor: pointer;
  }
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}
.historyPop_List {
  height: 562px;
  overflow-x: hidden;
  overflow-y: auto;
  margin-top: 24px;
  .historyPop_List_Six_Item {
    display: flex;
    justify-content: space-between;
    font-size: 16px;
    height: 24px;
    margin-top: 16px;
    color: #373a55;
    font-family: "PingFang SC";
    cursor: pointer;
    span {
      display: block; //成为“块级”元素(block-level)；span元素的默认display属性值为“inline”，
      max-width: 14em; //限制字数
      overflow: hidden; //对溢出内容的隐藏
      white-space: nowrap; //只保留一个空白，文本不会换行，会在在同一行上继续，直到遇到br标签为止。
      text-overflow: ellipsis;
    }
    div {
      display: flex;
    }
    img {
      margin-right: 10px;
      margin-top: 5px;
      margin-left: 10px;
    }
    p {
      float: right;
      color: #959ca6;
      font-size: 12px;
      margin-top: 3px;
      margin-right: 3px;
    }
  }
  .historyPop_List_Week,
  .historyPop_List_Later {
    margin-top: 32px;
  }
}
.collotPop_List {
  height: 550px;
  overflow-x: hidden;
  overflow-y: auto;
  margin-top: 24px;
  .collotPop_List_Item {
    display: flex;
    justify-content: space-between;
    font-size: 16px;
    height: 24px;
    margin-top: 16px;
    color: #373a55;
    font-family: "PingFang SC";
    cursor: pointer;
    span {
      display: block; //成为“块级”元素(block-level)；span元素的默认display属性值为“inline”，
      max-width: 17em; //限制字数
      overflow: hidden; //对溢出内容的隐藏
      white-space: nowrap; //只保留一个空白，文本不会换行，会在在同一行上继续，直到遇到br标签为止。
      text-overflow: ellipsis;
    }
    div {
      display: flex;
    }
    img {
      margin-right: 10px;
      margin-top: 5px;
      margin-left: 10px;
    }
    p {
      float: right;
      color: #959ca6;
      font-size: 12px;
      margin-top: 3px;
      margin-right: 3px;
    }
  }
}
</style>
