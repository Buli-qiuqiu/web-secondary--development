import React from 'react';
import ReactDOM from 'react-dom';
import Config from './Config';
import action from './action';

export const inject = (dom, props) => {
  if (props.isConfig) {
    ReactDOM.render(<Config {...props} />, dom);
  } else {
    action(props);
    // const App = () => {
    //   return <div>qwe</div>
    // }

    // ReactDOM.render(<App {...props} />, dom);
  }
};

export const unmount = parentElementId => {
  if (parentElementId) {
    ReactDOM.unmountComponentAtNode(document.getElementById(parentElementId));
  } else {
  }
};
