import {
  useRef,
  useState,
  useEffect
} from "react"
import PropTypes from "prop-types"
import { Input } from "antd"

import useDelegator from "../../utils/handlePlatform/UseDelegator.js"
import eventActionDefinitions from "./eventActionDefinitions.js"
import { getThemeStyle } from "../themeColor"

const Child = ({
                 data,
                 onChange,
                 formConfig,
                 component,
                 customConfig,
                 theme,
                 child_id,
                 index
               }) => {
  const state2 = useRef(data)
  const [state, setState] = useState(data)
  const [configuration, setConfiguration] = useState({})
  useEffect(() => {
    setConfiguration(customConfig)
  }, [])

  const triggerEvent = async (eventName, payload) => {
    await window.eventCenter.triggerEventNew({
      objectId: formConfig?.id,
      componentId: component.id,
      type: "report",
      event: eventName,
      payload: { ...payload, childIndex: index }
    })
  }

  const do_EventCenter_message = ({ value }) => {
    alert(value)
  }
  const actionFunDefinitions = {
    do_EventCenter_message
  }

  const Event_Center_getName = () => {
    return `${formConfig?.form_name}-${component.columnStyle.title}`
  }

  // 事件中心注册挂载
  useDelegator(
    component.id,
    { Event_Center_getName, ...actionFunDefinitions },
    eventActionDefinitions,
    formConfig?.id,
    child_id,
    index,
    { eventCenter: window.eventCenter, componentCenter: window.componentCenter }
  )
  return (
    <Input
      style={getThemeStyle(formConfig.theme)}
      value={state}
      defaultValue={data}
      onChange={(e) => {
        onChange(e.target.value)
        triggerEvent("change", { value: e.target.value })
        state2.current = e.target.value
        setState(e.target.value)
      }}
      {...configuration}
    />
  )
}
Child.propTypes = {
  data: PropTypes.string,
  onChange: PropTypes.func
}

export default Child
