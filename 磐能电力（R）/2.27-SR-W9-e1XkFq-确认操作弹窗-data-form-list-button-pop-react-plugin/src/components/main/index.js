import React, {
  useEffect,
  useState
} from "react"
import EventActionDefinitions from "./eventActionDefinitions.js"
import useDelegator from "../../utils/handlePlatform/UseDelegator.js"
import Utils from "../../utils/index.js"
import { Button, Modal } from 'antd';
import { InfoCircleFilled } from '@ant-design/icons';

import "./index.less"

const Main = (props) => {
  const [modalTitle, setModalTitle] = useState("");
  const [modalContent, setModalContent] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // const customConfig = props?.customParams ? JSON.parse(props?.customParams) : {};

  const { customConfig = {}, onOk, onCancel } = props;
  const { data = {} } = customConfig;


  const showModal = () => {
    const { visible } = data;
    setIsModalOpen(visible || true);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
    onCancel();
  };
  const handleClick = () => {
    setIsModalOpen(false);
    onOk();
  }

  const initComData = () => {
    data.modalTitle && setModalTitle(data.modalTitle);
    data.modalContent && setModalContent(data.modalContent);
    console.log('展示页--props', props);
    showModal();
  }
  const Event_Center_getName = () => {
    const requirementNumber = process.env.CONFIG_JSON_REQUIREMENTNUM
    return customConfig.id || requirementNumber || Utils.tools.generateUUID()
  }

  const do_EventCenter_message = ({ value }) => {
    alert(value)
  }
  const actionFunDefinitions = {
    do_EventCenter_message
  }
  /**
   * 用于触发事件的方法，window.eventCenter?.triggerEvent封装了一层，
   * @param {String} eventName 事件名
   * @param {Object} payload 事件传参
   * @example triggerEvent("click",{value:"123"})
   *
   */
  const triggerEvent = (eventName, payload) => {
    const componentId = props.componentId
    componentId && window.eventCenter?.triggerEventNew({
        objectId: props.viewId,
        componentId: props.componentId,
        type: "viewer",
        event: eventName,
        payload
      }
    )
  }

  useEffect(() => {
    initComData()
  }, [])
  useDelegator(props, actionFunDefinitions, EventActionDefinitions)

  const footerBtn = [
    <Button key="submit" type="primary" className="okBtn" onClick={handleClick}>
      确定
    </Button>,
    <Button key="cancel" className="canceBtn" onClick={handleCancel}>
      取消
    </Button>
  ]

  return (
    <>
      <Modal
        title={modalTitle}
        open={isModalOpen} 
        onCancel={handleCancel}
        footer={footerBtn}
      >
        <div className="tipModal">
          <InfoCircleFilled style={{ fontSize: "40px",color: "#f52349" }}/>
          <span className="tipContent">{ modalContent }</span>
        </div>
      </Modal>
    </>
  )
}

export default Main
