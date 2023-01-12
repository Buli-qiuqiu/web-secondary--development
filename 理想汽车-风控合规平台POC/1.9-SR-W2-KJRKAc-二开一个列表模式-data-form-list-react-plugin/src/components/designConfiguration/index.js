import React, { useEffect } from "react";
import { Form, Input, Switch } from "antd";
import { MinusCircleOutlined, PlusCircleOutlined } from "@ant-design/icons";
import { useDynamicList } from "ahooks";

const UrlList = ({ onChange, defaultValue = [""] }) => {
  const { list, remove, getKey, insert, replace } =
    useDynamicList(defaultValue);

  useEffect(() => {
    onChange(list);
  }, [list]);

  const Row = (index: number, item: any) => (
    <div key={getKey(index)} style={{ marginBottom: 16 }}>
      <span>第{index + 1}级 </span>
      <Input
        style={{ width: 150 }}
        placeholder="不填写不会点击跳转"
        onChange={(e) => replace(index, e.target.value)}
        value={item}
      />

      {list.length > 1 && (
        <MinusCircleOutlined
          style={{ marginLeft: 8 }}
          onClick={() => {
            remove(index);
          }}
        />
      )}
      <PlusCircleOutlined
        style={{ marginLeft: 8 }}
        onClick={() => {
          insert(index + 1, "");
        }}
      />
    </div>
  );

  return <>{list.map((ele, index) => Row(index, ele))}</>;
};

function DesignConfiguration(props) {
  const [form] = Form.useForm();
  //此处的customConfig已经封装为一个object，可以直接使用,changeCustomConfig的入参应为一个json字符串
  const { changeCustomConfig, customConfig } = props;
  //id为默认添加的配置项，勿删
  !customConfig.id && (customConfig.id = "");
  //此处为最简单的样例
  !customConfig.number && (customConfig.number = 1);

  const formItemLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 20 },
  };
  const handleValueChange = (changedValues, allValues) => {
    changeCustomConfig(JSON.stringify(allValues));
  };
  return (
    <div className="designConfiguration">
      <Form
        layout="vertical"
        // {...formItemLayout}
        form={form}
        onValuesChange={handleValueChange}
      >
        <Form.Item label="右键菜单" name="isOpenContextMenu">
          <Switch defaultChecked={customConfig.isOpenContextMenu}></Switch>
        </Form.Item>
        <Form.Item label="节点点击跳转url" name="urlList">
          <UrlList defaultValue={customConfig.urlList}></UrlList>
        </Form.Item>
      </Form>
    </div>
  );
}

export default DesignConfiguration;
