import React, { useEffect } from "react";
import { Form, Input } from "antd";
import { Select } from "antd";

const DesignConfiguration = ({ changeCustomConfig, customConfig }) => {
  const [form] = Form.useForm();
  useEffect(() => {
    form.setFieldsValue(customConfig);
  }, []);

  const handleValueChange = (changedValues, allValues) => {
    changeCustomConfig(JSON.stringify(allValues));
  };

  const formItemLayout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  };

  return (
    <>
      <Form
        {...formItemLayout}
        form={form}
        onValuesChange={handleValueChange}
        initialValues={{
          name: "按钮",
          type: "data",
        }}
      >
        <Form.Item label="交换机类型" name="type">
          <Select
            style={{ width: "170px" }}
            defaultValue="data"
            options={[
              { value: "data", label: "数据流" },
              { value: "control", label: "控制流" },
              { value: "realTimeStream", label: "实时流" },
            ]}
          />
        </Form.Item>
        <Form.Item label="按钮名称" name="name">
          <Input style={{ width: "170px" }} />
        </Form.Item>
      </Form>
    </>
  );
};

DesignConfiguration.propTypes = {};

export default DesignConfiguration;
