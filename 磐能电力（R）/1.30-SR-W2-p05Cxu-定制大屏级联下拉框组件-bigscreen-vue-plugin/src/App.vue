<script>
import {
  DataConfiguration,
  StyleConfiguration,
  OtherConfiguration,
  Main
} from "./components";

export default {
  name: "App",
  components: { StyleConfiguration, DataConfiguration, OtherConfiguration, Main },
  props: {
    componentId: String,
    options: {
      type: Object,
      default: () => ({
        // 配置项从externalVariables里取
        externalVariables: {}
      })
    },
    block: Object,
    bigscreen: Object,
    notifyVariable: Function,
    type: String,
    pubSub: Object,
    eventBus: Object,
    data: Object | Array,
    updateProcess: Function
  },
  data() {
    return {};
  },
  computed: {},
  watch: {},
  created() {
  },
  mounted() {
  },
  beforeDestroy() {
  },
  methods: {},
  render(h) {
    let props = this._props;
    let handleConfiguration = () => {
      const dataConfig = props.block?.dataConfig || {};
      const { pluginOptions = {}, columns } = dataConfig;
      pluginOptions.columns = columns;
      return pluginOptions;
    };
    let changeConfiguration = (pluginOptions) => {
      if (props.bigscreen && props.block) {
        const {
          bigscreen: { updateBlockById, pluginDetailMap },
          block: {
            baseConfig: { id }
          }
        } = props;
        updateBlockById(id, { dataConfig: { pluginOptions: { ...pluginOptions } } });
        pluginDetailMap[`${id}-default`].detail.ref.current.run();
      } else {
        console.log("暂时无此方法，请升级版本");
      }
    };
    props = { configuration: handleConfiguration(), ...props };
    if (!this.type) {
      return <Main {...{ props }} />;
    } else {
      const renderhMap = {
        dataConfiguration: DataConfiguration,
        styleConfiguration: StyleConfiguration,
        otherConfiguration: OtherConfiguration
      };
      const Comp = renderhMap[this.type];
      props = { configuration: handleConfiguration(), changeConfiguration, ...props };
      return (
        <Comp {...{ props }} />
      );

    }

  }
};
</script>
