<template>
  <div class="statisticalPage">
    <div class="statisticalHead">
      <el-radio-group v-model="reportType" text-color="#1B85FF" @change="reportChange">
        <el-radio-button label="日报"></el-radio-button>
        <el-radio-button label="月报"></el-radio-button>
        <el-radio-button label="年报"></el-radio-button>
      </el-radio-group>
    </div>
    <div class="tabPage">
      <div class="statisticalDateOf">
        <div v-show="reportType != '年报'" class="leftBox">
          <el-date-picker
            v-show="reportType === '日报'"
            class="marginR"
            v-model="selectDateDate"
            size="small"
            :editable="false"
            value-format="yyyy-MM-dd"
            key="month"
            type="daterange"
            range-separator="-"
            @change="getReportsData"
          ></el-date-picker>
          <el-date-picker
            v-show="reportType === '月报'"
            class="marginR"
            v-model="selectDate"
            size="small"
            :editable="false"
            value-format="yyyy"
            key="year"
            @change="getReportsData"
            type="year"
          ></el-date-picker>
          <img class="dateImg" src="../pluginTemp/images/dateimg.png" alt=""/>
        </div>
        <!-- <el-button
          class="exportBtn"
          type="primary"
          size="small"
          @click="exportReportsData"
          >导出</el-button> -->
        <img class="exportImg" src="../pluginTemp/images/exports.png" alt="" @click="exportReportsData">
      </div>
      <div ref="tableBox" class="tableBox">
        <div class="tableTop">
          <div class="title" :style="{height:titleHeight + 'px'}">电站名称</div>
          <div class="content">{{ reportObj.name }}</div>
        </div>
        <!-- <div v-if="parmasType != 'object'" class="tableTop">
          <div class="title">客户名称</div>
          <div class="content">{{ reportObj.belong_customer }}</div>
        </div> -->
        <div class="tableTop">
          <div class="title">装机容量</div>
          <div class="content">{{reportObj.machine_volume ? Number(reportObj.machine_volume).toFixed(2) + ' kWp' : ''}}</div>
        </div>
        <!-- <div v-if="parmasType != 'object'" class="tableTop">
          <div class="title">地址</div>
          <div class="content">{{ reportObj.collector_address }}</div>
        </div> -->
        <!-- :max-height="tableHeight" -->
        <el-table
          :data="tableData"
          :summary-method="getSummaries"
          show-summary
          :border="true"
          :stripe="true"
          :cell-style="changeCellStyle"
          style="width: 100%"
        >
          <el-table-column
          v-if="reportType == '日报'"
            prop="time"
            sortable
            label="日期"
            align="center"
            width="210"
          ></el-table-column>
          <el-table-column
          v-else-if="reportType == '月报'"
            prop="time"
            sortable
            label="月份"
            align="center"
            width="210"
          ></el-table-column>
          <el-table-column
         v-else
            prop="time"
            sortable
            label="年份"
            align="center"
            width="210"
          ></el-table-column>
          <el-table-column
            prop="power_output"
            sortable
            align="center"
            :label="`发电量（${tableUnit}）`"
          >
        <template slot-scope="scope">
          <!-- <span>{{Number(scope.row.power_output).toFixed(2)}}</span> -->
          <span>{{ scope.row.power_output }}</span>
        </template></el-table-column>
          <el-table-column
            prop="equivalentTime"
            sortable
            align="center"
            label="等效时数（h）"
          >
           <template slot-scope="scope">
          <!-- <span>{{Number(scope.row.equivalentTime).toFixed(2)}}</span> -->
            <span>{{ scope.row.equivalentTime }}</span>
        </template></el-table-column>
          <!-- <el-table-column
            prop="swdl"
            sortable
            align="center"
            :label="`上网电量（${tableUnit}）`"
          ></el-table-column>
          <el-table-column
            prop="zfzydl"
            sortable
            align="center"
            :label="`自发自用电量（${tableUnit}）`"
          ></el-table-column> -->
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
// import appService from "@njsdata/app-sdk";
import eventActionDefine from './components/msgCompConfig'
import './index.css'
import { queryReportsData, exportReports } from './api/asset'
import moment from 'moment'
export default {
  name: 'App',
  props: {
    customConfig: Object,
  },
  computed: {
    pickerUp() {
      return this.reportType === '日报' ? '上一月' : '上一年'
    },
    pickerDown() {
      return this.reportType === '日报' ? '下一月' : '下一年'
    },
    tableUnit() {
      return this.reportType === '日报' ? 'kWh' : '万kWh'
    }
  },
  data() {
    return {
      parmasType: '',
      paramsId: '',
      reportType: '日报',
      selectDate: '',
      selectDateDate: [],
      tableData: [],
      tableHeight: 570,
      reportObj: {
        belong_customer: '',
        collector_address: '',
        machine_volume: '',
        name: '',
      },
      titleHeight:'39'
    }
  },
  created() {
    this.selectDate = moment(new Date()).format('YYYY');
    this.selectDateDate = [moment(new Date()).startOf('month').format('YYYY-MM-DD'), moment(new Date()).endOf('month').format('YYYY-MM-DD')];
  },
  mounted() {
    let { componentId } = this.customConfig || {}
    componentId &&
      window.componentCenter?.register(
        componentId,
        'comp',
        this,
        eventActionDefine
      )
    this.tableHeight = this.$refs.tableBox.offsetHeight
    // console.log('this.tableHeight',this.tableHeight);
    this.getReportsData()
    this.$nextTick(()=>{
      this.titleHeight = document.querySelectorAll('.content')[0].offsetHeight
    })
  },
  methods: {
    do_EventCenter_getId(val) {
      // console.log('val==================>', val)
      this.dataType(val)
    },
    Event_Center_getName() {
      return '统计报表ID参数接收'
    },
    // 参数类型判断
    dataType(val) {
      let { id } = val
      this.parmasType = typeof id
      if (typeof id === 'object') {
        let idArry = id.map((x) => {
            return x.id
          }).toString()
        this.paramsId = idArry
      } else {
        this.paramsId = id
      }
      if (this.paramsId != "" || this.paramsId[0] != "") {
        this.getReportsData()
      }
    },
    // 报表数据接口
    async getReportsData() {
      let isDate = this.reportType === '日报' ? this.selectDateDate : this.selectDate;
      let params = {
        // id: this.paramsId,
        id: '116,119',
        date: this.reportType === '日报' ? isDate[0] : isDate,
        endTime: this.reportType === '日报' ? isDate[1] : ""
      }
      // console.log('params=============>', params)
      if (params.id == "" || params.id[0] == "") return;
      await queryReportsData(params)
        .then((res) => {
          let { data } = res
          this.tableData = data.detail.map((x) => {
            x.equivalentTime = x.equivalentTime
            x.power_output = x.power_output
            // x.equivalentTime = Number(x.equivalentTime.replace(/,/g, ''));
            // x.power_output = Number(x.power_output.replace(/,/g, ''));
            return x
          })
          Object.keys(this.reportObj).forEach((x) => {
            this.reportObj[x] = data[x]
          })
             this.$nextTick(()=>{
      this.titleHeight = document.querySelectorAll('.content')[0].offsetHeight
    })
          console.log('this.tableData',this.tableData);
        })
        .catch((err) => {
          // console.log('err',err);
          let { data } = err
          this.reportObj = {
            belong_customer: '',
            collector_address: '',
            machine_volume: '',
            name: '',
          }
          this.tableData = []
          // this.$message.error(data.message)
          // alert(data.message)
        })
    },
    // 报表导出
    AsciiToString(asccode) {
      return String.fromCharCode(asccode)
    },
    UrlDecode(zipStr) {
      var uzipStr = ''
      for (var i = 0; i < zipStr.length; i += 1) {
        var chr = zipStr.charAt(i)
        if (chr === '+') {
          uzipStr += ' '
        } else if (chr === '%') {
          var asc = zipStr.substring(i + 1, i + 3)
          if (parseInt('0x' + asc) > 0x7f) {
            uzipStr += decodeURI(
              '%' + asc.toString() + zipStr.substring(i + 3, i + 9).toString()
            )
            i += 8
          } else {
            uzipStr += this.AsciiToString(parseInt('0x' + asc))
            i += 2
          }
        } else {
          uzipStr += chr
        }
      }

      return uzipStr
    },
    exportReportsData() {
      let isDate = this.reportType === '日报' ? this.selectDateDate : this.selectDate;
      let params = {
        id: this.paramsId,
        // id: '105,99',
        date: this.reportType === '日报' ? isDate[0] : isDate,
        endTime: this.reportType === '日报' ? isDate[1] : ""
      }
      exportReports(params)
        .then((res) => {
          const temp = res.headers['content-disposition'].split('=')[1] // 对文件名乱码转义--【Node.js】使用iconv-lite解决中文乱码
          let iconv = require('iconv-lite')
          iconv.skipDecodeWarning = true //忽略警告
          let fileName = iconv.decode(temp, 'utf-8')
          const _res = res.data
          let blob = new Blob([_res])
          let downloadElement = document.createElement('a')
          let href = window.URL.createObjectURL(blob) //创建下载的链接
          downloadElement.href = href
          let fileNameNew = this.UrlDecode(fileName)
          downloadElement.download = fileNameNew //下载后文件名
          document.body.appendChild(downloadElement)
          downloadElement.click() //点击下载
          document.body.removeChild(downloadElement) //下载完成移除元素
          window.URL.revokeObjectURL(href) //释放掉blob对象

          // var blob = res.data
          // // FileReader主要用于将文件内容读入内存
          // var reader = new FileReader()
          // reader.readAsDataURL(blob)
          // // onload当读取操作成功完成时调用
          // reader.onload = function (e) {
          //   var a = document.createElement('a')
          //   // 获取文件名fileName
          //   var fileName = res.headers['content-disposition'].split('=')
          //   fileName = fileName[fileName.length - 1]
          //   fileName = decodeURI(fileName)
          //   a.download = fileName
          //   a.href = e.target.result
          //   document.body.appendChild(a)
          //   a.click()
          //   document.body.removeChild(a)
          // }
        })
        .catch((err) => {
          // this.$message.error('导出失败')
          // alert('导出失败')
        })
    },
    // 报表切换
    reportChange(val) {
      console.log('报表类型', val)
      switch (val) {
        case '日报':
          this.selectDateDate = [moment(new Date()).startOf('month').format('YYYY-MM-DD'), moment(new Date()).endOf('month').format('YYYY-MM-DD')];
          break
        case '月报':
          this.selectDate = moment(new Date()).format('YYYY')
          break
        default:
          this.selectDate = ''
          break
      }
      this.getReportsData()
    },
    getSummaries(param) {
      const { columns, data } = param
      const sums = []
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '合计'
          return
        }
        const values = data.map((item) => Number(item[column.property]))
        if (!values.every((value) => isNaN(value))) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr)
            if (!isNaN(value)) {
              return prev + curr
            } else {
              return prev
            }
          }, 0)
          sums[index] = sums[index].toFixed(2)
          sums[index] += ''
        } else {
          sums[index] = 'N/A'
        }
      })
      return sums
    },
    changeCellStyle(row, column, rowIndex, columnIndex) {
      if (row.column.label === '日期') {
        return 'font-weight: 400' // 修改的样式
      } else {
        return ''
      }
    },
    // 日期加减
    addDate(type) {
      if (this.reportType === '月报') {
        if (type === 'reduce') {
          this.selectDate = moment(this.selectDate)
            .subtract(1, 'year')
            .startOf('year')
            .format('YYYY')
        } else {
          this.selectDate = moment(this.selectDate)
            .add(1, 'year')
            .startOf('year')
            .format('YYYY')
        }
      } else {
        if (type === 'reduce') {
          this.selectDate = moment(this.selectDate)
            .subtract(1, 'month')
            .startOf('month')
            .format('YYYY-MM')
        } else {
          this.selectDate = moment(this.selectDate)
            .add(1, 'month')
            .startOf('month')
            .format('YYYY-MM')
        }
      }
    },
  },
  destroyed() {
    window.componentCenter?.removeInstance(this.customConfig?.componentId)
  },
}
</script>

<style lang="less" scoped>
/deep/.el-picker-panel {
  position: absolute;
  z-index: 222;
}
.statisticalPage {
  background: #ffffff;
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 0 25px;
  .statisticalHead {
    margin-top: 20px;
    width: 100%;
    min-width: 500px;
   
    /deep/.el-radio-button__inner {
      font-family: "Alibaba PuHuiTi";
      font-size: 16px;
      color: #000000;
      padding: 0;
      height: 32px;
      width: 80px;
      line-height: 30px;
      // background-color: transparent;
    }
    /deep/.el-radio-button__orig-radio:checked+.el-radio-button__inner{
      background-color: transparent !important;
      font-weight: 700;
    }
  }

  .tabPage {
    margin-top: 25px;
    height: calc(100% - 100px);
    min-width: 680px;
    .statisticalDateOf {
      display: flex;
      align-items: center;
      .leftBox {
        position: relative;
        display: flex;
        align-items: center;
        .marginR {
          width: 260px;
          /deep/.el-input__prefix{
            display: none;
          }
          /deep/.el-input__inner{
            color: #98999A;
            padding-left: 15px;
            background: #eff0f0;
          }
        }
        .dateImg {
          position: absolute;
          right: 1px;
          width: 32px;
          height: 32px;
          border-top-right-radius: 0px;
          border-bottom-right-radius: 0px;
        }
      }
      // .exportBtn {
      //   margin-left: auto;
      //   margin-right: 20px;
      //   right: 0px;
      //   width: 80px;
      // }
      .exportImg {
        margin-left: auto;
        right: 0px;
        width: 85px;
        height: 32px;
      }
    }
    .tableBox {
      background: #ffffff;
      margin-top: 20px;
      // padding: 0 20px;
      // box-shadow: 0 0 5px 5px #f3f4f5;
      padding-top: 10px;
      // height: calc(100% - 70px);
      // .tableTop {
      //   display: flex;
      //   align-items: center;
      //   width: 100%;
      //   font-size: 14px;
      //   line-height: 48px;
      //   text-align: left;
      //   border-top: 1px solid #ebedf0;
      //   .title {
      //     text-indent: 25px;
      //     font-weight: 700;
      //     width: 110px;
      //     min-width: 110px;
      //     background: #f8f8f8;
      //   }
      //   .content {
      //     padding-left: 20px;
      //     color: #333333;
      //   }
      // }
      .tableTop {
        display: flex;
        align-items: center;
        flex: 1;
        font-size: 14px;
        line-height: 39px;
        text-align: left;
        border-top: 1px solid rgba(208,218,228,1);
        border-right: 1px solid rgba(208,218,228,1);
        border-left: 1px solid rgba(208,218,228,1);
        .title {
                        height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
          text-align: center;
          color: #000000;
          font-weight: 700;
          width: 210px;
          min-width: 210px;
          background: #ebf5ff;
          box-sizing: border-box;
          border-right: 1px solid rgba(208,218,228,1);
        }
        .content {
          min-height: 39px;
          padding-left: 20px;
          color: #000000;
        }
      }
      /deep/.el-table--border:after,.el-table--group:after,.el-table:before {
        background-color: rgba(208,218,228,1);
      }
      /deep/.el-table--border,.el-table--group {
        border-color: rgba(208,218,228,1);
      }
      /deep/.el-table--striped .el-table__body tr.el-table__row--striped td.el-table__cell {
        background: #f8fcff !important;
      }
      /deep/.el-table {
        font-family: "Microsoft YaHei" !important;
        .ascending .sort-caret.ascending {
          border-bottom-color: #000000;
        }
        .descending .sort-caret.descending {
          border-top-color: #000000;
        }
        th.el-table__cell {
          background: #ebf5ff;
          color: #000000;
          padding: 2px 12px;
          border-color: rgba(208,218,228,1);
        }
        .el-table__body td.el-table__cell {
          padding: 7px 12px;
          color: #000000;
          border-color: rgba(208,218,228,1);
        }
        .el-table__footer-wrapper td.el-table__cell{
          border-color:  rgba(208,218,228,1);
          background: #ffffff;
          .cell{
            color: #000000;
          }
        }
      }
    }
  }
}
</style>
