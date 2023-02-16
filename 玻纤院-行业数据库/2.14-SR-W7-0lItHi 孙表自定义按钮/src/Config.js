/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
import { Col, Form, Input, Row, Select } from 'antd';
import { useSetState } from 'ahooks';

import {
  getStructNames,
  queryDetailStruct,
  queryFormStruct,
} from './api/asset';

const { Option } = Select;

const createStructOption = (structs = []) =>
  structs.map(struct => {
    return (
      <Option key={struct} value={struct}>
        {struct}
      </Option>
    );
  });

const Config = ({
  configValue,
  changeConfigValue,
  subTableComponents,
  page,
}) => {
  const [state, setState] = useSetState(
    configValue ?? { sunTableRelation: {} }
  );

  const [childTableStructs, setChildTableStructs] = useState([]);
  const [subChildTableStructs, setSunChildTableStructs] = useState([]);

  const changeWidth = e => {
    setState({ width: e.target.value });
  };
  const changeHeight = e => {
    setState({ height: e.target.value });
  };
  const changeTitle = e => {
    setState({ title: e.target.value });
  };
  const changemoduleId = e => {
    setState({ sunTableFormId: e.target.value });
  };
  const changeSubTableField = value => {
    setState({
      sunTableRelation: { subTableField: value, ...state.sunTableRelation },
    });
  };
  const changeSunTableField = value => {
    setState({
      sunTableRelation: { sunTableField: value, ...state.sunTableRelation },
    });
  };

  const queryForm = async function() {
    const query = page === 'formPage' ? queryFormStruct : queryDetailStruct;

    const structs = await query(state.sunTableFormId);
    setSunChildTableStructs(structs);
    // const pages = data.currentDatapp.datappPageFormInfo.resultPages.children;
  };

  useEffect(() => {
    changeConfigValue(state);
  }, [state]);

  useEffect(() => {
    queryForm();
  }, [state.sunTableFormId]);
  useEffect(() => {
    Promise.resolve(getStructNames(subTableComponents)).then(structs => {
      setChildTableStructs(structs);
    });
  }, [subTableComponents]);

  return (
    <div>
      <Form.Item
        label="弹窗名称"
        // rules={[{ required: true, message: 'Please input your username!' }]}
      >
        <Input onChange={changeTitle} defaultValue={state.title ?? '表单'} />
      </Form.Item>
      <Form.Item
        label="宽度"
        // rules={[{ required: true, message: 'Please input your username!' }]}
      >
        <Input onChange={changeWidth} defaultValue={state.width ?? 720} />
      </Form.Item>
      <Form.Item
        label="高度"
        // rules={[{ required: true, message: 'Please input your username!' }]}
      >
        <Input onChange={changeHeight} defaultValue={state.height ?? 640} />
      </Form.Item>
      <Form.Item
        label="绑定一个表单当孙表"
        // rules={[{ required: true, message: 'Please input your username!' }]}
      >
        <Input onChange={changemoduleId} defaultValue={state.sunTableFormId} />
      </Form.Item>

      <Row>
        <Col span={12}>
          <Form.Item
            label="子表字段"
            wrapperCol={{ span: 24, offset: 0 }}
            labelCol={{ span: 24, offset: 0 }}
            // rules={[{ required: true, message: 'Please input your username!' }]}
          >
            <Select
              onChange={changeSubTableField}
              defaultValue={state.sunTableRelation?.subTableField}
            >
              {createStructOption(childTableStructs)}
            </Select>
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item
            label="孙表字段"
            wrapperCol={{ span: 24, offset: 0 }}
            labelCol={{ span: 24, offset: 0 }}
            // rules={[{ required: true, message: 'Please input your username!' }]}
          >
            <Select
              onChange={changeSunTableField}
              defaultValue={state.sunTableRelation?.sunTableField}
            >
              {createStructOption(subChildTableStructs)}
            </Select>
          </Form.Item>
        </Col>
      </Row>
    </div>
  );
};
export default Config;
