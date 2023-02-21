<template>
  <div class="configBox">
    <el-collapse v-model="activeNames">
      <!-- ================================= :gutter="20"-->
      <el-collapse-item title="主标题" name="1">
        <el-row>
          <el-col :span="24">
            <div>显示</div>
          </el-col>
          <el-col :span="24">
            <el-switch
              v-model="chartTitle.show"
              active-color="#116ede"
              inactive-color="#e1e3e6">
            </el-switch>
          </el-col>
        </el-row>
        <div v-show="chartTitle.show">
          <el-row :gutter="20">
            <el-col :span="12">
              <div>标题位置横</div>
              <el-select v-model="chartTitle.left" placeholder="请选择">
                <el-option
                  v-for="item in leftOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-col>
            <el-col :span="12">
              <div>标题位置竖</div>
              <el-select v-model="chartTitle.top" placeholder="请选择">
                <el-option
                  v-for="item in topOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <div>名称</div>
            </el-col>
            <el-col :span="24">
              <el-input v-model="chartTitle.text" placeholder="请输入名称"></el-input>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <div>字体尺寸</div>
            </el-col>
            <el-col :span="24">
              <el-input v-model="chartTitle.textStyle.fontSize" placeholder=""></el-input>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <div>字体</div>
              <el-input v-model="chartTitle.textStyle.fontStyle" placeholder=""></el-input>
            </el-col>
            <el-col :span="12">
              <div>颜色</div>
              <el-input v-model="chartTitle.textStyle.color" placeholder=""></el-input>
            </el-col>
          </el-row>
        </div>
      </el-collapse-item>
      <!-- ================================= -->
      <el-collapse-item title="副标题" name="2">
        <el-row>
          <el-col :span="24">
            <div>显示</div>
          </el-col>
          <el-col :span="24">
            <el-switch
              v-model="subtextShow"
              active-color="#116ede"
              inactive-color="#e1e3e6">
            </el-switch>
          </el-col>
        </el-row>
        <div v-show="subtextShow">
          <el-row>
            <el-col :span="24">
              <div>名称</div>
            </el-col>
            <el-col :span="24">
              <el-input v-model="chartTitle.subtext" placeholder="请输入名称"></el-input>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <div>字体尺寸</div>
            </el-col>
            <el-col :span="24">
              <el-input v-model="chartTitle.subtextStyle.fontSize" placeholder=""></el-input>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <div>字体</div>
              <el-input v-model="chartTitle.subtextStyle.fontStyle" placeholder=""></el-input>
            </el-col>
            <el-col :span="12">
              <div>颜色</div>
              <el-input v-model="chartTitle.subtextStyle.color" placeholder=""></el-input>
            </el-col>
          </el-row>
        </div>
      </el-collapse-item>
      <!-- ================================= -->
      <el-collapse-item title="系列颜色" name="3">
        <el-row>
          <el-col :span="24">
            <div>颜色</div>
          </el-col>
          <el-col :span="24">
            <el-input type="textarea" :rows="2" v-model="seriesColor" placeholder="请输入颜色/以-分割 #0778e5-#84e2e5-#0778e5-#84e2e5"></el-input>
          </el-col>
        </el-row>
      </el-collapse-item>
      <!-- ================================= -->
      <el-collapse-item title="图例" name="4">
        <el-row>
          <el-col :span="24">
            <div>显示</div>
          </el-col>
          <el-col :span="24">
            <el-switch
              v-model="legendconfig.show"
              active-color="#116ede"
              inactive-color="#e1e3e6">
            </el-switch>
          </el-col>
        </el-row>
        <div v-show="legendconfig.show">
          <el-row :gutter="20">
            <el-col :span="12">
              <div>位置横</div>
              <el-select v-model="legendconfig.left" placeholder="请选择">
                <el-option
                  v-for="item in leftOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-col>
            <el-col :span="12">
              <div>位置竖</div>
              <el-select v-model="legendconfig.top" placeholder="请选择">
                <el-option
                  v-for="item in topOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <div>位置右边距</div>
              <el-input v-model="legendconfig.right" placeholder="请输入绝对值 百分比"></el-input>
            </el-col>
            <el-col :span="12">
              <div>位置底边距</div>
              <el-input v-model="legendconfig.bottom" placeholder="请输入绝对值 百分比"></el-input>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <div>图例分页</div>
              <el-radio-group v-model="legendconfig.type">
                <el-radio label="plain">普通图例</el-radio>
                <el-radio label="scroll">可翻页</el-radio>
              </el-radio-group>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <div>排列方式</div>
              <el-radio-group v-model="legendconfig.orient">
                <el-radio label="horizontal">水平排列</el-radio>
                <el-radio label="vertical">垂直排列</el-radio>
              </el-radio-group>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <div>图例形状</div>
              <el-select v-model="legendconfig.icon" placeholder="请选择">
                <el-option
                  v-for="item in iconOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="24">
              <div>字体</div>
              <el-input v-model="legendconfig.textStyle.fontStyle" placeholder="请输入字体英文格式"></el-input>
            </el-col>
            <!-- <el-col :span="12">
              <div>间距</div>
              <el-input v-model="legendconfig.itemGap" placeholder=""></el-input>
            </el-col> -->
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <div>图例宽度</div>
              <el-input v-model="legendconfig.itemWidth" placeholder=""></el-input>
            </el-col>
            <el-col :span="12">
              <div>图例高度</div>
              <el-input v-model="legendconfig.itemHeight" placeholder=""></el-input>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <div>字体尺寸</div>
              <el-input v-model="legendconfig.textStyle.fontSize" placeholder=""></el-input>
            </el-col>
            <el-col :span="12">
              <div>颜色</div>
              <el-input v-model="legendconfig.textStyle.color" placeholder=""></el-input>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <div>边框尺寸</div>
              <el-input v-model="legendconfig.itemStyle.borderWidth" placeholder=""></el-input>
            </el-col>
            <el-col :span="12">
              <div>边框颜色</div>
              <el-input v-model="legendconfig.itemStyle.borderColor" placeholder=""></el-input>
            </el-col>
          </el-row>
        </div>
      </el-collapse-item>
      <!-- ================================= -->
      <el-collapse-item title="图表布局" name="5">
        <el-row :gutter="20">
          <el-col :span="12">
            <div>上内边距</div>
            <el-input v-model="seriesConfig.top" placeholder=""></el-input>
          </el-col>
          <el-col :span="12">
            <div>下内边距</div>
            <el-input v-model="seriesConfig.bottom" placeholder=""></el-input>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <div>左内边距</div>
            <el-input v-model="seriesConfig.left" placeholder=""></el-input>
          </el-col>
          <el-col :span="12">
            <div>右内边距</div>
            <el-input v-model="seriesConfig.right" placeholder=""></el-input>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <div>内圆尺寸</div>
            <el-input v-model="seriesConfig.radius[0]" placeholder=""></el-input>
          </el-col>
          <el-col :span="12">
            <div>外圆尺寸</div>
            <el-input v-model="seriesConfig.radius[1]" placeholder=""></el-input>
          </el-col>
        </el-row>
      </el-collapse-item>
      <!-- ================================= -->
      <el-collapse-item title="序列设置" name="6">
        <el-row :gutter="10">
          <el-col :span="8">
            <div>序列边框宽度</div>
            <el-input v-model="seriesItemStyle.borderWidth" placeholder=""></el-input>
          </el-col>
          <el-col :span="8">
            <div>序列边框颜色</div>
            <el-input v-model="seriesItemStyle.borderColor" placeholder=""></el-input>
          </el-col>
          <el-col :span="8">
            <div>序列边框圆角</div>
            <el-input v-model="seriesItemStyle.borderRadius" placeholder=""></el-input>
          </el-col>
        </el-row>
      </el-collapse-item>
    </el-collapse>
    <div class="btnBox">
      <el-button size="middle" style="width: 120px" type="primary" plain @click="handleClick">执行</el-button>
    </div>
  </div>
</template>

<script>
import Vue from 'vue';
import {
  Row,
  Col,
  Collapse,
  CollapseItem,
  Input,
  Select,
  Option,
  Switch,
  RadioGroup,
  Radio,
} from 'element-ui';

Vue.use(Collapse);
Vue.use(CollapseItem);
Vue.use(Input);
Vue.use(Row);
Vue.use(Col);
Vue.use(Select);
Vue.use(Option);
Vue.use(Switch);
Vue.use(RadioGroup);
Vue.use(Radio);

export default {
  name: "DesignConfiguration",
  components: {},
  props: ["customConfig", "changeCustomConfig"],
  data() {
    return {
      activeNames: [],
      subtextShow: false,
      // 标题
      chartTitle: {
        show: false,
        text: "Main Title",
        subtext: "Sub Title",
        left: "center", //'left', 'center', 'right'。
        top: "top", // 'top', 'middle', 'bottom'
        textStyle: {
          fontSize: '30',
          fontStyle: "oblique",
          color: '#333',
        },
        subtextStyle: {
          fontSize: '20',
          fontStyle: "oblique",
          color: '#333',
        },
      },
      leftOptions: [
        {
          value: 'left',
          label: '左'
        }, 
        {
          value: 'center',
          label: '中'
        },
        {
          value: 'right',
          label: '右'
        },
        {
          value: 'auto',
          label: '自适应'
        }
      ],
      topOptions: [
        {
          value: 'top',
          label: '上'
        },
        {
          value: 'middle',
          label: '中'
        },
        {
          value: 'bottom',
          label: '下'
        },
        {
          value: 'auto',
          label: '自适应'
        }
      ],
      // 系列颜色
      seriesColor: "",
      // 图例
      legendconfig: {
        show: false,
        icon: "circle",// 形状 'circle', 'rect', 'roundRect', 'triangle', 'diamond', 'pin', 'arrow', 'none'
        type: "plain", // 'scroll' 'plain'
        orient: "horizontal", // 'horizontal' 'vertical'
        left: 'auto', //'left', 'center', 'right'
        top: 'auto', //'top', 'middle', 'bottom'
        right: '0', // 绝对值 百分比
        bottom: '0', // 绝对值 百分比
        itemWidth: '20',
        itemHeight: '12',
        // itemGap: 10, //间隔
        textStyle: {
          fontSize: '14',
          fontStyle: "oblique",
          color: '#333',
        },
        itemStyle: {
          borderColor: '',
          borderWidth: '0',
        }
      },
      iconOptions: [
        {
          value: 'circle',
          label: '圆形'
        },
        {
          value: 'rect',
          label: '矩形'
        },
        {
          value: 'square',
          label: '正方形'
        },
        {
          value: 'roundRect',
          label: '圆角矩形'
        },
        {
          value: 'triangle',
          label: '三角形'
        },
        {
          value: 'diamond',
          label: '棱形'
        },
        {
          value: 'arrow',
          label: '箭头'
        },
        {
          value: 'none',
          label: '无'
        }
      ],
      // 系列配置
      seriesConfig: {
        left: '0',
        top: '0',
        right: '0',
        bottom: '0',
        radius: ['50', '250'],
      },
      seriesItemStyle: {
        borderWidth: '0',
        borderColor: 'pink',
        borderRadius: '10',
      }
    };
  },
  mounted() {
    // let customConfigoptions = this.customConfig || {};
    let { chartTitle, seriesColor, legendconfig, seriesConfig, seriesItemStyle } = this.customConfig;
    this.chartTitle = JSON.parse(chartTitle) || this.chartTitle;
    this.seriesColor = seriesColor || this.seriesColor;
    // legendconfig.itemWidth = legendconfig.itemWidth + '';
    // legendconfig.itemHeight = legendconfig.itemHeight + '';
    this.legendconfig = JSON.parse(legendconfig) || this.legendconfig;
    this.seriesConfig = JSON.parse(seriesConfig) || this.seriesConfig;
    this.seriesItemStyle = JSON.parse(seriesItemStyle) || this.seriesItemStyle;
    console.log('配置页-mounted-customConfig', this.customConfig);
  },
  methods: {
    handleClick() {
      this.customConfig.legendconfig = JSON.stringify(this.legendconfig);
      this.customConfig.chartTitle = JSON.stringify(this.chartTitle);
      this.customConfig.seriesColor = this.seriesColor;
      this.customConfig.seriesConfig = JSON.stringify(this.seriesConfig);
      this.customConfig.seriesItemStyle = JSON.stringify(this.seriesItemStyle);
      console.log('配置页-执行后-customConfig', this.customConfig);
      this.changeCustomConfig(this.customConfig);
    }
  }
};
</script>

<style lang="less" scoped>
.configBox {
  width: 100%;
  height: 100%;
  background: #FFFFFF;

  .btnBox {
    margin-top: 15px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>