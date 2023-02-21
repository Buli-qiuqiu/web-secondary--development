// 组件可派发事件
export const events = [
  {
    key: "click",
    name: "点击",
    payload: [
      {
        name: "值",
        key: "value",
        dataType: "string"
      }
    ]
  }
];
// 组件可接收事件
export const actions = [
  {
    key: "sub_system_id",
    name: "sub_system_idID",
    params: [
      {
        key: "value",
        name: "子系统",
        dataType: "string"
      }
    ],
    hasReturn: false,
    // hasReturn为false则不用写returns选项
    // returns: [
    //   {
    //     key: "value",
    //     name: "值",
    //     dataType: "string"
    //   }
    // ]
  },
  {
    key: "executor_id",
    name: "executor_idID",
    params: [
      {
        key: "value",
        name: "执行人id",
        dataType: "string"
      }
    ],
    hasReturn: false,
  },
  {
    key: "project_id",
    name: "project_idID",
    params: [
      {
        key: "value",
        name: "项目表id",
        dataType: "string"
      }
    ],
    hasReturn: false,
  }
];

export default {
  actions,
  events
};
