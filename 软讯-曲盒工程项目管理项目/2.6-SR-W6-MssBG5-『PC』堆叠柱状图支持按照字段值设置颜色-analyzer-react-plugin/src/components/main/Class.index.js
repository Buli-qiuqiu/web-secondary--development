import React, { Component } from "react";

export default class Main extends Component {
  state = {
    id: "",
    developers:"",
    width: "100%",
    height: "100%",
    number: 1

  };

  componentDidMount() {
    //封装平台方法
    //同时封装外层dom id为需求编号，初始化事件注册，重要勿删
    this.props.mainInit && this.props.mainInit(this);
    this.initComData();
  }

  initComData = () => {
    //customConfig为组件式配置项数据
    //dataSource为分析仪左侧拖入的数据源
    const { dataSource, customConfig, options } = this.props;
    //customOptions为传统的输入框形式的配置项
    const customOptions = options?.externalVariables || {};
    //特别注意，因为配置项区域是懒加载，所以这里要给customConfig一个与配置项(designConfiguration下index.js)那边customConfig一样的默认值，否则由于第一次进去没有执行配置项的代码，customConfig此时其实是会报错，以下为样例
    customConfig.number && this.setState({ number: customConfig.number });
  };

  Event_Center_getName() {
    return this.state.id;
  }

  /**
   * 用于触发事件方法，window.eventCenter?.triggerEvent封装了一层，
   * @param {String} eventName 事件名
   * @param {Array} payload 事件传参
   *
   */
  triggerEvent = (eventName, payload)=> {
    this.props.componentId && window.eventCenter?.triggerEvent(
      this.props.componentId,
      eventName,
      //payload需为一个object
      payload
    );
  }
  handleClick = () => {
    console.log(this);
    this.triggerEvent("click", { value: "123" });
  };

  render() {
    return (
      <div
        className="analyzer-secondary"
        style={{ width: this.state.width, height: this.state.height }}
        id={this.state.id}
        developers={this.state.developers}
      >
        {/*以下为测试，正式开发请去除相关代码*/}
        {this.state.number}
        <button onClick= {this.handleClick}>逻辑控制样例</button>
      </div>
    );
  }
}
