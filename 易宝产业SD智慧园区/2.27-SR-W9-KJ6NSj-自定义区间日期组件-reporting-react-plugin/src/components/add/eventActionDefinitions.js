// 组件可派发事件
export const events = [
  {
    key: "dateOnOk",
    name: "日期选择完毕",
    payload: [
      {
        name: "日期区间",
        key: "dateRange",
        dataType: "objectArray"
      }
    ]
  }
];
// 组件可接收事件
export const actions = [
  {
    key: "dateOnGet",
    name: "获取日期",
    // params: [
    //   {
    //     key: "dateRange",
    //     name: "日期区间",
    //     dataType: "objectArray"
    //   }
    // ],
    hasReturn: false,
    // hasReturn为false则不用写returns选项
    returns: [
      {
        key: "dateRange",
        name: "日期区间",
        dataType: "object"
      }
    ]
  }
];

export default {
  actions,
  events
};
