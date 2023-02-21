import React, {
  useEffect
} from "react"
import PropTypes from "prop-types"
import { getThemeStyle } from "../themeColor"

const List = (props) => {
  const { data, formConfig, customConfig } = props
  useEffect(() => {
  }, [])

  return <div style={getThemeStyle(formConfig.theme)}>{data}</div>
}

List.propTypes = {
  data: PropTypes.string
}

export default List
