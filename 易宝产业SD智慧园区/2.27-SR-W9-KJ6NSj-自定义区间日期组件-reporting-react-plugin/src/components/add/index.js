import React, {
  useState,
  useEffect
} from "react"
import PropTypes from "prop-types"
import useDelegator from "../../utils/handlePlatform/UseDelegator.js"
import eventActionDefinitions from "./eventActionDefinitions.js"
import Utils from "../../utils/index.js"
import moment from 'moment';
import 'moment/locale/zh-cn';
import locale from 'antd/lib/date-picker/locale/zh_CN';
import './index.css'
import { DatePicker, Form } from 'antd';

const { RangePicker } = DatePicker;

const Add = (props) => {
  const [form] = Form.useForm();
  const {
    data,
    onChange,
    formConfig,
    component,
    customConfig,
    eventCenter,
    componentCenter
  } = props

  const [dataType, setDataType] = useState("date");
  const [dateTypeVal, setDateTypeVal] = useState("YYYY-MM-DD");
  const [maxRangePicker, setMaxRangePicker] = useState("");
  const [dates, setDates] = useState(null);
  const [value, setValue] = useState(null);
  const [dateRange, setDateRange] = useState(null);
  // let dateRange = [];

  const initData = () => {
    setDataType(customConfig?.dataType || "date")
    setDateTypeVal(customConfig?.dateTypeVal || "YYYY-MM-DD")
    setMaxRangePicker(customConfig?.maxRangePicker || "")
  }
  useEffect(() => {
    form.setFieldsValue({});
    initData()
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

  const do_EventCenter_dateOnGet = ({ val }) => {
    // 获取表单参数
    let { onRange } = form.getFieldsValue();
    let formValue = [];
    if (onRange && onRange.length > 1) {
      formValue = [moment(onRange[0]).format('x'), moment(onRange[1]).format('x')];
    }
    return { dateRange: formValue }
  }
  const actionFunDefinitions = {
    do_EventCenter_dateOnGet
  }

  useDelegator(
    component.id,
    { Event_Center_getName ,...actionFunDefinitions},
    eventActionDefinitions,
    formConfig?.id,
    null,
    -1,
    { eventCenter, componentCenter }
  );

  const disabledDate = (current) => {
    if (!dates) {
      return false;
    }
    const tooLate = dates[0] && current.diff(dates[0], 'days') > Number(maxRangePicker) - 1;
    const tooEarly = dates[1] && dates[1].diff(current, 'days') > Number(maxRangePicker) - 1;
    return !!tooEarly || !!tooLate;
  };

  const onOpenChange = (open) => {
    if (open) {
      setDates([null, null]);
    } else {
      setDates(null);
    }
  };

  const onRangeChange = (val) => {
    setValue(val);
    if (val?.length && val.length > 0) {
      let dateRange = [moment(val[0]).format('x'), moment(val[1]).format('x')];
      setDateRange(dateRange);
    }
    // setDateRange(dateRanges)
    // triggerEvent('dateOnOk', { dateRange });
  };
  
  const onOk = (val) => {
    if (val?.length && val.length > 1) {
      let dateRange = [moment(val[0]).format('x'), moment(val[1]).format('x')];
      setDateRange(dateRange);
    }
    // setDateRange(dateRanges)
    // triggerEvent('dateOnOk', { dateRange });
  };

  return (
    <>
      <Form
        form={form}
      >
        <Form.Item name="onRange">
          <RangePicker
            format={dateTypeVal}
            locale={locale}
            showTime={
              dataType == "date" ? null : {
                format: 'HH:mm:ss',
              }
            }
            value={dates || value}
            disabledDate={disabledDate}
            onCalendarChange={(val) => setDates(val)}
            onChange={(val) => onRangeChange(val)}
            onOpenChange={onOpenChange}
            onOk={onOk}
          />
        </Form.Item>
      </Form>
    </>
  )
}

Add.propTypes = {
  data: PropTypes.string,
  onChange: PropTypes.func
}

export default Add
