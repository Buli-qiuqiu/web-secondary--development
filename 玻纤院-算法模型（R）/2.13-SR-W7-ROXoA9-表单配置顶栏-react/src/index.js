import React from 'react';
import ReactDOM from 'react-dom';

import action from './action';
import { Button } from 'antd';
import Config from './Config';
import { inject } from './appInjector';
const config = require('../pluginTemp/config.json')

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
    config.id,
    (dom, props, context, eventBus) => {
      console.log(props, '----文件');
      inject(dom, props, context, eventBus);
    }
  );
}

// IllegalStateException = -{
//   id: "9dae05e1c52548a595cf1626ec54eeeb",
//   sourceId: null, asset_id: "ad61e047-bbbd-4ef3-ba87-fb1003013ba7",
//   col_name: baifenbi, parent_id: null, config: null, entity_name: null,
//   smart_security_option: null, col_value: null, col_label: null,
//   col_index: 11, col_alias: 百分比, col_desc: 百分比,
//   col_property: null, col_datatype: 8, scale: 4, precision: null, textList: null, standard_id: null, standard_serial: null, name_cn: null, service_definition: null, data_type: null, data_format: null, param_value: null, question_type: null, isNew: null, originName: null, queryable: null, displayed: null, is_private: false, is_ciphertext: false, uniqueFlag: null, dict_name: null, dict_id: null, data: null, component_id: null, componentTitle: null, show_type: null, smart_data_type: null, group_name: null, import_flag: false, tableName: null, tableNameAlias: null, form_column_id: null, compareType: null, calculateType: null, length: 10, not_null_flag: null, primary_key_flag: null, multipleComponentFlag: false, joinColumnName: null, joinTableAlias: null, dataStandardId: null, dataStandardcatalogId: null, standardName: null, col_name_alias: baifenbi, assetName: null, assetColumnMapping: null, mappingName: null
// }