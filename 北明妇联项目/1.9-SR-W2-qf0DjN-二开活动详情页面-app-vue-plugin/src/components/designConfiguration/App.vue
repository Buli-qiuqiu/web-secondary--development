<template>
  <div class="peizhi">
    <el-form ref="form" :model="form" label-position="top">
      <el-form-item label="活动总结地址">
        <el-input v-model="form.activeOverUrl" @input="inputChange"></el-input>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import Vue from 'vue';
import { Form, FormItem, Input } from 'element-ui';
Vue.use(Input);
Vue.use(Form);
Vue.use(FormItem);

export default {
  name: "DesignConfiguration",
  components: {},
  data() {
    return {
      form:{
        activeOverUrl: ""
      }
    };
  },
  props: {
    funcRef: Object,
    //用于当改变配置的时候，将当前的customConfig当做入参，用于保存最新的customConfig
    changeCustomConfig: Function,
    customConfig: Object
  },
  mounted() {
    Object.keys(this.customConfig).forEach(key =>{
      this.form[key] = JSON.parse(JSON.stringify(this.customConfig[key]))
    })
  },
  methods: {
    inputChange(value){
      this.customConfig['activeOverUrl'] = value;
      console.log('this.customConfig', this.customConfig);
    }
  }
};
</script>

<style lang="less" scoped>
.peizhi {}
</style>