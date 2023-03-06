import {
  useRef,
  useEffect
} from "react"
import Utils from "../index.js"

function useDelegator(
  { componentId, customConfig },
  actions,
  eventActionDefinitions
) {

  const Event_Center_getName = () => {
    const requirementNumber = process.env.CONFIG_JSON_REQUIREMENTNUM
    return customConfig.id || requirementNumber || Utils.tools.generateUUID()
  }
  actions = { Event_Center_getName, ...actions }
  let ref = useRef(actions)
  useEffect(() => {
    window.componentCenter?.register(componentId, "comp", ref.current, eventActionDefinitions)
    return () => {
      window.componentCenter?.removeInstance(componentId)
    }
  }, [componentId, customConfig, actions, eventActionDefinitions])
}

export default useDelegator
