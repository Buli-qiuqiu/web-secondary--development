// 组件可派发事件
export const events = [
   {
      key: "editData",
      name: "编辑资料",
      payload: [
         {
            name: "编辑",
            key: "citycode",
            dataType: "string",
         },
      ],
   },
];

// 组件可接收事件
export const actions = [];

export default {
   actions,
   events,
};
