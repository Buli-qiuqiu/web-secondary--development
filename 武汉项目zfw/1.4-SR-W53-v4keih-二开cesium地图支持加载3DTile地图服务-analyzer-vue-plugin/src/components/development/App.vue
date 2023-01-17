<template>
  <div id="development">
    <el-carousel arrow="always" :autoplay="false">
      <el-carousel-item v-for="item in renderMap" :key="item">
        <div class="boxHeight" v-if="item == 'Main'">
          <Main
            :mainInit="mainInit"
            :key="mainKey"
            :options="options"
            :customConfig="customConfig"
            :dataSource="mockData.dataSource"
          />
        </div>
        <div class="boxHeight" v-else>
          <Options
            :options="options"
            :changeOptions="changeOptions"
          />
          <DesignConfiguration
            :customConfig="customConfig"
            :changeCustomConfig="changeCustomConfig"
            :dataSource="mockData.dataSource"
          />
        </div>
      </el-carousel-item>
    </el-carousel>
  </div>
</template>

<script>
import {
  Carousel,
  CarouselItem
} from "element-ui";
import Vue from "vue";
import {
  Main,
  DesignConfiguration
} from "@/components";
// import Main from "../main/AppEarth.vue";
import Options from "./Options.vue";
import {
  mockCustomConfig,
  mockOptions,
  mockChangeOptions,
  mockChangeCustomConfig
} from "./mockData.js";
import Utils from "@/utils";
import mockData from "@/components/development/mockData.js";

Vue.use(Carousel);
Vue.use(CarouselItem);
export default {
  name: "Development",
  components: {
    Main,
    Options,
    DesignConfiguration
  },
  data() {
    return {
      renderMap: [
        "Main",
        "DesignConfiguration"
      ],
      mockData,
      options: mockOptions,
      mainKey: "",
      customConfig: mockCustomConfig
    };
  },
  created() {
  },
  props: {
    mainInit: Function
  },
  mounted() {
    this.mainInit(this);
  },
  methods: {
    changeOptions(options) {
      this.options = options;
      this.mainKey = Utils.generateUUID();
      mockChangeOptions(this.options);
    },
    changeCustomConfig(customConfig) {
      this.customConfig = customConfig;
      this.mainKey = Utils.generateUUID();
      mockChangeCustomConfig(customConfig);
    }
  }
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
    .boxHeight {
      height: 100%;
    }
  }
}
</style>