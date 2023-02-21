import React, { useState, useEffect, useRef } from "react";
import "./development.less";
import {
  Add,
  Detail,
  DesignConfiguration,
  Design,
  Child,
  List,
  Query,
} from "../index.js";
import { Carousel } from "antd";
import {
  mockCustomConfig,
  mockChangeCustomConfig,
  data,
  formConfig,
  child_id,
  component,
  index,
  onChange,
} from "./mockData.js";
import Utils from "../../utils";
import setAttributes from "../../utils/handlePlatform/setAttributes.js";

const renderMap = [
  { type: "新增", component: Add },
  { type: "设计", component: Design },
  { type: "列表", component: List },
  { type: "详情", component: Detail },
  { type: "子表", component: Child },
  { type: "查询", component: Query },
];
const Development = () => {
  const [customConfig, setCustomConfig] = useState(mockCustomConfig);
  const changeCustomConfig = (customConfig) => {
    customConfig = JSON.parse(customConfig);
    setCustomConfig(customConfig);
    setAttributes(carousel.current, { customConfig });
    mockChangeCustomConfig(customConfig);
  };
  const carousel = useRef();
  useEffect(() => {
    setAttributes(carousel.current, { customConfig });
  }, []);
  return (
    <div id="development">
      <div ref={carousel}>
        <Carousel>
          {renderMap.map((item, renderMapIndex) => {
            let props;
            if (item.component == Child) {
              props = {
                customConfig,
                data,
                formConfig,
                child_id,
                component,
                index,
                onChange,
              };
            } else if (item.component === Add || item.component === Design) {
              props = {
                customConfig,
                data,
                formConfig,
                onChange,
                component,
              };
            } else {
              props = { data, formConfig, customConfig };
            }
            let Comp = item.component;
            return (
              <div
                key={renderMapIndex}
                className="carousel-item"
                type={item.type}
              >
                {item.type == "新增" || item.type == "设计" ? (
                  <Comp {...props} key={Utils.tools.generateUUID()} />
                ) : (
                  <Comp {...props} />
                )}
              </div>
            );
          })}
        </Carousel>
      </div>
      <div id="configuration">
        <DesignConfiguration
          changeCustomConfig={changeCustomConfig}
          customConfig={customConfig}
        />
      </div>
    </div>
  );
};

Development.propTypes = {};

export default Development;
