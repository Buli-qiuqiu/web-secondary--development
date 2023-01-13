import React, { useEffect } from "react";
import { Form, InputNumber, Input, Select } from "antd";

const DesignConfiguration = ({ changeConfiguration, configuration, componentList }) => {
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
        <Form.Item label="校验资产ID：" name="checkAssetsId">
          <Input />
        </Form.Item>
        <Form.Item label="校验变量名：" name="checkKey">
          <Input />
        </Form.Item>
        <Form.Item label="详情页路由：" name="infoUrl">
          <Input />
        </Form.Item>
        <Form.Item label="详情页路由主键变量名：" name="dataId">
          <Input />
        </Form.Item>
        <Form.Item label="请求资产匹配变量名：" name="dataIdKey">
          <Input />
        </Form.Item>
        <Form.Item label="当前数据变量名：" name="nowItem">
          <Select
            fieldNames={{ label: 'title', value: 'id' }}
            options={options}
          />
        </Form.Item>
      </Form>
    </>
  );
};

DesignConfiguration.propTypes = {};

export default DesignConfiguration;
