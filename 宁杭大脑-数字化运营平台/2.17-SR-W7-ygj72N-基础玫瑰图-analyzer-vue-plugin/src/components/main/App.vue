<template>
  <div ref="ningHangMeiguituBox" class="meiGuiTuBox">
    <div class="meiGuiTu" ref="ningHangMeiguitu" :style="{ 'width': width, 'height': height }"></div>
  </div>
</template>

<script>
import * as echarts from 'echarts';

const configJson = require("../../../pluginTemp/config.json")

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
  name: "Main",
  components: {},
  data() {
    return {
      timer: null,
      myChart: null,
      width: "100%",
      height: "100%",
      meiGuiData: [],
      legendconfig: {
        show: false
      },
      chartTitle: {
        show: false
      },
      // 系列颜色
      seriesColor: [],
      // 图表配置
      seriesConfig: {
        left: '0',
        top: '0',
        right: '0',
        bottom: '0',
        radius: [50, 250],
        itemStyle: {
          borderWidth: '0',
          borderColor: '',
          borderRadius: '10',
        }
      },
      seriesItemStyle: {
        borderWidth: 0,
        borderColor: 'pink',
        borderRadius: '10',
      }
    }
  },
  props: {
    dataSource: Object | Array,
    componentId: String,
    customConfig: Object,
    options: Object,
    customOptions: Object,
    updateProcess: Function,
    mainInit: Function
  },
  created() {
  },
  mounted() {
    this.$refs.ningHangMeiguituBox.parentNode.style.height = '100%'
    this.$refs.ningHangMeiguituBox.parentNode.style.width = '100%'
    this.$refs.ningHangMeiguituBox.parentNode.parentNode.style.minHeight = '0'

    this.mainInit(this)
    this.initComData()
  },
  methods: {
    Event_Center_getName() {
      const requirementNumber = configJson["requirement-number"] === "需求编号"
        ? "" : configJson["requirement-number"]
      return this.options?.externalVariables?.id || requirementNumber || Utils.tools.generateUUID()
    },
    /**
     * 用于触发事件的方法，window.eventCenter?.triggerEvent封装了一层
     * @param {String} eventName 事件名
     * @param {Object} payload 事件传参
     * @example
     * triggerEvent("click",{value:"123"})
     *
     */
    triggerEvent(eventName, payload) {
      this.componentId && window.eventCenter?.triggerEvent(
        this.componentId,
        eventName,
        //payload需为一个object
        payload
      )
    },
    handleClick() {
      this.triggerEvent("click", { value: "123" })
    },
    do_EventCenter_message({ value }) {
      alert(value)
    },
    initComData() {
      //customConfig为组件式配置项数据
      //dataSource为分析仪左侧拖入的数据源
      //customOptions为传统的输入框形式的配置项
      const { dataSource, customConfig, customOptions } = this;
      console.log('预览页-initComData-customConfig', customConfig);
      console.log('预览页-initComData-customOptions', customOptions);
      this.width = customOptions.width;
      this.height = customOptions.height;

      let { chartTitle, seriesColor, legendconfig, seriesConfig, seriesItemStyle } = customConfig;
      this.chartTitle = JSON.parse(chartTitle) || this.chartTitle;
      this.seriesColor = seriesColor ? seriesColor.split('-') : this.seriesColor;
      this.legendconfig = JSON.parse(legendconfig) || this.legendconfig;
      this.seriesConfig = JSON.parse(seriesConfig) || this.seriesConfig;
      this.seriesItemStyle = JSON.parse(seriesItemStyle) || this.seriesItemStyle;
      this.legendconfig.itemWidth = Number(this.legendconfig.itemWidth)
      this.legendconfig.itemHeight = Number(this.legendconfig.itemHeight)
      // console.log('this.legendconfig', this.legendconfig);
      this.mapData();
    },
    //处理格式
    mapData() {
      // console.log('this.dataSource', this.dataSource);
      let pieDataCopy = JSON.parse(JSON.stringify(this.dataSource))
      pieDataCopy.shift()
      this.meiGuiData = pieDataCopy.map((x, y) => {
        this.num += Number(x[1])
        return {
          name: x[0] || '空',
          value: Number(x[1]) || 0,
          itemStyle: {
            color: this.seriesColor[y]
          }
        }
      })
      // console.log('this.meiGuiData', this.meiGuiData)
      this.$nextTick(()=>{
        this.initEcharts();
      })
    },
    // 初始化图表
    initEcharts() {
      if (this.myChart !== null && this.myChart !== '' && this.myChart !== undefined) {
        this.myChart.dispose() //销毁
      }
      let self = this;
      let ningHangMeiguitu = this.$refs.ningHangMeiguitu;
      this.myChart = echarts.init(ningHangMeiguitu);
      let option = {
        title: this.chartTitle.show ? this.chartTitle : { show: false },
        tooltip: {
          trigger: 'item',
        },
        legend: this.legendconfig.show ? this.legendconfig : { show: false },
        // legend: {
        //   show: true,
        //   icon: "circle",// 形状 'circle', 'rect', 'roundRect', 'triangle', 'diamond', 'pin', 'arrow', 'none'
        //   type: "plain", // 'scroll' 'plain'
        //   orient: "horizontal", // 'horizontal' 'vertical'
        //   left: 'auto', //'left', 'center', 'right'
        //   top: 'auto', //'top', 'middle', 'bottom'
        //   right: '0', // 绝对值 百分比
        //   bottom: '0', // 绝对值 百分比
        //   itemGap: 10, //间隔
        //   textStyle: {
        //     fontSize: '14',
        //     fontStyle: "oblique",
        //     color: '#333',
        //   },
        //   itemStyle: {
        //     borderColor: '',
        //     borderWidth: '0',
        //   }
        // },
        series: [
          {
            type: 'pie',
            left: this.seriesConfig.left,
            top: this.seriesConfig.top,
            right: this.seriesConfig.right,
            bottom: this.seriesConfig.bottom,
            radius: this.seriesConfig.radius,
            // center: ['50%', '50%'],
            roseType: 'radius',
            itemStyle: this.seriesItemStyle || {},
            tooltip: {
              show: true,
              // borderWidth: 0,
              // backgroundColor: 'transparent',
              // padding: [0, 0, 0, 0],
              confine: true,
              // formatter: (params) => {
              //   if (params.name !== '') {
              //     let item = self.meiGuiData.find((x) => x.name === params.name)
              //     let p = ((item.value / self.num) * 100).toFixed(0)
              //     return `<div style="text-indent: 20px;background:url( ${require('../src/assest/tooipBg1.png')}) no-repeat center center;background-size: 100%;background-attachment: fixed;height: 66px;width: 120px;font-size: 14px;color: #a8c7e5;">${params.name}<br/><span style="margin-left: 20px;font-size: 16px;color: #fff;font-weight: 700;">${p}%</span></div>`
              //   }
              // },
            },
            label: {
              show: false,
            },
            labelLine: {
              show: false,
            },
            data: this.meiGuiData,
          }
        ],
      }

      option && this.myChart.setOption(option)
      const task = () => {
        this.myChart.resize()
      }
      window.addEventListener('resize', debounce(task, 300))
    },
  },
  beforeDestroy() {
    window.componentCenter?.removeInstance(this.componentId)
  }
}
</script>

<style lang="less" scoped>
.meiGuiTuBox {
  width: 100%;
  height: 100%;
  background: none;
  .meiGuiTu {
    width: 100%;
    height: 100%;
  }
}
</style>