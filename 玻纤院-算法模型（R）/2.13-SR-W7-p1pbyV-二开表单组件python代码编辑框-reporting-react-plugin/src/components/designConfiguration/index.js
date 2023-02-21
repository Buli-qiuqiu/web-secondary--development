import React, { useEffect } from "react";
import { Form, Input, Switch } from "antd";

const DesignConfiguration = ({ changeCustomConfig, customConfig }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    console.log("customConfig--->", customConfig);
    form.setFieldsValue(customConfig);
  }, []);

  const handleValueChange = (changedValues, allValues) => {
    form.setFieldsValue(allValues);
    changeCustomConfig(JSON.stringify(allValues));
  };

  const formItemLayout = {
    labelCol: { span: 24 },
  };

  return (
    <>
      <Form {...formItemLayout} form={form} onValuesChange={handleValueChange}>
        <Form.Item label="编辑框高度" name="editorHeight">
          <Input style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item
          label="是否只读"
          name="editorReadOnly"
          valuePropName="checked"
        >
          <Switch />
        </Form.Item>
      </Form>
    </>
  );
};

DesignConfiguration.propTypes = {};

export default DesignConfiguration;
