import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import useDelegator from "../../utils/handlePlatform/UseDelegator.js";
import eventActionDefinitions from "./eventActionDefinitions.js";
import Utils from "../../utils/index.js";
import { Button, Modal } from "antd";
import "./index.less";
const Add = (props) => {
  const {
    data,
    onChange,
    formConfig,
    component,
    customConfig,
    eventCenter,
    componentCenter,
    getExchangeTemplate,
  } = props;
  let id = null;
  const changeData = (val) => {
    id = val;
    onChange(val);
  };
  const showModal = () => {
    getExchangeTemplate &&
      getExchangeTemplate(data || id, customConfig?.type || "data", changeData);
  };
  const initData = () => {
    console.log(data);
  };
  useEffect(() => {
    initData();
  }, []);
  /**
   * 用于触发事件的方法，window.eventCenter?.triggerEvent封装了一层，
   * @param {String} eventName 事件名
   * @param {Object} payload 事件传参
   * @example triggerEvent("click",{value:"123"})
   *
   */
  const triggerEvent = (eventName, payload) => {
    window?.eventCenter.triggerEventNew({
      objectId: formConfig?.id,
      componentId: component.id,
      type: "report",
      event: eventName,
      payload,
    });
  };
  const Event_Center_getName = () => {
    const requirementNumber = process.env.CONFIG_JSON_REQUIREMENTNUM;
    return customConfig.id || requirementNumber || Utils.tools.generateUUID();
  };

  const do_EventCenter_message = ({ value }) => {
    alert(value);
  };
  const actionFunDefinitions = {
    do_EventCenter_message,
  };

  useDelegator(
    component.id,
    { Event_Center_getName, ...actionFunDefinitions },
    eventActionDefinitions,
    formConfig?.id,
    null,
    -1,
    { eventCenter, componentCenter }
  );
  return (
    <>
      <div className="reporting-secondary">
        {/*下边为样例，正式开发请删除number相关数据*/}
        <Button type="primary" onClick={showModal}>
          {customConfig?.name || "按钮"}
        </Button>
      </div>
    </>
  );
};

Add.propTypes = {
  data: PropTypes.string,
  onChange: PropTypes.func,
  getExchangeTemplate: PropTypes.func,
};

export default Add;
