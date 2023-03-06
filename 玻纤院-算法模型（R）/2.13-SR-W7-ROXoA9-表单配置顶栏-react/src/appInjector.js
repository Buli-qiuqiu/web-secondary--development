import React from 'react';
import ReactDOM from 'react-dom';
import Config from './Config';
import Header from './Header';
import { ResponseDataHoc } from '@sd-ui/custom-plugin';
import './index.less'
export const inject = (dom, props, context, eventBus) => {
  const pluginProps = {
    props,
    context,
    eventBus,
  };

  if (props.type === 'config') {
    props.plugin.dispatch('setMenuConfig', {
      type: 'flat',
      content: [
        // 'actions', // 开始节点增删改查
        // 'insertRenderBlockArr', // 输入，选择，布局，表格
        // 'flowAssociations', // 业务流
        // 'logicDataSource', // 逻辑控制
        // 'saveDataSource', // 退出
        'insertComponents', // 插入输入等组件
        'customComponents', // 自定义组件
        'insertCustomComponents', // 插入自定义组件
        // 'associationMethod', // 外部服务
        // 'settings', // 设置
        // 'otherDataSource', // 数据绑定
        // 'oneSketch', // oneSketch
        // 'customButton', // 按钮设置
        // 'pageDesign', // 页面设计
        // 'help', // 帮助
        // 'component', // 组件
      ],
    });
  }

  if (props.type === 'left') {
    ReactDOM.render(ResponseDataHoc(pluginProps)(Config), dom);
  } else if (props.type === 'header') {
    props.plugin.dispatch('setMenuConfig', {
      type: 'flat',
      content: [
        // 'actions', // 开始节点增删改查
        // 'insertRenderBlockArr', // 输入，选择，布局，表格
        // 'flowAssociations', // 业务流
        // 'logicDataSource', // 逻辑控制
        // 'saveDataSource', // 退出
        'insertComponents', // 插入输入等组件
        'customComponents', // 自定义组件
        'insertCustomComponents', // 插入自定义组件
        // 'associationMethod', // 外部服务
        // 'settings', // 设置
        // 'otherDataSource', // 数据绑定
        // 'oneSketch', // oneSketch
        // 'customButton', // 按钮设置
        // 'pageDesign', // 页面设计
        // 'help', // 帮助
        // 'component', // 组件
      ],
    });
    ReactDOM.render(ResponseDataHoc(pluginProps)(Header), dom);
  }
};

export const unmount = parentElementId => {
  if (parentElementId) {
    ReactDOM.unmountComponentAtNode(document.getElementById(parentElementId));
  } else {
  }
};
