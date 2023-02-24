<template>
  <div class="paramsBox">
    <el-row v-for="item,index in paramsList" :key="index">
      <el-col :span="24">
        <el-button type="text" icon="el-icon-delete" size="mini" @click="delFun(index)">删除参数</el-button>
      </el-col>
      <el-col :span="24">
        <el-input v-model="paramsList[index]" placeholder="请输入参数名"></el-input>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-button size="small" class="btncla" type="primary" @click="addFun">增加参数</el-button>
      </el-col>
      <el-col :span="24">
        <el-button size="small" class="btncla" type="primary" @click="handelFun">执行</el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import Vue from 'vue';
import { Button, Input, Row, Col } from 'element-ui';

Vue.use(Button);
Vue.use(Input);
Vue.use(Row);
Vue.use(Col);

export default {
  name: "DesignConfiguration",
  components: {},
  data() {
    return {
      paramsList: []
    };
  },
  props: {
    funcRef: Object,
    //用于当改变配置的时候，将当前的customConfig当做入参，用于保存最新的customConfig
    changeCustomConfig: Function,
    customConfig: Object
  },
  mounted() {
    Object.keys(this.customConfig).forEach(key => {
      this.paramsList = JSON.parse(JSON.stringify(this.customConfig[key]))
    })
  },
  methods: {
    // 增加配置
    addFun() {
      this.paramsList.push("");
    },
    // 删除配置
    delFun(ind) {
      this.paramsList.splice(ind, 1);
    },
    // 改变配置
    handelFun() {
      let options = {
        paramsList: this.paramsList
      }
      this.changeCustomConfig(options)
    }
  }
};
</script>

<style lang="less" scoped>
.paramsBox {
  width: 100%;
  .btncla {
    margin-top: 10px;
  }
}
</style>