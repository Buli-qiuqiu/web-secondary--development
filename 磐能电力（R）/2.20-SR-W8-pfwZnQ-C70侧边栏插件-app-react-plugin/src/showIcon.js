/*
 * @Author: your name
 * @Date: 2020-05-31 14:51:14
 * @LastEditTime: 2020-06-02 18:15:36
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \onemind-web\src\components\iconLibrary\index.js
 */
import React, { Component } from "react";
import PropTypes from "prop-types";
import asyncLoad from "./utils/asyncLoad";

const Icon = asyncLoad(() => import("sdata-ui"), "Icon");

class ShowIcon extends Component {
  static propTypes = {
    icon_type: PropTypes.string,
    name: PropTypes.string,
    color: PropTypes.string,
    size: PropTypes.string,
    bgColor: PropTypes.string,
  };

  render() {
    const { icon_type, name, color, size, bgColor } = this.props;
    return (
      <>
        {icon_type === "custom" ? (
          // eslint-disable-next-line jsx-a11y/alt-text
          <img
            src={name}
            style={{
              width: size || "14px",
              height: size || "14px",
            }}
          />
        ) : (
          <Icon
            type={name}
            style={{
              color: color,
              fontSize: size || "14px",
              background: bgColor,
              lineHeight: 0,
            }}
          />
        )}
      </>
    );
  }
}
export default ShowIcon;
