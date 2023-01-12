import React, { useState, useEffect, useRef } from "react";
import MindElixir from "mind-elixir";
import { useMount } from "ahooks";
import { computeDataSource, computeTreeData } from "./development/nodeData";

const level = (node, num = 0) => {
  if (node.parent) return level(node.parent, num + 1);
  return num;
};

const MindMap = (props) => {
  const meRef = useRef(null);

  const buttons = props.lineButtons
    .filter((item) => item.title !== "详情")
    .map((item) => {
      return {
        name: item.title,
        key: "",
        onclick: (e) => {
          props.handleClick(
            item.id,
            meRef.current.currentNode?.nodeObj?.detail?.record
          );
          document.querySelector("cmenu").hidden = true;
        },
      };
    });

  useMount(() => {
    meRef.current = new MindElixir({
      el: "#map",
      direction: MindElixir.RIGHT,
      draggable: true, // default true
      contextMenu: !!props.pluginConfig.isOpenContextMenu, // default true
      toolBar: false, // default true
      nodeMenu: true, // default true
      keypress: false, // default true
      overflowHidden: false, // default false
      primaryLinkStyle: 3, // [1,2] default 1
      primaryNodeVerticalGap: 25, // default 25
      primaryNodeHorizontalGap: 65, // default 65
      allowUndo: true,
      editable: false,
      contextMenuOption: {
        focus: true,
        link: true,
        extend: buttons,
      },
    });

    const treeNodeDate = computeTreeData(
      computeDataSource(props.data, props.dataSource),
      props.pluginConfig.urlList
    );

    console.log(computeDataSource(props.data));
    console.log(treeNodeDate);
    meRef.current.init(treeNodeDate);

    // 选中节点回调
    meRef.current.bus.addListener("selectNode", (node) => {
      // 最后一级节点
      console.log(node);
      console.log(level(node));

      if (!document.querySelector("cmenu .menu-list #新增")) {
        console.log("不存在新增");
        return;
      }

      if (level(node) < 3) {
        changeInsertButtonVisibility("block");
      } else {
        changeInsertButtonVisibility("none");
      }
      // window.ME.init(NodeData);
    });
  });

  const changeInsertButtonVisibility = (status) => {
    document
      .querySelectorAll("cmenu .menu-list #新增")
      .forEach((node) => node && (node.style.display = status));
  };

  useEffect(() => {
    const treeNodeDate = computeTreeData(
      computeDataSource(props.data, props.dataSource),
      props.pluginConfig.urlList
    );

    console.log(computeDataSource(props.data));
    console.log(treeNodeDate);
    meRef.current.init(treeNodeDate);
  }, [props.data, props.dataSource, props.pluginConfig.urlList]);

  return (
    <div
      style={{ width: "100%", height: "100%", position: "relative" }}
      className="frame-box"
    >
      <div id="map"></div>
    </div>
  );
};

MindMap.propTypes = {};

export default MindMap;
