<template>
  <div class="statisticalPage">
    <div class="statisticalHead">
      <el-radio-group v-model="reportType" text-color="#1B85FF" @change="reportChange">
        <el-radio-button class="dateBtn" label="日报"></el-radio-button>
        <el-radio-button class="dateBtn" label="周报"></el-radio-button>
        <el-radio-button class="dateBtn" label="月报"></el-radio-button>
        <el-radio-button class="dateBtn" label="年报"></el-radio-button>
      </el-radio-group>
    </div>
    <div class="tabPage">
      <div class="statisticalDateOf">
        <div class="leftBox">
          <!-- <el-button class="marginR" type="primary" icon="el-icon-arrow-left" size="small" @click="addDate('reduce')">{{ pickerUp }}</el-button> -->
          <el-date-picker v-show="reportType === '日报'" class="marginR" :clearable="false" v-model="selectDate" size="small" :editable="false" value-format="yyyy-MM-dd" key="date" type="date" @change="getReportsData"></el-date-picker>
          <el-date-picker
            v-show="reportType === '周报'"
            class="marginR zhouBao"
            v-model="selectDateDate"
            size="small"
            :editable="false"
            value-format="yyyy-MM-dd"
            key="week"
            type="daterange"
            range-separator="-"
            :picker-options="pickerOptions"
            @change="getReportsData"
          ></el-date-picker>
          <el-date-picker v-show="reportType === '月报'" class="marginR" :clearable="false" v-model="selectDate" size="small" :editable="false" value-format="yyyy-MM" key="month" type="month" @change="getReportsData"></el-date-picker>
          <el-date-picker v-show="reportType === '年报'" class="marginR" :clearable="false" v-model="selectDate" size="small" :editable="false" value-format="yyyy" key="year" type="year" @change="getReportsData"></el-date-picker>
          <!-- <el-button class="marginR" type="primary" size="small" @click="addDate('add')">
            {{ pickerDown }}
            <i class="el-icon-arrow-right el-icon--right"></i>
          </el-button> -->
          <!-- <el-button class="searchBtn" type="primary" size="small"> -->
            <!-- <i class="el-icon-date"></i> -->
            <img class="dateImg" src="../pluginTemp/images/dateimg.png" alt="">
          <!-- </el-button> -->
        </div>
        <!-- <el-button class="exportBtn" type="primary" size="small" @click="exportReportsData">
          <img class="exportImg" src="../pluginTemp/images/export.png" alt="" srcset=""> 导出
        </el-button> -->
        <img class="exportImg" src="../pluginTemp/images/exports.png" alt="" @click="exportReportsData">
      </div>
      <div ref="tableBox" class="tableBox">
        <div class="toplab">
          <div class="tableTop">
            <div class="title" :style="{width:computedWidth/6+2 +'px'}">电站名称</div>
            <div class="content" :style="{width:computedWidth/4+20  +'px'}">{{ reportObj.name }}</div>
          </div>
          <div class="tableTop1">
            <div class="title" :style="{width:computedWidth/6+1 +'px'}">装机容量</div>
            <div class="content">{{ isNaN(Number(reportObj.machine_volume).toFixed(2))?'':Number(reportObj.machine_volume).toFixed(2) }}&nbsp;kWp</div>
          </div>
        </div>
        <el-table id="oneTable" :border="true" :stripe="true" :data="tableData" max-height="500px" :summary-method="getSummaries" :cell-style="changeCellStyle" style="width: 100%">
          <el-table-column prop="name" label="电量" align="center" min-width="120" class-name="textClass"></el-table-column>
          <el-table-column prop="all" sortable align="center" min-width="120" :label="`总（${tableUnit}）`">
          <template slot-scope="scope">
              <span>{{isNaN(Number(scope.row.all).toFixed(2))?'':Number(scope.row.all).toFixed(2)}}</span>
          </template>
          </el-table-column>
          <el-table-column prop="jian" sortable align="center" min-width="120" :label="`尖（${tableUnit}）`">
                <template slot-scope="scope">
              <span>{{isNaN(Number(scope.row.jian).toFixed(2))?'':Number(scope.row.jian).toFixed(2)}}</span>
          </template>
        </el-table-column>
          <el-table-column prop="feng" sortable align="center" min-width="120" :label="`峰（${tableUnit}）`">
                <template slot-scope="scope">
              <span>{{isNaN(Number(scope.row.feng).toFixed(2))?'':Number(scope.row.feng).toFixed(2)}}</span>
          </template>
          </el-table-column>
          <el-table-column prop="ping" sortable align="center" min-width="120" :label="`平（${tableUnit}）`">
                <template slot-scope="scope">
              <span>{{isNaN(Number(scope.row.ping).toFixed(2))?'':Number(scope.row.ping).toFixed(2)}}</span>
          </template>
          </el-table-column>
          <el-table-column prop="gu" sortable align="center" min-width="120" :label="`谷（${tableUnit}）`">
                <template slot-scope="scope">
              <span>{{isNaN(Number(scope.row.gu).toFixed(2))?'':Number(scope.row.gu).toFixed(2)}}</span>
          </template>
          </el-table-column>
        </el-table>
        <!-- 发电时段 -->
        <div class="tabel_title" style="margin-top: 40px">{{ powerGeneration }}</div>
        <el-table :border="true" :stripe="true" :data="deviationTableData" max-height="500px" :show-summary="true" :summary-method="shiDuanGetSummaries" :cell-style="changeCellStyle" style="width: 100%">
          <el-table-column prop="time" sortable :label="tableTitle" align="center" min-width="110"></el-table-column>
          <el-table-column prop="power_eq" sortable align="center" min-width="120" :label="`逆变器发电量（${tableDeviationUnit}）`">
            <template slot-scope="scope">
              <span>{{isNaN(Number(scope.row.power_eq))?'':Number(scope.row.power_eq).toFixed(2)}}</span>
            </template>
          </el-table-column>
          <el-table-column v-if="reportType != '日报'" prop="power_db" sortable align="center" min-width="120" :label="`计量表发电量（${tableDeviationUnit}）`">
            <template slot-scope="scope">
              <span>{{isNaN(Number(scope.row.power_db))?'':Number(scope.row.power_db).toFixed(2)}}</span>
            </template>
          </el-table-column>
          <el-table-column v-if="reportType != '日报'" prop="deviation_rate" sortable align="center" label="偏差率（%）">
            <template slot-scope="scope">
              <!-- <span>{{isNaN(Number(scope.row.deviation_rate))?'': Number(scope.row.deviation_rate) > 0 ? Number(scope.row.deviation_rate).toFixed(2) : ''}}</span> -->
              <span>{{isNaN(Number(scope.row.deviation_rate))?'':Number(scope.row.deviation_rate).toFixed(2)}}</span>
            </template>
          </el-table-column>
        </el-table>
        <div class="tabel_title" style="margin-top: 40px">图表</div>
        <div ref="lineEchart" id="lineEchart" class="lineEchart"></div>
        <!-- <img :src="echartImg" style="width: 100%; height: 350px" alt="" /> -->
        <div class="tabel_title">逆变器事件报警</div>
        <el-table :border="true" :stripe="true" :data="alarmTableData" max-height="500px" :show-summary="true" :summary-method="getSummariesElse" :cell-style="changeCellStyle" style="width: 100%">
          <el-table-column prop="equipment_name" sortable label="逆变器名称" align="center" min-width="120"></el-table-column>
          <el-table-column prop="total_cnt" sortable align="center" label="总计" min-width="80"></el-table-column>
          <el-table-column prop="yc_cnt" sortable align="center" label="重大事件" min-width="80"></el-table-column>
          <el-table-column prop="yx_cnt" sortable align="center" label="较大事件" min-width="80"></el-table-column>
          <el-table-column prop="sg_cnt" sortable align="center" label="一般事件" min-width="80"></el-table-column>
          <!-- <el-table-column prop="bw_cnt" sortable align="center" label="变位" min-width="80"></el-table-column> -->
          <!-- <el-table-column prop="gz_cnt" sortable align="center" label="告知" min-width="80"></el-table-column> -->
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
import * as echarts from 'echarts'
import moment from 'moment'
// 防抖
const debounce = (func, ms) => {
  let timer
  return function (...args) {
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      func.apply(this, args)
    }, ms)
  }
}
export default {
  name: 'App',
  props: {
    customConfig: Object,
  },
  computed: {
    pickerUp() {
      return this.reportType === '日报' ? '上一日' : this.reportType === '月报' ? '上一月' : '上一年'
    },
    pickerDown() {
      return this.reportType === '日报' ? '下一日' : this.reportType === '月报' ? '下一月' : '下一年'
    },
    powerGeneration() {
      switch (this.reportType) {
        case "日报":
          return "日发电时段"
        case "周报":
          return "周发电时段"
        case "月报":
          return "月发电时段"
        case "年报":
          return "年发电时段"
      }
    },
    tableTitle() {
      switch (this.reportType) {
        case "日报":
          return "时间"
        case "周报":
          return "日期"
        case "月报":
          return "日期"
        case "年报":
          return "月份"
      }
    },
    deviationUnit() {
      switch (this.reportType) {
        case "日报":
          return "单位：kWh"
        case "周报":
          return "单位：kWh"
        case "月报":
          return "单位：kWh"
        case "年报":
          return "单位：万kWh"
      }
    },
    tableDeviationUnit() {
      switch (this.reportType) {
        case "日报":
          return "kWh"
        case "周报":
          return "kWh"
        case "月报":
          return "kWh"
        case "年报":
          return "万kWh"
      }
    },
    tableUnit() {
      // return this.reportType === '日报' ? 'kWh' : '万kWh'
      switch (this.reportType) {
        case "日报":
          return "kWh"
        case "周报":
          return "万kWh"
        case "月报":
          return "万kWh"
        case "年报":
          return "万kWh"
      }
    },
  },
  data() {
    let pickDate = "";
    return {
      echartImg: '',
      timer: null,
      myChart: null,
      parmasType: '',
      paramsId: '',
      reportType: '日报',
      selectDate: '',
      selectDateDate: [],
      tableData: [],
      alarmTableData: [],
      deviationTableData: [],
      xAxisData: [],
      eqData: [],
      dbData: [],
      rateData: [],
      tableHeight: 570,
      reportObj: {
        machine_volume: '',
        name: '',
      },
      computedWidth:'',
      pickerOptions: {
        disabledDate(time) {
          // let startDate = moment(new Date()).subtract(7, 'day').startOf('day').valueOf();
          let endDate = moment(new Date()).subtract(1, 'day').startOf('day').valueOf();
          // return time.getTime() > endDate || time.getTime() < startDate;
          return time.getTime() > endDate;
        }
      }
    }
  },
  created() {
    this.selectDate = moment(new Date()).subtract(1, 'day').startOf('day').format('YYYY-MM-DD');
    this.selectDateDate = [moment(new Date()).subtract(7, 'day').startOf('day').format('YYYY-MM-DD'), moment(new Date()).subtract(1, 'day').startOf('day').format('YYYY-MM-DD')];
  },
  mounted() {
    // this.dataType({ id: '116' })
    
    let { componentId } = this.customConfig || {}
    componentId && window.componentCenter?.register(componentId, 'comp', this, eventActionDefine)
    this.tableHeight = this.$refs.tableBox.offsetHeight
    this.$nextTick(()=>{
      this.computedWidth = document.querySelectorAll('.has-gutter')[0].offsetWidth
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
        let idArry = id
          .map((x) => {
            return x.id
          })
          .toString()
        this.paramsId = idArry
      } else {
        this.paramsId = id
      }
      if (this.paramsId != '' || this.paramsId[0] != '') {
        this.getReportsData()
      }
    },
    // 报表数据接口
    async getReportsData() {
      this.tableData = [];
      let params = {
        id: this.paramsId,
        date: this.reportType === '周报' ? this.selectDateDate[0] :this.selectDate,
        endTime: this.reportType === '周报' ? this.selectDateDate[1] : ""
      }
      // console.log('params=============>', params)
      if (params.id == '' || params.id[0] == '') return
      let { data } = await queryReportsData(params)
      let { electricityStatistics, generateElectricity, alarmReport } = data
      this.reportObj = {
        name: data.name,
        machine_volume: data.machine_volume,
      }
      this.tableData = [
        {
          name: '发电量',
          all: electricityStatistics.power_all,
          jian: electricityStatistics.power_j,
          feng: electricityStatistics.power_f,
          ping: electricityStatistics.power_p,
          gu: electricityStatistics.power_g,
        },
        {
          name: '上网电量',
          all: electricityStatistics.swdl_all,
          jian: electricityStatistics.swdl_j,
          feng: electricityStatistics.swdl_f,
          ping: electricityStatistics.swdl_p,
          gu: electricityStatistics.swdl_g,
        },
        {
          name: '自发自用电量',
          all: electricityStatistics.zfzydl_all,
          jian: electricityStatistics.zfzydl_j,
          feng: electricityStatistics.zfzydl_f,
          ping: electricityStatistics.zfzydl_p,
          gu: electricityStatistics.zfzydl_g,
        },
      ]
      this.alarmTableData = alarmReport
      this.xAxisData = []
      this.eqData = []
      this.dbData = []
      this.rateData = []
      this.deviationTableData = generateElectricity.map((x) => {
        this.xAxisData.push(x.time)
        if (this.reportType === '日报') {
          // x.time = moment(x.time).format('HH:MM')
          let end = parseInt(x.time.split(':')[0]) + 1 + ':00'
          x.time = x.time + '-' + end
        }
        this.eqData.push(x.power_eq.toFixed(2))
        this.dbData.push(x.power_db.toFixed(2))
        // this.dbData.push(200)
        this.rateData.push(x.deviation_rate.toFixed(2))
        return x
      })
      this.initEcharts()
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
            uzipStr += decodeURI('%' + asc.toString() + zipStr.substring(i + 3, i + 9).toString())
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
    async exportReportsData() {
      let echartImg = this.myChart.getDataURL({
        pixelRatio: 2,
      })
      // echartImg = await this.translateBase64ImgToBlob(echartImg, 'image/jpeg')
      // console.log('echartImg', echartImg)
      // let fileIm = new FormData()
      // fileIm.append('file', echartImg, 'echartImg.image')
      let params = {
        id: this.paramsId,
        decode: echartImg,
        time: this.reportType === '周报' ? this.selectDateDate[0] : this.selectDate,
        endTime: this.reportType === '周报' ? this.selectDateDate[1] : ""
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
      // console.log('报表类型', val)
      switch (val) {
        case '日报':
          this.selectDate = moment(new Date()).subtract(1, 'day').startOf('day').format('YYYY-MM-DD');
          break
        case '周报':
          this.selectDateDate = [moment(new Date()).subtract(7, 'day').startOf('day').format('YYYY-MM-DD'), moment(new Date()).subtract(1, 'day').startOf('day').format('YYYY-MM-DD')];
          break
        case '月报':
          this.selectDate = moment(new Date()).format('YYYY-MM')
          break
        default:
          this.selectDate = moment(new Date()).format('YYYY')
          break
      }
      this.getReportsData()
      this.initEcharts()
    },
    // 合计
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
    // 发电时段合计
    shiDuanGetSummaries(param) {
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
      // 偏差率合计 计算公式=（合计逆变器发电量-计量表发电量）/合计的逆变器发电量
      if (sums.length > 2) {
        let aa = Number(sums[1]) || 0,
            bb = Number(sums[2]) || 0,
            cc = (((aa - bb) / aa) * 100).toFixed(2);
        sums[3] = cc + '';
      }
      return sums
    },
    // 逆变器合计
    getSummariesElse(param) {
      const { columns, data } = param
      const sums = []
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '总计'
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
          sums[index] = sums[index]
          sums[index] += ''
        } else {
          sums[index] = 'N/A'
        }
      })
      return sums
    },
    changeCellStyle(row, column, rowIndex, columnIndex) {
      if (row.column.label === '时间' || row.column.label === '日期' || row.column.label === '月份') {
        return 'font-weight: 700' // 修改的样式
      } else {
        return ''
      }
    },
    // 日期加减
    // addDate(type) {
    //   if (this.reportType === '日报') {
    //     if (type === 'reduce') {
    //       this.selectDate = moment(this.selectDate).subtract(1, 'day').startOf('day').format('YYYY-MM-DD')
    //     } else {
    //       this.selectDate = moment(this.selectDate).add(1, 'day').startOf('day').format('YYYY-MM-DD')
    //     }
    //   } else if (this.reportType === '月报') {
    //     if (type === 'reduce') {
    //       this.selectDate = moment(this.selectDate).subtract(1, 'month').startOf('month').format('YYYY-MM')
    //     } else {
    //       this.selectDate = moment(this.selectDate).add(1, 'month').startOf('month').format('YYYY-MM')
    //     }
    //   } else if (this.reportType === '年报') {
    //     if (type === 'reduce') {
    //       this.selectDate = moment(this.selectDate).subtract(1, 'year').startOf('year').format('YYYY')
    //     } else {
    //       this.selectDate = moment(this.selectDate).add(1, 'year').startOf('year').format('YYYY')
    //     }
    //   }
    // },
    // 初始化图表
    initEcharts() {
      const colors = ['#6cb5ec', '#6ce6a4', '#d456e6']
      if (this.myChart !== null && this.myChart !== '' && this.myChart !== undefined) {
        this.myChart.dispose() //销毁
      }
      let lineEchart = this.$refs.lineEchart
      this.myChart = echarts.init(lineEchart)
      let option = {
        color: colors,
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
          },
          formatter:  (params)=>{
            var relVal = params[0].name
            for (var i = 0; i < params.length; i++) {
              if(params[i].seriesName =='偏差率'){
                relVal += '<br/>' + params[i].marker + params[i].seriesName + ' : ' + params[i].value + ' %'
              } else {
                if(this.reportType == '年报'){
                  relVal += '<br/>' + params[i].marker + params[i].seriesName + ' : ' + params[i].value + ' 万kWh'
                }else{
                  relVal += '<br/>' + params[i].marker + params[i].seriesName + ' : ' + params[i].value + ' kWh'
                }
              }
            }
            return relVal
          }
        },
        grid: {
          left: this.reportType === '日报' ? '4%' : "6%",
          right: '4%',
        },
        // toolbox: {
        //   feature: {
        //     saveAsImage: { show: true },
        //   },
        // },
        legend: {
          itemHeight: 4,
          itemWidth: 20,
          itemGap: 200,
          icon: 'rect',
          data: this.reportType === '日报' ? [
            {
              name: '发电量(逆变器)',
              icon: 'rect',
            }
          ] : [
            {
              name: '发电量(逆变器)',
              icon: 'rect',
            },
            {
              name: '发电量(计量表)',
              icon: 'rect',
            },
            {
              name: '偏差率',
              icon: 'rect',
            },
          ],
        },
        xAxis: [
          {
            type: 'category',
            axisTick: {
              alignWithLabel: true,
            },
            axisLine: {
              show: true,
              lineStyle: {
                color: 'rgba(0,0,0,0.4)',
              },
            },
            data: this.xAxisData,
          },
        ],
        yAxis: [
          {
            type: 'value',
            name: this.deviationUnit,
            position: 'left',
            alignTicks: true,
            nameTextStyle: {
              color: '#000000',
            },
            axisLine: {
              show: true,
              lineStyle: {
                color: 'rgba(0,0,0,0.4)',
              },
            },
            axisLabel: {
              color: '#333',
              formatter: '{value}',
            },
            splitLine: {
              show: true, // y轴网格线
              lineStyle:{
                color: 'rgba(0,0,0,0.1)',
                type:'solid'
              }
            },
          },
          {
            type: 'value',
            name: '单位：%',
            position: 'right',
            alignTicks: true,
            offset: 0,
            nameTextStyle: {
              color: '#000000',
            },
            axisLine: {
              show: true,
              lineStyle: {
                color: 'rgba(0,0,0,0.4)',
              },
            },
            axisLabel: {
              color: '#333',
              formatter: '{value}',
            },
            splitLine: {
              show: false, // y轴网格线
            },
          },
        ],
        series: this.reportType === '日报' ? [
          {
            name: '发电量(逆变器)',
            type: 'bar',
            barWidth: 15,
            barMaxWidth: 15,
            barMinWidth: 15,
            dataGroupId: 'aa',
            yAxisIndex: 0,
            data: this.eqData,
          }
        ] : [
          {
            name: '发电量(逆变器)',
            type: 'bar',
            barWidth: 15,
            barMaxWidth: 15,
            barMinWidth: 15,
            dataGroupId: 'aa',
            yAxisIndex: 0,
            data: this.eqData,
          },
          {
            name: '发电量(计量表)',
            type: 'bar',
            barWidth: 15,
            barMaxWidth: 15,
            barMinWidth: 15,
            barGap: "10%",//柱图间距
            dataGroupId: 'aa',
            yAxisIndex: 0,
            data: this.dbData,
          },
          {
            name: '偏差率',
            type: 'line',
            showSymbol: false,
            smooth: true,
            yAxisIndex: 1,
            dataGroupId: 'bb',
            data: this.rateData,
          }
        ],
        // dataZoom: {
        //   show: true, // 为true 滚动条出现
        //   realtime: true,
        //   type:'slider', // 有type这个属性，滚动条在最下面，也可以不行，写y：36，这表示距离顶端36px，一般就是在图上面。
        //   height: 20, // 表示滚动条的高度，也就是粗细
        //   start: 20, // 表示默认展示20%～80%这一段。
        //   end: 80
        // }
        // dataZoom: {
        //   type: 'inside', // 有type这个属性，滚动条在最下面，也可以不行，写y：36，这表示距离顶端36px，一般就是在图上面。
        //   zoomLock: true, // 为true 滚动条出现
        //   start: 0, // 表示默认展示开始位置20%这一段。
        //   end: 70, // 表示默认展示结束位置80%这一段。
        // },
      }
      option && this.myChart.setOption(option)
      const task = () => {
        this.myChart.resize()
      }
      window.addEventListener('resize', debounce(task, 300))
    },
    // stringToByte(str) {
    //   var bytes = new Array()
    //   var len, c
    //   len = str.length
    //   for (var i = 0; i < len; i++) {
    //     c = str.charCodeAt(i)
    //     if (c >= 0x010000 && c <= 0x10ffff) {
    //       bytes.push(((c >> 18) & 0x07) | 0xf0)
    //       bytes.push(((c >> 12) & 0x3f) | 0x80)
    //       bytes.push(((c >> 6) & 0x3f) | 0x80)
    //       bytes.push((c & 0x3f) | 0x80)
    //     } else if (c >= 0x000800 && c <= 0x00ffff) {
    //       bytes.push(((c >> 12) & 0x0f) | 0xe0)
    //       bytes.push(((c >> 6) & 0x3f) | 0x80)
    //       bytes.push((c & 0x3f) | 0x80)
    //     } else if (c >= 0x000080 && c <= 0x0007ff) {
    //       bytes.push(((c >> 6) & 0x1f) | 0xc0)
    //       bytes.push((c & 0x3f) | 0x80)
    //     } else {
    //       bytes.push(c & 0xff)
    //     }
    //   }
    //   return bytes
    // },
    // translateBase64ImgToBlob(base64, contentType) {
    //   let arr = base64.split(',') //去掉base64格式图片的头部
    //   let bstr = atob(arr[1]) //atob()方法将数据解码
    //   let leng = bstr.length
    //   let u8arr = new Uint8Array(leng)
    //   while (leng--) {
    //     u8arr[leng] = bstr.charCodeAt(leng) //返回指定位置的字符的 Unicode 编码
    //   }
    //   let blob = new Blob([u8arr], { type: contentType })
    //   // var blobImg = {}
    //   // blobImg.url = URL.createObjectURL(blob) //创建URL
    //   // blobImg.name = new Date().getTime() + '.png'
    //   return blob
    // },
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
  height: calc(100% - 25px);
  padding: 0 25px 25px 25px;
  .statisticalHead {
    margin-top: 20px;
    width: 100%;
    min-width: 500px;
    /deep/.el-radio-button__inner {
      padding: 0;
      height: 32px;
      width: 80px;
      line-height: 32px;
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
          width: 150px;
          /deep/.el-input__prefix{
            display: none;
          }
          /deep/.el-input__inner{
            padding-left: 15px;
            background: #eff0f0;
          }
        }
        .zhouBao {
          width: 260px;
        }
        .dateImg {
          position: absolute;
          right: 1px;
          width: 32px;
          height: 32px;
          border-top-right-radius: 0px;
          border-bottom-right-radius: 0px;
        }
        // .searchBtn {
        //   position: absolute;
        //   right: 1px;
        //   padding: 0;
        //   border-top-left-radius: 0px;
        //   border-bottom-left-radius: 0px;
        //   font-size: 20px;
        // }
      }
      .exportImg {
        margin-left: auto;
        right: 0px;
        width: 85px;
        height: 32px;
      }
      // .exportBtn {
      //   font-size: 16px;
      //   margin-left: auto;
      //   right: 0px;
      //   width: 85px;
      //   padding: 8px 8px;
      // }
    }
    .tableBox {
      background: #ffffff;
      margin-top: 20px;
      // padding: 0 20px;
      padding-bottom: 20px;
      // box-shadow: 0 0 5px 5px #f3f4f5;
      padding-top: 10px;
      height: calc(100% - 70px);
      overflow-y: scroll;
      &::-webkit-scrollbar {
        display: none;
      }
      // &::-webkit-scrollbar {
      //   width: 6px;
      //   height: 8px;
      //   background: #f5f5f5;
      // }
      // /*定义滑块内阴影+圆角*/
      // &::-webkit-scrollbar-thumb {
      //   background: #333333;
      //   border-radius: 10px;
      // }

      // /*定义滚动条轨道内阴影+圆角*/
      // &::-webkit-scrollbar-track {
      //   background: #fff;
      // }

      .toplab {
        display: flex;
        flex: 1;
        justify-content: space-between;
        border: 1px solid rgba(208,218,228,1);
        border-bottom: none;
        box-sizing: border-box;

        .tableTop {
          display: flex;
          align-items: center;
          flex: 1;
          font-size: 14px;
          line-height: 39px;
          text-align: left;
          .title {
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            text-align: center;
            color: #000000;
            font-weight: 700;
            // width: calc(34% - 5px);
            min-width: 110px;
            background: #ebf5ff;
            border-right: 1px solid rgba(208,218,228,1);
            box-sizing: border-box;
          }
          .content {
            padding-left: 20px;
            color: #000000;
          }
        }
        .tableTop1 {
          display: flex;
          align-items: center;
          flex: 1;
          font-size: 14px;
          line-height: 39px;
          text-align: left;
          .title {
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            text-align: center;
            color: #000000;
            font-weight: 700;
            // width: calc(34% - 6px);
            min-width: 110px;
            background: #ebf5ff;
            border-right: 1px solid rgba(208,218,228,1);
            border-left: 1px solid rgba(208,218,228,1);
            box-sizing: border-box;
          }
          .content {
            padding-left: 20px;
            color: #000000;
          }
        }
      }
      // #oneTable {
      //   /deep/ tr:first-of-type th:first-of-type:before {
      //     content: "";
      //     position: absolute;
      //     width: 1px;
      //     height: 311px;/*斜线的长度*/
      //     top: 0;
      //     left: 0;
      //     background-color: #ebeef5;
      //     opacity: 1;
      //     display: block;
      //     // transform: rotate(-43deg);/*调整斜线的角度*/
      //     transform: rotate(-79.5deg);/*调整斜线的角度*/
      //     -webkit-transform-origin: top;
      //     transform-origin: top;
      //   }
      // }
      /deep/.el-table--striped .el-table__body tr.el-table__row--striped td.el-table__cell {
        background: #f8fcff !important;
      }
      /deep/.el-table {
        border: 1px solid rgba(208,218,228,1);
        box-sizing: border-box;
        .textClass {
          font-weight: 700;
        }
        th.el-table__cell {
          background: #ebf5ff;
          color: #000000;
          padding: 2px 12px;
          border-color: rgba(208,218,228,1);
        }
        .el-table__body td.el-table__cell {
          // &:first-child {
          //   background: #f8f8f8;
          // }
          padding: 7px 12px;
          color: #000000;
          border-color: rgba(208,218,228,1);
        }
        .el-table__footer-wrapper {
          td.el-table__cell {
            &:first-child {
              font-weight: bold;
            }
            // &:nth-child(n + 2) {
            //   background: #ffffff;
            //   font-weight: bold;
            // }
            padding: 7px 0;
            color: #000000;
            border-color: rgba(208,218,228,1);
          }
        }
      }

      .tabel_title {
        margin-top: 15px;
        width: 100%;
        height: 30px;
        font-size: 16px;
        font-weight: 700;
        color: #000000;
      }
      .lineEchart {
        width: 100%;
        height: 350px;
      }
    }
  }
}
</style>