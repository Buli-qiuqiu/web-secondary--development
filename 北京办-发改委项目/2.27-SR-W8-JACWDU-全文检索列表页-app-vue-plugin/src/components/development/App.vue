<template>
  <div id="development">
    <el-carousel arrow="always" :autoplay="false">
      <el-carousel-item v-for="item in renderMap" :key="item">
        <div v-if="item == 'Main'" style="height: 100%">
          <Main :mainInit="mainInit" :key="mainKey" :customConfig="customConfig" />
        </div>
        <div v-else>
          <Options :options="customConfig" :changeOptions="changeCustomConfig" />
          <DesignConfiguration :customConfig="customConfig" :changeCustomConfig="changeCustomConfig" />
        </div>
      </el-carousel-item>
    </el-carousel>
  </div>
</template>

<script>
import { Carousel, CarouselItem, Input, Select, Option, Button, Icon, Radio, Card, Pagination, Popover } from "element-ui";
import Vue from "vue";
import { Main, DesignConfiguration } from "@/components";
import Options from "./Options.vue";
import { mockCustomConfig, mockChangeCustomConfig } from "./mockData.js";
import Utils from "@/utils";

Vue.use(Carousel);
Vue.use(CarouselItem);
Vue.use(Input);
Vue.use(Select);
Vue.use(Option);
Vue.use(Button);
Vue.use(Icon);
Vue.use(Radio);
Vue.use(Card);
Vue.use(Pagination);
Vue.use(Popover);
export default {
  name: "Development",
  components: {
    Main,
    Options,
    DesignConfiguration,
  },
  data() {
    return {
      renderMap: ["Main", "DesignConfiguration"],
      mainKey: "",
      customConfig: mockCustomConfig,
    };
  },
  created() {},
  props: {
    mainInit: Function,
  },
  mounted() {
    this.mainInit(this);
  },
  methods: {
    changeCustomConfig(customConfig) {
      this.customConfig = customConfig;
      this.mainKey = Utils.tools.generateUUID();
      mockChangeCustomConfig(customConfig);
    },
  },
};
</script>

<style lang="less" scoped>
#development {
  height: 100%;

  .el-carousel {
    height: 100%;

    ::v-deep .el-carousel__container {
      height: 100%;
    }
  }
}
</style>
