import React, { useState } from "react"
import {
  Input,
  Select,
  Col, 
  Row,
  Button
} from "antd"

import "./index.css"

const DesignConfiguration = ({ changeCustomConfig, customConfig }) => {
  console.log('配置页--customConfig', customConfig);
  const [dataType, setDataType] = useState(customConfig?.dataType || "date");
  const [dateTypeVal, setDateTypeVal] = useState(customConfig?.dateTypeVal || "YYYY-MM-DD");
  const [maxRangePicker, setMaxRangePicker] = useState(customConfig?.maxRangePicker || "");

  const handleValueChange = () => {
    const newOptions = {
      dataType,
      dateTypeVal,
      maxRangePicker,
    }; 
    changeCustomConfig(JSON.stringify(newOptions))
  }

  const selectChange = val =>{
    console.log(val);
    setDataType(val);
    switch (val) {
      case "date":
        setDateTypeVal("YYYY-MM-DD")
        break;
      case "dateTime":
        setDateTypeVal("YYYY-MM-DD HH:mm:ss")
        break;
    }
  }

  // 最大区间
  const maxRange = e => {
    let maxStr = e.target.value;
    setMaxRangePicker(maxStr)
  };

  return (
    <>
      <Row>
        <Col span={24}>类型:</Col>
        <Col span={24}>
          <Select
            defaultValue="date"
            value={dataType}
            style={{
              width: "100%",
            }}
            options={[
              {
                value: 'date',
                label: '按日期',
              },
              {
                value: 'dateTime',
                label: '按日期时间',
              }
            ]}
            onChange={selectChange}
          />
        </Col>
      </Row>
      <Row>
        <Col span={24}>日期格式:</Col>
        <Col span={24}>
          <Input value={dateTypeVal} />
        </Col>
      </Row>
      <Row>
        <Col span={24}>最大日期范围:</Col>
        <Col span={24}>
          <Input value={maxRangePicker} onChange={maxRange} suffix="天" />
        </Col>
      </Row>
      <Row>
        <div className="btnBox">
          <Button type="primary" onClick={handleValueChange}>执行</Button>
        </div>
      </Row>
    </>
  )
}

DesignConfiguration.propTypes = {}

export default DesignConfiguration
