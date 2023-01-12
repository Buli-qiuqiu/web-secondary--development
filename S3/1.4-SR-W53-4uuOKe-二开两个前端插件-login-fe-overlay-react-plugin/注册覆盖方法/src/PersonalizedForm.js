import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Form, Input, Button, message, Select, Checkbox, Row, Col } from 'antd';
import { promisify } from 'es6-promisify';
import { getCode, loginAccount, getUser, userMsgInsert } from './api/asset'; // 同二开的request
// import history from 'utils/history'; // 路由跳转
import request from "./api/request";
import './PersonalizedForm.less';
import qs from 'querystringify';


const cleanObject = obj =>
  Object.entries(obj).reduce(
    (prev, [key, value]) =>
      value === undefined ? prev : { ...prev, [key]: value },
    {}
  );
const stringify = (query, suffix) => qs.stringify(cleanObject(query), suffix);

const FormItem = Form.Item;
const { Option } = Select;

export default class PersonalizedForm extends Component {

  // formRef = React.createRef()
  state = {
    functionOptions: [],
    tradeOptions: [],
    channelOptions: [],
    sceneOptions: [],
  };

  constructor(props) {
    super(props);
    this.formRef = React.createRef();
    console.log(props, '======');
  }
  async componentDidMount() {

    try {
      const { data } = await request.get('ext/system/userMsg/queryAllMsg');
      const { channelList, scenariosList } = data;
      const functionList = [
        { label: '董事长/CEO/CIO', key: '1' },
        { label: 'CTO/研发总监/架构/产品', key: '2' },
        { label: '市场/销售/售前/运营', key: '3' },
        { label: '软件开发/数据开发', key: '4' },
        { label: '项目经理/测试/实施/运维', key: '5' },
        { label: '业务人员', key: '6' },
        { label: '其他', key: '99' },]
      const tradeList = [{ label: '城市/应急/政务', key: '1' },
      { label: '工业/能源/电力', key: '2' },
      { label: '园区/物流/交通', key: '3' },
      { label: '水利/水务/环保', key: '4' },
      { label: '医疗/卫生/教育', key: '5' },
      { label: '公安/军工/金融', key: '6' },
      { label: '其他', key: '99' },]
      const functionOptions = functionList.map(item => (
        <Option key={item.key} value={item.key}>
          {item.label}
        </Option>
      ));
      const tradeOptions = tradeList.map(item => (
        <Option key={item.key} value={item.key}>
          {item.label}
        </Option>
      ));
      const channelOptions = channelList.map(item => (
        <Option key={item.id} value={item.id}>
          {item.name}
        </Option>
      ));
      const sceneOptions = scenariosList.map(item => ({
        value: item.id,
        label: item.name,
      }));
      this.setState({
        functionOptions,
        tradeOptions,
        channelOptions,
        sceneOptions,
      });
    } catch (err) {
      message.error('请求失败', 1);
    }
  }

  validateFieldsAndScroll = () => {
    return 5
  };
  // validateFieldsAndScroll = promisify(this.formRef.current.validateFieldsAndScroll);

  handleSubmit = async value => {
    try {
      const params = {
        ...value,
        scenariosCode: value.scenariosCode.join(','),
        needHelp: +value.needHelp,
        phone: this.props.mobile,
      };
      await userMsgInsert(params);

      this.props?.funstate?.stateTest(this.props.token);
      this.props?.funstate?.isModalFn()
      // if (window.location.search.includes('redirect_url')) {
      //   try {
      //     const qsSearch = qs.parse(window.location.search);
      //     const { appKey, redirect_url } = qsSearch;
      //     const { data } = await getCode({ appKey });
      //     const param = redirect_url.includes('?');
      //     if (appKey) {
      //       window.location.href =
      //         redirect_url + qs.stringify({ code: data }, param ? '&' : true);
      //     } else {
      //       window.location.href = redirect_url;
      //     }
      //   } catch (error) {
      //     console.log(error);
      //   }
      // } else {

      //   //页面跳转
      //   // history.push({
      //   //   pathname: '/',
      //   //   search: stringify({
      //   //     newUser: true,
      //   //   }),
      //   // });
      // }
    } catch (err) {
      message.error('请求失败', 1);
    }
  };

  render() {
    // const { form } = this.props;
    const {
      functionOptions,
      tradeOptions,
      channelOptions,
      sceneOptions,
    } = this.state;
    return (
      <div className="PersonalizedPage">
        <div className="personalized_steps">
          <div className="personalized_A" style={{ color: '#fff' }}>
            登录账号
          </div>
          <div className="personalized_B" style={{ color: '#fff' }}>
            个性化信息
          </div>
          <div className="personalized_C" style={{ color: '#555555' }}>
            激活成功
          </div>
        </div>
        <div className="personalizedContent">
          <div>
            <span className="message-info">请输入您的信息</span>
            <span className="message-info1">
              为了更好的为您服务，请完善您的个人信息，我们将会为您提供更适合的学习资料、项目案例等
            </span>
          </div>
          <Form
            className="personalized_form"
            onFinish={this.handleSubmit}
            ref={this.formRef}
            autoComplete="off"
          >
            <Row>
              <Col span={11}>
                <FormItem name='name' rules={[
                  {
                    required: true,
                    message: '请输入姓名',

                  },
                ]} >

                  <Input
                    autoComplete="off"
                    placeholder="请输入您的姓名"
                    maxLength={32}
                  />

                </FormItem>
              </Col>
              <Col span={2} />
              <Col span={11}>
                <FormItem name='email' rules={[
                  {
                    pattern: /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/,
                    required: true,
                    message: '请输入正确的邮箱地址!',
                  },
                ]}  >

                  <Input
                    autoComplete="off"
                    placeholder="请输入您的邮箱"
                    maxLength={32}
                  />

                </FormItem>
              </Col>
            </Row>

            <Row>
              <Col span={11}>
                <FormItem name='companyName' rules={[
                  {
                    required: true,
                    message: '请输入您的公司名',
                  },
                ]}  >

                  <Input
                    autoComplete="off"
                    placeholder="请输入您的公司名"
                    maxLength={32}
                  />

                </FormItem>
              </Col>
              <Col span={2} />
              <Col span={11}>
                <FormItem name='functionCode' rules={[
                  {
                    required: true,
                    message: '请选择',
                  },
                ]} >

                  <Select placeholder="您的职能是">{functionOptions}</Select>

                </FormItem>
              </Col>
            </Row>

            <Row>
              <Col span={11}>
                <FormItem name='tradeCode' rules={[
                  {
                    required: true,
                    message: '请选择',
                  },
                ]}>

                  <Select
                    placeholder="您所在的行业"
                  // onChange={this.handleSelectChange}
                  >
                    {tradeOptions}
                  </Select>

                </FormItem>
              </Col>
              <Col span={2} />
              <Col span={11}>
                <FormItem name='channelCode' rules={[
                  {
                    required: true,
                    message: '请选择',
                  },
                ]}  >

                  <Select placeholder="哪个渠道了解到我们">
                    {channelOptions}
                  </Select>

                </FormItem>
              </Col>
            </Row>

            <div>
              <span className="message-info">您的应用场景是（可多选）</span>
            </div>
            <FormItem name='scenariosCode' rules={[
              {
                required: true,
                message: '请选择您的应用场景',
              },
            ]} style={{ padding: 10, border: '1px #DDDDDD solid' }}>

              <Checkbox.Group className="sceneStyle" options={sceneOptions} />

            </FormItem>
            <FormItem name='needHelp' initialValue={true} valuePropName='checked' style={{ textAlign: 'center' }}>

              <Checkbox>
                需要数睿数据尽快与我联系，详细介绍产品、方案或报价，或提供帮助。
              </Checkbox>

            </FormItem>
            {/* <p className="jump">
            <Link to="/" replace>
              跳过此步骤&gt;&gt;
            </Link>
          </p> */}
            <FormItem style={{ textAlign: 'center' }}>
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                className="login-form-button"
              >
                确认提交
              </Button>


            </FormItem>
          </Form>
        </div>
      </div>
    );
  }
}

