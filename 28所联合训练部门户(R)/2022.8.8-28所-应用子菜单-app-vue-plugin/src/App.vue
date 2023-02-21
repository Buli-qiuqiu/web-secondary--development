<template>
  <div :id="id" :ref="id" class="menu_list">
    <div class="top_box">
      <div class="menu_title">{{ title }}</div>
      <div class="menu_more" :style="{ color: pinPaiTextColor }" @click="lineHerf()">更多</div>
    </div>
    <div ref="typeBox" class="type_box">
      <!-- <div ref="dragBox" class="drag_box" @mousedown="dragx($event)">
        <div v-for="(x, y) in menuTypeList" :key="y" class="type_title" :style="{ background: menuActive == y ? pinPaiColor : '#fff', color: menuActive == y ? '#fff' : '#6e6e6e' }" @click="typeBtn(x, y)">{{ x[menuTypeTitle] }}</div>
      </div> -->
      <div ref="dragBox" class="drag_box">
        <div v-for="(x, y) in menuTypeList" :key="y" class="type_title" :style="{ background: menuActive == y ? pinPaiColor : '#fff', color: menuActive == y ? '#fff' : '#6e6e6e' }" @click="typeBtn(x, y)">{{ x[menuTypeTitle] }}</div>
      </div>
    </div>
    <div class="bottomBox" :style="{ height: boxHeight + 'px' }">
      <div class="leftArrow">
        <div v-if="pageNum > 1" class="arrowBox" @click="arrowHande('-')">
        <!-- <div class="arrowBox" @click="arrowHande('-')"> -->
          <i class="el-icon-arrow-left"></i>
        </div>
      </div>
      <div class="list_box">
        <div class="for_box" v-for="(item, i) in menuList" :key="i">
          <el-tooltip class="item" effect="light" :content="item[menuDesc]" placement="bottom">
            <!--  :class="{ activeItem: active == i }" :style="{ background: active == i ? pinPaiColor : 'rgba(255, 255, 255, 0.8)'}" -->
            <div class="menuLitm" @click="setActive(i, item)">
              <img :src="JSON.parse(item[imgSrc])[0].url" class="menu_img" alt="" />
              <span class="name">{{ item[menuTitle] }}</span>
            </div>
          </el-tooltip>
        </div>
      </div>
      <div class="rightArrow">
        <div v-if="menuListCopy.length > (pageNum * (rowNum * 4))" class="arrowBox" @click="arrowHande('+')">
        <!-- <div class="arrowBox" @click="arrowHande('+')"> -->
          <i class="el-icon-arrow-right"></i>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import appService from "@njsdata/app-sdk";
import eventActionDefine from './components/msgCompConfig'
import './index.css'
import { getAssetById, queryAssetById, getMenu } from './api/asset'

export default {
  name: 'App',
  props: {
    customConfig: Object,
    themeInfo: Object,
  },
  data() {
    return {
      id: "erbasMenu930",
      styleEle: null,
      title: '',
      assetId: '',
      menuId: '',
      active: -1,
      menuActive: 0,
      menuTitle: '',
      menuDesc: '',
      themeList: [],
      imgSrc: '',
      lineTo: '',
      menuTo: '',
      menuList: [],
      menuListCopy: [],
      menuTypeList: [],
      menuTypeTitle: '',
      menuType: '',
      menuTypeVal: '',
      menuListAll: [],
      boxHeight: '',
      filterWords: "",
      userRole: "",
      rowNum: 1,
      pageNum: 1
    }
  },
  computed: {
    pinPaiColor() {
      let theme_global_config = this.themeInfo ? this.themeInfo?.theme_global_config : { '--theme-public-pinPai-color': 'rgba(24,144,255,0.8)' }
      let themeColor = theme_global_config['--theme-public-pinPai-color']
      return themeColor
    },
    pinPaiTextColor() {
      let theme_global_config = this.themeInfo ? this.themeInfo?.theme_global_config : { '--theme-public-text-color-1': 'rgba(24,144,255,0.8)' }
      let themeColor = theme_global_config["--theme-public-text-color-1"]
      return themeColor
    },
  },
  mounted() {
    // 滚动轴【鼠标】横向滚动
    let tabsContainer = document.querySelector(".drag_box");
    tabsContainer.addEventListener("wheel", (event) => {
      event.preventDefault();
      console.log(event.deltaY);
      if (event.deltaY >= 0) {
        tabsContainer.scrollLeft += (event.deltaY + 20);
      } else {
        tabsContainer.scrollLeft += (event.deltaY - 20);
      }
    });
    // this.assetId = this.customConfig?.assetId
    this.menuId = this.customConfig?.menuId
    this.title = this.customConfig?.title
    this.menuTitle = this.customConfig?.menuTitle
    this.menuDesc = this.customConfig?.menuDesc
    this.themeList = JSON.parse(this.customConfig?.themePic)
    this.lineTo = this.customConfig?.moreTo
    this.menuTo = this.customConfig?.menuTo
    this.menuTypeTitle = this.customConfig?.menuTypeTitle
    this.menuType = this.customConfig?.menuType
    this.boxHeight = this.customConfig?.boxHeight
    this.filterWords = this.customConfig?.filterWords
    this.rowNum = parseInt(this.customConfig?.rowNum)
    this.userRole = window.currentUser?.id ? window.currentUser?.id : "1234567890"
    this.getData()
    this.$nextTick(() => {
      this.appendStyle()
    })
    let { componentId } = this.customConfig || {}
    componentId && window.componentCenter?.register(componentId, 'comp', this, eventActionDefine)
  },
  methods: {
    appendStyle() {
      let style = `#${this.id} .menuLitm:hover{color:${this.pinPaiTextColor} !important;background:${this.pinPaiColor} !important;}`;
      if (this.$refs[this.id]) {
        this.styleEle = document.createElement("style");
        document.head.appendChild(this.styleEle);
        this.styleEle.innerText = style;
      }
    },
    async getData() {
      let theme_id = this.themeInfo.theme_id ? this.themeInfo.theme_id : '52250e971ce3482491f75a7ae01af824'
      this.imgSrc = ''
      this.themeList.forEach((y) => {
        if (y.themeId == theme_id) {
          this.imgSrc = y.image
        }
      })
      // 旧版查询资产
      // const params = {
      //   column: this.filterWords,
      //   compareObj: this.userRole,
      //   datatype: 0,
      //   type: 10
      // }
      // let { data } = await queryAssetById(this.assetId,params)
      // // let { data } = await getAssetById(this.assetId)
      // let key = data[0]
      // let value = data[1]
      // this.menuListAll = value.map((val) => {
      //   let obj = {}
      //   key.forEach((k, index) => {
      //     obj[k.col_name] = val[index]
      //   })
      //   return obj
      // })
      // console.log('this.menuListAll',this.menuListAll);

      // 新版查询应用商店常用接口
      this.menuListAll = []
      let { data } = await getMenu()
      let {dataList,sorts} = data
      let sortList = sorts[0] ? JSON.parse(sorts[0].sorts) : []
      for (let index = 0; index < sortList.length; index++) {
        for (let current = 0; current < dataList.length; current++) {
          if (dataList[current].data_id == sortList[index]) {
            this.menuListAll.push(dataList.splice(current,1)[0])
            current--
          }
        }
      }
      dataList.forEach(x=>{
        this.menuListAll.push(x)
      })
      
      // console.log('this.cyMenuList=',this.menuListAll);
      this.getMenuData()
    },
    async getMenuData() {
      let { data } = await getAssetById(this.menuId)
      let key = data[0]
      let value = data[1]
      this.menuTypeList = value.map((val) => {
        let obj = {}
        key.forEach((k, index) => {
          obj[k.col_name] = val[index]
        })
        return obj
      })
      this.typeBtn(this.menuTypeList[0], 0)
    },
    dragx(el) {
      let oDiv = this.$refs.dragBox //当前元素
      let tDiv = this.$refs.typeBox //当前元素
      let disX = el.clientX
      let dWidth = tDiv.offsetWidth
      let sonWidth = oDiv.offsetWidth
      let out = sonWidth - dWidth
      let startLeft = 0
      if (oDiv.style.left == '') {
        startLeft = 0
      } else {
        startLeft = parseInt(oDiv.style.left)
      }
      console.log('startLeft', startLeft)
      document.onmousemove = function (e) {
        //通过事件委托，计算移动的距离
        let l = e.clientX - disX + startLeft
        if (Math.abs(l) < out) {
          //移动当前元素
          oDiv.style.left = l + 'px'
          // oDiv.style.top = t + 'px'
        }
      }
      document.onmouseup = function (e) {
        let endLeft = parseInt(oDiv.style.left)
        if (endLeft > 0) {
          oDiv.style.left = 0
        }
        document.onmousemove = null
        document.onmouseup = null
      }
    },
    lineHerf() {
      window.open(this.lineTo)
    },
    setActive(i, item) {
      this.active = i
      window.open(item[this.menuTo])
    },
    typeBtn(item, i) {
      this.menuActive = i
      this.menuTypeVal = item[this.menuType]
      let menuListCopys = []
      this.pageNum = 1
      let startIndex = 0
      let endIndex =  this.pageNum * (this.rowNum * 4)
      menuListCopys = this.menuListAll.filter((x) => {
        return x[this.menuType] == this.menuTypeVal
      })
      this.menuListCopy = JSON.parse(JSON.stringify(menuListCopys));
      this.menuList = menuListCopys.splice(startIndex,endIndex)
      console.log('this.menuList', this.menuList)
    },
    triggerEvent() {
      let { componentId, appId } = this.customConfig || {}
      componentId &&
        appId &&
        window.eventCenter?.triggerEventNew({
          objectId: appId,
          componentId: componentId,
          type: 'app',
          event: '',
          payload: {
            value: '',
          },
        })
    },
    arrowHande(size) {
      if (size === '-') {
        this.pageNum = this.pageNum - 1
        if (this.pageNum == 0) {
          this.pageNum = 1
          return
        }
      } else {
        this.pageNum = this.pageNum + 1
      }
      let startIndex = (this.pageNum - 1) * (this.rowNum * 4)
      let endIndex =  this.pageNum * (this.rowNum * 4)
      this.menuList = this.menuListCopy.slice(startIndex,endIndex)
    },
    do_EventCenter_messageSuccess() {
      alert('动作执行成功！')
    },
    Event_Center_getName() {
      return ''
    },
  },
  destroyed() {
    window.componentCenter?.removeInstance(this.customConfig?.componentId)
  },
}
</script>

<style lang="less" scoped>
// .menu_list::-webkit-scrollbar {
//   display: none;
// }
.menu_list {
  padding: 15px 0 15px 15px;
  width: 545px;
  background: #f1f2f7;
  border-radius: 4px;
  box-sizing: border-box;
  .top_box {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .menu_title {
      font-size: 16px;
      color: #333;
      font-weight: 600;
    }
    .menu_more {
      margin-right: 15px;
      cursor: pointer;
      font-size: 14px;
    }
  }
  .type_box {
    margin-top: 15px;
    height: 30px;
    width: calc(100% - 15px);
    display: flex;
    justify-content: center;
    // overflow: hidden;
    .drag_box {
      display: flex;
      flex-wrap: nowrap;
      height: 30px;
      overflow: auto;
      overflow-y: hidden;
      border-radius: 4px;
      box-shadow: 0 0 6px #dadbe1;
      scrollbar-width: none;
      &::-webkit-scrollbar {
        display: none;
      }
      // &::-webkit-scrollbar {
      //   width: 8px;
      //   height: 8px;
      //   background: #242526;
      //   border-radius: 4px;
      // }
      // /*定义滚动条轨道内阴影+圆角*/
      // &::-webkit-scrollbar-track {
      //   border-radius: 4px;
      //   background: #242526;
      // }
      // /*定义滑块内阴影+圆角*/
      // &::-webkit-scrollbar-thumb {
      //   border-radius: 4px;
      //   background: rgba(255, 255, 255, 0.2);
      // }
      .type_title {
        cursor: pointer;
        display: inline-block;
        user-select: none;
        width: 100px;
        // height: 22px;
        // line-height: 22px;
        min-width: 100px;
        text-align: center;
        padding: 5px 0;
        font-size: 14px;
        border-right: 1px solid #e7e7e7;
        &:last-child {
          border-right: none;
        }
      }
    }
  }
  .bottomBox {
    display: flex;
    align-items: center;
    flex: 1;
    .leftArrow,.rightArrow {
      display: flex;
      align-items: center;
      user-select: none;
      margin-right: 15px;
      height: 100%;
      width: 20px;
      .arrowBox {
        height: 50px;
        width: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 14px;
        color: #ffffff;
        background: #9e9c9f;
        // opacity: 0;
        // &:hover {
        //   opacity: 1;
        // }
      }
    }
    .list_box {
      user-select: none;
      display: flex;
      flex-wrap: wrap;
      width: 100%;
      height: 100%;
      padding-bottom: 13px;
      padding-top: 8px;
      .for_box {
        width: 100px;
        height: 104px;
        margin-top: 8px;
        margin-right: 15px;
        display: flex;
        align-items: center;
        cursor: pointer;
  
        .menuLitm {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          border-radius: 4px;
          width: 100%;
          height: 100%;
          box-sizing: border-box;
          background: inherit;
          color: #2a2b2d;
          .menu_img {
            width: 40px;
            height: 40px;
            min-width: 40px;
            min-height: 40px;
            border-radius: 50%;
          }
          .name {
            margin-top: 8px;
            font-family: 'PingFang SC';
            font-style: normal;
            font-weight: 400;
            font-size: 14px;
            // height: 20px;
            // line-height: 20px;
            width: 100%;
            text-overflow: -o-ellipsis-lastline;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 1;
            line-clamp: 1;
            -webkit-box-orient: vertical;
            text-align: center;
          }
        }
      }
    }
  }
}
</style>