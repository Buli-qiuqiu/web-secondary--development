<template>
  <div class="analyzer-secondary" :style="{ width, height }" ref="analyzer-secondary" :id="id">
    <div id="mMap" :style="{width, height}"></div>
  </div>
</template>

<script>
  import _ from 'lodash'
  import * as Cesium from "cesium"
    // Cesium.Ion.defaultAccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI4ZTJhY2U0NC1kZmRjLTRhMDctYWFhMS05ODFjYWYzNjE0ZWMiLCJpZCI6MTIwMzgwLCJpYXQiOjE2NzI5MDQzMDh9.Co78gtu4FH8w3Qzy7noVwTad5JfwZ-lNjOcoDAiw7c0"; //这里的token是自己申请的token
    window.CESIUM_BASE_URL = "/";
  const { XE } = window;
export default {
  name: "Main",
  components: {},
  data() {
    return {
      id: "",
      width: "100%",
      height: "100%",
      number: 1,
      viewer: null,
      earth: null,
      scene: null,
      handler: null,
      scriptEle: null,
      scriptEle1: null,
      scriptEle2: null,
      scriptEle3: null,
      providerList: [], // 底图配置列表
      pointListApp: [], // 点位配置
      serverImageryUrl: "http://10.34.4.103:8010/ServiceAdapter/MAP/EMAP_DEEPWEB/6f9c5d19634442a3accb406539ef09dc",
      POICollection: [],
        // {
        //   text: "武胜社区",
        //   img: "https://img0.baidu.com/it/u=2223986897,2002289354&fm=253&fmt=auto&app=138&f=JPG?w=500&h=500",
        //   longitude: 114.28590897394388,
        //   latitude: 30.569480438478557
        // },
        // {
        //   text: "晴川桥",
        //   img: "https://img0.baidu.com/it/u=2223986897,2002289354&fm=253&fmt=auto&app=138&f=JPG?w=500&h=500",
        //   longitude: 114.27893240843595,
        //   latitude: 30.566033923596226
        // },
        // {
        //   text: "南岸嘴江滩公园",
        //   img: "https://img0.baidu.com/it/u=2223986897,2002289354&fm=253&fmt=auto&app=138&f=JPG?w=500&h=500",
        //   longitude: 114.28279014079745,
        //   latitude: 30.56420130806063
        // }
      };
    },
  props: {
    dataSource: Object | Array,
    componentId: String,
    customConfig: Object,
    options: Object,
    updateProcess: Function,
    mainInit: Function
  },
  created() {},
  mounted() {
    // this.scriptEle = document.createElement("script")
    // document.head.appendChild(this.scriptEle)
    // this.scriptEle.src = "http://earthsdk.com/v/last/XbsjCesium/Cesium.js";

    // this.scriptEle1 = document.createElement("script")
    // document.head.appendChild(this.scriptEle1)
    // this.scriptEle1.src = "http://earthsdk.com/v/last/XbsjEarth/XbsjEarth.js";

    // this.scriptEle3 = document.createElement("link")
    // document.head.appendChild(this.scriptEle3)
    // this.scriptEle3.rel = "stylesheet";
    // this.scriptEle3.href = "http://earthsdk.com/v/last/XbsjCesium/Widgets/widgets.css";

    setTimeout(()=>{
      const { XE } = window;
      console.log("xe", XE);
      this.mainInit(this);
      this.initComData();
      // this.initDataSource();
      XE.ready().then(this.initComData()); 
    },300);

  },
  methods: {
    Event_Center_getName() {
      return this.id;
    },
    triggerEvent(eventName, payload) {
      this.props.componentId && window.eventCenter?.triggerEvent(
        this.props.componentId,
        eventName,
        //payload需为一个object
        payload
      );
    },
    // 配置项
    initComData() {
      //customConfig为组件式配置项数据
      //dataSource为分析仪左侧拖入的数据源
      const { dataSource, customConfig, options } = this;
      //customOptions为传统的输入框形式的配置项
      const customOptions = options?.externalVariables || {};
      console.log('展示页面customConfig', customConfig);
      console.log('//**配置页dataSource**//', dataSource);
      try {
        // 模型
        this.providerList = customConfig.imageryProviderList ? customConfig.imageryProviderList : [];
        // 底图
        this.serverImageryUrl = customConfig.ServerImageryProvider ? customConfig.ServerImageryProvider : "http://10.34.4.103:8010/ServiceAdapter/MAP/EMAP_DEEPWEB/6f9c5d19634442a3accb406539ef09dc";
        // 点位
        this.pointListApp = customConfig.pointList ? _.cloneDeep(customConfig.pointList) : [];
      } catch (error) {
        // 模型
        this.providerList = customConfig.imageryProviderList ? customConfig.imageryProviderList : [];
        // 底图
        this.serverImageryUrl = customConfig.ServerImageryProvider ? customConfig.ServerImageryProvider : "http://10.34.4.103:8010/ServiceAdapter/MAP/EMAP_DEEPWEB/6f9c5d19634442a3accb406539ef09dc";
        // 点位
        this.pointListApp = customConfig.pointList ? _.cloneDeep(customConfig.pointList) : [];
      }
      console.log('底图this.serverImageryUrl', this.serverImageryUrl);
      console.log('模型this.providerList', this.providerList);
      console.log('点位this.pointListApp', this.pointListApp);
      // 请求底图
      this.initMap();
    },
    // 数据
    initDataSource() {
      let dataCopy = JSON.parse(JSON.stringify(this.dataSource));
      let keys = dataCopy.splice(0,1)[0],
        values = dataCopy;
      this.POICollection = values.map(x => {
        let obj = {};
        keys.forEach((y, yIndex) => {
          obj[y] = Number(x[yIndex])
        });
        return obj;
      });
      // console.log('this.POICollection', this.POICollection);
    },
    //初始化地图
    initMap(){
      // earth = new XE.Earth('earthContainer');
      this.earth = new XE.Earth('mMap', {
        // 这里设置Viewer的配置，和new Viewer(container, options)中的options一致
        // imageryProvider: esri,          //设置底图
        geocoder: false,                //是否显示地名查找控件
        sceneModePicker: false,         //是否显示投影方式控件
        navigationHelpButton: false,    //是否显示帮助信息控件
        baseLayerPicker: false,         //是否显示图层选择控件
        homeButton: false,              //是否显示Home按钮
        fullscreenButton: false,        //是否显示全屏按钮
        animation: false,               //左下角的动画控件的显示
        shouldAnimate: false,           //控制模型动画
        timeline: false,                //底部的时间轴
        selectionIndicator: false,
        infoBox: false,
      });

      this.earth.sceneTree.root = {
        "children": [
          {
            "czmObject": {
              "name": "默认离线影像",
              "xbsjType": "Imagery",
              "xbsjImageryProvider": {
                "createTileMapServiceImageryProvider": {
                  "url": XE.HTML.cesiumDir + 'Assets/Textures/NaturalEarthII',
                  "fileExtension": 'jpg',
                },
                "type": "createTileMapServiceImageryProvider"
              }
            }
          },
        ]
      };
      // XE.ready().then(this.initMap()); 




      // var esri = new Cesium.ArcGisMapServerImageryProvider({
      //   // url: "https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer"
      //   url: this.serverImageryUrl
      // })
      // this.viewer = new Cesium.Viewer("mMap",{
      //   imageryProvider: esri,          //设置底图
      //   geocoder: false,                //是否显示地名查找控件
      //   sceneModePicker: false,         //是否显示投影方式控件
      //   navigationHelpButton: false,    //是否显示帮助信息控件
      //   baseLayerPicker: false,         //是否显示图层选择控件
      //   homeButton: false,              //是否显示Home按钮
      //   fullscreenButton: false,        //是否显示全屏按钮
      //   animation: false,               //左下角的动画控件的显示
      //   shouldAnimate: false,           //控制模型动画
      //   timeline: false,                //底部的时间轴
      //   // terrainProvider: Cesium.createWorldTerrain(), //打开深度检测选项
      //   selectionIndicator: false,
      //   infoBox: false,
      // });
      // //定位到指定位置 flyto:会有一个飞行动画 ; setview直接定位
      // this.viewer.camera.flyTo({
      //   destination: Cesium.Cartesian3.fromDegrees(114.28280, 30.54220, 4078.0),
      //   orientation: {
      //     heading: Cesium.Math.toRadians(-22.00), // 航偏角
      //     pitch: Cesium.Math.toRadians(332.55), // 仰角
      //     roll: Cesium.Math.toRadians(0), // 翻滚角
      //   }
      // });
      // //去cesium logo水印 或 css
      // this.viewer.cesiumWidget.creditContainer.style.display = "none";
      // //创建场景
      // this.scene = this.viewer.scene;
      // // if(!this.scene.pickPositionSupported){
      // //   window.alert("此浏览器不支持拾取位置！")
      // // }
      // this.handler = new Cesium.ScreenSpaceEventHandler(this.scene.canvas);

      // // 加载图层
      // if (this.providerList.length > 0) {
      //   this.Cesium3DTilesetLoad();
      // }
      // // 生成点位
      // if (this.pointListApp.length > 0) {
      //   this.pointSet();
      // }
      // 拾点
      // this.getClickPointAdd(this.viewer);
    },
    // 加载图层
    async Cesium3DTilesetLoad(){
      try {
        this.providerList.forEach(x =>{
          let tileset = new Cesium.Cesium3DTileset({
            url: x.serveUrl,
            // url: "http://127.0.0.1:5501/tileset.json",
          });
          this.scene.primitives.add(tileset);
          tileset.readyPromise.then((tileset)=> {
            if (x.color) {
              tileset.style = new Cesium.Cesium3DTileStyle({
                color: {
                  conditions: [["true", x.color]]
                },
              });
            }
            console.log("加载tileset完成", tileset);
          }).catch((error)=> {
            console.log('失败tileset', error);
          });
        })
      } catch (error) {
        console.log(error);
      }

      // let tileset = new Cesium.Cesium3DTileset({
      //   url: "http://127.0.0.1:5501/tileset1.json",
      //   maximumScreenSpaceError: 2,        //最大的屏幕空间误差
      //   maximumNumberOfLoadedTiles: 1000,  //最大加载瓦片个数
      //   shadows: Cesium.ShadowMode.DISABLED,
      //   luminanceAtZenith: 1,
      //   url: "http://10.34.4.103:8010/ServiceAdapter/MAP/HYXZFW3DTILE/6f9c5d19634442a3accb406539ef09dc/tileset.json"
      // });
      // this.scene.primitives.add(tileset);
      // tileset.readyPromise.then((tileset) => {
      //   tileset.style = new Cesium.Cesium3DTileStyle({
      //     color: {
      //       conditions: [
      //         ["true", "rgb(200, 208, 212)"]]
      //     },
      //   });
      //   this.viewer.zoomTo(tileset);
      //   this.viewer.zoomTo(
      //     tileset,
      //     new Cesium.HeadingPitchRange(
      //       0.0,
      //       -0.5,
      //       tileset.boundingSphere.radius / 4.0
      //     )
      //   );
      //   console.log('成功tileset', tileset);
      // }).catch((error) => {
      //   console.log('失败tileset',error);
      // });
    },
    // 清除点位
    clearEntityFromView() {
      this.viewer.entities.removeAll();
    },
    // 生成点位
    pointSet() {
      // 清除点位
      this.clearEntityFromView();
      let _that = this;
      // console.log('this.pointListApp', this.pointListApp);
      // console.log('this.POICollection', this.POICollection);
      this.pointListApp.forEach(item => {
        let imgUrl = item.imgList.length > 0 ? item.imgList[0].url : "";
        let { LongitudeKey, LatitudeKey } = item;
        // console.log('imgUrl', imgUrl);
        this.POICollection.forEach((point)=> {
          // console.log("经度", point[LongitudeKey],point);
          // console.log("维度", point[LatitudeKey], point);
          this.viewer.entities.add({
            position: Cesium.Cartesian3.fromDegrees(point[LongitudeKey], point[LatitudeKey], 10),
            label: {
              text: "为什么出不来",
              font: "7pt 微软雅黑",
              // 字体颜色
              fillColor: Cesium.Color.fromCssColorString('#ffffff'),
              // 背景颜色
              backgroundColor: Cesium.Color.fromCssColorString('rgba(19,77,177,0.95)'),
              // 是否显示背景颜色
              showBackground: true,
              // 字体边框
              outline: true,
              // 字体边框颜色
              outlineColor: Cesium.Color.fromCssColorString('#ffffff'),
              // 字体边框尺寸
              outlineWidth: 10,
              // 应用于图像的统一比例。比例大于会1.0放大标签，而比例小于会1.0缩小标签。
              scale: 1.0,
              // 设置样式：FILL：填写标签的文本，但不要勾勒轮廓；OUTLINE：概述标签的文本，但不要填写；FILL_AND_OUTLINE：填写并概述标签文本。
              // style: 0,
              // 相对于坐标的水平位置
              verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
              // 相对于坐标的水平位置
              horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
              // 该属性指定标签在屏幕空间中距此标签原点的像素偏移量
              pixelOffset: new Cesium.Cartesian2(10, -40),
              // 是否显示
              show: false
            },
            billboard: {
              // 图像地址，URI或Canvas的属性
              // image: __webpack_require__("8606")("./".concat(point.type, ".png")),
              // image: "https://img0.baidu.com/it/u=2223986897,2002289354&fm=253&fmt=auto&app=138&f=JPG?w=500&h=500",
              image: imgUrl,
              // 设置颜色和透明度
              color: Cesium.Color.fromCssColorString('#6ab4fff2').withAlpha(1.0),
              // 高度（以像素为单位）
              height: 50,
              // 宽度（以像素为单位）
              width: 40,
              // 大小是否以米为单位
              sizeInMeters: false,
              // 相对于坐标的垂直位置
              verticalOrigin: Cesium.VerticalOrigin.CENTER,
              // 相对于坐标的水平位置
              horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
              // 该属性指定标签在屏幕空间中距此标签原点的像素偏移量
              pixelOffset: new Cesium.Cartesian2(0, 0),
              // 应用于图像的统一比例。比例大于会1.0放大标签，而比例小于会1.0缩小标签。
              scale: 1.0,
              // 是否显示
              show: true
            }
          });
        })
      })
    },

    /**
     * @description: 获取当前鼠标点击位置坐标，并添加到图上显示
     * @param {*} _viewer
     * @return {*}
     */
    getClickPointAdd(_viewer) {
        // 注册屏幕点击事件
        // let handler = new Cesium.ScreenSpaceEventHandler(_viewer.scene.canvas);
        this.handler.setInputAction(function(event) {
            // 转换为不包含地形的笛卡尔坐标
            let clickPosition = _viewer.scene.camera.pickEllipsoid(event.position);
            // 转经纬度（弧度）坐标
            let radiansPos = Cesium.Cartographic.fromCartesian(clickPosition);
            // 转角度
            console.log("经度：" + Cesium.Math.toDegrees(radiansPos.longitude) + ", 纬度：" + Cesium.Math.toDegrees(radiansPos.latitude));

            // 添加点
            _viewer.entities.add({
                position: clickPosition,
                point: {
                    color: Cesium.Color.YELLOW,
                    pixelSize: 30
                }
            })
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
    }

  },
  destroyed() {
    //业务代码，不需要记得清除
    document.head.removeChild(this.styleEle)
    document.head.removeChild(this.styleEle1)
    document.head.removeChild(this.styleEle2)
    document.head.removeChild(this.styleEle3)
  },
};
</script>

<style scoped>

</style>