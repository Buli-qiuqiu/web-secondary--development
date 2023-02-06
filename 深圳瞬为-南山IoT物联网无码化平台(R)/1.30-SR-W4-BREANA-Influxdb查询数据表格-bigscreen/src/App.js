import React from "react";
import {
  DataConfiguration,
  StyleConfiguration,
  OtherConfiguration,
  MainRender
} from "./components";
import PropTypes from "prop-types";
import Main from "./components/main";

const renderHashMap = {
  Main: MainRender,
  dataConfiguration: DataConfiguration,
  styleConfiguration: StyleConfiguration,
  otherConfiguration: OtherConfiguration
};
const App = ({ type, mode, ...props }) => {
  if (mode === "development") {
    let handleConfiguration = () => {
      const { block } = props;
      const { dataConfig } = block;
      const { pluginOptions = {}, columns } = dataConfig;
      pluginOptions.columns = columns;
      return pluginOptions;
    };
    let handleOptionsChange = () => {
      return "configureation";
    };
    const options = {
      changeConfiguration: handleOptionsChange,
      configuration: handleConfiguration(),
      ...props
    };
    return (
      <>
        <div id={"main"}>
          <div className="left">主视图</div>
          <div className="right" style={{ width: "80%", height: "400px" }}>
            <Main {...props}></Main>
          </div>
        </div>
        <div id={"style"}>
          <div className="left">style</div>
          <div className="right">
            <StyleConfiguration {...options}></StyleConfiguration>
          </div>
        </div>
        <div id={"data"}>
          <div className="left">data</div>
          <div className="right">
            <DataConfiguration {...options}></DataConfiguration>
          </div>
        </div>
        <div id={"other"}>
          <div className="left">other</div>
          <div className="right">
            <OtherConfiguration {...options}></OtherConfiguration>
          </div>
        </div>
      </>
    );
  } else {
    if (!type) {
      return (<Main {...props}></Main>);
    } else {
      let handleConfiguration = () => {
      const { block } = props;
      const { dataConfig } = block;
      const { pluginOptions = {}, columns } = dataConfig;
      pluginOptions.columns = columns;
      return pluginOptions;
    };
    //处理配置更新
    let handleOptionsChange = (pluginOptions) => {
      const {
        bigscreen: { updateBlockById, pluginDetailMap },
        block: {
          baseConfig: { id }
        }
      } = props;
      updateBlockById(id, { dataConfig: { pluginOptions: { ...pluginOptions } } });
      //调用加载器的run方法强制更新
      pluginDetailMap[`${id}-default`].detail.ref.current.run();
    };
      const options = {
        changeConfiguration: handleOptionsChange,
        configuration: handleConfiguration(),
        ...props
      };
      let Comp = () => <></>;
      if (renderHashMap[type]) Comp = renderHashMap[type];
      return <Comp {...options} />;
    }
  }
};


App.propTypes = {
  type: PropTypes.string
};

export default App;
