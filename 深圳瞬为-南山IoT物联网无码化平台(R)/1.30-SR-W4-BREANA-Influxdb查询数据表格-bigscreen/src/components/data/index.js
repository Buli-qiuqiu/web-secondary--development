import React, { useCallback, useState } from "react";
import { isEqual } from "lodash";
import { Input, Row, Col } from "antd";
import { DeleteOutlined } from '@ant-design/icons';
import "./index.less"

function DataConfiguration(props) {
  const { changeConfiguration, configuration } = props;
  // const [bindValue, setBindValue] = useState(configuration?.bindValue || '');
  const [tableValueKey, setTableValueKey] = useState(configuration?.tableValueKey || ['']);

  const handleSubmit = useCallback(() => {
    let tableValueKeyCopy = JSON.parse(JSON.stringify(tableValueKey)).filter(Boolean);
    setTableValueKey(tableValueKeyCopy)
    const newOptions = {
      // bindValue,
      tableValueKey: tableValueKeyCopy,
    };
    console.log("配置页", newOptions);
    if (!isEqual(newOptions, configuration)) {
      changeConfiguration({ ...configuration, ...newOptions });
    }
  });
  
  //表格字段
  const handleTableValueKey = (e, index) => {
    let tableValueKeyCopy = JSON.parse(JSON.stringify(tableValueKey))
    console.log(e.target.value, index);
    tableValueKeyCopy[index] = e.target.value
    setTableValueKey(tableValueKeyCopy)
  };
  //添加
  const addTableKey = () => {
    let tableValueKeyCopy = JSON.parse(JSON.stringify(tableValueKey))
    tableValueKeyCopy.push('')
    setTableValueKey(tableValueKeyCopy)
  };
  // 变量删除
  const delBindValue = ind => {
    let tableValueKeyCopy = JSON.parse(JSON.stringify(tableValueKey))
    tableValueKeyCopy.splice(ind,1)
    setTableValueKey(tableValueKeyCopy)
  };

  return (
    <div>
      <Row>
        <Col span={24} className="rowtitle">数据字段</Col>
        {
          tableValueKey.map((x,index)=>{
            return <div className="add-list" key={index}><Input value={x} onChange={(e) => { handleTableValueKey(e, index) }} /> <DeleteOutlined className="del-icon" onClick={() => { delBindValue(index) }}/></div>
          })
        }
        <div className="add-btn" onClick={addTableKey}>添加字段</div>
      </Row>
      {/* <Row>
        <Col span={24} className="rowtitle">变量绑定</Col>
        <Input value={bindValue} onChange={handleBindValue} />
      </Row> */}
      <Row>
        <div className="detail-btn" onClick={handleSubmit}>
          执行
        </div>
      </Row>
    </div>
  );
}

DataConfiguration.propTypes = {};

export default DataConfiguration;
