import {
  useEffect,
  useState
} from "react"
import adapter from "./adapter.js"
import { isEqual } from "lodash"

const configJson = require("../../../pluginTemp/config.json")
const pluginType = configJson.type === "app"
  ? configJson.props.type === "customize" ? "app" : configJson.props.type
  : configJson.type

function ResponseDataHoc({ props, context, eventBus }) {
  return function(App) {
    const ResponseDataLayer = () => {
      const [responseProps, setResponseProps] = useState(props)
      useEffect(() => {
        eventBus.on((newProps) => {
          if (isEqual(responseProps, newProps)) {
            return
          }
          props = adapter(newProps, pluginType)
          setResponseProps(props)
        })
        return () => {
          eventBus.remove()
        }
      }, [])
      return <App {...context} {...responseProps} />
    }
    return <ResponseDataLayer></ResponseDataLayer>
  }
}

export default ResponseDataHoc
