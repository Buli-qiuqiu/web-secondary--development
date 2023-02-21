import React from "react";
import PropTypes from "prop-types";
import Editor from "react-monaco-editor";
import "./index.less";

const Detail = ({ data, formConfig }) => {
  return (
    <div className="outermest_details">
      <Editor
        width="100%"
        height="500px"
        language="python"
        theme="vs-dark"
        value={data}
      />
    </div>
  );
};

Detail.propTypes = {
  data: PropTypes.string,
};

export default Detail;
