<template>
  <div>
    <span>填充默认值：</span>
    <el-switch v-model="defaultFill" active-color="#409EFF" class="main-el-switch" :width="60" inactive-color="#909399" active-text="开启" 　　inactive-text="关闭"> </el-switch>
    <br />
    <br />
    <el-radio v-model="radio" label="1">默认</el-radio>
    <el-radio v-model="radio" label="2">url+默认</el-radio>
    <br />
    <br />
    <span v-show="defaultFill && radio == 2">参数名</span>
    <br v-show="defaultFill && radio == 2" />
    <el-input v-show="defaultFill && radio == 2" style="width: 200px" v-model="filedName" placeholder="请输入URL参数名"></el-input>
    <br v-show="defaultFill && radio == 2" />
    <br v-show="defaultFill && radio == 2" />
    <span>默认隐藏：</span>
    <el-switch v-model="defaultShow" active-color="#409EFF" class="main-el-switch" :width="60" inactive-color="#909399" active-text="开启" 　　inactive-text="关闭"> </el-switch>
    <br />
    <br />
    <span>选择框1绑定变量</span>
    <br />
    <el-input style="width: 200px" v-model="selectData1" placeholder="请输入变量名称"></el-input>
    <br />
    <br />
    <span>选择框2绑定变量</span>
    <br />
    <el-input style="width: 200px" v-model="selectData2" placeholder="请输入变量名称"></el-input>
    <br />
    <br />
    <el-button type="primary" size="mini" @click="submit">执行</el-button>
  </div>
</template>

<script>
import configurationMixin from "@/mixins/configuration.js";
import Vue from "vue";
import { Switch, Radio, Input, Button } from "element-ui";
Vue.use(Switch);
Vue.use(Radio);
Vue.use(Input);
Vue.use(Button);
export default {
  name: "DataConfiguration",
  components: {},
  mixins: [configurationMixin],
  props: {
    configuration: Object,
    block: Object,
  },
  data() {
    return {
      defaultFill: false,
      defaultShow: false,
      radio: "1",
      selectData1: "1",
      selectData2: "1",
      filedName: "",
    };
  },
  mounted() {
    let pluginOptions = JSON.parse(JSON.stringify(this.block?.dataConfig?.pluginOptions || "{}"));
    this.defaultFill = pluginOptions.defaultFill;
    this.defaultShow = pluginOptions.defaultShow;
    this.radio = pluginOptions.radio;
    this.selectData1 = pluginOptions.selectData1;
    this.selectData2 = pluginOptions.selectData2;
    this.filedName = pluginOptions.filedName;
  },
  methods: {
    submit() {
      let newOptions = {
        selectData1: this.selectData1,
        selectData2: this.selectData2,
        defaultShow: this.defaultShow,
        radio: this.radio,
        filedName: this.filedName,
        defaultFill: this.defaultFill,
      };
      this.changeConfiguration({ ...this.configuration, ...newOptions });
    },
  },
};
</script>

<style scoped lang="less">
/deep/ .clearPadding .vxe-cell {
  padding: 0;
}
/deep/ .clearPaddingLeft .vxe-cell {
  padding-left: 0px;
}
/deep/ .main-el-switch {
  position: relative;
  .el-switch__core {
    height: 24px;
    border-radius: 12px;
    &:after {
      left: 4px;
      top: 3px;
    }
  }
  &.el-switch {
    &.is-checked {
      .el-switch__core {
        &:after {
          margin-left: -20px;
          left: 100%;
        }
      }
    }
  }
  &.is-checked {
    .el-switch__label--left {
      opacity: 0;
    }
    .el-switch__label--right {
      opacity: 1;
    }
  }
  .el-switch__label {
    position: absolute;
    top: 0;
  }
  .el-switch__label--left {
    right: 0;
    color: #fff;
    z-index: 1;
    margin-right: 8px;
  }
  .el-switch__label--right {
    left: 0;
    color: #fff;
    opacity: 0;
    margin-left: 8px;
  }
}
</style>
