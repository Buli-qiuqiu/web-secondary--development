import React from "react"
import { useEffect } from "react"
import {
  Form,
  Input
} from "antd"

function DesignConfiguration(props) {
  const [form] = Form.useForm()
  //此处的customConfig已经封装为一个object，可以直接使用,changeCustomConfig的入参应为一个json字符串
  const { changeCustomConfig, customConfig } = props
  //id为默认添加的配置项，勿删
  useEffect(() => {
    form.setFieldsValue(customConfig)
  }, [])
  const handleValueChange = (changedValues, allValues) => {
    changeCustomConfig(JSON.stringify(allValues))
  }

  const formItemLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 20 }
  }

  return (
    <>
      <Form
        {...formItemLayout}
        form={form}
        onValuesChange={handleValueChange}
      >
        <Form.Item label="下标" name="position">
          <Input style={{ width: "200px" }} />
        </Form.Item>
        <Form.Item label="path" name="path">
          <Input style={{ width: "200px" }} />
        </Form.Item>
      </Form>
    </>
  )
}

export default DesignConfiguration
