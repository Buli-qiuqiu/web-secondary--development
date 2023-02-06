import React, { Component } from "react";
import msgCompConfig from "./msgCompConfig";
import Utils from "../../utils";
import Highcharts from 'highcharts/highstock';
import { DatePicker, ConfigProvider } from 'antd';
import { queryDataLSDL } from "../../api/asset";
import _ from "lodash"
import moment from "moment";
import zhCN from "antd/es/locale/zh_CN";
import 'moment/locale/zh-cn';
import "./index.less"
moment.locale('zh-cn'); // 注意这里设置 moment 必须放在有 import 的后面。

const { RangePicker } = DatePicker;

export default class Main extends Component {
  state = {
    categories: [],
    id: "",
  };
  dateList = ['', ''];
  componentDidMount() {
    // this.initComData();
    // this.initHighChartsLine(["02-17 01:01", "02-17 01:02", "02-17 01:03", "02-17 01:04"],[]);
    this.queryDataLine();
    // console.log('this.props', this.props);
    window.componentCenter?.register &&
    window.componentCenter.register(this.props?.componentId, "comp", this, msgCompConfig);
    this.props?.updateProcess && this.props.updateProcess();
  }

  initComData = () => {
    //pluginOptions为组件式配置项数据
    const pluginOptions = this.props?.block?.dataConfig?.pluginOptions;
    //options为传统的输入框形式的配置项
    const options = this.props.options?.externalVariables;
    const id = options?.id ? `secondary_bigscreen_${options.id}` : `secondary_bigscreen_${Utils.generateUUID()}`;
    this.setState({ id });
    // console.log(pluginOptions, options, id);
  };

  queryDataLine = async () => {
    console.log('this.props', this.props);
    const pluginOptions = this.props?.block?.dataConfig?.pluginOptions;
    const options = this.props.options?.externalVariables;
    const deviceId = this.props.variable?.default_value;

    let { chartsCategories, chartsXKey, chartsYKey } = pluginOptions;
    let { tableName } = options;
    // let deviceId = this.props.customConfig?.variable?.default_value;
    let column = new Array(chartsXKey, ...chartsYKey).filter(Boolean)
    let parmas = {
      deviceId: deviceId,
      startTime: this.dateList[0] || "",
      endTime: this.dateList[1] || "",
      column: column,
      tableName: tableName
    }
    let list = [];
    // let nameList = [];
    let listCopy = [];
    let categoriesList = [];
    let { data } = await queryDataLSDL(parmas)
    if (data) {
      let { columns, values } = data;
    
      if (columns) {
        list = values.map((val) => {
          let obj = {}
          columns.forEach((k, index) => {
            obj[k] = val[index]
          })
          // if (chartsCategories) {
            // if (nameList.indexOf(obj[chartsCategories]) == '-1') {
            //   nameList.push(obj[chartsCategories])
            // }
            // nameList = chartsCategories;
          // }
          let time = moment(obj[chartsXKey]).format("MM-DD HH:mm")
          if (categoriesList.indexOf(time) == '-1') {
            categoriesList.push(time)
          }
          return obj
        })
        // .reverse()
      
        listCopy = chartsCategories.map((x,Xindex)=>{
          let obj = {
            name: x,
            data: []
          }
          let yKey = chartsYKey[Xindex];

          for (let index = 0; index < list.length; index++) {
            if (list[index][yKey]) {
              let dataChild = {
                name: moment(list[index][chartsXKey]).format("MM-DD HH:mm"),
                y: Number(list[index][yKey])
              }

              obj.data.push(dataChild)
            }
          }
          return obj
          // for (let index = 0; index < list.length; index++) {
          //   if (list[index][chartsCategories] == x){
          //     let dataChild = {
          //       name: moment(list[index][chartsXKey]).format("MM-DD HH:mm"),
          //       y: Number(list[index][chartsYKey])
          //     }
              
          //     obj.data.push(dataChild)
          //   }
          // }
        })
      }
    }
    // categoriesList = categoriesList.map(x=>{
    //   return new Date(x).valueOf()
    // })
    // categoriesList.sort((a, b) => b - a);
    // categoriesList = categoriesList.map(x => {
    //   return moment(x).format("YYYY-MM-DD HH:mm:ss")
    // })
    // console.log('nameList', nameList);
    console.log('list', list);
    console.log('listCopy', listCopy);
    console.log('categoriesList', categoriesList);

    this.initHighChartsLine(categoriesList, listCopy)
  }

  initHighChartsLine = (categoriesList, listCopy) => {
    const pluginOptions = this.props?.block?.dataConfig?.pluginOptions;
    //options为传统的输入框形式的配置项
    const options = this.props.options?.externalVariables;
    let seriesColor = options.seriesColor ? options.seriesColor.split('-') : ['#0778e5', '#84e2e5', '#51deac', '#e6c77c', '#e69146', '#13d8ea']
    Highcharts.setOptions({
      colors: seriesColor
    });
    Highcharts.chart(this.refs.iotLine, {
      chart: {
        backgroundColor: '#f7fcfe',
        type: 'line',
        // zoomType: 'x'
      },
      // boost: {
      //   useGPUTranslations: true
      // },
      title: {
        text: ''
      },
      subtitle: {
        text: ''
      },
      credits: {
        enabled: false
      },
      legend: {
        enabled: pluginOptions.chartsCategories ? true : false,
        layout: 'horizontal',
        align: 'center',
        verticalAlign: 'top'
      },
      yAxis: {
        tickAmount: 6,
        lineColor: '#f1f7fb',
        lineWidth: 2,
        title: {
          text: ''
        },
        gridLineDashStyle: 'Dash',
        gridLineColor: '#e8eef6'
      },
      xAxis: {
        type: "category",
        // uniqueNames: true,
        // reversed: true,
        // tickPixelInterval: 50,
        lineColor: '#e8eef6',
        lineWidth: 1,
        tickWidth: 0,
        min: 0, // 别忘了这里
        max: categoriesList.length - 1 < 15 ? categoriesList.length - 1 : 15,
        labels: {
          autoRotation: false,
          formatter() {
            let time = this.value.split(" ");
            let s = `<span>${time[0]}</span><br /><span>${time[1]}</span>`;
            return s;
          }
        },
        scrollbar: { // 滚动条样式
          enabled: true,
          height: 8,
          barBackgroundColor: '#d1d1d1',
          barBorderColor: '#d1d1d1',
          rifleColor: '#d1d1d1',
          barBorderRadius: 5,
          buttonBorderWidth: 0,
          buttonArrowColor: 'rgba(0,0,0,0)'
        },
        categories: categoriesList
      },
      plotOptions: {
        series: {
          turboThreshold: 1000000,
          marker: {
            enabled: true
          }
        }
      },
      tooltip: {
        enabled: true,
        backgroundColor: options.tooltipBgColor || 'rgba(255,255,255)', // 将提示框的透明度拿掉，默认是0.85
        borderColor: options.tooltipBgColor || 'rgba(255,255,255)',
        // shared: true,
        formatter() {
          let s = `<div style="font-family: ${options.tooltipFontFamily};color: ${options.tooltipFontColor};font-size: ${options.tooltipFontSize};">
                      <span >${this.key}</span><br />
                      <span style="color: ${this.series.color}">●</span>
                      <span >${this.series.name}:<b>${this.y}</b></span>
                    </div>`;
          return s;
        }
      },
      series: listCopy
      // series: [
      //   {
      //     name: 'aaaa',
      //     data: [
      //       {
      //         name: '02-17 01:01',
      //         y: 99
      //       },
      //       {
      //         name: '02-17 01:02',
      //         y: 90
      //       },
      //       {
      //         name: '02-17 01:03',
      //         y: 90
      //       },
      //       {
      //         name: '02-17 01:04',
      //         y: 90
      //       }
      //     ]
      //   }
      // ]
    });
  }

  selectDate = (dates, dateStrings) => {
    // console.log(dates);
    console.log(dateStrings);
    this.dateList = dateStrings;
    this.queryDataLine();
  }

  Event_Center_getName() {
    return this.state.id;
  }

  render() {
    const { id } = this.state;
    return (
      /*大屏定义外层容器百分百，不可删除*/
      <div id={id} className="highChartsLineBox" style={{ width: "100%", height: "100%" }}>
        <ConfigProvider locale={zhCN}>
          <RangePicker format="YYYY-MM-DD" placeholder={['开始日期', '结束日期']} onChange={(dates, dateStrings) => { this.selectDate(dates, dateStrings) }} />
        </ConfigProvider>
        <div id="iotLine" ref='iotLine' className="highChartsLine"></div>
      </div>
    );
  }
}
