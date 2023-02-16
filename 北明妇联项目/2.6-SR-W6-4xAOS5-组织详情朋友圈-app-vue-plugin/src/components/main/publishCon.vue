<template>
  <div class="comList">
    <!-- <div :ref="keyRef" class="textContent" :style="{ '-webkit-line-clamp': zhanKai ? '20' : '5'}" v-html="concent"></div> -->
    <div class="textBox" :style="{ 'max-height': zhanKai ? '300px' : '100px'}">
      <div :ref="keyRef" class="textContent" v-html="concent"></div>
    </div>
    <span v-if="textIsMore" class="textMore" @click="openFun">{{ moreText }}</span>
    <!-- <span v-if="zhanKai" class="textMore" @click="openFun">收起</span> -->
  </div>
</template> 

<script>
export default {
  name: "PublishCom",
  props: {
    concent: {
      type: String,
      default: ""
    },
    keyRef: {
      type: String,
      default: ""
    }
  },
  data () {
    return {
      zhanKai: false,
      refDom: null,
      boxHeight: 0,
      textIsMore: false,
      moreText: "全文",
    }
  },
  mounted () {
    this.refDom = this.$refs[this.keyRef];
    this.boxHeight = this.refDom.clientHeight;
    if (this.boxHeight > 100) {
      this.textIsMore = true
    }
    // console.log('this.boxHeight', this.boxHeight);
    // console.log('this.refDom', [this.refDom]);
  },
  methods: {
    openFun(){
      if (this.zhanKai) {
        this.zhanKai = false;
        this.moreText = "全文";
      }else {
        this.zhanKai = true;
        this.moreText = "收起";
      }
    }
  },
}
</script>

<style lang="less" scoped>
.comList {
  width: 100%;
  .textBox {
    overflow: hidden;
    .textContent {
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #333333;
      line-height: 20px;
      // overflow: hidden;
      text-overflow: ellipsis;
      // display: -webkit-box;
      // -webkit-line-clamp: 5;
      // -webkit-box-orient: vertical;
      word-break: break-all;
      white-space: pre-wrap;
    }
  }

  .textMore {
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #3d72a6;
    line-height: 20px;
  }
}
</style>