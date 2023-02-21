import React, {
  useState,
  useEffect
} from "react"
import PropTypes from "prop-types"
import useDelegator from "../../utils/handlePlatform/UseDelegator.js"
import eventActionDefinitions from "./eventActionDefinitions.js"
import Utils from "../../utils/index.js"
import { message, Upload, Button, Modal } from "antd";
import { postFile } from './../../api/asset';
import { CloudUploadOutlined, CheckCircleFilled, CloseCircleFilled } from '@ant-design/icons';

import './index.less';

let propsAttr = {
  name: 'file',
  listType: "picture",
  action: `/sdata/rest/RXQHBatchInsert/importExcel`,
  maxCount: 1,
  headers: {
    authorization: 'authorization-text',
  },
  onChange(info) {
    // if (info.file.status !== 'uploading') {
    //   console.log(info.file, info.fileList);
    // }
    if (info.file.status === 'done') {
      console.log('doneinfo', info);
      // message.success(`${info.file.name} 文件上传成功`);
    } else if (info.file.status === 'error') {
      console.log('info===', info);
      message.error(`${info.file.name} 文件上传失败，请重试`);
    }
  }
};

let sub_system_id = "",executor_id = "",project_id = "";

const Add = (props) => {
  const {
    data,
    onChange,
    formConfig,
    component,
    customConfig,
    eventCenter,
    componentCenter
  } = props

  const [fileList, setFileList] = useState([]);
  const [modalTwoVisible, setModalTwoVisible] = useState(false);
  const [successData, setSuccessData] = useState({});

  // const initData = () => {
  // }

  useEffect(() => {
    // initData()
  }, [])
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
      payload
    })
  }
  const Event_Center_getName = () => {
    const requirementNumber = process.env.CONFIG_JSON_REQUIREMENTNUM
    return customConfig.id || requirementNumber || Utils.tools.generateUUID()
  }

  const do_EventCenter_sub_system_id = ({ value }) => {
    sub_system_id = value;
    console.log('sub_system_id=====',value)
  }
  const do_EventCenter_executor_id = ({ value }) => {
    executor_id = value;
    console.log('executor_id========', value)
  }
  const do_EventCenter_project_id = ({ value }) => {
    project_id = value;
    console.log('project_id=======', value)
  }

  const actionFunDefinitions = {
    do_EventCenter_sub_system_id,
    do_EventCenter_executor_id,
    do_EventCenter_project_id
  }

  useDelegator(
    component.id,
    { Event_Center_getName ,...actionFunDefinitions},
    eventActionDefinitions,
    formConfig?.id,
    null,
    -1,
    { eventCenter, componentCenter }
  )

  const handleCancelTwo = () => {
    setModalTwoVisible(false);
  }
  const downLoadHandel = (fileUrl) => {
    window.location.href = fileUrl;
  }
  // 上传前回调
  const handleBeforeUpload = (file) => {
    let type = file.name.split('.');
    let last = type.length - 1;
    const isPNG = type[last] === 'xls';
    if (!isPNG) {
      message.error(`${file.name}不是.xls文件`);
    }
    return isPNG || Upload.LIST_IGNORE;
  }

  // 上传
  const doImgUpload = (options) => {
    const { onSuccess, onError, file, onProgress } = options;
    let formData = new FormData();
    formData.append("file", file);
    let params = {
      sub_system_id,
      executor_id,
      project_id,
      formData
    }
    postFile(params).then(res => {
      let { data } = res;
      onProgress({ percent: 100})
      onSuccess(file)
      setSuccessData(data)
      setModalTwoVisible(true);
    }).catch(err => {
      onProgress({ percent: 100 })
      onError(file)
    })
  }


  return (
    <div className="pinks">
      <Upload {...propsAttr} className="uploadBtn" beforeUpload={handleBeforeUpload} customRequest={doImgUpload}>
        <Button type="dashed" size="large" icon={<CloudUploadOutlined />}>上传附件</Button>
      </Upload>
      <Modal title="导入文件" open={modalTwoVisible} footer={null} destroyOnClose={true} onCancel={handleCancelTwo} width={550} wrapClassName="tranferModalTwo" getContainer={false}>
        {
          successData.errorCount > 0
            ?
            <div className="successBox">
              <CloseCircleFilled style={{ fontSize: '40px', marginBottom: '30px', color: "#fe5b5e" }} />
              <div className="suceessTextBox">
                成功导入<span className="suceessText">{successData.successCount}</span>条数据，
                导入失败<span className="errText">{successData.errorCount}</span>条数据
              </div>
              <Button type="primary" style={{ marginTop: '20px' }} onClick={() => { downLoadHandel(successData.errorPath) }}>导出失败数据</Button>
            </div>
            :
            <div className="successBox">
              <CheckCircleFilled style={{ fontSize: '40px', marginBottom: '30px', color: "#33c5aa" }} />
              <div className="suceessTextBox">
                成功导入<span className="suceessText">{successData.successCount}</span>条数据，
                导入失败<span className="errText">{successData.errorCount}</span>条数据
              </div>
            </div>
        }
      </Modal>
    </div>
  )
}

Add.propTypes = {
  data: PropTypes.string,
  onChange: PropTypes.func
}

export default Add
