import React, { useCallback } from "react";
import { isEqual } from "lodash";

function StyleConfiguration(props) {
  const { changeConfiguration, configuration } = props;
  const handleSubmit = useCallback(() => {
    console.log("配置页", props);
    const newOptions = {};
    if (!isEqual(newOptions, configuration)) {
      changeConfiguration({ ...configuration, ...newOptions });
    }
  });
  return <div>StyleConfiguration</div>;
}

StyleConfiguration.propTypes = {};

export default StyleConfiguration;
