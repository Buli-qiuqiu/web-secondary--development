<template>
  <!-- 定义外层容器标识，宽高百分百 不可删除 -->
  <div class="lunb_28" :id="identification" :style="{ width: '100%', height: heightF ? heightF : '100%' }"
    :ref="identification">
    <!-- -->
    <div class="lb_right" ref="lunb_28" style="width: 100%;height: 100%">
      <div class="lb_img" :style="{ width: sOption == 'right' ? '76%' : '100%' }">
        <el-carousel class="lbzj" ref="carousel" height="100%" :interval="speedTime" indicator-position="none"
          @change="carouselChange" arrow="always">
          <el-carousel-item v-for="(item, inx) in jqReports" :key="inx">
            <a :href="`${detailsUrl}${keyField}=${item[keyField]}`" target="_blank">
              <img :src="item[imgField]" width="100%" height="100%" :style="{ objectFit: Picture }" />
              <div class="title_text" :title="item[titleField]">
                {{ item[titleField] }}
              </div>
            </a>

          </el-carousel-item>
        </el-carousel>
      </div>
      <div class="lb_list" v-if="sOption == 'right'">
        <div :class="{ icon_top: true, icon_bottom: scrollDirection }" v-if="jqReports.length > 5" @click="scorllBotFn">
          <i :class="scrollDirection ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"></i>
        </div>
        <div :class="{ list_body: true, trFive: jqReports.length > 5 }">
          <ul class="scroll_ul">
            <li :class="{ scroll_li: true }" v-for="(item, inx) in jqReports" :key="inx" :title="item[titleField]"
              @click="thumbnailClick(inx)">
              <div class="temp">
                <img class="tempI" :src="item[imgField]" alt="">
                <div :class="{ bof: true, exhibitr: curIndex === inx }">
                  <i class="el-icon-caret-left"></i>
                </div>

              </div>

            </li>
          </ul>
        </div>
      </div>
    </div>

    <div class="lb_bottom" v-if="sOption == 'bottom'">
      <div :class="{ icon_left: true, icon_bottom: scrollDirection }" v-if="jqReports.length > 5" @click="scorllBotFn">
        <i :class="scrollDirection ? 'el-icon-arrow-left' : 'el-icon-arrow-right'"></i>
      </div>
      <div :class="{ list_body: true, trFive: jqReports.length > 5 }">
        <ul class="scroll_ul">
          <li :class="{ scroll_li: true }" v-for="(item, inx) in jqReports" :key="inx" :title="item[titleField]"
            @click="thumbnailClick(inx)">
            <div class="temp">
              <img class="tempI" :src="item[imgField]" alt="">
              <div :class="{ bof: true, exhibit: curIndex === inx }">
                <i class="el-icon-caret-bottom"></i>
              </div>

            </div>

          </li>
        </ul>
      </div>
    </div>

  </div>
</template>

<script>
import eventActionDefine from "./components/msgCompConfig";
import { queryAssetById } from './api/asset'

// import $ from "jquery"

export default {
  //这里写组件英文名称，容器dom的id及事件中心命名均用到这个name，请认真填写
  name: "ButtonChange",
  props: {
    customConfig: Object,
    info: Object,
    //应用变量和系统变量 7.26 V8R4C50SPC220需求新加 之前版本取不到appVariables和sysVariables
    appVariables: Array,
    sysVariables: Array,
    //8.11 V8R4C60SPC100需求新加，之前版本取不到themeInfo
    themeInfo: Object
  },
  computed: {
    theme() {
      let { theme_global_config } = this.themeInfo || {
        theme_global_config: {
          "--theme-public-pinPai-color": "rgba(24,144,255,1)",
          "--theme-public-text-color-1": "rgba(12, 13, 14,1)"
        }
      }

      let themeColor = theme_global_config["--theme-public-pinPai-color"]
      let textColor = theme_global_config["--theme-public-text-color-1"]
      this.$nextTick(() => {
        let style = `#${this.identification} .el-radio-button__inner:hover{
                      color:${this.theme.themeColor};
                      }
                     #${this.identification} .el-radio-button.is-active .el-radio-button__inner:hover{
                      color: #FFF;
                      }
                      `
        if (this.$refs[this.identification]) {
          this.styleEle = document.createElement("style")
          document.head.appendChild(this.styleEle)
          this.styleEle.innerText = style
        }
      })
      return {
        themeColor,
        textColor
      }
    },
    assetId() {
      let assetId = this.customConfig?.assetId || 'fe53425-e934-41ce-8396-7d62dcf46f57'
      return assetId
    },
    speedTime() {
      let speedTime = this.customConfig?.speedTime || '1000'
      return Number(speedTime) * 1000
    },

    imgField() {
      let imgField = this.customConfig?.imgField || 'imgUrl'
      return imgField
    },
    titleField() {
      let titleField = this.customConfig?.titleField || 'title'
      return titleField
    },
    detailsUrl() {
      return this.customConfig?.detailsUrl
    },
    keyField() {
      let keyField = this.customConfig?.keyField || 'data_id'
      return keyField
    },
    sidebar() {
      let sidebar = this.customConfig?.sidebar == 'bottom' ? ['scrollLeft', 'clientWidth', 'scrollWidth'] : ['scrollTop', 'clientHeight', 'scrollHeight']
      return sidebar
    },
    Picture() {
      let temp = this.customConfig?.pictureTile
      let value
      switch (temp) {
        case '填充':
          value = 'fill'
          break;

        case '原比填充':
          value = 'contain'
          break;
        case '裁剪':
          value = 'cover'
          break;
        default:
          value = 'fill'
      }
      return value
    },
    heightF() {
      let temp = this.customConfig?.height
      return temp
    }
  },
  data() {
    return {
      temp: null,
      scrollCount: 0,
      scrollDirection: false,
      curIndex: 0,
      jqReports: [
        { imgUrl: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fimg.1ppt.com%2Fuploads%2Fallimg%2F2104%2F1_210414101157_3.JPG&refer=http%3A%2F%2Fimg.1ppt.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1663316034&t=260968e909601298f9e0ce91343ee24a', titleTrans: 'ddd' },
        { imgUrl: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fseopic.699pic.com%2Fphoto%2F50056%2F5125.jpg_wh1200.jpg&refer=http%3A%2F%2Fseopic.699pic.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1663316034&t=a0ccd7bcd1ebb40fca286d61ff191150', titleTrans: '222' },
        { imgUrl: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fpicnew13.photophoto.cn%2F20181121%2Flanseshumakejibeijingsucai-30989032_1.jpg&refer=http%3A%2F%2Fpicnew13.photophoto.cn&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1663316034&t=7efe1bbd26d46fc40528f2a43d95ed37', titleTrans: '333' },
        { imgUrl: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fpic.vjshi.com%2F2018-11-06%2F4e8b30d282741c3ecc6819ac040601f1%2F00003.jpg%3Fx-oss-process%3Dstyle%2Fwatermark&refer=http%3A%2F%2Fpic.vjshi.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1663316034&t=3879235c8ae02ce8126ba34b069ee44c', titleTrans: 'ddd' },
        { imgUrl: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fpic181.nipic.com%2Ffile%2F20180910%2F26523992_132305292082_2.jpg&refer=http%3A%2F%2Fpic181.nipic.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1663316034&t=9288767c432c2d1ac8ee70100dabfeb4', titleTrans: '444' },
        { imgUrl: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fimg.zcool.cn%2Fcommunity%2F016de95b82c3f5a80120577da70e3a.jpg%403000w_1l_0o_100sh.jpg&refer=http%3A%2F%2Fimg.zcool.cn&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1663316034&t=069db11f2b65eae370968134656825a3', titleTrans: '55' },
        { imgUrl: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fimg.zcool.cn%2Fcommunity%2F016de95b82c3f5a80120577da70e3a.jpg%403000w_1l_0o_100sh.jpg&refer=http%3A%2F%2Fimg.zcool.cn&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1663316034&t=069db11f2b65eae370968134656825a3', titleTrans: '55' },
        { imgUrl: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fimg.zcool.cn%2Fcommunity%2F016de95b82c3f5a80120577da70e3a.jpg%403000w_1l_0o_100sh.jpg&refer=http%3A%2F%2Fimg.zcool.cn&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1663316034&t=069db11f2b65eae370968134656825a3', titleTrans: '55' },
      ],
      sOption: this.customConfig?.sidebar == 'bottom' ? 'bottom' : 'right',
      //必需，不可删除
      identification: "",
      //业务代码
      selected: "",
      buttons: [],
      defaultValue: "",
      styleEle: null
    }
  },
  created() {
    queryAssetById(this.assetId).then(res => {
      let a = this.Processing(res.data)
      this.jqReports = JSON.parse(JSON.stringify(a))
      this.jqReports.forEach(x => {
        x[this.imgField] = x[this.imgField] && JSON.parse(x[this.imgField])[0]?.url
      }
      )
    })


  },
  mounted() {
    //用于注册事件定义，不可删除
    this.$refs.lunb_28.parentNode.parentNode.style.height = "100%";
    this.$refs.lunb_28.parentNode.parentNode.style.width = "100%";
    let a = document.querySelector('.scroll_ul');
    a.addEventListener('scroll', this.handleScroll, true)


    let { componentId } = this.customConfig || {};
    componentId &&
      window.componentCenter?.register(
        componentId,
        "comp",
        this,
        eventActionDefine
      );
    // let { buttons, id } = this.customConfig
    // let componentName = this.$vnode.tag.split("-").pop().toLowerCase()
    // this.identification = id ? `secondary_${componentName}_${id}` : `secondary_${componentName}_${utils.generateUUID()}`
    // //用于定义接收用户输入
    // try {
    //   this.buttons = JSON.parse(buttons).data;
    //   this.defaultValue = JSON.parse(buttons).defaultValue;
    // } catch (error) {
    //   console.log(error);
    // }

    // //业务代码
    // if (this.defaultValue) {
    //   this.selected = this.defaultValue
    //   this.triggerEvent("valueChange",
    //     {
    //       value: this.defaultValue
    //     }
    //   )
    // }
  },
  methods: {
    scorllBotFn(index, e) {
      let scroll = this.sidebar[0]
      let client = this.sidebar[1]
      // console.log(document.querySelector('.scroll_ul').scrollTop == document.querySelector('.scroll_ul')[scroll]);
      // console.log('scrollTop' == scroll);
      typeof index == 'number' ? this.scrollCount = index : this.scrollCount++
      if (!this.scrollDirection) {
        //   document.querySelector(`.scroll_ul .scroll_li:nth-of-type(${e})`).scrollIntoView()
        document.querySelector('.scroll_ul')[scroll] = this.scrollCount * document.querySelector('.scroll_li')[client]
        // document.querySelector('.scroll_ul').scrollTop = this.scrollCount * document.querySelector('.scroll_li').clientHeight
      } else {
        // document.querySelector(`.scroll_ul .scroll_li:nth-of-type(${e})`).scrollIntoView()
        document.querySelector('.scroll_ul')[scroll] = (this.jqReports.length - 5 - this.scrollCount) * document.querySelector('.scroll_li')[client]
        // document.querySelector('.scroll_ul').scrollTop = (this.jqReports.length - 5 - this.scrollCount) * document.querySelector('.scroll_li').clientHeight
      }
      if (this.scrollCount >= (this.jqReports.length - 5)) {

        this.scrollCount = 0
        this.scrollDirection = !this.scrollDirection
      }

    },
    // scorllRigFn(index) {

    //   typeof index == 'number' ? this.scrollCount = index : this.scrollCount++
    //   if (!this.scrollDirection) {
    //     document.querySelector('.scroll_ul_right').scrollLeft = this.scrollCount * document.querySelector('.scroll_li_R').clientWidth
    //   } else {

    //     document.querySelector('.scroll_ul_right').scrollLeft = (this.jqReports.length - 5 - this.scrollCount) * document.querySelector('.scroll_li_R').clientWidth
    //   }
    //   if (this.scrollCount >= (this.jqReports.length - 5)) {

    //     this.scrollCount = 0
    //     this.scrollDirection = !this.scrollDirection
    //   }

    // },
    carouselChange(e) {
      let scroll = this.sidebar[0]
      let client = this.sidebar[1]
      let scrH = this.sidebar[2]
      this.curIndex = e
      let indx = e + 1 - 5
      e == 0 ? document.querySelector('.scroll_ul')[scroll] = 0 : null

      let sty = document.querySelector('.scroll_ul')



      let scrollH = sty?.[scrH] - sty?.[client] - sty?.[scroll]


      if (scrollH <= 3) return
      if (indx > 0) {

        this.scorllBotFn(indx, e)
      }

    },
    handleValueChange(value) {
      this.triggerEvent("valueChange",
        {
          value
        }
      )
    },
    handleScroll(e) {
      let scroll = this.sidebar[0]
      let client = this.sidebar[1]
      let scrH = this.sidebar[2]
      if (this.temp) clearTimeout(this.temp);
      this.temp = setTimeout(() => {

        let temp
        if (!this.scrollDirection) {
          temp = parseInt(e.target[scroll] / document.querySelector('.scroll_li')[client])
        } else {
          temp = (this.jqReports.length - 5) - Math.ceil(e.target[scroll] / document.querySelector('.scroll_li')[client])
        }

        let scrollH = e.target[scrH] - e.target[client] - e.target[scroll]

        if (scrollH <= 3) {
          this.scrollCount = 0
          this.scrollDirection = true
          return
        }
        if (e.target.scrollTop <= 0) {
          this.scrollCount = 0
          this.scrollDirection = false
          return
        }
        this.scrollCount = temp


      }, 200)



    },
    Processing(arr) {
      let headerData = arr[0]
      let bodyData = arr[1]
      // console.log(headerData);
      let tableData = bodyData.map(x => {
        let ret = {};
        x.forEach((item, index) => {
          ret[headerData[index].col_name] = item;
        });
        return ret
      })
      return tableData


    },

    thumbnailClick(i) {
      this.$refs.carousel.setActiveItem(i)
    },

    /**
     * 触发事件 必需，不可删除
     * @param {String} eventName 事件名
     * @param {Array} payload 事件传参
     *
     */
    triggerEvent(eventName, payload) {
      let { componentId, appId } = this.customConfig || {};
      componentId && appId && window.eventCenter?.triggerEvent(
        componentId,
        eventName,
        payload
      );
    },
    //必需，不可删除
    Event_Center_getName() {
      return this.identification;
    },
    //与msgCompConfig.js文件actions相对应，组件动作，依据定义加上do_message前缀
    do_message_setValue(value) {
      this.setValue(value)
    },
    setValue(value) {
      this.selected = value

    }
  },
  destroyed() {
    //必需，不可删除
    window.componentCenter?.removeInstance(this.customConfig?.componentId);
    //业务代码，不需要记得清除
    document.head.removeChild(this.styleEle)
  },
};
</script>

<style lang="less" scoped>
.lunb_28 {

  display: flex;
  flex-direction: column;
  caret-color: rgba(0, 0, 0, 0);

  .lbzj {
    border-radius: 10px;

    /deep/ .el-carousel__arrow {
      background-color: rgba(31, 45, 61, .7);
      font-size: 18px;
      line-height: 36px;
    }
  }

  .lb_right {
    display: flex;

    .lb_img {

      width: 76%;
      // height: 100%;
      box-sizing: border-box;
      padding-bottom: 0.5%;
      position: relative;
      border-radius: 10px;

      .lbzj {
        width: 100%;
        height: 100%;


      }

      .title_text {
        width: 100%;
        height: 100px;
        font-weight: 700;
        font-size: 36px;
        line-height: 100px;
        color: #ffffff;
        background: rgba(0, 0, 0, 0.4);
        padding-left: 40px;
        position: absolute;
        bottom: 0;
        box-sizing: border-box;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }

    .lb_list {
      width: 24%;
      height: 100%;
      padding: 0 0 0 3.2%;
      box-sizing: border-box;
      position: relative;

      .icon_top {
        width: 40px;
        height: 40px;
        text-align: center;
        border-radius: 40px;
        line-height: 40px;
        background: rgba(77, 76, 76, .7);
        position: absolute;
        left: 50%;
        bottom: 0;
        z-index: 999;
        color: #fff;
        cursor: pointer;

      }

      .icon_bottom {
        bottom: none;
        top: 0;
      }

      .list_body {
        width: 100%;
        // height: calc(100% - 15px);
        height: 100%;

        ul {
          margin: 0;
          height: 100%;
          padding: 0px 12px 0px 0;
          overflow-y: scroll;

          &::-webkit-scrollbar {
            display: none;
          }

          scroll-behavior: smooth;
        }

        li {

          // padding-left: 24px;
          height: 20%;
          font-weight: 400;
          font-size: 18px;
          line-height: 25px;
          color: #00effe;
          list-style: none;

          padding: 1%;
          padding-bottom: 3%;
          border-radius: 10px;
          // overflow: hidden;
          box-sizing: border-box;
          text-overflow: ellipsis;
          white-space: nowrap;
          cursor: pointer;


          // position: relative;

          .temp {
            width: 100%;
            height: 100%;
            border-radius: 10px;
            position: relative;
          }

          img {
            width: 100%;
            height: 100%;
            position: relative;
            z-index: 1;
            border-radius: 10px;
          }

          .bof {
            width: 30%;
            height: 100%;
            background: rgba(26, 128, 102, .8);
            border-radius: 10px 0 0 10px;
            // float: left;


            position: absolute;
            top: 0;
            z-index: 9;
            display: none;

            .el-icon-caret-left {
              color: #fff;
              font-size: 30px
            }

            // .sanj {
            //   width: 0;
            //   height: 0;


            //   border: 10px solid;
            //   border-color: transparent transparent transparent #fff
            // }

            // left: 1%;
          }

          .exhibitr {
            display: flex;
            justify-content: center;
            align-items: center;
            // width: 30%;
            // transition: all 1s;
            // border-radius: 10px 0 0 10px;
            animation-name: bounce_left;
            animation-duration: 1000ms;
            animation-fill-mode: forwards;
          }

          @keyframes bounce_left {
            0% {
              width: 0;
              animation-timing-function: ease-in;
              opacity: 1;
            }


            100% {
              width: 30%;
              // transform: translateX(0px);
              animation-timing-function: ease-out;
              opacity: 1;
            }
          }
        }

        // .brak {

        //   text-shadow: 0px 0px 14px rgba(182, 224, 255, 0.3);
        //   position: relative;

        //   &:before {
        //     content: "";
        //     display: block;
        //     position: absolute;
        //     width: 3px;
        //     height: 25px;

        //     border-radius: 1px;
        //     left: 5px;
        //   }
        // }
      }
    }
  }

  .lb_bottom {
    width: 100%;
    height: 20%;
    // padding: 0 0 0 3.2%;
    box-sizing: border-box;
    position: relative;

    .icon_left {
      width: 25px;
      height: 25px;
      text-align: center;
      border-radius: 25px;
      line-height: 25px;
      background: rgba(77, 76, 76, .7);
      position: absolute;
      right: 0;
      bottom: 40%;
      z-index: 999;
      color: #fff;
      cursor: pointer;

    }

    .icon_bottom {
      right: none;
      left: 0;
    }

    .list_body {
      width: 100%;
      // height: calc(100% - 15px);
      height: 100%;

      ul {
        margin: 0;
        height: 100%;
        padding: 0px 12px 0px 0;
        overflow-x: scroll;
        display: flex;

        &::-webkit-scrollbar {
          display: none;
        }

        scroll-behavior: smooth;
      }

      li {

        // padding-left: 24px;
        width: 25%;
        margin-right: 3px;
        height: 100%;
        font-weight: 400;
        font-size: 18px;
        line-height: 25px;
        color: #00effe;
        list-style: none;
        flex: none;
        // float: left;
        padding: 0.2%;
        // padding-bottom: 3%;
        border-radius: 10px;
        // overflow: hidden;
        box-sizing: border-box;
        text-overflow: ellipsis;
        white-space: nowrap;
        cursor: pointer;


        // position: relative;

        .temp {
          width: 100%;
          height: 100%;
          border-radius: 10px;
          position: relative;
        }

        img {
          width: 100%;
          height: 100%;
          position: relative;
          z-index: 1;
          border-radius: 10px;
        }

        .bof {
          width: 100%;
          height: 40%;
          background: rgba(26, 128, 102, .8);
          border-radius: 10px 10px 0 0;
          // float: left;


          position: absolute;
          top: 0;
          z-index: 9;
          display: none;

          .el-icon-caret-bottom {
            color: #fff;
            font-size: 30px
          }

          // .sanj {
          //   width: 0;
          //   height: 0;


          //   border: 10px solid;
          //   border-color: transparent transparent transparent #fff
          // }

          // left: 1%;
        }

        .exhibit {
          display: flex;
          justify-content: center;
          align-items: center;
          // width: 30%;
          // transition: all 1s;
          // border-radius: 10px 0 0 10px;
          animation-name: bounce_botom;
          animation-duration: 1000ms;
          animation-fill-mode: forwards;
        }

        @keyframes bounce_botom {
          0% {
            height: 0;
            animation-timing-function: ease-in;
            opacity: 1;
          }


          100% {
            height: 40%;
            // transform: translateX(0px);
            animation-timing-function: ease-out;
            opacity: 1;
          }
        }
      }

      // .brak {

      //   text-shadow: 0px 0px 14px rgba(182, 224, 255, 0.3);
      //   position: relative;

      //   &:before {
      //     content: "";
      //     display: block;
      //     position: absolute;
      //     width: 3px;
      //     height: 25px;

      //     border-radius: 1px;
      //     left: 5px;
      //   }
      // }
    }
  }
}
</style>
