import React, { Component } from "react";
import msgCompConfig from "./msgCompConfig";
import Utils from "../../utils";
import { DatePicker, Table, ConfigProvider } from 'antd';
import { queryDataLSDL } from "../../api/asset";
import "./index.less"
import moment from "moment";
import zhCN from "antd/es/locale/zh_CN";
import 'moment/locale/zh-cn';
moment.locale('zh-cn'); // 注意这里设置 moment 必须放在有 import 的后面。
const { RangePicker } = DatePicker;

export default class Main extends Component {
  state = {
    tableData: [],
    columns: [],
    id: ""
  };
  dateList = ['', ''];

  componentDidMount() {
    this.initComData();
    this.queryDataLine();
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
    let { tableValueKey } = pluginOptions;
    let { tableName } = options;
    const deviceId = this.props.variable?.default_value;
    let parmas = {
      deviceId: deviceId,
      startTime: this.dateList[0] || "",
      endTime: this.dateList[1] || "",
      column: tableValueKey.filter(Boolean),
      tableName: tableName
    }
    let columnlist = [];
    let dataLIst = [];
    let { data } = await queryDataLSDL(parmas)
    if (data) {
      let { columns, values } = data;
      columnlist = columns.map(x=>{
        return {
          title: x,
          dataIndex: x,
          key: x,
        }
      })
      dataLIst = values.map((x,i) => {
        let obj = {}
        for (let index = 0; index < x.length; index++) {
          obj.key = i + "";
          obj[columns[index]] = x[index]
        }
        if (obj.time) {
          obj.time = moment(obj.time).format("MM-DD HH:mm")
        }
        return obj;
      })
    }
    console.log(columnlist);
    console.log(dataLIst);
    
    this.setState({ columns: columnlist })
    this.setState({ tableData: dataLIst })
  }

  selectDate = (dates, dateStrings) => {
    // console.log(dateStrings);
    this.dateList = dateStrings;
    this.queryDataLine();
  }

  Event_Center_getName() {
    return this.state.id;
  }

  render() {
    const { id, tableData, columns } = this.state;
    return (
      /*大屏定义外层容器百分百，不可删除*/
      <div id={id} className="highChartsLineBox" style={{ width: "100%", height: "100%" }}>
        <ConfigProvider locale={zhCN}>
          <RangePicker format="YYYY-MM-DD" placeholder={['开始日期', '结束日期']} onChange={(dates, dateStrings) => { this.selectDate(dates, dateStrings) }} />
        </ ConfigProvider>
        <Table bordered className="iotTable" scroll={{y: 300}} pagination={false} columns={columns} dataSource={tableData} />
      </div>
    );
  }
}
