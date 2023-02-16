import React from "react";

function DesignConfiguration(props) {
  //此处的customConfig已经封装完毕，可以直接使用
  const { changeCustomConfig, customConfig } = props;
  //此处为最简单的样例
  !customConfig.number && (customConfig.number = 1);
  const handleClick = () => {
    customConfig.number++;
    changeCustomConfig(customConfig);
  };
  return (
    <div className="configuration">
      {/* <button onClick={handleClick}>测试配置项与主区域的交互</button> */}
    </div>);
}

export default DesignConfiguration;
