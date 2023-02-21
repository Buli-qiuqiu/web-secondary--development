<script>
import {
  Main,
  DesignConfiguration
} from "@/components"

export default {
  name: "App",
  components: { Main, DesignConfiguration },
  props: [
    "dataSource",
    "componentId",
    "options",
    "customOptions",
    "updateProcess",
    "type",
    "mainInit",
    "eventBus",
    "pubSub",
    "customConfig",
    "changeCustomConfig"
  ],
  data() {
  },
  computed: {},
  watch: {},
  mounted() {
  },
  methods: {},
  render(h) {
    const renderhMap = {
      main: Main,
      designConfiguration: DesignConfiguration
    }
    const Comp = renderhMap[this.type]
    let aa = {...{ props: this._props }};
    console.log('this._props', this._props);
    console.log('aa', aa);
    console.log('this', this);
    return <Comp {...{ props: this._props }} />
  }
}
</script>
<style lang="less" scoped>
</style>

