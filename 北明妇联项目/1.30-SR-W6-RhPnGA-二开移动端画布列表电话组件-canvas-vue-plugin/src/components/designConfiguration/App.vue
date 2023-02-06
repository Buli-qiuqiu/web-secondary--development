<template>
  <div class="designConfiguration">
    <el-form ref="form" :model="form" label-width="80px">
    </el-form>
  </div>
</template>

<script>
import { Form, FormItem, Input } from "element-ui";
import Vue from "vue";

Vue.use(FormItem);
Vue.use(Form);
Vue.use(Input);
export default {
  name: "DesignConfiguration",
  components: {},
  data() {
    return {
      form: {
        id: "",
        iconSize: "",
        fontSize: "",
      },
    };
  },
  watch: {
    form: {
      deep: true,
      handler(newValue) {
        this.customConfig.form = newValue;
        this.changeCustomConfig(JSON.stringify(this.customConfig));
      },
    },
  },
  props: {
    //用于当改变配置的时候，将当前的customConfig当做入参，用于保存最新的customConfig
    changeCustomConfig: Function,
    customConfig: Object,
  },
  mounted() {
    this.form = this.customConfig?.form || {
      iconSize: "",
      fontSize: "",
    };
  },
  methods: {},
};
</script>

<style scoped></style>
