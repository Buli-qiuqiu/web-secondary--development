// 组件可派发事件
export const events = [
   {
      key: "clickMarker",
      name: "坐标点ID",
      payload: [
         {
            name: "坐标点ID",
            key: "value",
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
