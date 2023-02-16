<template>
   <div class="pn_outermost">
      <!-- 按钮组 -->
      <div class="header_box">
         <!-- 日期选择器 -->
         <div class="datepicker_button">
            <el-date-picker v-model="datePicke" type="daterange" size="small" start-placeholder="开始日期" end-placeholder="结束日期" @change="changeDatePicker" :clearable="false"></el-date-picker>
            <img class="export_button" src="./assets/export.png" @click="exportEcharts()" />
         </div>
         <!-- 导出 -->
         <div>
            <el-radio-group v-model="pageType" size="small" @change="changePageType">
               <el-radio-button label="echarts">棒图</el-radio-button>
               <el-radio-button label="table">表格</el-radio-button>
            </el-radio-group>
         </div>
      </div>
      <!-- 柱状图 -->
      <div class="ehcarts_box" v-if="pageType == 'echarts'">
         <div ref="echartsBar" id="pn_echarts_bar" style="width: 100%; height: 100%"></div>
         <div style="margin-top: 50px">
            组串电流偏差率高：
            <span v-if="!remindInfo">无</span>
            <span v-if="remindInfo">{{ remindInfo }}</span>
         </div>
      </div>
      <!-- 表格 -->
      <div class="table_box" v-if="pageType == 'table'">
         <el-table ref="tableData" v-loading="tableLoading" :data="tableData" border :cell-style="tableRowClassName" :header-cell-style="{ background: '#ECF5FF' }" height="100%">
            <el-table-column class-name="first_column" prop="time" label="时间" width="160" sortable fixed align="center"></el-table-column>
            <el-table-column class-name="second_column" prop="dispersion_rate" label="离散率（%）" min-width="120" fixed align="center"></el-table-column>
            <el-table-column class-name="third_column" prop="current_p_avg" label="平均电流Ⅰ*" min-width="105" fixed align="center"></el-table-column>
            <template v-for="i in 24">
               <el-table-column v-if="columnIsShow(i)" :key="i" class-name="dynamic_column" min-width="65" align="center">
                  <template slot="header">
                     <div>
                        <span>Ⅰ</span>
                        <span class="column_label">{{ i }}</span>
                        <span>*</span>
                     </div>
                  </template>
                  <template slot-scope="scope">
                     <div :class="dispersionStyle(scope.row, i)">{{ scope.row[`PV${i}`] }}</div>
                  </template>
               </el-table-column>
            </template>
         </el-table>
         <el-pagination
            class="table_pagination"
            background
            @size-change="handlePageSizeChange"
            @current-change="handlePageChange"
            :current-page="page"
            :page-sizes="[15, 30, 50, 100]"
            :page-size="pageSize"
            layout="total, prev, pager, next, sizes, jumper"
            :total="total"
         >
         </el-pagination>
      </div>
   </div>
</template>

<script>
// 引入逻辑控制
import eventActionDefine from "./components/msgCompConfig";
// 引入公共封装方法
import utils from "@/utils";
// 引入接口方法
import { queryAssetByTime, getEcharts, exportEchartsExcel, queryRemindInfo } from "./api/asset";
// 引入CSS文件
import "./index.css";
// 引入Jquery
import $ from "jquery";
// 引入图标
import dateicon from "./assets/date.png";
// 引入Echarts
import * as echarts from "echarts";
// 引入时间转换
import moment from "moment";

export default {
   name: "App",

   props: {
      customConfig: Object,
      sysVariables: Array,
      appVariables: Array,
   },

   data() {
      return {
         // 树形控件ID
         ids: "",
         // 日期选择器
         datePicke: [new Date(new Date().getTime() - 3600 * 1000 * 24 * 7).getTime(), new Date().getTime()],
         // 表格数据
         tableData: [
            // {
            //   time: "123",
            //   dispersion_rate: "123",
            //   current_p_avg: "1",
            //   PV1: "123",
            //   PV2: "123",
            //   PV3: "123",
            //   PV4: "123",
            //   PV5: "123",
            //   PV6: "123",
            //   PV7: "123",
            //   PV8: "123",
            //   PV9: "123",
            //   PV10: "123",
            //   PV11: "123",
            //   PV12: "123",
            //   PV13: "123",
            //   PV14: "123",
            //   PV15: "123",
            //   PV16: "123",
            //   PV17: "123",
            //   PV18: "123",
            //   PV19: "123",
            //   PV20: "123",
            //   PV21: "123",
            //   PV22: "123",
            //   PV23: "123",
            //   PV24: "123",
            //   PV25: "123",
            // },
         ],
         // 表格loading
         tableLoading: false,
         // 图表
         myChart: null,
         // 图表数据
         seriesData: [0, 0, 0, 0, 0],
         // 页面展示类型
         pageType: "echarts",

         // 渲染表格
         debounceTask: "",

         // 总数
         total: 0,
         // 页码
         page: 1,
         // 页数
         pageSize: 15,

         // 提示消息
         remindInfo: "",
      };
   },

   mounted() {
      // 用于注册事件定义，不可删除
      let { componentId } = this.customConfig || {};
      componentId && window.componentCenter?.register(componentId, "comp", this, eventActionDefine);

      // 初始化图表
      this.initEcharts();
      // 添加图标
      this.addDatePickerIcon();

      if (process.env.NODE_ENV !== "production") {
         this.do_EventCenter_getIds({ value: "1999116999240" });
      }
   },

   methods: {
      // 生成Echarts
      initEcharts() {
         echarts.init(document.getElementById("pn_echarts_bar")).dispose();
         let myChart = echarts.init(document.getElementById("pn_echarts_bar"));
         this.myChart = myChart;
         let option = {};

         let xAxisData = [];
         let xAxisNameList = ["35%以上", "20%~35%", "10%~20%", "5%~10%", "5%以下"];
         xAxisNameList.forEach((item) => {
            xAxisData.push({
               value: item,
               textStyle: {
                  color: "#333333",
                  fontFamily: "Alibaba PuHuiTi",
                  fontSize: 14,
                  fontWeight: "400",
               },
            });
         });

         option = {
            // 悬浮框
            tooltip: {
               trigger: "axis",
               axisPointer: {
                  type: "shadow",
               },
               className: "tooltipBox",
               formatter: (params) => {
                  let list = [];
                  let listItem = "";
                  for (var i = 0; i < params.length; i++) {
                     list.push(
                        `<div class="tooltipBox_content" style="color: #fff;">
                <div class="tooltipBox_radius" style="background: ${params[i].color}"></div>
                <div style="color: #fff; font-size: 15px;">离散率 ${params[i].data}次</div>
              </div>`
                     );
                  }
                  listItem = list.join("");
                  return (
                     `<div>
              <div class="tooltipBox_title" style="color: #fff; font-size: 16px">${params[0].name}</div>` +
                     listItem +
                     `</div>`
                  );
               },
            },
            // 整体
            grid: {
               top: "55px",
               left: "8px",
               right: "1px",
               bottom: "8px",
               containLabel: true,
            },
            // X轴
            xAxis: [
               {
                  type: "category",
                  data: xAxisData,
                  axisTick: {
                     show: false,
                  },
                  axisLine: {
                     lineStyle: {
                        color: "#999999",
                     },
                  },
                  offset: 7.32,
               },
            ],
            // Y轴
            yAxis: [
               {
                  type: "value",
                  minInterval: 5,
                  name: "单位：次",
                  nameTextStyle: {
                     color: "#333333",
                     fontFamily: "Alibaba PuHuiTi",
                     fontSize: 12,
                     fontWeight: "400",
                     padding: [10, 0, 10, 0],
                  },
                  axisLabel: {
                     color: "#333333",
                     fontFamily: "Alibaba PuHuiTi",
                     fontSize: 14,
                     fontWeight: "400",
                  },
                  axisLine: {
                     show: true,
                     lineStyle: {
                        color: "#999999",
                     },
                  },
                  splitLine: {
                     lineStyle: {
                        color: "#E4E4E4",
                     },
                  },
               },
               {
                  type: "value",
                  axisLabel: { show: false },
                  axisLine: {
                     show: true,
                     lineStyle: {
                        color: "#878787",
                     },
                  },
                  splitLine: { show: false },
               },
            ],
            // 数据
            series: [
               {
                  type: "bar",
                  barWidth: "35%",
                  data: this.seriesData,
                  itemStyle: {
                     normal: {
                        color: function (color) {
                           var colorList = ["#FF6E6C", "#FE9834", "#0893FD", "#A281F9", "#45D49F"];
                           return colorList[color.dataIndex];
                        },
                     },
                  },
                  label: {
                     show: true,
                     lineHeight: 10,
                     formatter: "{c}",
                     position: "top",
                     offset: [0, -7],
                     textStyle: {
                        color: "#333333",
                        fontFamily: "Alibaba PuHuiTi",
                        fontSize: 14,
                        fontWeight: "400",
                     },
                  },
               },
            ],
         };

         option && myChart.setOption(option);
      },

      // 下载模板方法
      AsciiToString(asccode) {
         return String.fromCharCode(asccode);
      },
      // 下载模板方法
      UrlDecode(zipStr) {
         var uzipStr = "";
         for (var i = 0; i < zipStr.length; i += 1) {
            var chr = zipStr.charAt(i);
            if (chr === "+") {
               uzipStr += " ";
            } else if (chr === "%") {
               var asc = zipStr.substring(i + 1, i + 3);
               if (parseInt("0x" + asc) > 0x7f) {
                  uzipStr += decodeURI("%" + asc.toString() + zipStr.substring(i + 3, i + 9).toString());
                  i += 8;
               } else {
                  uzipStr += this.AsciiToString(parseInt("0x" + asc));
                  i += 2;
               }
            } else {
               uzipStr += chr;
            }
         }
         return uzipStr;
      },
      // 导出Echarts
      exportEcharts() {
         let img = "";

         if (!this.myChart) {
            return;
         }

         img = this.myChart.getDataURL({
            pixelRatio: 2,
            backgroundColor: "#fff",
         });

         let _startTime = this.datePicke[0];
         let _endTime = this.datePicke[1];

         let dataForm = {
            ids: this.ids,
            startTime: moment(_startTime).format("yyyy-MM-DD 00:00:00"),
            endTime: moment(_endTime).format("yyyy-MM-DD 23:59:59"),
            decode: img,
         };
         exportEchartsExcel(dataForm)
            .then((res) => {
               const temp = res.headers["content-disposition"].split("=")[1]; // 对文件名乱码转义--【Node.js】使用iconv-lite解决中文乱码
               let iconv = require("iconv-lite");
               iconv.skipDecodeWarning = true; //忽略警告
               let fileName = iconv.decode(temp, "utf-8");
               const _res = res.data;
               let blob = new Blob([_res]);
               let downloadElement = document.createElement("a");
               let href = window.URL.createObjectURL(blob); //创建下载的链接
               downloadElement.href = href;
               let fileNameNew = this.UrlDecode(fileName);
               downloadElement.download = fileNameNew; //下载后文件名
               document.body.appendChild(downloadElement);
               downloadElement.click(); //点击下载
               document.body.removeChild(downloadElement); //下载完成移除元素
               window.URL.revokeObjectURL(href); //释放掉blob对象
            })
            .catch((err) => {
               this.$message.warning("导出失败");
            });
      },

      // 获取Echarts图表数据
      getEchartsData() {
         this.seriesData = [];

         let _startTime = this.datePicke[0];
         let _endTime = this.datePicke[1];

         _startTime = moment(_startTime).format("yyyy-MM-DD 00:00:00");
         _endTime = moment(_endTime).format("yyyy-MM-DD 23:59:59");

         getEcharts(this.ids, _startTime, _endTime).then((res) => {
            let _res = res.data[0];
            this.seriesData = [_res.five, _res.four, _res.three, _res.two, _res.one];
            // 生成Echarts
            this.initEcharts();
         });

         // 获取提示消息
         queryRemindInfo(this.ids, _startTime, _endTime).then((res) => {
            this.total = res.data.num;
            let strArr = [];
            res.data.pvSet.forEach((item) => {
               strArr.push(`【${item}】`);
            });
            this.remindInfo = strArr.join("、");
         });
      },

      // 获取表格数据
      getTabelData() {
         this.tableData = [];
         this.tableLoading = true;

         let _startTime = this.datePicke[0];
         let _endTime = this.datePicke[1];

         _startTime = moment(_startTime).format("yyyy-MM-DD 00:00:00");
         _endTime = moment(_endTime).format("yyyy-MM-DD 23:59:59");

         queryAssetByTime(this.ids, _startTime, _endTime, this.page, this.pageSize)
            .then((res) => {
               let resData = JSON.parse(JSON.stringify(res.data));
               resData.forEach((item) => {
                  if (item.time) {
                     let times = Date.parse(new Date(item.time));
                     item.time = moment(times).format("yyyy-MM-DD HH:mm:ss");
                  }
               });

               this.$nextTick(() => {
                  this.tableData = resData;
                  this.$forceUpdate();
                  this.tableLoading = false;
               });
            })
            .catch(() => {
               this.tableLoading = false;
            });

         function debounce(func, ms = 1000) {
            let timer;
            return function (...args) {
               if (timer) clearTimeout(timer);
               timer = setTimeout(() => {
                  func.apply(this, args);
               }, ms);
            };
         }
         const task = () => {
            console.log("重新渲染表格");
            this.$refs.tableData.doLayout();
         };
         this.debounceTask = debounce(task, 300);
         window.addEventListener("resize", this.debounceTask);
      },

      // 切换日期
      changeDatePicker() {
         this.getEchartsData();
         this.getTabelData();
      },

      // 切换页面显示类型
      changePageType(value) {
         if (value == "echarts") {
            this.getEchartsData();
         } else {
            this.getTabelData();
         }
      },

      // 单元格变色
      dispersionStyle(row, index) {
         if (row[`PV${index}`] == 0) {
            return "coloumn_grey";
         }
         if (row[`PV${index}`]) {
            if ((row.current_p_avg - row[`PV${index}`]) / row.current_p_avg >= 0.2) {
               return "coloumn_yellow";
            } else {
               return "coloumn_white";
            }
         }
      },

      // 是否展示列
      columnIsShow(index) {
         let dataObj = this.tableData[0];
         if (dataObj) {
            if (dataObj[`PV${index}`]) {
               return true;
            }
            if (dataObj[`PV${index}`] == "") {
               return true;
            }
            if (dataObj[`PV${index}`] == 0) {
               return true;
            }
            return false;
         }
         return false;
      },

      // 表格隔行变色
      tableRowClassName({ row, column, rowIndex, columnIndex }) {
         if (columnIndex < 3) {
            if (columnIndex == 1) {
               if (row.dispersion_rate > 5 && row.dispersion_rate <= 10) {
                  return { background: "#A281F9", color: "#fff" };
               } else if (row.dispersion_rate > 10 && row.dispersion_rate <= 20) {
                  return { background: "#0893FD", color: "#fff" };
               } else if (row.dispersion_rate > 20 && row.dispersion_rate <= 35) {
                  return { background: "#FE9834", color: "#fff" };
               } else if (row.dispersion_rate > 35) {
                  return { background: "#FF6E6C", color: "#fff" };
               }
            }
            if (rowIndex % 2 == 0) {
               return "";
            } else {
               return { background: "#F9FCFF" };
            }
         }
      },

      // 添加日期选择器图标
      addDatePickerIcon() {
         let datepicker_icon = $(".el-range__close-icon");
         let iconDom = `<img src="${dateicon}" width="100%" height="100%" />`;
         datepicker_icon.append(iconDom);
      },

      // 分页
      handlePageChange(page) {
         this.page = page;
         this.getTabelData();
      },

      // 页码切换
      handlePageSizeChange(pageSize) {
         this.pageSize = pageSize;
         this.getTabelData();
      },

      // 触发动作
      do_EventCenter_getIds(value) {
         this.ids = value.value;

         // 获取表格数据
         this.getTabelData();
         // 获取Echarts图表数据
         this.getEchartsData();
      },

      // 注册组件名
      Event_Center_getName() {
         return "离散率";
      },
   },
   // 注销页面
   destroyed() {
      window.componentCenter?.removeInstance(this.customConfig?.componentId);

      window.removeEventListener("resize", this.debounceTask);
   },
};
</script>

<style lang="less">
// 最外层
.pn_outermost {
   width: 100%;
   height: 100%;
   box-sizing: border-box;
   background: #fff;
   padding: 25px 25px 28px 25px;
   // 头部盒子
   .header_box {
      width: 100%;
      display: flex;
      justify-content: space-between;
      margin-bottom: 5px;
   }
   // 日期选择器
   .datepicker_button {
      border-radius: 2px;
      margin-left: 2px;
      display: flex;
      align-items: center;
      .export_button {
         cursor: pointer;
         margin-top: 1px;
         margin-left: 25px;
      }
      .el-range-input {
         background: rgba(239, 240, 243, 1);
      }
      // 选择器整体
      .el-date-editor {
         cursor: pointer;
         width: 260px;
         height: 32px;
         border-radius: 2px;
         opacity: 1;
         border: 1px solid rgba(222, 222, 222, 1);
         background: rgba(239, 240, 243, 1);
         box-sizing: border-box;
      }

      // 选择器文字样式
      .el-range-input {
         color: rgba(152, 153, 154, 1);
         font-size: 16px;
         font-weight: 400;
         font-family: "Alibaba PuHuiTi";
         text-align: center;
      }

      // 左侧图标
      .el-range__icon {
         display: none;
      }
      // 右侧图标
      .el-range__close-icon {
         position: absolute;
         right: 0;
         left: 228px;
         width: 32px;
         height: 32px;
         top: -1px;
      }
   }
   // ehcarts盒子
   .ehcarts_box {
      margin-left: -0.8px;
      margin-right: 25px;
      height: 418.09px;
      margin-bottom: 24.91px;
   }
   // 表格头部
   .el-table__header {
      // 头部单元格
      .el-table__cell {
         padding: 14px 0;
         height: 50px;
         color: #040404;
         font-size: 16px;
         font-weight: bold;
         font-family: "Alibaba PuHuiTi";
         box-sizing: border-box;
         // 头部单元格内元素
         .cell {
            padding: 0;
            margin: 0;
            height: 23px;
         }
      }
   }
   // 表格行
   .el-table__row {
      // 头部单元格
      .el-table__cell {
         padding: 0 !important;
         height: 40px;
         // 头部单元格内元素
         .cell {
            padding: 0;
            margin: 0;
            height: 100%;
            line-height: 38px;
         }
      }
   }
   // 表格底部横线
   .el-table::before {
      height: 0;
   }
   // 表格边框颜色
   .el-table--border,
   .el-table--group {
      border: 1px solid #d0dae4;
      border-bottom: none;
   }
   // 表格内竖线颜色
   .el-table--border td,
   .el-table--border th,
   .el-table__body-wrapper .el-table--border.is-scrolling-left ~ .el-table__fixed {
      border-right: 1px solid #d0dae4;
   }
   // 表格内行线颜色
   .el-table td,
   .el-table th.is-leaf {
      border-bottom: 1px solid #d0dae4;
   }

   .table_pagination {
      width: 100%;
      text-align: right;
      box-sizing: border-box;
      margin-top: 30px;
      background: transparent;
      li {
         width: 30px;
         height: 28px;
         line-height: 28px;
         border-radius: 4px;
         border: 1px solid #f4f4f5 !important;
         background: transparent !important;
      }
   }
   .el-pagination.is-background .el-pager li:not(.disabled).active {
      color: #111 !important;
      border-radius: 4px;
      border: 1px solid #0454f2 !important;
   }

   .table_box {
      height: 657px;
      margin-top: 21px;
   }

   .el-table--border th.el-table__cell.gutter:last-of-type {
      background: rgb(236, 245, 255) !important;
   }

   .first_column {
      div {
         top: -3px;
      }
   }

   // // 滚动条宽高
   // ::-webkit-scrollbar {
   //   height: 8px;
   //   width: 9px;
   // }

   // // // 表格固定列样式
   // .el-table__fixed,
   // .el-table__fixed-right {
   //   height: calc(100% - 8px) !important;
   //   box-shadow: -5px -2px 10px rgba(0, 0, 0, 0.12) !important;
   // }

   /* 滚动滑块的颜色 */
   ::-webkit-scrollbar-thumb {
      background-color: #1b85ff;
      border-radius: 5px;
   }
   /* 滚动条背景颜色 */
   ::-webkit-scrollbar-track {
      background-color: #fff;
      border-radius: 5px;
   }
}

// 单元格背景色
.coloumn_yellow {
   background: #ffd96f;
   color: #ffffff;
   height: 100%;
}
.coloumn_white {
   background: #fff;
   color: #000000;
   height: 100%;
}
.coloumn_grey {
   background: #aaaaaa;
   color: #fff;
   height: 100%;
}
.column_label {
   font-size: 11px;
}

// echarts悬浮框
.tooltipBox {
   width: 135px;
   padding: 0 !important;
   background-color: rgba(111, 111, 111, 0.8) !important;
   border-width: 0 !important;
   border-radius: 5 !important;
}
.tooltipBox_title,
.tooltipBox_content {
   display: flex;
   text-align: left;
   align-items: center;
   height: 20px;
   padding-left: 10px;
   padding-top: 5px;
}
.tooltipBox_radius {
   width: 15px;
   height: 15px;
   margin-right: 10px;
   border-radius: 50%;
}
.tooltipBox_title {
   margin: 5px 0 5px 0;
}
.tooltipBox_content {
   margin-bottom: 5px;
}
.tooltipBox .tooltipBox_content:last-child {
   margin-bottom: 10px;
}
</style>
