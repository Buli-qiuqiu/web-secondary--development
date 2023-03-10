import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Tabs, Menu } from "antd";
import qs from "querystringify";
import $ from "jquery";
// import appService from "@njsdata/app-sdk";
import "./app.less";

const { TabPane } = Tabs;

const App = (props) => {
  const { pageTabs = [], menuDatas = [], onChange, onRemove, getMenuName } = props;
  // 储存禁止删除页签的ID
  let [unCloseTabId, setUnCloseTabId] = useState("");

  // 当前页签数组的数据
  let [tabData, setTabData] = useState([]);

  //  保存当前DOM元素
  let [nodeKey, setNodeKey] = useState("");

  // 移除的key
  let [removeKey, setRemoveKey] = useState("");

  // 页签ID
  let [menuKey, setMenuKey] = useState("");
  // 当前点击ID
  let [activeKey, setActiveKey] = useState("");

  useEffect(() => {
    // 标签DOM
    let tabList = $("#pndl_tabs .ant-tabs-nav .ant-tabs-nav-wrap")[0];
    let unCloseBox = $("#unCloseKeyss")[0];
    // 菜单DOM
    let menu = document.getElementById("nskg_rightMenu");

    // 右键点击事件
    $(tabList).on("contextmenu", ".ant-tabs-tab", function (e) {
      e.preventDefault();

      let idKey = $(e.target).attr("data-node-key");

      if (idKey) {
        setNodeKey(idKey);
      } else {
        let parentIdKey = $(e.target).parent();
        setNodeKey(parentIdKey);
      }

      menu.style.left = e.clientX + "px";
      menu.style.top = e.clientY + "px";
      menu.style.display = "block";
    });
    // 右键点击事件
    // $(unCloseBox).bind("contextmenu", "#unCloseKey", function (e) {
    //    e.preventDefault();

    //    let idKey = $(e.target).attr("data-node-key");

    //    if (idKey) {
    //       setNodeKey(idKey);
    //    }

    //    menu.style.left = e.clientX + "px";
    //    menu.style.top = e.clientY + "px";
    //    menu.style.display = "block";
    // });
    // 添加点击关闭菜单事件
    document.body.addEventListener("click", () => {
      if (menu.style.display == "block") {
        menu.style.display = "none";
      }
    });
  }, []);

  useEffect(() => {
    let dataList = JSON.parse(JSON.stringify(pageTabs));
    // console.log("dataList--->", dataList);
    // console.log("props--->", props);

    // 获取首页ID
    let homeId = "";
    menuDatas.forEach((item) => {
      if (item.name == "总览") {
        homeId = item.id + "#3";
        setUnCloseTabId(homeId);
      }
    });
    // 添加首页
    dataList.unshift({ id: homeId });
    // 数组去重
    for (let i = 0; i < dataList.length; i++) {
      for (let j = i + 1; j < dataList.length; j++) {
        if (dataList[i].id == dataList[j].id) {
          dataList.splice(j, 1);
          j--;
        }
      }
    }
    if (removeKey) {
      setTabData([{ id: unCloseTabId }]);
      onRemove(menuKey);
      setRemoveKey("");
      setMenuKey("");
    } else {
      setTabData(dataList);
    }
    // 设置tab数组
  }, [pageTabs]);
  const onChangeTab = (e) => {
    onChange(e);
    var MenuChange = new CustomEvent("MenuChange", {
      detail: {},
    });
    window.dispatchEvent(MenuChange);
  };
  // 右键菜单
  const handleMenu = (value) => {
    let dataList = JSON.parse(JSON.stringify(pageTabs));
    var MenuChange = new CustomEvent("MenuChange", {
      detail: {},
    });
    if (value.key == "关闭其他") {
      dataList.forEach((item) => {
        if (item.id != unCloseTabId && item.id != nodeKey) {
          onRemove(item.id);
        }
      });
    }

    if (value.key == "关闭全部") {
      dataList.forEach((item) => {
        if (item.id != unCloseTabId) {
          onRemove(item.id);
        }
      });
    }

    if (value.key == "关闭右侧") {
      let currentIndex = null;
      dataList.forEach((item, index) => {
        if (item.id != unCloseTabId && item.id == nodeKey) {
          currentIndex = index;
          return;
        }
        if (currentIndex && index > currentIndex) {
          // console.log('currentIndex', currentIndex, index);
          onRemove(item.id);
        }
      });
    }

    if (value.key == "关闭左侧") {
      let currentIndex = null;
      dataList.forEach((item, index) => {
        if (item.id != unCloseTabId && item.id == nodeKey) {
          currentIndex = index;
          return;
        }
        if (currentIndex == null) {
          // console.log('currentIndex', currentIndex, index);
          onRemove(item.id);
        }
      });
    }
    window.dispatchEvent(MenuChange);
  };

  // 删除方法
  const onRemoveTab = (key) => {
    let dataList = JSON.parse(JSON.stringify(pageTabs));
    var MenuChange = new CustomEvent("MenuChange", {
      detail: {},
    });
    if (dataList.length <= 1) {
      let menuId = qs.parse(window.location.search).menuId;

      setTabData([{ id: unCloseTabId }]);
      onChange(unCloseTabId);
      setRemoveKey(key);
      setMenuKey(menuId);
    }
    onRemove(key);
    window.dispatchEvent(MenuChange);
  };
  // active
  const activeFun = (val) => {
    console.log("val", val);
    setActiveKey(val);
  };

  return (
    <div className="pndl_tabsBox">
      {/* Tabs */}
      <div id="unCloseKeyss" className="unCloseBoxss">
        {/*  style={{ borderBottom: qs.parse(window.location.search).menuId == unCloseTabId ? "0px solid #1890ff" : '' }} */}
        <div
          id="unCloseKey"
          className={qs.parse(window.location.search).menuId == unCloseTabId ? "unCloseActive" : "unClose"}
          key={unCloseTabId}
          onClick={() => {
            onChangeTab(unCloseTabId);
          }}
        >
          总览
        </div>
      </div>
      <Tabs id="pndl_tabs" type="editable-card" onChange={onChangeTab} hideAdd={true} onEdit={onRemoveTab} activeKey={qs.parse(window.location.search).menuId}>
        {/* <Tabs id="pndl_tabs" type="editable-card" onChange={activeFun} hideAdd={true} onEdit={onRemoveTab} activeKey={activeKey}> */}
        {tabData.map((item) => (
          <TabPane tab={getMenuName(item.id)} key={item.id} closable={tabData.length !== 1}></TabPane>
        ))}
      </Tabs>
      {/* 菜单 */}
      <div id="nskg_rightMenu" className="right_menu">
        <Menu
          onClick={handleMenu}
          items={[
            { key: "关闭其他", label: <span>关闭其他</span> },
            { key: "关闭全部", label: <span>关闭全部</span> },
            { key: "关闭右侧", label: <span>关闭右侧</span> },
            { key: "关闭左侧", label: <span>关闭左侧</span> },
          ]}
        />
      </div>
    </div>
  );
};

App.propTypes = {
  pageTabs: PropTypes.array, // 应用页签集合
  menuDatas: PropTypes.array, // 应用页签菜单数据
  onChange: PropTypes.func, // 应用页签的change方法
  onRemove: PropTypes.func, // 应用页签的删除方法
  getMenuName: PropTypes.func, // 获取应用页签的名称
};

export default App;
