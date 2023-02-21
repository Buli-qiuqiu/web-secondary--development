<script>
import { Main } from "@/components";

export default {
   name: "App",
   components: { Main },
   props: ["type"],
   data() {},
   computed: {},
   watch: {},
   mounted() {},
   methods: {},
   render(h) {
      const renderhMap = {
         main: Main,
      };
      const Comp = renderhMap[this.type];
      return <Comp {...{ props: this._props }} />;
   },
};
</script>
<style lang="less" scoped></style>
