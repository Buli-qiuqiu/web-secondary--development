import React, { useCallback, useState } from "react";
import { isEqual } from "lodash";
import { Input, Row, Col } from "antd";
import { DeleteOutlined } from '@ant-design/icons';
import "./index.less"
function DataConfiguration(props) {
  const { changeConfiguration, configuration } = props;
  const [chartsCategories, setChartsCategories] = useState(configuration?.chartsCategories || []);
  const [chartsYKey, setChartsYKey] = useState(configuration?.chartsYKey || []);
  const [chartsXKey, setChartsXKey] = useState(configuration?.chartsXKey || '');
  console.log("配置页", props);

  const handleSubmit = useCallback(() => {
    let chartsCategoriesCopy = JSON.parse(JSON.stringify(chartsCategories)).filter(Boolean);
    let chartsYKeyCopy = JSON.parse(JSON.stringify(chartsYKey)).filter(Boolean);
    setChartsCategories(chartsCategoriesCopy)
    setChartsYKey(chartsYKeyCopy)
    // console.log("配置页", props);
    const newOptions = {
      chartsXKey,
      chartsYKey: chartsYKeyCopy,
      chartsCategories: chartsCategoriesCopy,
      // bindValue,
      // chartsValueKey,
    };
    console.log('newOptions', newOptions);
    if (!isEqual(newOptions, configuration)) {
      changeConfiguration({ ...configuration, ...newOptions });
    }
  });

  //图表X轴
  const handleChartsXKeys = e => {
    setChartsXKey(e.target.value);
  };
  //图表图例
  const handleCategories = (e,index) => {
    let categoriesList = JSON.parse(JSON.stringify(chartsCategories));
    categoriesList[index] = e.target.value;
    setChartsCategories(categoriesList);
  };
  //图表Y轴
  const handleChartsYKeys = (e,index) => {
    let chartsYKeysList = JSON.parse(JSON.stringify(chartsYKey));
    chartsYKeysList[index] = e.target.value;
    setChartsYKey(chartsYKeysList);
  };
  //添加
  const addTableKey = () => {
    let categoriesList = JSON.parse(JSON.stringify(chartsCategories));
    let chartsYKeysList = JSON.parse(JSON.stringify(chartsYKey));
    categoriesList.push('')
    chartsYKeysList.push('')
    setChartsCategories(categoriesList)
    setChartsYKey(chartsYKeysList)
  };
  // 变量删除
  const delBindValue = ind => {
    let categoriesList = JSON.parse(JSON.stringify(chartsCategories));
    let chartsYKeysList = JSON.parse(JSON.stringify(chartsYKey));
    categoriesList.splice(ind, 1)
    chartsYKeysList.splice(ind, 1)
    setChartsCategories(categoriesList)
    setChartsYKey(chartsYKeysList)
  };

  return (
    <div>
      <Row>
        <Col span={24} className="rowtitle">图表X轴</Col>
        <Input value={chartsXKey} onChange={handleChartsXKeys} />
      </Row>
      
      <Row>
        <Col span={12}>
          {
            chartsCategories.map((x, Xindex) => {
              return (
                <Col key={Xindex} span={24}>
                  <Col span={24} className="rowtitle">图例-{Xindex} <DeleteOutlined className="del-icon" onClick={() => { delBindValue(Xindex) }} /></Col>
                  <Input value={x} onChange={(e) => { handleCategories(e, Xindex)}} />
                </Col>
              )
            })
          }
        </Col>
        <Col span={12}>
          {
            chartsYKey.map((y, Yindex) => {
              return (
                <Col key={Yindex} span={24}>
                  <Col span={24} className="rowtitle">Y轴-{Yindex} <DeleteOutlined className="del-icon" onClick={() => { delBindValue(Yindex) }} /></Col>
                  <Input value={y} onChange={(e) => { handleChartsYKeys(e, Yindex) }} />
                </Col>
              )
            })
          }
        </Col>
        
        <div className="add-btn" onClick={addTableKey}>添加Y轴字段</div>
      </Row>
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
