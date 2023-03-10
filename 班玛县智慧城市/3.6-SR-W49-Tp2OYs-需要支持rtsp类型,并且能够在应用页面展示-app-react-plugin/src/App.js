import React, { Component } from "react";
import {
  Menu,
  Modal,
  message
} from "antd";
import "./app.less";
// import { clickLogin, clickStartRealPlay } from './demo';
import eventActionDefinition from "./components/msgCompConfig";
import { queryAssetById } from "./api/asset"
import previwPng from "./images/previw.png"
// import Script from 'react-load-script';

const configId = process.env.CUSTOM_PLUGIN_ID
const prefix =
  `/storage_area/devops/dataflow/secondary_dev/123456789/${configId}/script`;

const url1 = prefix + "/jsPlugin-1.2.0.min.js",
  url2 = prefix + "/playctrl/AudioRenderer.js",
  url3 = prefix + "/playctrl/SuperRender.js",
  url4 = prefix + "/jquery-1.7.1.min.js",
  url5 = prefix + "/cryptico.min.js",
  url6 = prefix + "/webVideoCtrl.js";

// let { $, window } = window;
let szDeviceIdentify = "";
let selectMenuSzIP = "";

function getItem(key, label) {
  return {
    key,
    label,
  };
}

function mockData(data) {
  let keys = data[0],
    values = data[1],
    dataList = [];
  dataList = values.map(xVal => {
    let obj = {}
    keys.forEach((xKey, iKey) => {
      obj[xKey['col_name']] = xVal[iKey]
    });
    return obj;
  })
  return dataList;
}

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: [],
      cameraDataSource: [],
      cameraDataList: [],
      items: [],
      oSel: [],
      open: false,
      selectOSel: {},
      selectedKeys: [],
      script1: null,
      script2: null,
      script3: null,
      script4: null,
      script5: null,
      script6: null,
    }
  }
  componentWillMount() {
    this.useScript(url1, url2, url3, url4, url5, url6);
  }
  componentDidMount() {
    this.props?.customConfig?.componentId &&
      window.componentCenter?.register(
        this.props?.customConfig?.componentId,
        "",
        this,
        eventActionDefinition
      );
    this.getDataSource();
    this.getCameraSource();
    // setTimeout(()=>{
    //   this.login_in('139.170.234.27', 33);
    // },300)
  }

  useScript = (url1, url2, url3, url4, url5, url6) => {
    // 顺序引入两个外部js文件
    const script1 = document.createElement('script');
    script1.src = url1;
    script1.async = false;
    document.head.appendChild(script1);

    const script2 = document.createElement('script');
    script2.src = url2;
    script2.async = false;
    document.body.appendChild(script2);

    const script3 = document.createElement('script');
    script3.src = url3;
    script3.async = false;
    document.body.appendChild(script3);

    const script4 = document.createElement('script');
    script4.src = url4;
    script4.async = false;
    document.body.appendChild(script4);

    const script5 = document.createElement('script');
    script5.src = url5;
    script5.async = false;
    document.body.appendChild(script5);

    const script6 = document.createElement('script');
    script6.src = url6;
    script6.id = "videonode";
    script6.async = false;
    document.body.appendChild(script6);

    this.setState({
      script1,
      script2,
      script3,
      script4,
      script5,
      script6
    })
  };
  // 寺院
  getDataSource = async () => {
    const { customConfig } = this.props;
    const siYuanAssetId = customConfig?.siYuanAssetId || "00088200-4290-1417-b939-0fb3ccd97724";
    let { data } = await queryAssetById(siYuanAssetId);
    let dataList = mockData(data)
    this.setState({ dataSource: dataList });
    let items = dataList.map(x => {
      return getItem(x.id, x.temple_name)
    })
    this.setState({ items });
    console.log(items[0].key);
    let keyId = items[0].key;
    setTimeout(() => {
      this.onClick({ key: keyId })
    }, 300)
  }
  // 摄像头
  getCameraSource = async () => {
    const { customConfig } = this.props;
    const CameraAssetId = customConfig?.CameraAssetId || "3f57a963-3597-ea64-39cf-0d064761ccbf";
    let { data } = await queryAssetById(CameraAssetId);
    let dataList = mockData(data)
    this.setState({ cameraDataSource: dataList });
  }
  // 登录设备 
  login_in = (ipParams, iChannelID) => {
    const _this = this;
    const { customConfig } = this.props;
    const modalH = Number(customConfig?.modalH) || 440;
    const modalW = Number(customConfig?.modalW) || 600;
    // 检查插件是否已经安装过
    var iRet = window.WebVideoCtrl.I_CheckPluginInstall();
    if (-1 === iRet) {
      // alert("您还未安装过插件，双击开发包目录里的WebComponentsKit.exe安装！");
      message.warning("您还未安装过插件！")
      return;
    }

    var oLiveView = {
      iProtocol: 1, // protocol 1：http, 2:https
      szIP: ipParams, // protocol ip
      szPort: "80", // protocol port
      szUsername: "admin", // device username
      szPassword: "hk123456", // device password
      iStreamType: 1, // stream 1：main stream  2：sub-stream  3：third stream  4：transcode stream
      bZeroChannel: false, // zero channel
    };

    if (ipParams == selectMenuSzIP) {
      console.log(ipParams , selectMenuSzIP);
      window.WebVideoCtrl.I_StartRealPlay(szDeviceIdentify,
        {
          iStreamType: oLiveView.iStreamType,
          iChannelID: iChannelID,
          bZeroChannel: oLiveView.bZeroChannel,
          error: function (err) {
            _this.setState({ open: false })
            message.warning("播放失败")
            console.log('err', err);
          }
        });
    } else {
      window.WebVideoCtrl.I_Logout(
        szDeviceIdentify,
        {
          success: function (params) {
            console.log('登出设备')
          }
        }
      )
      // 登录设备
      window.WebVideoCtrl.I_Login(
        oLiveView.szIP,
        oLiveView.iProtocol,
        oLiveView.szPort,
        oLiveView.szUsername,
        oLiveView.szPassword,
        {
          success: function (xmlDoc) {
            szDeviceIdentify = oLiveView.szIP + "_" + oLiveView.szPort;
            selectMenuSzIP = oLiveView.szIP;
            // 获取通道
            window.WebVideoCtrl.I_GetDigitalChannelInfo(szDeviceIdentify, {
              async: false,
              success: function (xmlDoc) {
                console.log(`${szDeviceIdentify} 获取数字通道成功！`);
                // var oChannels = $(xmlDoc).find("InputProxyChannelStatus");
                // let oSel = [];
                // $.each(oChannels, function (i) {
                //   var id = $(this).find("id").eq(0).text(),
                //     name = $(this).find("name").eq(0).text(),
                //     online = $(this).find("online").eq(0).text();
                //   oSel.push({ id, name, online });
                // });
                // _that.setState({ oSel })
                // console.log("通道", oSel);

                // 初始化插件参数及插入插件
                window.WebVideoCtrl.I_InitPlugin(modalW, modalH, {
                  bWndFull: true, //是否支持单窗口双击全屏，默认支持 true:支持 false:不支持
                  iWndowType: 1,
                  cbInitPluginComplete: function () {
                    window.WebVideoCtrl.I_InsertOBJECTPlugin("divPlugin");

                    // 检查插件是否最新
                    if (-1 === window.WebVideoCtrl.I_CheckPluginVersion()) {
                      alert(
                        "检测到新的插件版本，双击开发包目录里的WebComponentsKit.exe升级！"
                      );
                      return;
                    }
                    // 开始预览
                    // setTimeout(function () {
                      window.WebVideoCtrl.I_StartRealPlay(szDeviceIdentify,
                        {
                          iStreamType: oLiveView.iStreamType,
                          iChannelID: iChannelID,
                          bZeroChannel: oLiveView.bZeroChannel,
                          error: function (err) {
                            message.warning("播放失败")
                            _this.setState({ open: false })
                            console.log('err', err);
                          }
                        });
                    // }, 300);
                  },
                });
              },
              error: function (status, xmlDoc) {
                _this.setState({ open: false });
                message.warning("获取模拟通道失败！")
              },
            });
          },
          error: function (status, xmlDoc) {
            _this.setState({ open: false });
            message.warning("登录失败！")
          },
        }
      );
    }
  };

  do_EventCenter_messageSuccess() {
    // window.location.reload();
  }
  componentWillUnmount() {
    let { script6,
      script5,
      script4,
      script3,
      script2,
      script1 } = this.state;
    document.body.removeChild(script6);
    document.body.removeChild(script5);
    document.body.removeChild(script4);
    document.body.removeChild(script3);
    document.body.removeChild(script2);
    document.body.removeChild(script1);
  }
  // 逻辑控制用，不可删
  Event_Center_getName() {
    return "应用二开测试";
  }
  // 点击菜单
  onClick = async (e) => {
    this.setState({ selectedKeys: [e.key] })
    let { cameraDataSource } = this.state;
    let cameraList = cameraDataSource.filter(element => {
      if (element.temple == e.key) return element
    })
    this.setState({ cameraDataList: cameraList })
    console.log('cameraList', cameraList);
  };

  // 打开窗口
  handleOpen = (item) => {
    console.log('item', item);
    this.setState({ selectOSel: item, open: true });
    let iChannelID = Number(item.channelID);
    this.login_in(item.ip_address, iChannelID);
  };
  // 关闭窗口
  handleCancel = () => {
    let _this = this;
    window.WebVideoCtrl.I_Stop({
      iWndIndex: 0,
      success: function () {
        _this.setState({ open: false })
      },
      error: function (err) {
        _this.setState({ open: false })
        console.log('err', err);
      }
    });
  };

  render() {
    //应用变量和系统变量 7.26 V8R4C50SPC220需求新加 之前版本取不到appVariables和sysVariables
    //8.11 V8R4C60SPC100需求新加，之前版本取不到themeInfo
    const { customConfig } = this.props;
    const modalH = Number(customConfig?.modalH) || 440;
    const modalW = Number(customConfig?.modalW) || 600;
    const { items, cameraDataList, open, selectOSel, selectedKeys } = this.state || {};
    return (
      <div className="rtspPage">
        <div className="menuBox">
          <div className="rtspList">摄像头列表</div>
          <Menu
            selectedKeys={selectedKeys}
            defaultSelectedKeys={selectedKeys}
            items={items}
            style={{
              width: 256,
            }}
            onClick={this.onClick}
          />
        </div>
        <div className="rihtBox">
          {cameraDataList.map(els => {
            return (
              <div className="cameraCard" key={els.data_id}>
                <div className="imgBox" onClick={() => this.handleOpen(els)}>
                  <img className="previwPng" src={previwPng} alt="" />
                </div>
                <div className="cameraTitle">{els.base_station}</div>
              </div>
            )
          })
          }
        </div>
        <Modal
          getContainer={false}
          open={open}
          title={selectOSel.base_station}
          onCancel={this.handleCancel}
          footer={null}
          width={modalW + 20}
        >
          <div className="divPlugin" id="divPlugin" style={{ with: modalW, height: modalH, background: 'grey' }}></div>
        </Modal>
      </div>
    );
  }
}
