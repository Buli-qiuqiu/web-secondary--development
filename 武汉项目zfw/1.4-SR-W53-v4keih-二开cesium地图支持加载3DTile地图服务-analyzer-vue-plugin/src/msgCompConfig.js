// 组件可派发事件，用eventCenter.triggerEvent触发
export const events = [
  {
    key: "valueChange",
    name: "值改变",
    payload: [
      {
        name: "值",
        key: "value",
        dataType: "string"
      }
    ]
  }
];

// 组件可接收事件,定义方法需加上do_EventCenter_前缀，数组可以为空，但不能删除定义
export const actions = [
  // {
  //   key: "messageSuccess",
  //   name: "成功提示",
  //   params: [
  //     {
  //       key: "value",
  //       name: "值",
  //       dataType: "string"
  //     }
  //   ],
  //   hasReturn: false,
  //   // hasReturn为false则不用写returns选项
  //   returns: [
  //     {
  //       key: "value",
  //       name: "值",
  //       dataType: "string"
  //     }
  //   ]
  // }


];

export default {
  actions,
  events
};
