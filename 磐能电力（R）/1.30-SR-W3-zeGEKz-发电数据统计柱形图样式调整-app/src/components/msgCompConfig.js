// 组件可派发事件
export const events = [];

// 组件可接收事件
export const actions = [
  {
    key: "getId",
    name: "参数ID",
    isSupportChild: false,
    params: [
      {
        key: "id",
        name: "ID",
        dataType: "string,number,objectArray",
      }
    ],
  }
];

export default {
  actions,
  events,
};
