import React, { useState, useEffect } from "react";
import { Menu, Tooltip } from "antd";
import appService from "@njsdata/app-sdk";
import { mockData } from "./mock";
import { Icon } from "sdata-ui";
import qs from "querystringify";
import ShowIcon from "./showIcon";
import "./app.less";

const { SubMenu } = Menu;

const formatData = (data, nameList) => {
  data.forEach((item, index) => {
    nameList.forEach((it) => {
      if (item.id === it) {
        data.splice(index, 1);
      } else if (item?.children && item?.children?.length > 0) {
        formatData(item?.children, nameList);
      }
    });
  });
};

const App = (props) => {
  console.log('**props**', props);
  const [openKeys, setOpenKeys] = useState([]);
  const [visible, setVisible] = useState(false);
  const [data, setData] = useState(mockData);
  const [collapsed, setCollapsed] = useState(false);
  const [rootSubmenuKeys, setRootSubmenuKeys] = useState(["acff4125-129f-fec6-3098-0ecb1c7ecf61", "2ce57bcb-fdf8-524e-c70b-bc40c7db67bb", "c372b864-6fad-9949-fe3b-f4fb75b34898"]);
  const [defaultSelectedKeys, seDefaultSelectedKeys] = useState(["5d1906ed-7de7-5984-cb4d-8e66019edceb"]);
  const [selectedKeys, setSelectedKeys] = useState(["5d1906ed-7de7-5984-cb4d-8e66019edceb"]);
  const [defaultOpenKeys, setDefaultOpenKeys] = useState([]);
  const [mouseItem, setMouseItem] = useState(null);
  const [keys, setKeys] = useState(null);
  const { customConfig } = props;
  const { 首页名称: homePage = "首页", 隐藏菜单id: names = "", 隐藏展开菜单id: hideNames = "" } = customConfig;
  const hidenNameList = hideNames.split(",");
  useEffect(() => {
    const data = appService.getMenuData() || mockData;
    // const data = mockData;
    const nameList = names.split(",");

    formatData(data, nameList);
    setData(data);

    let arr = [];
    data.forEach((item) => {
      if (item?.children?.length > 0) arr.push(item.id);
    });
    setRootSubmenuKeys(arr);
    // var newEvent = new Event("falseMenuClick", { bubbles: true, cancelable: true, composed: true });
    window.addEventListener("MenuClick", (e) => {
      console.log("进来了", e);
      props.customConfig.setAppMenucollapsed(e.detail.tf)
      setCollapsed(e.detail.tf);
    });
    if (window.APP_SDK_DATA) {
      // window.PubSub.subscribe("collapsed", (_, data) => {
      //   setCollapsed(data);
      // });
      setCollapsed(window.APP_SDK_DATA.store.appMenucollapsed);
      // window.PubSub.subscribe("menuClick", (_, { key }) => {
      // initData(key?.split("#")[0], data);
      // });
    }
    const { menuId } = qs.parse(window.location.search);
    if (menuId) {
      const key = menuId.split("#")[0];
      initData(key, data);
    }
    const menuRefVisible = document.getElementById("menuRef");
    nodeVisible(menuRefVisible);
  }, []);
  const nodeVisible = (menuRefVisible) => {
    if (!menuRefVisible.parentNode) return;
    if (menuRefVisible.parentNode.tagName == "ASIDE") {
      menuRefVisible.parentNode.style.overflow = "visible";
      return false;
    } else {
      nodeVisible(menuRefVisible.parentNode);
    }
  };
  const initData = (key, formatData, type = 1) => {
    formatData.forEach((item) => {
      if (item?.children?.length > 0) {
        let selectedObj = item.children.find((it) => {
          return it.id === key;
        });
        if (selectedObj) {
          if (type === 1) {
            seDefaultSelectedKeys([key]);
            setSelectedKeys([key]);
            setDefaultOpenKeys([item.id]);
            setOpenKeys([item.id]);
          }
          if (type === 2) {
            seDefaultSelectedKeys([selectedObj["parent_id"]]);
            setSelectedKeys([selectedObj["parent_id"]]);
            if (selectedObj["parent_id"]) {
              data.forEach((k) => {
                const sameChild = (k.children || []).find((m) => m.id === selectedObj["parent_id"]);
                if (k.id === selectedObj["parent_id"] || sameChild) {
                  setDefaultOpenKeys([k.id]);
                  setOpenKeys([k.id]);
                }
              });
            }
            // data.forEach((item) => {
            //   if (item.children?.length > 0) {
            //     let Obj = item.children.find((it) => {
            //       return it.id === selectedObj["parent_id"];
            //     });
            //     if (Obj) {
            //       setDefaultOpenKeys([
            //         Obj["parent_id"],
            //         "cbd082ef-2183-77f9-da84-0ed8c74402cb",
            //       ]);
            //       setOpenKeys([
            //         Obj["parent_id"],
            //         "cbd082ef-2183-77f9-da84-0ed8c74402cb",
            //       ]);
            //     }
            //   }
            // });
          }
        } else {
          initData(key, item.children, 2);
        }
      }
      if (item.id === key && item.name === homePage) {
        seDefaultSelectedKeys([key]);
        setSelectedKeys([key]);
      }
    });
    setKeys(selectedKeys[0]);
  };

  const onOpenChange = (keys) => {
    console.log("keys", keys);
    const latestOpenKey = keys.find((key) => openKeys.indexOf(key) === -1);
    if (rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
      setOpenKeys(keys);
    } else {
      setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
    }
    setVisible(false);
  };

  const onOpenChange1 = (id) => {
    if (window.PubSub) {
      window.PubSub.publish("collapsed", false);
      const latestOpenKey = [id].find((key) => openKeys.indexOf(key) === -1);
      if (rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
        setOpenKeys([id]);
      } else {
        setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
      }
    }
  };

  const handleIcon = (item) => {
    const { icon } = item;
    if (icon.includes("base64")) {
      return <img src={icon} className="menu-img-icon" />;
    } else {
      return <ShowIcon icon_type={JSON.parse(icon).type} name={JSON.parse(icon).url} color={JSON.parse(icon).color} bgColor={JSON.parse(icon).bgColor} />;
    }
  };

  const handlePanNengClick = ({ key, isSubMenu }, it) => {
    let key1 = key?.split("#")[0];
    initData(key1, data);
    setKeys(key1);
    if (customConfig.onPageTabsChange && (it?.children?.length === 0 || !it?.children || hidenNameList.includes(it.id)) && key1 !== keys) {
      // window.PubSub.publish("menuClick", { key, isSubMenu });
      // customConfig.onPageTabsChange(key)
      const customEvent = new CustomEvent("JUMP_APP_TAB", {
        detail: {
          key,
        },
      });
      document.dispatchEvent(customEvent);

      // console.log(customConfig.onPageTabsChange, '----arta');
    }
  };

  const onMouseOver = (it) => {
    if (hidenNameList.includes(it.id)) {
      return;
    }
    if (it?.children?.length > 0) {
      setMouseItem(it.id);
      setVisible(true);
    }
  };

  const onMouseOut = (it) => {
    if (it?.children?.length > 0) {
      setMouseItem(it.id);
      setVisible(false);
    }
  };

  const loop = (data, levels) =>
    data.map((item) => {
      if (item.children && item.children?.length > 0 && item.isDelete !== 0) {
        return (
          <SubMenu
            key={item.id}
            title={
              <span
                className="menuTitle"
                onClick={() =>
                  handlePanNengClick({
                    key: (item.type === 1 ? "system" : item.id) + "#" + item.type,
                    isSubMenu: true,
                  })
                }
              >
                <span>
                  {item.icon ? (
                    handleIcon(item)
                  ) : (
                    <Icon type={item.type === 1 ? "icon-xitongshezhi" : item.type === 2 ? "icon-mulu" : item.name === homePage ? "icon-home" : "icon-yemian_1"} />
                  )}
                  <span className="name" title={item.name}>
                    {item.name}
                  </span>
                </span>
              </span>
            }
          >
            {item.children?.map((it) => (
              <Menu.Item
                key={it.id}
                className={it.name === homePage && "first"}
                onMouseOver={() => onMouseOver(it)}
                onMouseOut={() => onMouseOut(it)}
                onClick={() =>
                  handlePanNengClick(
                    {
                      key: (it.type === 1 ? "system" : it.id) + "#" + it.type,
                    },
                    it
                  )
                }
              >
                <div style={{ position: "relative" }}>
                  {it.icon ? (
                    handleIcon(it)
                  ) : (
                    // <Icon
                    //   type={
                    //     it.type === 1
                    //       ? "icon-xitongshezhi"
                    //       : it.type === 2
                    //         ? "icon-mulu"
                    //         : it.name === homePage
                    //           ? "icon-home"
                    //           : "icon-yemian_1"
                    //   }
                    // />
                    <Icon style={{ width: "19px" }} type="" />
                  )}
                  {it.children?.length > 0 && !hidenNameList.includes(it.id) ? (
                    <>
                      <span className="name" title={it.name}>
                        <span>{it.name}</span>
                        <span
                          style={{
                            float: "right",
                            color: "rgb(255 255 255 / 85%)",
                            fontWeight: "bold",
                          }}
                        >
                          {">"}
                        </span>
                      </span>
                      <div className="hoverdiv" style={mouseItem === it.id && visible ? { display: "block" } : { display: "none" }}>
                        <div className="hoverHeader">
                          <span className="hoverBox"></span>
                          <span style={{ marginLeft: 10 }}>{it.name}</span>
                        </div>
                        <div className="divider"></div>
                        <div className={it.children.length < 4 ? "hoverBody1" : "hoverBody"}>
                          {it.children.map((item) => (
                            <div
                              onClick={() =>
                                handlePanNengClick({
                                  key: (item.type === 1 ? "system" : item.id) + "#" + item.type,
                                })
                              }
                              key={(item.type === 1 ? "system" : item.id) + "#" + item.type}
                              className={it.children.length < 4 ? "linkText1" : "linkText"}
                              style={{
                                width: it.children.length < 4 ? `${100 / it.children.length}%` : "25%",
                              }}
                            >{`- ${item.name}`}</div>
                          ))}
                        </div>
                      </div>
                    </>
                  ) : (
                    <span className="name" title={it.name}>
                      {it.name}
                    </span>
                  )}
                </div>
              </Menu.Item>
            ))}
          </SubMenu>
        );
      } else if ((!item.children || item.children?.length === 0) && item.isDelete !== 0) {
        return (
          item.name === homePage && (
            <Menu.Item
              key={item.id}
              className={item.name === homePage && "first"}
              onClick={() =>
                handlePanNengClick({
                  key: (item.type === 1 ? "system" : item.id) + "#" + item.type,
                })
              }
            >
              <span>
                {item.icon ? (
                  handleIcon(item)
                ) : (
                  <Icon type={item.type === 1 ? "icon-xitongshezhi" : item.type === 2 ? "icon-mulu" : item.name === homePage ? "icon-home" : "icon-yemian_1"} />
                )}
                <span className="name" title={item.name}>
                  {item.name}
                </span>
              </span>
            </Menu.Item>
          )
        );
      }
    });

  const loop1 = (data, levels) =>
    data.map((item) => {
      if (item.children && item.children?.length > 0 && item.isDelete !== 0) {
        return (
          <SubMenu
            key={item.id}
            onTitleClick={() => onOpenChange1(item.id)}
            title={
              <span className="menuTitle" onClick={() => onOpenChange1(item.id)}>
                <Tooltip title={item.name} placement="right">
                  <span>
                    {item.icon ? (
                      handleIcon(item)
                    ) : (
                      <Icon type={item.type === 1 ? "icon-xitongshezhi" : item.type === 2 ? "icon-mulu" : item.name === homePage ? "icon-home" : "icon-yemian_1"} />
                    )}
                  </span>
                </Tooltip>
              </span>
            }
          ></SubMenu>
        );
      } else if ((!item.children || item.children?.length === 0) && item.isDelete !== 0) {
        return (
          item.name === homePage && (
            <Menu.Item key={item.id} className={item.name === homePage && "first"}>
              <Tooltip title={homePage} placement="right">
                <span>
                  {item.icon ? (
                    handleIcon(item)
                  ) : (
                    <Icon type={item.type === 1 ? "icon-xitongshezhi" : item.type === 2 ? "icon-mulu" : item.name === homePage ? "icon-home" : "icon-yemian_1"} />
                  )}
                </span>
              </Tooltip>
            </Menu.Item>
          )
        );
      }
    });

  return collapsed ? (
    <div id="menuRef" className="PNDL_menu1">
      {defaultSelectedKeys.length > 0 && (
        <Menu
          mode="inline"
          // openKeys={openKeys}
          selectedKeys={selectedKeys}
          defaultSelectedKeys={defaultSelectedKeys}
          // defaultOpenKeys={defaultOpenKeys}
          // onOpenChange={onOpenChange}
          style={{
            width: 80,
            height: "100vh",
            background: "#131926",
          }}
        >
          {loop1(data)}
        </Menu>
      )}
    </div>
  ) : (
    <div id="menuRef" className="PNDL_menu">
      {defaultSelectedKeys.length > 0 && (
        <Menu
          mode="inline"
          openKeys={openKeys}
          selectedKeys={selectedKeys}
          defaultSelectedKeys={defaultSelectedKeys}
          defaultOpenKeys={defaultOpenKeys}
          onOpenChange={onOpenChange}
          theme="dark"
          style={{
            width: 256,
            height: "100vh",
            background: "#131926",
          }}
        >
          {loop(data)}
        </Menu>
      )}
    </div>
  );
};

export default App;
