import React, { useEffect, useState } from "react";
import Editor from "react-monaco-editor";
import "./index.less";

const Add = (props) => {
  const { data, onChange, customConfig } = props;

  const [code, setCode] = useState("# python代码内容");

  useEffect(() => {
    console.log("配置项--->", customConfig);
    console.log("data--->", data);
    data && setCode(data);
  }, []);

  const changeEditor = (value) => {
    onChange(value);
  };

  return (
    <div className={customConfig ? "outermest_add" : ""}>
      <Editor
        width="100%"
        height={`${customConfig.editorHeight}px`}
        language="python"
        theme="vs-dark"
        value={code}
        onChange={changeEditor}
      />
    </div>
  );
};

export default Add;
