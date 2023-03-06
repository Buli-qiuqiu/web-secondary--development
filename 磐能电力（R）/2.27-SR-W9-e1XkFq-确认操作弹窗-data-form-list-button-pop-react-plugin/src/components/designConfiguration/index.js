import React from "react"
import { useEffect } from "react"
import {
  Form,
  Input,
  Button
} from "antd"

function DesignConfiguration(props) {
  const [form] = Form.useForm()
  //此处的customConfig已经封装为一个object，可以直接使用,changeCustomConfig的入参应为一个json字符串
  const { customConfig = {} } = props;
  const { onUpdate, data = {}, className } = customConfig;
  //id为默认添加的配置项，勿删
  useEffect(() => {
    form.setFieldsValue(data || {});
    console.log('配置页-props', props);
  }, [])
  const handleValueChange = (allValues) => {
    console.log('allValues', allValues);
    onUpdate({ ...allValues })
  }

  const formItemLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 20 }
  }

  return (
    <>
      {/* onValuesChange={handleValueChange} */}
      <Form
        {...formItemLayout}
        form={form}
        onFinish={handleValueChange}
      >
        <Form.Item label="id" name="id">
          <Input style={{ width: "200px" }} />
        </Form.Item>
        <Form.Item label="标题" name="modalTitle">
          <Input style={{ width: "200px" }} />
        </Form.Item>
        <Form.Item label="内容" name="modalContent">
          <Input style={{ width: "200px" }} />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            提交
          </Button>
        </Form.Item>
      </Form>
    </>
  )
}

export default DesignConfiguration
