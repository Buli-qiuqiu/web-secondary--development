import React, { useCallback } from "react";
import { isEqual } from "lodash";

function OtherConfiguration(props) {
  const { changeConfiguration, configuration } = props;
  const handleSubmit = useCallback(() => {
    console.log("配置页", props);
    const newOptions = {};
    if (!isEqual(newOptions, configuration)) {
      changeConfiguration({ ...configuration, ...newOptions });
    }
  });
  return <div>OtherConfiguration</div>;
}

OtherConfiguration.propTypes = {};

export default OtherConfiguration;
