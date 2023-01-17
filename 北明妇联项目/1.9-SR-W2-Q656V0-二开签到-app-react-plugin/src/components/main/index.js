import React, { Component } from "react";
import moment from "moment";
import "./index.less";
import on from "./img/on.png";
import off from "./img/off.png";
import { message } from "antd";
import { queryCheckIn, checkIn, getUser, getContinuity } from "../../api/asset";

export default class Main extends Component {
  state = {
    id: "",
    number: 1,
    thisWeek: [],
  };

  async componentDidMount() {
    //封装平台方法
    //同时封装外层dom id为需求编号，初始化事件注册，重要勿删
    this.props.mainInit && this.props.mainInit(this);
    //获取当前周日期
    let thisWeek = [];
    let weekOfDay = parseInt(moment().format("E")); //计算今天是这周第几天
    for (let i = 1; i < 8; i++) {
      thisWeek.push(
        moment()
          .startOf("day")
          .subtract(weekOfDay - i, "days")
      );
    }
    //获取当前用户id
    const { data: userInfo } = await getUser();
    //获取当前用户签到信息
    const { data: userCheckInfo } = await queryCheckIn({
      date_of_arrival: moment().startOf("day").valueOf(),
      ids: userInfo.id,
    });
    //获取当前连续签到天数
    const { data: continuity } = await getContinuity({
      date_of_arrival: moment().startOf("day").valueOf(),
      ids: userInfo.id,
    });
    console.log("continuity: ", continuity);

    this.setState({
      thisWeek,
      userId: userInfo.id,
      userCheckInfo: userCheckInfo,
      continuity: continuity[0] && continuity[0].continuous_days,
    });
  }

  Event_Center_getName() {
    return this.state.id;
  }

  /**
   * 用于触发事件方法，window.eventCenter?.triggerEvent封装了一层，
   * @param {String} eventName 事件名
   * @param {Array} payload 事件传参
   *
   */
  triggerEvent = (eventName, payload) => {
    const componentId =
      this.props.componentId || this.props?.customConfig.componentId;
    componentId &&
      window.eventCenter?.triggerEvent(
        componentId,
        eventName,
        //payload需为一个object
        payload
      );
  };
  handleClick = () => {
    console.log(this);
    this.triggerEvent("click", { value: "123" });
  };
  onCheckIn = async (flag) => {
    console.log("flag: ", flag);
    if (!flag) {
      const data = await checkIn({
        date_of_arrival: moment().startOf("day").valueOf(),
        ids: this.state.userId,
        gain_points: 5,
      });
      console.log("data: ", data);
      if (data.status === 200) {
        message.success({
          content: "今日已签到，获得5积分",
          className: "messageCheckIn",
        });
        //获取当前用户签到信息
        const { data: userCheckInfo } = await queryCheckIn({
          date_of_arrival: moment().startOf("day").valueOf(),
          ids: this.state.userId,
        });
        this.setState({
          userCheckInfo: userCheckInfo,
          continuity: this.state.continuity + 1,
        });
      }
    } else {
      message.warning({
        content: "今日已签过，请明日再来",
        className: "messageCheckIn",
      });
    }
  };
  render() {
    const { thisWeek = [], userCheckInfo = [], continuity } = this.state;
    console.log("thisWeek: ", thisWeek);
    return (
      <div className="app-secondary" id={this.state.id}>
        <div className="checkIn">
          <div className="header">
            <span
              style={{
                marginTop: 14,
                marginLeft: 10,
                fontSize: 15,
                fontFamily: "PingFangSC-Medium, PingFang SC",
                fontWeight: 500,
                color: "#333333",
                lineHeight: "21px",
              }}
            >
              每日签到
            </span>
            <span
              style={{
                marginTop: 14,
                marginRight: 10,
                fontSize: 14,
                fontFamily: "PingFangSC-Regular, PingFang SC",
                fontWeight: 400,
                color: "#666666",
                lineHeight: "20px",
              }}
            >
              您已连续签到
              <span style={{ color: "#F1694E", marginLeft: 2 }}>
                {continuity}
              </span>
              天
            </span>
          </div>
          <div className="content">
            {thisWeek.map((day) => {
              let flag = false;
              let isCheckIn = userCheckInfo.find((item) =>
                day.isSame(item.date_of_arrival, "day")
              );
              if (isCheckIn && isCheckIn.punch_in === "1") flag = true;
              return (
                <>
                  <div className="hasCheckIn">
                    <div
                      className="hasInIcon"
                      onClick={
                        day.isSame(moment().valueOf(), "day")
                          ? () => this.onCheckIn(flag)
                          : () => {
                              message.warning({
                                content: "不是当前日期，无法签到",
                                className: "messageCheckIn",
                              });
                            }
                      }
                      style={
                        !flag
                          ? {
                              background:
                                "linear-gradient(180deg, rgba(255,210,180,0.32) 0%, #FFD9BF 100%)",
                            }
                          : {}
                      }
                    >
                      {flag ? (
                        <img src={on} alt="已签到" />
                      ) : (
                        <img src={off} alt="未签到" />
                      )}
                    </div>
                    <div className="date">{day.format("MM.DD")}</div>
                  </div>
                </>
              );
            })}
          </div>
        </div>
      </div>
    );
  }
}
