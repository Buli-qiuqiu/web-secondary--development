import React, { useEffect, useState } from "react";
import EventActionDefinitions from "./eventActionDefinitions.js";
import useDelegator from "../../utils/handlePlatform/UseDelegator.js";
import Utils from "../../utils/index.js";
import { exportZip } from "../../api/asset";
const Main = (props) => {
  console.log(props.allParams.allComponentList);
  const [position, setPosition] = useState(
    JSON.parse(props?.customParams).position
  );
  const [path, setPath] = useState(JSON.parse(props?.customParams).path);
  const [pathId, setPathId] = useState(
    props.allParams.allComponentList[
      Number(JSON.parse(props?.customParams).position)
    ].component_id
  );
  const customParams = JSON.parse(props?.customParams);
  const initComData = () => {
    let message = {
      path: path,
    };
    props.selectedRows.forEach((item) => {
      for (const key in item) {
        if (key == pathId) {
          message.dataId = item[key];
          exportZip(message).then((res) => {
            console.log(res);
            let blob = new Blob([res.data], { type: "application/zip" });
            let url = window.URL.createObjectURL(blob);
            const link = document.createElement("a"); // 创建a标签
            link.href = url;
            link.download = decodeURI(
              res.headers['content-disposition'].split("=")[1].split(".")[0]
            ); // 重命名文件
            link.click();
            URL.revokeObjectURL(url); // 释放内存
          });
        }
      }
    });
  };
  const Event_Center_getName = () => {
    const requirementNumber = process.env.CONFIG_JSON_REQUIREMENTNUM;
    return customParams.id || requirementNumber || Utils.tools.generateUUID();
  };

  const do_EventCenter_message = ({ value }) => {
    alert(value);
  };

  const actionFunDefinitions = {
    do_EventCenter_message,
  };
  /**
   * 用于触发事件的方法，window.eventCenter?.triggerEvent封装了一层，
   * @param {String} eventName 事件名
   * @param {Object} payload 事件传参
   * @example triggerEvent("click",{value:"123"})
   *
   */
  const triggerEvent = (eventName, payload) => {
    const componentId = props.componentId;
    componentId &&
      window.eventCenter?.triggerEventNew({
        objectId: props.viewId,
        componentId: props.componentId,
        type: "viewer",
        event: eventName,
        payload,
      });
  };
  const handleClick = () => {
    triggerEvent("click", { value: "123" });
  };
  useEffect(() => {
    initComData();
  }, []);
  useDelegator(
    props.componentId,
    { Event_Center_getName, ...actionFunDefinitions },
    EventActionDefinitions,
    props.viewId
  );
  return (
    <>
      <div>{/*以下为样例，正式开发请去除相关代码*/}</div>
    </>
  );
};

export default Main;
