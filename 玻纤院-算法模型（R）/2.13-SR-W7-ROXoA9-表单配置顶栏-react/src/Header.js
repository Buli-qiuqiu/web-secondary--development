import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useMount } from 'ahooks';
import { AutoComplete, Input, Row, Button, Col, message } from 'antd';
import { formGenerateAsset, queryForm, queryDetail } from './api/asset'
import Icon, { EditOutlined, AudioOutlined, SearchOutlined } from '@ant-design/icons';
import qs from 'querystringify';
import errorCode from './ERROR_zh_CN.json'
const render = title => <span>{title}</span>;

const disabledStyle = {
  cursor: 'not-allowed',
  opacity: 0.3,
};

const renderComponentItem = option => ({
  value: option.title,
  label: <div style={option.disabled ? disabledStyle : {}}>{option.title}</div>,
  onClick: !option.disabled ? option.onClick : () => { },
});

const renderCustomComponentItem = option => {
  return {
    value: option.title,
    label: <div style={{ display: 'flex' }}>{option.title}</div>,
    onClick: option.onClick,
  };
};

const renderComponentList = (array = [], type) => {
  if (type === '自定义组件') {
    return array.map(data => renderCustomComponentItem(data));
  }
  return array.map(data => renderComponentItem(data));
};
let attFormValue2 = {}
const Header = props => {
  useMount(() => { });
  const [editName, setEditName] = useState(false)
  const [formName, setformName] = useState('')
  const [attFormValue, setAttFormValue] = useState({})

  const [options, setOptions] = useState([]);
  console.log(props, '-------文件配置项');

  function buildOptions(optionComponentDataSource) {
    function buildGroupsMap(optionComponentDataSource) {
      if (optionComponentDataSource?.length === 0) {
        return {};
      }
      return optionComponentDataSource.reduce((acc, cur) => {
        if (acc[(cur?.component?.componentGroup)]) {
          acc[(cur?.component?.componentGroup)].push(cur);
        } else {
          acc[(cur?.component?.componentGroup)] = [cur];
        }
        return acc;
      }, {});
    }

    function buildOptions(componentOptionsGroupsMap) {
      const result = [];
      Object.keys(componentOptionsGroupsMap).map(groupName => {
        result.push({
          label: render(groupName),
          options: renderComponentList(
            componentOptionsGroupsMap[groupName],
            groupName
          ),
        });
      });
      return result;
    }

    return buildOptions(buildGroupsMap(optionComponentDataSource));
  }
  useEffect(() => {
    let designValues = props.plugin.dispatch('getDesignValues')
    setformName(designValues?.formName)
  }, [])

  const handleSearch = e => {
    const options = props.plugin.dispatch('handleSearch', e);
    console.log(options);
    console.log(buildOptions(options));
    setOptions(buildOptions(options));
  };

  const handleClick = () => {
    triggerEvent("click", { value: "123" })
  }
  //失焦事件
  const handleEditName = (e) => {
    props.plugin.dispatch('changeFormName', formName)
    setEditName(false)
  }
  //保存方法
  const handleSaveConfiguration = () => {

    let designValues = props.plugin.dispatch('getDesignValues')
    // if (designValues.physicalAssetId) {
    //   props.plugin.dispatch('handleDesignSave')
    // } else {
    let atemp = []

    if (attFormValue2.id) {
      designValues.formComponents.forEach(item => {
        let a = false
        attFormValue2.formComponents.forEach(i => {
          if (item.id == i.id) a = true
        })
        if (!a) atemp.push(item)
      })
      if (atemp.length == 0) {
        attFormValue2.formComponents.forEach(item => {
          let a = false
          designValues.formComponents.forEach(i => {
            if (item.id == i.id) a = true
          })
          if (!a) atemp.push(item)
        })
        if (atemp.length != 0) {
          for (let index = 0; index < atemp.length; index++) {
            let deleteI = null
            let delItem = atemp[index]
            attFormValue2.formComponents.forEach((item, i) => {
              if (item?.id == delItem?.id) {
                deleteI = i
              }
            })
            if (deleteI !== null) {
              attFormValue2.formComponents.splice(deleteI, 1)
            }
          }
        }


      } else {
        let { formComponents } = attFormValue2;
        attFormValue2.formComponents = [...formComponents, ...atemp]
      }
    }

    designValues = attFormValue2.id ? attFormValue2 : designValues
    console.log(designValues, props.plugin.dispatch('getDesignValues'), attFormValue2, '----------配置信息');
    formGenerateAsset(designValues).then(res => {
      message.success('保存成功')
      let query = qs.parse(window.location.search)?.id
      queryForm(query).then(res2 => {
        attFormValue2 = res2.data
        // setAttFormValue(res2.data)
      })
    }).catch(err => {
      message.error(errorCode[`ERROR.${err.data.code}`]);
    })
    // }
    // tempFunction.handleDesignSave(tempFunction.getDesignValues())
  }

  return (
    <>
      <div className="app-secondary">
        {/*以下为样例，正式开发请去除相关代码*/}
        <div className='two_reporting_top' >
          <Row gutter={16}>
            <Col className="gutter-row" span={8}>
              <div ></div>
            </Col>
            <Col className="gutter-row" span={8}>
              {
                editName ?
                  <div className="edit_name" > <input id='formName' autofocus="autofocus" onBlur={(e) => { handleEditName(e) }} onChange={(e) => { setformName(e.target.value) }} value={formName}></input>  <EditOutlined /></div> :
                  <div className="not_edit" onClick={() => { setEditName(true); window.setTimeout("document.getElementById('formName').focus();", 200); }} > <span className="hover_span">{formName}</span>  <EditOutlined /></div>
              }

            </Col>
            <Col className="gutter-row" span={8}>
              <div className="tool_overview" >
                <Button className='close two_button' onClick={() => { window.close() }} >关闭</Button>
                <span>  </span>
                <Button onClick={() => { handleSaveConfiguration() }} className='save_button two_button' type="primary">保存</Button>
              </div>
            </Col>
          </Row>
        </div>
      </div>

      {/* <div
        style={{
          display: 'flex',
          justifyContent: 'space-evenly',
        }}
      >
        <div
          onClick={() => {
            // props.plugin.dispatch('changeFormName', 'asdasd');
            props.plugin.dispatch('setModelFieldModalVisible', true);
            // props.plugin.setMenuConfig('qweqwe');
          }}
        >
          打开弹窗
        </div>
        <div
          onClick={() => {
            props.plugin.dispatch('modelFieldInsertAll');
          }}
        >
          一键插入
        </div>
        <div
          onClick={() => {
            console.log(JSON.stringify(props.plugin.dispatch('getDesignValues')));
          }}
        >
          获取表单全量数据
        </div>
        <div>
          <AutoComplete
            dropdownMatchSelectWidth={500}
            style={{
              width: 250,
              paddingRight: 30,
            }}
            options={options}
            onSelect={(value, { onClick }) => onClick && onClick()}
          // onClick={() => run(searchContentRef.current)}
          // open={true}
          >
            <Input
              onPressEnter={e => {
                handleSearch(e);
              }}
              onChange={e => handleSearch(e)}
            />
          </AutoComplete>
          <input
            onChange={e => {
              handleSearch(e);
            }}
          />
        </div>
      </div> */}
    </>

  );
};

Header.propTypes = {
  plugin: PropTypes.object.isRequired,
};

export default Header;
