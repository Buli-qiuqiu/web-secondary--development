// 过滤后数据格式
// {
//   "componentId": "461ebf45-2bf3-49c8-a053-3a7567cb81f0",
//   "id": "2b95f05d6e5f40acbe4903b72fbf7f8e",
//   "modelId": "7ff4ebb7-bbf6-402f-8efc-e1ccf802da57",
//   "needCountFlag": false,
//   "notAllowedChange": false,
//   "showType": "input",
//   "sort": 1,
//   "list": [
//       {
//           "colId": "461ebf45-2bf3-49c8-a053-3a7567cb81f0",
//           "colName": "单行文本",
//           "value": "123",
//           "type": 0
//       }
//   ],
//   "filterValue": [
//       {
//           "colId": "461ebf45-2bf3-49c8-a053-3a7567cb81f0",
//           "colName": "单行文本",
//           "value": "123",
//           "type": 0
//       }
//   ]
// }

// _queryList数据格式
// [
//   {
//       "componentId": "461ebf45-2bf3-49c8-a053-3a7567cb81f0",
//       "id": "88bb9a4b67a842c3bcdf8124decfcda4",
//       "modelId": "7ff4ebb7-bbf6-402f-8efc-e1ccf802da57",
//       "needCountFlag": false,
//       "notAllowedChange": false,
//       "showType": "input",
//       "sort": 1
//   },
//   {
//       "componentId": "b433f81f-0d55-44c0-b041-abd5c0b6781d",
//       "id": "71a4aa0ca56f4c859ab60e0fe41c30c7",
//       "modelId": "7ff4ebb7-bbf6-402f-8efc-e1ccf802da57",
//       "needCountFlag": false,
//       "notAllowedChange": false,
//       "showType": "number",
//       "sort": 2
//   }
// ]
import React, { useState, useEffect } from 'react';
import { RedoOutlined, SearchOutlined } from '@ant-design/icons';
import { Input, Button, Col, Row, InputNumber, ConfigProvider, Select, DatePicker, Empty, Form } from 'antd';
import PropTypes from 'prop-types';
import Utils from './utils';
// import 'dayjs/locale/zh-cn';
import locale from 'antd/es/locale/zh_CN'
import moment from 'moment'
import 'moment/locale/zh-cn'

// import locale from 'antd/es/date-picker/locale/zh_CN';
import { getAssetData } from './api/asset'
import './index.less'
const { RangePicker } = DatePicker;
moment.locale('zh-cn')
let option = [{ value: 1, label: 2 }]
const App = ({
  _queryList = [],
  onHandleSearch,
  onHandleClean,
  ...otherProps
}) => {
  const [optionsV, setOptionsV] = useState([]);
  const [selectData, setSelectData] = useState({})
  const [form] = Form.useForm();
  const [optionSelect, setOptionSelect] = useState({})
  console.log(123123, _queryList);
  console.log(123123, otherProps);

  useEffect(() => {
    let temp = {}
    _queryList.map(item => {
      if (item.showType === 'select') {
        if (getColData(item.componentId).option_key_column) {
          querySelect(item.componentId).then(res => {
            console.log(res);
            temp[getColName(item.componentId)] = res
          }).catch(err => {
            console.log(res);
          })
        } else {
          temp[getColName(item.componentId)] = JSON.parse(getColData(item.componentId).option_value || "[]")
        }
      }
    })
    setTimeout(() => {
      setOptionSelect(temp)
    }, 200)


    let two_area = document.querySelector('.two_areaQuery')
    if (two_area) {
      two_area.parentNode.style.width = '100%'
    }
  }, []);
  useEffect(() => {
    console.log(form.getFieldsValue(), '-----form');
  }, [form.getFieldsValue().电站数据]);
  useEffect(() => {
    // conditionalComp()
  }, [optionsV]);
  //找出指定的组件标题 label
  const getColName = id => {
    let { allComponentList } = otherProps;
    let nowComponent = allComponentList.filter(item => item.id === id);
    return nowComponent[0].title || nowComponent[0].label;
  };
  //找出指定组件
  const getColData = id => {
    let { allComponentList } = otherProps;
    let nowComponent = allComponentList.filter(item => item.id === id);
    return nowComponent[0]
  };
  //查询下拉框数据
  const querySelect = async id => {
    let res = await getAssetData(getColData(id)?.option_asset_id || getColData(id)?.componentPhysicalFieldMappingList?.[0].assetId, [getColData(id)?.option_key_column, getColData(id)?.option_value_column])
    let options = Utils.translatePlatformDataToJsonArray(res)
    let a = res.data[1].filter(x => {
      if (x[0] !== '' && x[0] !== null & x[0] !== undefined & x[0] !== NaN) {
        return { value: x[0], label: x[1] }
      }
    })
    a = a.map(x => {
      return { value: x[0], label: x[1] }
    })
    return a
  }
  //过滤设备名称
  const changePower = (value, ColObj, equipment) => {


    getAssetData(equipment?.option_asset_id || equipment?.componentPhysicalFieldMappingList[0].assetId, equipment?.option_key_column || equipment?.componentPhysicalFieldMappingList[0].structName, [{
      "column": ColObj?.option_key_column || ColObj?.componentPhysicalFieldMappingList?.[0]?.structName, "datatype": 0, type: 10,
      "compareObj": value
    }]).then(res => {
      let a = res.data[1].filter(x => {
        if (x[0] !== '' && x[0] !== null & x[0] !== undefined & x[0] !== NaN) {
          return { value: x[0], label: x[0] }
        }
      })
      a = a.map(x => {
        return { value: x[0], label: x[0] }
      })
      setOptionsV(a)
    }).catch(err => {
      console.log(err);
    })
  }
  //创建不同类型的筛选框
  const conditionalComp2 = () => {
    let statuLuj = []
    let setEquipment
    _queryList.map(async (item, i) => {
      if ((getColName(item.componentId) == '电站名称' && item.showType === 'select') || (getColName(item.componentId) == '设备名称' && item.showType === 'select')) statuLuj.push(getColName(item.componentId))
      if ((getColName(item.componentId) == '设备名称' && item.showType === 'select')) setEquipment = getColData(item.componentId)
    })
    // setIFten(statuLuj.length == 2)
    if (statuLuj.length == 2) {
      return _queryList.map(item => {
        if (item.showType === 'input') {
          return <Col className="gutter-row" span={8} >
            <Form.Item name={getColName(item.componentId)} label={getColName(item.componentId)} >
              <Input
                className='two_RangePicker'
                allowClear
                placeholder="输入input"
                style={{ width: '100%' }}
              // value={conditionalValue[getColName(item.componentId)]}
              />
            </Form.Item>
          </Col>
        }
        if (item.showType === 'select') {
          if (getColName(item.componentId) == '电站名称') {
            return <Col className="gutter-row" span={8} >
              <Form.Item name={getColName(item.componentId)} label={getColName(item.componentId)} >
                <Select
                  className='two_RangePicker'
                  placeholder="请选择"
                  showSearch
                  allowClear
                  onChange={e => { changePower(e, getColData(item.componentId), setEquipment) }}
                  filterOption={(input, option) =>
                    (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                  }
                  options={optionSelect[getColName(item.componentId)]}
                  style={{ width: '100%' }}
                // value={conditionalValue[getColName(item.componentId)]}
                />
              </Form.Item>
            </Col>
          }
          else if (getColName(item.componentId) == '设备名称') {
            // return
            return <Col className="gutter-row" span={8} >
              <Form.Item name={getColName(item.componentId)} label={getColName(item.componentId)} >
                <Select
                  className='two_RangePicker'
                  allowClear
                  placeholder="请选择"
                  showSearch
                  filterOption={(input, option) =>
                    (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                  }

                  // options={form.getFieldsValue().optionsV || []}
                  options={optionsV}
                  style={{ width: '100%' }}
                // value={conditionalValue[getColName(item.componentId)]}
                />
              </Form.Item>
            </Col>
          }
          else {

            return <Col className="gutter-row" span={8} >
              <Form.Item name={getColName(item.componentId)} label={getColName(item.componentId)} >
                <Select
                  className='two_RangePicker'
                  allowClear
                  placeholder="请选择"
                  showSearch
                  filterOption={(input, option) =>
                    (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                  }
                  // options={getColData(item.componentId).option_key_column ? option : JSON.parse(getColData(item.componentId).option_value || "[]")}
                  options={optionSelect[getColName(item.componentId)]}
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>
          }

        }
        if (item.showType === 'date') {
          return <Col className="gutter-row" span={8}>
            <ConfigProvider locale={locale}>
              <Form.Item name={getColName(item.componentId)} label={getColName(item.componentId)} >
                <RangePicker
                  className='two_RangePicker'
                  allowClear
                  style={{ width: '100%' }}
                  // value={conditionalValue[getColName(item.componentId)]}
                  suffixIcon={<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0 0H30C31.1046 0 32 0.895431 32 2V30C32 31.1046 31.1046 32 30 32H0V0Z" fill="#0084FF" />
                    <path d="M24.75 8.875H22.2695C22.2695 7.83984 21.4297 7 20.3945 7H20.082C19.0469 7 18.207 7.83984 18.207 8.875H13.8125C13.8125 8.35742 13.6035 7.88867 13.2637 7.54883C12.9238 7.20898 12.4551 7 11.9375 7H11.625C10.5898 7 9.75 7.83984 9.75 8.875H7.25C6.56055 8.875 6 9.43359 6 10.125V24.5C6 25.1895 6.56055 25.75 7.25 25.75H24.75C25.4395 25.75 26 25.1895 26 24.5V10.125C26 9.43359 25.4395 8.875 24.75 8.875ZM19.457 9.03125C19.457 8.59961 19.8066 8.25 20.2383 8.25C20.6699 8.25 21.0195 8.59961 21.0195 9.03125V10.5938C21.0195 11.0254 20.6699 11.375 20.2383 11.375C20.0234 11.375 19.8281 11.2871 19.6855 11.1465C19.5449 11.0039 19.457 10.8086 19.457 10.5938V9.03125ZM11 9.03125C11 8.59961 11.3496 8.25 11.7812 8.25C12.2129 8.25 12.5625 8.59961 12.5625 9.03125V10.5938C12.5625 11.0254 12.2129 11.375 11.7812 11.375C11.5664 11.375 11.3711 11.2871 11.2285 11.1465C11.0879 11.0039 11 10.8086 11 10.5938V9.03125ZM24.75 23.875C24.75 24.2207 24.4707 24.5 24.125 24.5H7.875C7.5293 24.5 7.25 24.2207 7.25 23.875V15.125H24.75V23.875Z" fill="white" />
                    <path d="M7.875 16.375H12.875V19.5H7.875V16.375ZM7.875 20.125H12.875V23.25H7.875V20.125ZM13.5 16.375H18.5V19.5H13.5V16.375ZM13.5 20.125H18.5V23.25H13.5V20.125ZM19.125 16.375H24.125V19.5H19.125V16.375ZM19.125 20.125H24.125V23.25H19.125V20.125Z" fill="white" />
                  </svg>}
                />
              </Form.Item>
            </ConfigProvider>
          </Col>
        }
      })
    } else {
      return _queryList.map(item => {
        if (item.showType === 'input') {
          return <Col className="gutter-row" span={8} >
            <Form.Item name={getColName(item.componentId)} label={getColName(item.componentId)} >
              <Input
                className='two_RangePicker'
                allowClear
                placeholder="输入input"
                style={{ width: '100%' }}
              />
            </Form.Item>
          </Col>
        }
        if (item.showType === 'select') {
          return <Col className="gutter-row" span={8} >
            <Form.Item name={getColName(item.componentId)} label={getColName(item.componentId)} >
              <Select
                className='two_RangePicker'
                // onChange={e => { changeFn(e, item) }}
                allowClear
                placeholder="请选择"
                showSearch
                filterOption={(input, option) =>
                  (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                }
                // options={getColData(item.componentId).option_key_column ? option : JSON.parse(getColData(item.componentId).option_value || "[]")}
                options={optionSelect[getColName(item.componentId)]}
                style={{ width: '100%' }}
              />
            </Form.Item>
          </Col>
        }
        if (item.showType === 'date') {
          return <Col className="gutter-row" span={8}>
            <ConfigProvider locale={locale}>
              <Form.Item name={getColName(item.componentId)} label={getColName(item.componentId)} >
                <RangePicker
                  className='two_RangePicker'
                  allowClear
                  style={{ width: '100%' }}
                  suffixIcon={<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0 0H30C31.1046 0 32 0.895431 32 2V30C32 31.1046 31.1046 32 30 32H0V0Z" fill="#0084FF" />
                    <path d="M24.75 8.875H22.2695C22.2695 7.83984 21.4297 7 20.3945 7H20.082C19.0469 7 18.207 7.83984 18.207 8.875H13.8125C13.8125 8.35742 13.6035 7.88867 13.2637 7.54883C12.9238 7.20898 12.4551 7 11.9375 7H11.625C10.5898 7 9.75 7.83984 9.75 8.875H7.25C6.56055 8.875 6 9.43359 6 10.125V24.5C6 25.1895 6.56055 25.75 7.25 25.75H24.75C25.4395 25.75 26 25.1895 26 24.5V10.125C26 9.43359 25.4395 8.875 24.75 8.875ZM19.457 9.03125C19.457 8.59961 19.8066 8.25 20.2383 8.25C20.6699 8.25 21.0195 8.59961 21.0195 9.03125V10.5938C21.0195 11.0254 20.6699 11.375 20.2383 11.375C20.0234 11.375 19.8281 11.2871 19.6855 11.1465C19.5449 11.0039 19.457 10.8086 19.457 10.5938V9.03125ZM11 9.03125C11 8.59961 11.3496 8.25 11.7812 8.25C12.2129 8.25 12.5625 8.59961 12.5625 9.03125V10.5938C12.5625 11.0254 12.2129 11.375 11.7812 11.375C11.5664 11.375 11.3711 11.2871 11.2285 11.1465C11.0879 11.0039 11 10.8086 11 10.5938V9.03125ZM24.75 23.875C24.75 24.2207 24.4707 24.5 24.125 24.5H7.875C7.5293 24.5 7.25 24.2207 7.25 23.875V15.125H24.75V23.875Z" fill="white" />
                    <path d="M7.875 16.375H12.875V19.5H7.875V16.375ZM7.875 20.125H12.875V23.25H7.875V20.125ZM13.5 16.375H18.5V19.5H13.5V16.375ZM13.5 20.125H18.5V23.25H13.5V20.125ZM19.125 16.375H24.125V19.5H19.125V16.375ZM19.125 20.125H24.125V23.25H19.125V20.125Z" fill="white" />
                  </svg>}
                />
              </Form.Item>
            </ConfigProvider>
          </Col>
        }
      })
    }
  }
  //提交方法
  const submit = () => {
    console.log(123123999911, _queryList);
    console.log(1231239999, otherProps);
    console.log('form======>', form.getFieldsValue());
    let newQueryParams = _queryList.map(item => {
      if (form.getFieldsValue()[getColName(item.componentId)] && item.showType === 'input') {
        let filterValue = [
          {
            colId: item.componentId,
            colName: getColData(item.componentId)?.componentBusinessConfigList?.[0]?.businessName,
            value: form.getFieldsValue()[getColName(item.componentId)],
            type: 0, // 表示等于
          },
        ];
        return { ...item, filterValue, list: filterValue };
      }
      if (form.getFieldsValue()[getColName(item.componentId)] && item.showType === 'select') {
        let filterValue = [
          {
            colId: item.componentId,
            colName: getColData(item.componentId)?.componentBusinessConfigList?.[0]?.businessName,
            value: form.getFieldsValue()[getColName(item.componentId)],
            type: 2, // 下拉框
          },
        ];
        return { ...item, filterValue, list: filterValue };
      }
      if (form.getFieldsValue()[getColName(item.componentId)] && item.showType === 'date') {
        let start = new Date(new Date(form.getFieldsValue()[getColName(item.componentId)][0]._d.toLocaleDateString()).getTime()).getTime()
        let end = new Date(new Date(form.getFieldsValue()[getColName(item.componentId)][1]._d.toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1).getTime()
        let filterValue = [
          {
            colId: item.componentId,
            colName: getColData(item.componentId)?.componentBusinessConfigList?.[0]?.businessName,
            value: start,
            extMeaning: "",
            type: 111, // 表示等于
          },
          {
            colId: item.componentId,
            colName: getColData(item.componentId)?.componentBusinessConfigList?.[0]?.businessName,
            extMeaning: "",
            value: end,
            type: 113, // 表示等于
          },
        ];
        return { ...item, filterValue, list: filterValue };
      }
      return item;
    });
    console.log(1231239999112233, newQueryParams);
    onHandleSearch(newQueryParams);
  };
  //测试传值 
  const resultFn = () => {
    return form.getFieldsValue().optionsV
  }
  //重置方法
  const reset = () => {
    onHandleClean && onHandleClean();
    form.resetFields()
  };
  const layout = {
    labelCol: {
      span: 8,
    },
    wrapperCol: {
      span: 16,
    },
  };

  return (
    <div className='two_areaQuery'>
      <ConfigProvider locale={locale}>
        <Form className='two_areaQuery_Form'  {...layout} form={form} name="control-hooks" >
          <div className='areaQuery' >
            <Row >
              {conditionalComp2()}
            </Row>
          </div>
        </Form>
      </ConfigProvider>
      <div className='submitButton'>
        <Button type="primary" className='plubicBtn ' style={{ marginRight: '20px' }} icon={<SearchOutlined />} onClick={submit}>
          查询
        </Button>
        <Button className='restBn_two plubicBtn' icon={<RedoOutlined />} onClick={reset}>
          重置
        </Button>
      </div>

    </div>
  );
};

App.propTypes = {
  _queryList: PropTypes.array,
  onHandleSearch: PropTypes.func,
  onHandleClean: PropTypes.func,
};

export default App;
