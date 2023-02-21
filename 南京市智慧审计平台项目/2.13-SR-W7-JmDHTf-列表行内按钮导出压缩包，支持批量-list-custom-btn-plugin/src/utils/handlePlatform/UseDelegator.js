import {
  useRef,
  useEffect
} from "react"

function useDelegator(
  id,
  actions,
  eventActionDefinitions
) {
  let ref = useRef(actions)
  useEffect(() => {
    window.componentCenter?.register(id, "comp", ref.current, eventActionDefinitions)
    return () => {
      window.componentCenter?.removeInstance(id)
    }
  }, [id, actions, eventActionDefinitions])
}

export default useDelegator
