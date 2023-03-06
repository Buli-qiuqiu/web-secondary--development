/* eslint-disable react/prop-types */
import React from 'react';
import Loading from './loading';
import Loadable from 'react-loadable';

/**
 * 异步加载组件
 * @example
 *   如果以前这样加载组件：
 *     import Detail from './Detail';
 *     import { Icon } from 'sdata-ui';
 *   使用 asyncLoad 改成这样:
 *     const Detail = asyncLoad(() => import('./Detail'));
 *     const Icon = asyncLoad(() => import('sdata-ui'), 'Icon');
 *
 *   高级：如果组件使用了 ref，可以用 asyncLoadWithRef 来动态加载：
 *     import asyncLoadWithRef from 'utils/asyncLoadWithRef';
 *     const Detail = asyncLoadWithRef(() => import('./Detail'));
 *     <Detail ref={detailRef} >  // 将会把 ref 转发到实际的组件
 */
const asyncLoad = (loader, namedExport = 'default') =>
  Loadable({
    loader,
    loading: Loading,
    render(loaded, props) {
      let Component = loaded[namedExport];
      const { forwardedRef, ...rest } = props;
      return <Component ref={forwardedRef} {...rest} />;
    },
  });

export default asyncLoad;
