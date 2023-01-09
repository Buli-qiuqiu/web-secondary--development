import React, { useEffect, useState } from "react";
import { Form, InputNumber, Select, Input } from "antd";

const DesignConfiguration = (props) => {
  const { changeConfiguration, configuration, componentList } = props
  const [form] = Form.useForm();
  const [options, setOptions] = useState([])
  useEffect(() => {
    try {
      form.setFieldsValue(JSON.parse(configuration));
      let option = componentList.map(x => {
        return {
          value: x.id,
          label: x.title,
        }
      })
      setOptions(option)
    } catch (error) {
      console.error("configuration解析错误", error);
    }
  }, []);

  const onFormLayoutChange = (changedValues, allValues) => {
    changeConfiguration(allValues);
  };

  const formItemLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 18 },
  };

  return (
    <>
      <Form
        {...formItemLayout}
        form={form}
        onValuesChange={onFormLayoutChange}
      >
        <Form.Item label="宽度：" name="width" initialValue={520}>
          <InputNumber />
        </Form.Item>
        <Form.Item label="图片变量名：" name="imgSrc">
          <Select
            fieldNames={{ label: 'title', value: 'id' }}
            options={options}
          />
        </Form.Item>
        {/* <Form.Item label="高度：" name="height" initialValue={520}>
          <InputNumber />
        </Form.Item> */}
        {/* <Form.Item label="图片变量名：" name="imgKey">
          <Input />
        </Form.Item> */}
      </Form>
    </>
  );
};

DesignConfiguration.propTypes = {};

export default DesignConfiguration;
