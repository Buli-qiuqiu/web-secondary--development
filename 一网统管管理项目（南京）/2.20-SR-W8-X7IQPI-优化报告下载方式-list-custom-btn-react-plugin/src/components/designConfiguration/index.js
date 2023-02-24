import React, { useEffect } from "react";
import { Form, Input,InputNumber } from "antd";

const DesignConfiguration = ({ changeConfiguration, configuration }) => {
  const [form] = Form.useForm();
  useEffect(() => {
    try {
      form.setFieldsValue(JSON.parse(configuration));
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
        <Form.Item label="type：" name="type" initialValue={''}>
          <Input />
        </Form.Item>
        <Form.Item label="department：" name="department" initialValue={''}>
          <input />
        </Form.Item>
        <Form.Item label="字段名" name="fieldName" initialValue={''}>
          <Input />
        </Form.Item>
        <Form.Item label="dayUrl" name="dayUrl" initialValue={''}>
          <Input />
        </Form.Item>
        <Form.Item label="monUrl" name="monUrl" initialValue={''}>
          <Input />
        </Form.Item>
        <Form.Item label="yearUrl" name="yearUrl" initialValue={''}>
          <Input />
        </Form.Item>
      </Form>z
    </>
  );
};

DesignConfiguration.propTypes = {};

export default DesignConfiguration;
