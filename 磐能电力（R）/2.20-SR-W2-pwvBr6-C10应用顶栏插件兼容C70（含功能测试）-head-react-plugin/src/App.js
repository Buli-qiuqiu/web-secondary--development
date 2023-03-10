import React, { useState, useEffect } from "react";
import { Select, Breadcrumb, Modal, Form, Input, Button, Avatar, Badge, Dropdown, Menu, List, Table, message } from "antd";
import moment from "moment";
import { MenuUnfoldOutlined, MenuFoldOutlined, LockOutlined, FullscreenOutlined, CaretDownOutlined } from "@ant-design/icons";
import * as ReportingService from "./api/asset";
import appService from "@njsdata/app-sdk";
import { mockData } from "./mock";
import qs from "querystringify";
import Base64 from "Base64";
import logo from "./2.png";
import "./app.less";
const count = 6;
const pageNum = 1;
const Cookie = "eyJhbGciOiJIUzI1NiJ9.eyJsb2dpblRpbWVzdGFtcCI6MTY2MDYzNzQyMDE2OSwidXNlcklkIjoiMTIzNDU2Nzg5MCJ9.k040f5ITc7zlFmxdmozdcXWjpvST6tIQPbi51-Na8mY";
// 格式化数据增加面包屑数据
const formatData = (data, topData = []) => {
  data.forEach((item) => {
    let arr = topData.concat([item.name]);
    item.breadCrumbItem = arr;
    if (item?.children?.length > 0) {
      formatData(item?.children, item.breadCrumbItem);
    }
  });
  return data;
};
const sortBy = (field) => {
  return (x, y) => {
    return Date.parse(new Date(y[field])) - Date.parse(new Date(x[field]));
  };
};
let websocket;
let timer;
// 平级树形数据
const flatArr = (menuData, initArr = []) => {
  menuData.forEach((item) => {
    initArr.push({
      id: item.id,
      label: item.name,
      breadCrumbItem: item.breadCrumbItem,
      value: (item.type === 1 ? "system" : item.id) + "#" + item.type,
    });
    if (item?.children?.length > 0) {
      flatArr(item.children, initArr);
    }
  });
  return initArr;
};
const App = (props) => {
  const [collapsed, setCollapsed] = useState(false);
  const [key, setKey] = useState("453601f6-b5ea-a393-a5e0-e0e243cdb62b");
  const [menuData, setMenuData] = useState([]);
  const [breadCrumbs, setBreadCrumbs] = useState([]);
  const [visible, setVisible] = useState(false);
  const [value, setValue] = useState(undefined);
  const [options, setOptions] = useState([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  const [userName, setUserName] = useState("用户名");
  const [pageNum, setPageNum] = useState(1);
  const [infoModalVisible, setInfoModalVisible] = useState(false);
  const [initLoading, setInitLoading] = useState(true);
  const [data, setData] = useState([]);
  const [list, setList] = useState([]);
  const [infoCount, setInfoCount] = useState(0);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 4,
    showSizeChanger: false,
  });
  const UUID = "2A5E4B3C-D83C-A2A5-37CD-9DFFF289ED52";
  async function getInfoData(params) {
    let pagin = params ? { ...params.pagination } : pagination;
    const { data: res } = await ReportingService.queryList({
      pageNum: pagin.current,
      pageSize: pagin.pageSize,
      orderBy: "last_modify_time",
      orderSort: "DESC",
      queryParams: [
        {
          colName: "service_type",
          type: 2,
          value: "9",
        },
        {
          colName: "info_status",
          type: 2,
          value: "1",
        },
      ],
    });
    setInfoCount(res.totalCount);
    if (window.localStorage.getItem("wanningInfoTop")) {
      console.log(window.localStorage.getItem("wanningInfoTop"), JSON.stringify(res.totalCount));
      if (JSON.stringify(res.totalCount) !== window.localStorage.getItem("wanningInfoTop")) {
        window.localStorage.setItem("wanningInfoTop", JSON.stringify(res.totalCount));
        if (!infoModalVisible && res.totalCount > 0) {
          setInfoModalVisible(true);
        }
        console.log("onmessage,弹窗状态:", infoCount, infoModalVisible, "95-------------------------");
      }
    } else {
      window.localStorage.setItem("wanningInfoTop", JSON.stringify(res.totalCount));
      if (!infoModalVisible && res.totalCount > 0) {
        setInfoModalVisible(true);
      }
      console.log("onmessage,弹窗状态:", infoCount, infoModalVisible, "95-------------------------");
    }

    let dataSource = [];
    console.log(Date.parse(new Date()));
    res.results.map((data, index) => {
      let info_content = JSON.parse(data?.info_content) || {};
      let d = {
        id: data.id,
        key: index,
        actionTime: info_content.time,
        dianzhanName: info_content.equipment_info_name,
        shebeiName: info_content.power_plant_name,
        content: info_content.emergency_content,
        info_status: data.info_status,
      };
      dataSource.push(d);
    });
    dataSource.sort(sortBy("actionTime"));
    setData(dataSource);
    setPagination({
      ...pagin,
      total: res.totalCount,
      showTotal: (total) => {
        return `共 ${total} 条记录`;
      },
    });
    return res;
  }

  const connectWS = () => {
    try {
      let userid = window?.currentUser ? window?.currentUser.id : "1234567890";
      // let url = `ws://${window.location.host}/sdata/webSocket/` + userid;
      let url = `ws://${window.location.hostname}:18180/sdata/webSocket/` + userid + `@${Math.floor(Math.random() * 1000000)}`;
      console.log("-----前端开始连接websocket-----", url);
      websocket = new WebSocket(url);
      websocket.onerror = function (e) {
        console.log(e);
      };
      websocket.onopen = function () {
        console.log("连接成功");
        timer = setInterval(() => {
          console.log("心跳");
          let ping = { type: "ping" };
          websocket.send(JSON.stringify(ping));
        }, 5000);
      };
      websocket.onmessage = function (event) {
        console.log(event, "event", 142142142142142142142142);
        getInfoData();
      };
      window.onbeforeunload = function () {
        closeWebSocket();
      };
      websocket.onclose = function (e) {
        console.log("连接关闭");
        console.log("websocket 断开: " + e.code + " " + e.reason + " " + e.wasClean);
        timer = null;
        if (e.code * 1 === 1000 || e.code * 1 === 1006) {
          console.log("尝试重连");
          connectWS();
        }
      };
      function closeWebSocket() {
        websocket.close();
        websocket = null;
      }
    } catch (error) {
      console.log("e", error);
    }
  };

  useEffect(() => {
    // ReportingService.setCookie(Cookie);
    // ReportingService.isLogin();
    getInfoData().then((res) => {
      setInitLoading(false);
      console.log("res.results: ", res.results);
      setList(res.results);
    });

    connectWS();

    document.addEventListener("fullscreenchange", (e) => {
      if (!document.fullscreenElement) {
        let elem = document.getElementsByClassName(`closePullScreen-${UUID}`);
        if (elem[0]) {
          let elemContent = document.getElementsByClassName("ant-layout-content application-content-view")[0];
          elemContent?.removeChild(elem[0]);
        }
      }
    });

    return () => {
      document.removeEventListener("fullscreenchange");
    };
  }, []);
  const [form] = Form.useForm();

  useEffect(() => {
    const data = appService.getMenuData() || mockData;
    const menuData = formatData(data);
    setMenuData(menuData);
    const { menuId } = qs.parse(window.location.search);
    if (menuId) {
      const id = menuId.split("#")[0];
      setKey(id);
      const breadCrumb = flatArr(menuData).find((item) => item.id === id)?.breadCrumbItem;
      setBreadCrumbs(breadCrumb);
    }
    window.addEventListener("MenuChange", (e) => {
      console.log("进来了top", e);
      var timer = setTimeout(() => {
        let { menuId } = qs.parse(window.location.search);
        if (menuId) {
          const id2 = menuId.split("#")[0];
          setKey(id2);
          let breadCrumb2 = flatArr(menuData).find((item) => item.id === id2)?.breadCrumbItem;
          console.log(menuId, id2, breadCrumb2);
          setBreadCrumbs(breadCrumb2);
          clearTimeout(timer);
        }
      }, 500);
      // - 参数1：function 必需。函数，过time时间之后执行的业务逻辑。
      // - 参数2：time 可选。执行或调用 function 需要等待的时间，以毫秒ms计。默认为 0。1s=1000ms

      // 清除setTimeout单次定时器
    });

    getUserName();

    window.PubSub &&
      window.PubSub.subscribe("menuClick", (_, { key }) => {
        const data1 = key.split("#")[0];
        setKey(data1);
        const breadCrumb = flatArr(menuData).find((item) => item.id === data1)?.breadCrumbItem;
        setBreadCrumbs(breadCrumb);
      });
    window.PubSub &&
      window.PubSub.subscribe("collapsed", (_, data) => {
        setTimeout(() => {
          setCollapsed(data);
        }, 140);
      });

    // 获取保存的密码
    localStorage.getItem("externalPassword");
    return () => {
      timer = null;
    };
  }, []);

  const toggleCollapsed = () => {
    console.log(props);
    setTimeout(() => {
      setCollapsed(!collapsed);
    }, 140);
    // window.PubSub.publish("collapsed", !collapsed);
    // props.setAppMenucollapsed(!collapsed);
    var newEvent = new CustomEvent("MenuClick", {
      detail: { tf: !collapsed },
    });
    window.dispatchEvent(newEvent);
    // props.setAppMenucollapsed(!collapsed);
  };

  const getUserName = () => {
    const { customConfig } = props;
    customConfig?.getUserName &&
      customConfig.getUserName((name) => {
        setUserName(name);
      });
    if (!customConfig?.getUserName) {
      ReportingService.user().then((res) => {
        setUserName(res.data.name);
      });
    }
  };

  const onSearch = (value) => {
    if (value) {
      let flatArrData = flatArr(menuData);
      let data = flatArrData.filter((item) => {
        return item.label.indexOf(value) > -1;
      });
      setOptions(data);
    } else {
      setOptions([]);
    }
  };

  const onEnlarge = () => {
    // const { href } = window.location;
    // const url = `${href}&enLarge=true`;
    // window.open(url);
    let elem = document.getElementsByClassName("ant-layout-content application-content-view");
    if (elem[0]) {
      elem = elem[0];
      elem.requestFullscreen();
    } else {
      return;
    }
    setTimeout(() => {
      if (document.fullscreenElement) {
        let newSpan = document.createElement("span");
        newSpan.className = `closePullScreen-${UUID}`;
        newSpan.style.cssText = `
          position: absolute;
          right: 5px;
          top: 0px;
          color: #0084ff;
          font-size: 18px;
          cursor: pointer;
          z-index: 999;
        `;
        const newContent = document.createTextNode("关闭全屏");
        newSpan.appendChild(newContent);
        elem.appendChild(newSpan);
        newSpan.addEventListener("click", () => {
          document.exitFullscreen && document.exitFullscreen();
          elem.removeChild(newSpan);
          elem = undefined;
          newSpan = undefined;
        });
      } else {
        message.error("全屏失败,请重试···");
        elem = undefined;
      }
    }, 500);
  };

  const onLockScreen = () => {
    setModalVisible(true);
  };

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        let res = Base64.btoa(values.password); //加密
        localStorage.setItem("externalPassword", res);
        setLoading(true);
        setTimeout(() => {
          setLoading(false);
          setModalVisible(false);
          setShow(false);
          form.setFieldsValue({
            password: undefined,
          });
        }, 1000);
      })
      .catch((errorInfo) => {
        return;
      });
  };
  const cancel = () => {
    setModalVisible(false);
  };
  const checkPassword = (rule, value, callback) => {
    let res = Base64.btoa(value);
    if (res !== localStorage.getItem("externalPassword")) {
      callback("密码错误！");
    } else {
      callback();
    }
  };

  const onFinish = (values) => {
    const password = values.externalPassword;
    const res = Base64.btoa(password);
    if (localStorage.getItem("externalPassword") === res) {
      setShow(true);
    }
    setTimeout(() => {
      form.setFieldsValue({
        externalPassword: undefined,
      });
      localStorage.removeItem("externalPassword");
    }, 1000);
  };

  const onMenuClick = ({ key }) => {
    const { customConfig } = props;
    const { onSignOut, jumptoPersonalCenter } = customConfig || {};
    console.log(props);
    if (key === "1") {
      console.log("onSignOutonSignOutonSignOutonSignOut");
      // if (onSignOut) {
      //   onSignOut();
      // } else {
      ReportingService.logout().then((res) => {
        if (res.status == 200) {
          window.location.href = window.configuration?.sso_portal_login_url;
        }
      });
      // }
    }
    if (key === "2") {
      jumptoPersonalCenter && jumptoPersonalCenter();
    }
  };

  const menu = (
    <Menu onClick={onMenuClick}>
      <Menu.Item key="2">个人中心</Menu.Item>
      <Menu.Item key="1">退出登录</Menu.Item>
    </Menu>
  );
  const read = (id) => {
    ReportingService.read(id);
    getInfoData();
  };
  // 显示更多
  const onLoadMore = () => {
    setLoading(true);
    setPageNum(pageNum + 1);

    setList(
      data.concat(
        [...new Array(count)].map(() => ({
          loading: true,
          name: {},
          picture: {},
        }))
      )
    );

    getInfoData().then((res) => {
      const newData = data.concat(res.results);
      setData(newData);
      setList(newData);
      console.log("newData: ", list);
      setLoading(false); // Resetting window's offsetTop so as to display react-virtualized demo underfloor.
      window.dispatchEvent(new Event("resize"));
    });
  };

  const columns = [
    {
      title: "序号",
      dataIndex: "index",
      key: "index",
      width: "66px",
      render: (_, record) => (pagination.current - 1) * pagination.pageSize + parseInt(record.key) + 1,
      align: "center", //头部单元格和列内容水平居中
      className: "blueThead",
      showSorterTooltip: false,
    },
    {
      title: "动作时间",
      key: "actionTime",
      dataIndex: "actionTime",
      sorter: (a, b) => Date.parse(new Date(a.actionTime)) - Date.parse(new Date(b.actionTime)),
      width: "188px",
      align: "center", //头部单元格和列内容水平居中
      showSorterTooltip: false,
    },
    {
      title: "电站名称",
      key: "dianzhanName",
      dataIndex: "dianzhanName",
      width: "158px",
      sorter: (a, b) => a.dianzhanName.localeCompare(b.dianzhanName, "zh"),
      align: "center", //头部单元格和列内容水平居中
      showSorterTooltip: false,
    },
    {
      title: "设备名称",
      key: "shebeiName",
      dataIndex: "shebeiName",
      sorter: (a, b) => a.shebeiName.localeCompare(b.shebeiName, "zh"),
      align: "center", //头部单元格和列内容水平居中
      showSorterTooltip: false,
      width: "113px",
    },
    {
      title: "事件内容",
      key: "content",
      dataIndex: "content",
      sorter: (a, b) => a.content.localeCompare(b.content, "zh"),
      align: "center", //头部单元格和列内容水平居中
      width: "323px",
      render: (text) => <span style={{ marginLeft: "15px" }}>{text}</span>,
      showSorterTooltip: false,
    },
    {
      title: "操作",
      key: "action",
      align: "center", //头部单元格和列内容水平居中
      width: "95px",
      showSorterTooltip: false,
      render: (_, record) => (
        <Button
          type="primary"
          onClick={() => {
            let id = record.id;
            read(id);
          }}
          disabled={record.info_status !== "1"}
        >
          确认
        </Button>
      ),
    },
  ];
  const handleTableChange = (newPagination) => {
    getInfoData({
      pagination: newPagination,
    });
  };
  const loadMore =
    !initLoading && !loading ? (
      <div
        style={{
          textAlign: "center",
          marginTop: 12,
          height: 32,
          lineHeight: "32px",
        }}
      >
        <Button onClick={onLoadMore} type="link">
          加载更多
        </Button>
      </div>
    ) : null;
  return (
    <div className="PNDL_head">
      {collapsed ? (
        <div className="logo" style={{ width: 79 }}>
          <img style={{ width: 50, height: 50 }} alt="" src={logo} />
        </div>
      ) : (
        <div className="logo" style={{ width: 255 }}>
          <img style={{ width: 50, height: 50 }} alt="" src={logo} />
          <span className="title">分布式光伏服务平台</span>
        </div>
      )}
      <div className="PNDL_head_content" style={{ backgroundColor: "#fff" }}>
        <div className="left">
          <div onClick={() => toggleCollapsed()}>
            {
              <svg width="24" height="19" viewBox="0 0 24 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M1.5 0C0.671573 0 0 0.671573 0 1.5C0 2.32843 0.671573 3 1.5 3C2.32843 3 3 2.32843 3 1.5C3 0.671573 2.32843 0 1.5 0ZM6.5 0C5.67157 0 5 0.671573 5 1.5C5 2.32843 5.67157 3 6.5 3H22.5C23.3284 3 24 2.32843 24 1.5C24 0.671573 23.3284 0 22.5 0H6.5ZM0 9.5C0 8.67157 0.671573 8 1.5 8C2.32843 8 3 8.67157 3 9.5C3 10.3284 2.32843 11 1.5 11C0.671573 11 0 10.3284 0 9.5ZM6.5 8C5.67157 8 5 8.67157 5 9.5C5 10.3284 5.67157 11 6.5 11H22.5C23.3284 11 24 10.3284 24 9.5C24 8.67157 23.3284 8 22.5 8H6.5ZM0 17.5C0 16.6716 0.671573 16 1.5 16C2.32843 16 3 16.6716 3 17.5C3 18.3284 2.32843 19 1.5 19C0.671573 19 0 18.3284 0 17.5ZM6.5 16C5.67157 16 5 16.6716 5 17.5C5 18.3284 5.67157 19 6.5 19H22.5C23.3284 19 24 18.3284 24 17.5C24 16.6716 23.3284 16 22.5 16H6.5Z"
                  fill="#0084FF"
                />
              </svg>
            }
          </div>
          <Breadcrumb style={{ marginLeft: 16 }}>
            {breadCrumbs?.map((item, index) => (
              // <Breadcrumb.Item style={{ fontSize: "16px", fontWeight: index == 0 ? 700 : 400, color: "#0084FF" }}>{item}</Breadcrumb.Item>
              <Breadcrumb.Item style={{ fontSize: "16px", fontWeight: index == 0 ? 700 : 400, color: "#0084FF" }}>{index == breadCrumbs.length - 1 ? item : item}</Breadcrumb.Item>
            ))}
          </Breadcrumb>
          {/* <div className="inputText" onClick={() => setVisible(true)}>
            {visible ? (
              <Select
                showSearch
                allowClear
                value={value}
                placeholder="请输入内容"
                onChange={(newValue) => {
                  setValue(newValue);
                  if (newValue) {
                    const id = newValue?.split("#")[0];
                    setKey(id);
                    const breadCrumb = flatArr(menuData).find((item) => item.id === id)?.breadCrumbItem;
                    setBreadCrumbs(breadCrumb);
                    window.PubSub &&
                      window.PubSub.publish("menuClick", {
                        key: newValue,
                      });
                  }
                }}
                onSearch={onSearch}
                options={options}
                filterOption={false}
                style={{ width: 270 }}
              />
            ) : (
              <span style={{ marginLeft: 12 }}>请输入内容</span>
            )}
          </div> */}
        </div>

        <div className="header-right">
          <FullscreenOutlined onClick={onEnlarge} style={{ fontSize: "25px", color: "#666666" }} />
          <LockOutlined onClick={onLockScreen} style={{ fontSize: "25px", color: "#666666", marginLeft: 10 }} />
          <Badge count={infoCount} onClick={() => setInfoModalVisible(true)}>
            <Avatar
              size={28}
              style={{ marginLeft: 10, backgroundColor: "#fff0" }}
              icon={
                <svg t="1660548868120" className="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2611">
                  <path
                    d="M593.861938 788.582269 424.670537 788.582269c-9.444093 0-18.437931 3.931542-24.695448 10.902304-6.313799 6.970762-9.441023 16.32378-8.547677 25.675776 2.860141 29.191856 16.32378 56.238862 38.009685 76.018348 21.772886 20.016893 50.161447 31.0379 79.889515 31.0379 29.696346 0 58.084906-11.022031 79.830163-30.977525 21.714558-19.839861 35.178197-46.885843 38.068014-76.255755 0.595564-9.473769-2.534729-18.707061-8.638751-25.498744C612.299869 792.513812 603.306031 788.582269 593.861938 788.582269zM555.020304 863.825974c-25.082258 22.877033-66.604954 22.817682-91.567485 0.060375-7.596002-6.970762-13.404288-15.429411-17.157775-24.723078l125.82266 0C568.394916 848.51629 562.643935 856.914564 555.020304 863.825974z"
                    p-id="2612"
                  ></path>
                  <path
                    d="M818.608631 648.343271l-62.763462-82.927711 0-36.22197 0-13.046131L755.845169 410.432767c0-70.745251-24.215518-136.337131-68.182892-184.682209-26.003234-28.625968-57.310264-49.715285-93.055372-62.821791-3.306302-18.944468-12.720719-36.251645-26.926256-49.207725-32.050973-29.251208-85.104283-29.251208-117.095905 0-14.356986 13.046131-23.77038 30.382984-26.986631 49.2681-35.71441 13.046131-67.022463 34.135448-93.025697 62.791092-43.937698 48.434106-68.183915 114.025986-68.183915 184.652534l0.179079 154.686035-62.315254 82.45085c-8.757454 9.353019-13.582343 21.506826-13.582343 34.256198l0 40.331567c0 27.643594 22.460548 50.042743 50.042743 50.042743l544.812313 0c27.610848 0 50.011021-22.400173 50.011021-50.042743l0-40.331567C831.535035 669.075455 826.739822 656.921647 818.608631 648.343271zM535.776008 149.881612c-7.387247-0.655939-19.301602-1.906419-26.569122-1.906419-7.29822 0-19.689435 1.251503-27.048029 1.906419C494.578724 129.627313 526.542716 133.379777 535.776008 149.881612zM237.426992 722.156394l-0.119727-40.034808 62.315254-82.449827c8.698103-9.354042 13.524015-21.447475 13.524015-34.256198L313.146535 410.432767c0-58.056254 19.540032-111.553679 54.986335-150.634766 17.574261-19.361977 38.307468-34.374902 61.540611-44.681642 48.851615-21.745257 110.302175-21.745257 159.096485 0 23.321148 10.425444 43.99398 25.438369 61.538565 44.681642 35.449373 39.081087 54.958706 92.578512 54.958706 150.634766l0 105.715717 0 13.046131 0 36.22197c0 12.867052 4.825912 25.081235 12.95608 33.539884l62.791092 82.868359 0.508583 39.795355L237.426992 722.156394z"
                    p-id="2613"
                  ></path>
                </svg>
              }
            />
          </Badge>
          <Avatar
            size={28}
            style={{ marginLeft: 30 }}
            src={
              "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAYAAAByDd+UAAAAAXNSR0IArs4c6QAAAERlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAA6ABAAMAAAABAAEAAKACAAQAAAABAAAAHKADAAQAAAABAAAAHAAAAABkvfSiAAAEuklEQVRIDa1WQWicRRT+Zv5/040xkTTZldSECpIqooJgRG8WL0UPXoLoVeJV1FTrwaMUKg2IPVhQzwWpBw96qofeCoKIUpSuB6URappN2A2pm/33n/H7Zv9Z12Q3aa0P/nxv3rx535t5byZrcBtytumnkwzzHphzDhNcMl4s27IWTQNcz0uonZww6weFo+9w+fC6nzdlPJcYlKzHqjO4kVvcSvlp1U6O0RGPMVjc7zLMIUXb3cLld+dMbVjUgYQf1/1E2+Il43FP4vCDT/CnArRaQLncRY1TA9Px8EKNSymqHD9J4u0Rh6/emDJN2ftlD+GZVT+bjmKRE790OqiVD5Fgp7sk6kKJ7NHWtRR/DeaNwSNuBxdPzZrV/rl/EZ6pk8zhFe9xhQvW+h2l5yPwSRtGqHHUhRr3C2NUWYZnsxQXTk39Q9pzDMfo8Hqa4rtO3iXLAZMAXqhgI/zaBWpMO0+bCRA1jrpQY28x7XI8PWLxaTxeqwlJBix6g1/ZhXXfQaqvZGAjSqfbTOpxltlf1scar8hmDRJ9XG8jSmcaGyZFTbHFIQmZrNz0x5jli9zOt2JGKcyFLIJOW5qgyi69yCD3FbNdMGiUEiwy0bWMfiWuFQZRHOo+xfNsvq+XK+Zad4ceJ9jqV2Omg9B5LO8hU1QmwBK83b+73euZ7FX6nZB7enrLV/AX75LDhnfhSIzrcFqi/Xe6SPUpmQYJ1y1wfUpSzxIYofwsdZ6KNxk2OBwTV1pu4VHds9wjiQ0i3B2YNdtfuvU2vIOBNDhHnWgsbojL8nwf6jiss+Usr0ISUbqOKSJb4PuhjJzLc66lf8SgK55sxMyyGcmlLpxkt7UDWUEgJ328D2lE08F5Huugl6MZ5hjUlPhFlM4kgk2YoS0ute7hkkVbhZZzxH5dNqawwQReo/0Siev6eMqXZGOd6tx9SLKHSrrPxvd4R1x8BmEy7iTccDYLFxtm0qtYrqaJIlKH03HItQrJQ2BCUYKxGMTrReS6lC8PUmfRINkoa7fNnbDZGKNYRJ2PBTutaKKodznYwLy8bPmAgYLjEEBIoR95wH5h05CD9W2mrF+Du7g3sWgxAfYJdygCh2mmvkTDExxNKYCSkUS0JJMulPC4676EH32GzzlcZ5Pw3wmDEckxTreGurDGS19Rc6huQu6wSqLzXHSc1yGQKeBBEnwdjnM3n/CrsG6hrkK+pxVxWXcIP3HfM9xZwoeWc0hyhyUGj//VD+IZNK+1S9x9aEQhY86Iy74zbtZYzC2eozJIWDA5PT4oyp3YFEOxeLGsYosjcCkIz/lLHsfDVFlf3j+2r+x3I0UMa3kDFFsciicCvHXE/EzjTdbtqNpXtv9DeMUSdvKDii0OxQyEUjoJPmN3zvIobrtJtG4/sex03okjih39eoTvHTYN/kY5x2wei5N3i4rVynBOsWOs4orHIfDBpj86muMaLfpF8Z+Fp9Vmyxw7OWl+7w/S22E0vk8Hvj4LPNrfou1OUWv5RC3sJlOcPTuMwb/wPvljE8vFf/pqtO+L/KXHR2PlgUmsvGz022qvDCWMrt5789EmXuDlfZW2Z/iWTTHNsTDvsc22q1O/wqO68OYkvjFGL+Nw+Rv5B+MAVPxCeQAAAABJRU5ErkJggg=="
            }
          />
          <Dropdown overlay={menu} className="dropUser">
            <span className="user-center">
              {userName}
              <CaretDownOutlined />
            </span>
          </Dropdown>
        </div>
      </div>

      {localStorage.getItem("externalPassword") && !show ? (
        <div className="unlock-modal">
          <div style={{ marginTop: 300 }}>
            <Form style={{ width: 500, margin: "auto" }} name="basic" labelCol={{ span: 4 }} wrapperCol={{ span: 20 }} form={form} autoComplete="off" onFinish={onFinish}>
              <Form.Item label="开锁密码" name="externalPassword" rules={[{ required: true, message: "请输入开锁密码！" }, { validator: checkPassword }]}>
                <Input placeholder="请输入开锁密码" />
              </Form.Item>
              <Form.Item wrapperCol={{ offset: 21, span: 3 }}>
                <Button type="primary" htmlType="submit">
                  确定
                </Button>
              </Form.Item>
            </Form>
          </div>
        </div>
      ) : (
        <Modal
          title="设置锁屏密码"
          centered={true}
          visible={isModalVisible}
          onOk={handleOk}
          closable={false}
          footer={[
            <Button key="submit" type="primary" loading={loading} onClick={handleOk}>
              确定
            </Button>,
            <Button key="cancel" onClick={cancel}>
              取消
            </Button>,
          ]}
        >
          <Form name="basic" labelCol={{ span: 4 }} wrapperCol={{ span: 20 }} form={form} autoComplete="off">
            <Form.Item label="锁屏密码" name="password" rules={[{ required: true, message: "请输入密码！" }]}>
              <Input placeholder="请输入锁屏密码" />
            </Form.Item>
          </Form>
        </Modal>
      )}
      {/* {infoModalVisible && (
        <Modal
          title="通知"
          mask={false}
          className="infoModal"
          centered={true}
          visible={infoModalVisible}
          onOk={handleOk}
          onCancel={() => setInfoModalVisible(false)}
          closable={false}
          footer={null}
          width={350}
          bodyStyle={{ height: "480px" }}
        >
          <List
            className="demo-loadmore-list"
            loading={initLoading}
            itemLayout="horizontal"
            loadMore={loadMore}
            dataSource={list}
            style={{ height: 435 }}
            renderItem={(item, index) => {
              item.key = index;
              console.log("item", item);
              return (
                <List.Item
                  actions={[
                    <Button
                      data-infoId={item.id}
                      size="small"
                      shape="round"
                      onClick={() => read(item)}
                    >
                      标记已读
                    </Button>,
                  ]}
                >
                  <List.Item.Meta
                    title={<a>{item.info_title}</a>}
                    description={item.info_content}
                  />
                </List.Item>
              );
            }}
          />
        </Modal>
      )} */}
      {infoModalVisible && (
        <Modal
          title="┃ 告警事件"
          mask={false}
          className="infoModal"
          centered={true}
          visible={infoModalVisible}
          onOk={handleOk}
          onCancel={() => setInfoModalVisible(false)}
          // closable={false}
          footer={null}
          width={1000}
          // bodyStyle={{ height: "480px" }}
        >
          <Table columns={columns} bordered rowKey={(record) => record.id} dataSource={data} pagination={pagination} loading={loading} onChange={handleTableChange} />
        </Modal>
      )}
    </div>
  );
};

export default App;
