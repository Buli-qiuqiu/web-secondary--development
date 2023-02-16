import React from "react";
import {
  DesignConfiguration,
  Main
} from "./components";
import MsgCompConfig from "./components/main/msgCompConfig.js";
import Utils from "./utils/index.js";

const renderHashMap = {
  main: Main,
  designConfiguration: DesignConfiguration
};
//封装平台方法
export const mainInit = (Main, setId, actionDefinitions) => {
  if (setId) {
    const { updateProcess, componentId, options } = Main;
    const customOptions = options?.externalVariables;
    //内部使用，需求编号，不需要可去掉，用来将需求编号打到dom元素上，方便以后处理问题
    const requirementNum = process.env.CUSTOM_PLUGIN["requirement-number"] === "需求编号"
                           ? ""
                           : `${process.env.CUSTOM_PLUGIN["requirement-number"]}-`;
    const customOptionsId = customOptions?.id
                            ? `analyzer-secondary-${requirementNum}${customOptions.id}`
                            : `analyzer-secondary-${requirementNum}${Utils.generateUUID()}`;
    setId(customOptionsId);
    const Event_Center_getName = () => {
      return customOptionsId;
    };
    window?.componentCenter?.register(componentId, "comp", { Event_Center_getName, ...actionDefinitions }, MsgCompConfig);
    updateProcess && updateProcess();
  } else {
    const { updateProcess, componentId } = Main.props;
    window?.componentCenter?.register(componentId, "comp", Main, MsgCompConfig);
    const customOptions = Main.props.options?.externalVariables || {};
    //内部使用，需求编号，不需要可去掉，用来将需求编号打到dom元素上，方便以后处理问题
    const requirementNum = process.env.CUSTOM_PLUGIN["requirement-number"] === "需求编号"
                           ? ""
                           : `${process.env.CUSTOM_PLUGIN["requirement-number"]}-`;
    const id = customOptions?.id
               ? `analyzer-secondary-${requirementNum}${customOptions.id}`
               : `analyzer-secondary-${requirementNum}${Utils.generateUUID()}`;
    const developers  =  process.env.REACT_APP_DEVELOPERS || ""
    Main.setState({developers})
    //由于分析仪放置到大屏中切换显示隐藏有问题，此处用于初始化元素宽高，默认100%
    customOptions?.width && Main.setState({ width: customOptions.width });
    customOptions?.height && Main.setState({ height: customOptions.height });
    Main.setState({ id });
    updateProcess && updateProcess();
  }
};
const App = ({ type, ...props }) => {
  type = type || "main";
  if (type === "designConfiguration") {
    !props.configuration.analyzer_secondary_configuration && (props.configuration.analyzer_secondary_configuration = {});
    props.customConfig = props.configuration.analyzer_secondary_configuration;
    props.changeCustomConfig = (customConfig) => {
      props.configuration.analyzer_secondary_configuration = customConfig;
      props.changeConfiguration(props.configuration);
    };
  } else {
    !props.options.analyzer_secondary_configuration && (props.options.analyzer_secondary_configuration = {});
    props.customConfig = props.options.analyzer_secondary_configuration;
    props.mainInit = mainInit;
  }
  let Comp = () => <></>;
  if (renderHashMap[type]) Comp = renderHashMap[type];
  return <Comp {...props} />;
};
App.propTypes = {};

export default App;
