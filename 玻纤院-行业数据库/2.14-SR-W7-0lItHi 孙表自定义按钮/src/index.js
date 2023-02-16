import React from 'react';
import ReactDOM from 'react-dom';
import { ResponseDataHoc } from '@sd-ui/custom-plugin';
import action from './action';
import { Button } from 'antd';
import Config from './Config';

if (process.env.NODE_ENV !== 'production') {
  require('antd/dist/antd.min.css');
}

if (process.env.NODE_ENV !== 'production') {
  let configValue = {};
  let changeConfigValue = configValue => {
    console.log(configValue);
  };
  const Apps = () => (
    <>
      <Button
        onClick={() => {
          action(123);
        }}
      >
        1
      </Button>
      <Config configValue={configValue} changeConfigValue={changeConfigValue} />
    </>
  );
  ReactDOM.render(<Apps />, document.getElementById('root'));
} else {
  if (!window.CUSTOM_PLUGIN) {
    window.CUSTOM_PLUGIN = new Map();
  }

  window.CUSTOM_PLUGIN.set(
    process.env.CUSTOM_PLUGIN_ID,
    (dom, props, context, eventBus) => {
      const pluginProps = {
        props,
        context,
        eventBus,
      };

      if (props.isConfig) {
        ReactDOM.render(ResponseDataHoc(pluginProps)(Config), dom);
      } else {
        action(props);
      }
    }
  );
}
