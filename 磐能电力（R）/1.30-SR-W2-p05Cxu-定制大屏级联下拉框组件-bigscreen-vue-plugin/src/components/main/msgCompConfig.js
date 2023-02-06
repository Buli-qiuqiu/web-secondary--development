// 组件可派发事件
export const events = [
  {
    key: "loadFinish",
    name: "加载完成",
    payload: [
      {
        name: "值",
        key: "value",
        dataType: "object",
      },
    ],
  },
  {
    key: "contentChange",
    name: "内容改变",
    payload: [
      {
        name: "值",
        key: "value",
        dataType: "object",
      },
    ],
  },
];

// 组件可接收事件
export const actions = [
  {
    key: "trueSelect",
    name: "显示组件",
    params: [
      {
        key: "booleanTrue",
        name: "值",
        dataType: "string",
      },
    ],
  },
  {
    key: "falseSelect",
    name: "隐藏组件",
    params: [
      {
        key: "booleanFalse",
        name: "值",
        dataType: "string",
      },
    ],
  },
];

export default {
  actions,
  events,
};
