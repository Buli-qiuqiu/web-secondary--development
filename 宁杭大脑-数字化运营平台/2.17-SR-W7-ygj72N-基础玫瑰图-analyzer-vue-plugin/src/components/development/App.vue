<template>
  <div id="development">
    <div class="main" ref="main">
      <Main
        :dataSource="mockData.dataSource"
        :mainInit="mainInit"
        :key="mainKey"
        :options="options"
        :customOptions="options.externalVariables"
        :customConfig="customConfig"
      />
    </div>
    <div id="configuration">
      <Options
        :options="options"
        :changeOptions="changeOptions"
      />
      <DesignConfiguration
        :customConfig="customConfig"
        :changeCustomConfig="changeCustomConfig"
      />
    </div>
  </div>
</template>

<script>
import {
  Main,
  DesignConfiguration
} from "@/components"
import Options from "./Options.vue"
import {
  mockCustomConfig,
  mockOptions,
  mockChangeOptions,
  mockChangeCustomConfig
} from "./mockData.js"
import Utils from "@/utils"
import mockData from "@/components/development/mockData.js"
import setAttributes from "@/utils/handlePlatform/setAttributes.js"

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
    }
  },
  created() {
  },
  props: {
    mainInit: Function
  },
  mounted() {
    this.mainInit(this)
    setAttributes(this.$refs.main,{customOptions:this.options.externalVariables})
  },
  methods: {
    changeOptions(options) {
      this.options = options
      this.mainKey = Utils.tools.generateUUID()
      setAttributes(this.$refs.main,{customOptions:this.options.externalVariables})
      mockChangeOptions(this.options)
    },
    changeCustomConfig(customConfig) {
      this.customConfig = customConfig
      this.mainKey = Utils.tools.generateUUID()
      mockChangeCustomConfig(customConfig)
    }
  }
}
</script>

<style lang="less" scoped>
#development {
  height: 100%;

  .main {
    width: calc(100% - 300px);
    display: inline-block;
    height: 100%;
  }

  #configuration {
    padding: 20px 10px 0 10px;
    height: 100%;
    background-color: #f0f2f5;
    overflow: auto;
    width: 300px;
    box-sizing: border-box;
    float: right;

    .optionsSubmit {
      background: #0454f2;
      border-color: #0454f2;
      box-shadow: 0 2px 0 rgba(0, 0, 0, .045);
      color: #fff;
      text-shadow: 0 -1px 0 rgba(0, 0, 0, .12);
      margin-left: 20px;
    }
  }

}
</style>