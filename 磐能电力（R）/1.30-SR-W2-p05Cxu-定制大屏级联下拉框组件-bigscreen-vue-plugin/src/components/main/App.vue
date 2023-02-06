<template>
  <div
    class="bigscreen_secondary"
    :style="{
      width: '100%',
      height: '100%',
      display: 'flex',
      justifyContent: 'space-between',
    }"
    ref="bigscreen_secondary"
    :id="id"
    v-show="this.pluginOptions?.defaultShow"
  >
    <el-select v-model="valueFa" placeholder="请选择" @change="changeFa" style="height: 48px" class="select" popper-class="selectPop">
      <el-option v-for="item in optionsFa" :key="item.value" :label="item.label" :value="item">{{ item.label }} </el-option>
    </el-select>
    <el-select v-model="valueSon" placeholder="请选择" @change="changeSon" style="height: 48px" class="select" popper-class="selectPop">
      <el-option v-for="item in optionsSon" :key="item.value" :label="item.label" :value="item"> {{ item.label }}</el-option>
    </el-select>
  </div>
</template>
<script>
import Vue from "vue";
import { Select, Option } from "element-ui";
import MsgCompConfig from "./msgCompConfig.js";
import Utils from "@/utils/index.js";
import configJson from "../../../pluginTemp/config.json";
Vue.use(Select);
Vue.use(Option);

export default {
  name: "Main",
  components: {},
  data() {
    return {
      id: "",
      optionsData: [],
      optionsFa: [],
      optionsSon: [],
      valueFa: {},
      valueSon: {},
      pluginOptions: {
        defaultShow: true,
      },
    };
  },
  props: {
    block: Object,
    pubSub: Object,
    data: Object | Array,
    bigscreen: Object,
    componentId: String,
    configuration: Object,
    options: Object,
    updateProcess: Function,
    notifyVariable: Function,
  },
  created() {},
  mounted() {
    this.pubSub &&
      this.pubSub.subscribe("updateChart" + this.componentId, (data) => {
        this.valueFa = {};
        this.valueSon = {};
        this.optionsSon = [];
        this.optionsData = [];
        data.options.columns.forEach((element, index) => {
          data.data.forEach((item, index2) => {
            if (index == 0) {
              this.optionsData[index2] = {};
            }
            this.optionsData[index2][element] = item[index];
          });
        });
        this.optionsFa = this.optionsData.filter((item) => {
          return !item.parentId;
        });
        this.initComData();
      });
    window.componentCenter?.register && window.componentCenter.register(this.componentId, "comp", this, MsgCompConfig);
    this.updateProcess && this.updateProcess();
    let id = this.options?.externalVariables?.id || Utils.generateUUID();
    const configJsonRequireNum = configJson["requirement-number"] === "需求编号" ? "" : configJson["requirement-number"];
    this.id = `bigscreen_secondary_${configJsonRequireNum}_${id}`;
  },
  methods: {
    initComData() {
      this.pluginOptions = JSON.parse(JSON.stringify(this.block?.dataConfig?.pluginOptions));
      this.pluginOptions.defaultShow = !this.pluginOptions.defaultShow;
      if (this.pluginOptions.defaultFill) {
        if (this.pluginOptions.radio == "1") {
          this.valueFa = this.optionsFa[0];
          this.changeFa(this.valueFa, "first");
        } else if (this.pluginOptions.filedName) {
          if (decodeURI(this.GetQueryString(this.pluginOptions.filedName))) {
            this.optionsFa.forEach((item) => {
              if (item.value == decodeURI(this.GetQueryString(this.pluginOptions.filedName))) {
                this.valueFa = item;
                this.changeFa(this.valueFa, "first");
              }
            });
            if (!this.valueFa.value) {
              this.optionsFa.push({
                value: decodeURI(this.GetQueryString(this.pluginOptions.filedName)),
                label: decodeURI(this.GetQueryString(this.pluginOptions.filedName)),
                id: "xxx",
                parentId: "",
              });
              this.valueFa = this.optionsFa[this.optionsFa.length - 1];
            }
          } else {
            this.valueFa = this.optionsFa[0];
            this.changeFa(this.valueFa, "first");
          }
        } else {
          this.valueFa = this.optionsFa[0];
          this.changeFa(this.valueFa, "first");
        }
      }
      console.log(this.optionsFa);
      this.triggerEvent("loadFinish", {
        value1: this.valueFa,
        value2: this.valueSon,
      });
    },
    changeFa(val, num) {
      this.valueSon = {};
      this.optionsSon = this.optionsData.filter((item) => {
        return item.parentId == val.id;
      });
      if (!num) {
        this.triggerEvent("contentChange", {
          value1: this.valueFa,
          value2: this.valueSon,
        });
      }
    },
    changeSon() {
      this.triggerEvent("contentChange", {
        value1: this.valueFa,
        value2: this.valueSon,
      });
    },
    // 获取URL参数
    GetQueryString(name) {
      var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
      var r = window.location.search.substr(1).match(reg); //获取url中"?"符后的字符串并正则匹配
      var context = "";
      if (r != null) context = r[2];
      reg = null;
      r = null;
      return context == null || context == "" || context == "undefined" ? "" : context;
    },
    triggerEvent(name, data) {
      window.eventCenter?.triggerEvent &&
        window.eventCenter.triggerEvent(this.componentId, name, {
          value: data,
        });
      // 获取大屏变量数组
      const { variableList = [] } = this.bigscreen;
      // // 假设我们要修改名为 variableA 的变量
      // const targetVariableName = "variableA";
      if (this.pluginOptions.selectData1) {
        let params = [];
        let targetVariableIndex = variableList.findIndex((item) => {
          return item.name === this.pluginOptions.selectData1;
        });
        // 如果找到，构造params参数
        if (targetVariableIndex > -1) {
          params.push({
            id: variableList[targetVariableIndex].id,
            value: this.valueFa.value, // 目标值
          });
        }
        // 触发变量改变
        this.notifyVariable && this.notifyVariable(params);
      }
      if (this.pluginOptions.selectData2) {
        let params = [];
        let targetVariableIndex = variableList.findIndex((item) => {
          return item.name === this.pluginOptions.selectData2;
        });
        // 如果找到，构造params参数
        if (targetVariableIndex > -1) {
          params.push({
            id: variableList[targetVariableIndex].id,
            value: this.valueSon.value, // 目标值
          });
        }
        // 触发变量改变
        this.notifyVariable && this.notifyVariable(params);
      }
    },
    do_EventCenter_trueSelect(value) {
      if (value.booleanTrue) {
        this.pluginOptions.defaultShow = true;
      }
    },
    do_EventCenter_falseSelect(value) {
      if (value.booleanFalse) {
        this.pluginOptions.defaultShow = false;
      }
    },
    Event_Center_getName() {
      return this.id;
    },
  },
};
</script>

<style lang="less" scoped>
/deep/.select {
  input {
    background: #333 !important ;
    color: #fff !important;
    border: 1px solid #333 !important;
    &:hover {
      border: 1px solid #333 !important;
    }
    &:focus {
      border: 1px solid #333 !important;
    }
  }
}
</style>
<style lang="less">
.selectPop {
  background: #333 !important ;
  border: 1px solid #333 !important;
  .selected {
    color: #409eff !important;
  }
  .el-select-dropdown__item {
    background: #333 !important ;
    color: #fff;
    &:hover {
      background: rgb(131, 130, 130) !important;
    }
  }
}
</style>
