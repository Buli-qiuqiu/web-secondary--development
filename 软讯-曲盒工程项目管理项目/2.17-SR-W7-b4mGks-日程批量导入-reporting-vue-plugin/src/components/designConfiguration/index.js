import React, { useEffect } from "react"
import {
  Form,
  Input,
} from "antd"

const DesignConfiguration = ({ changeCustomConfig, customConfig }) => {
  const [form] = Form.useForm()
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
        <Form.Item label="id" name="id">
          <Input style={{ width: "200px" }} />
        </Form.Item>
      </Form>
    </>
  )
}

DesignConfiguration.propTypes = {}

export default DesignConfiguration
