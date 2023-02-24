<template>
  <div class="configBox">
    <el-row>
      <el-col :span="24">
        <div>资产ID</div>
      </el-col>
      <el-col :span="18">
        <el-input v-model="form.assetId" size="small" placeholder="首先输入资产id"></el-input>
      </el-col>
      <el-col :span="6">
        <el-button class="queryBtn" size="small" type="primary" plain @click="queryData">请求资产</el-button>
      </el-col>
    </el-row>
    <!-- ================================= :gutter="20"-->
    <el-row>
      <el-col :span="24">
        <div>分组字段</div>
      </el-col>
      <el-col :span="24">
        <el-input v-model="form.groupBy" size="small"></el-input>
      </el-col>
    </el-row>
    <!-- ================================= :gutter="20"-->
    <el-collapse v-model="activeNames">
      <el-collapse-item title="聚合字段" name="1">
        <el-row :gutter="20" v-for="item,index in aggParams" :key="index">
          <el-col :span="12">
            <div>聚合字段</div>
            <el-input v-model="item.colName" size="small"></el-input>
            <!-- <el-select size="small" v-model="item.colName" placeholder="聚合字段">
              <el-option
                v-for="colName in dataSource"
                :key="colName.id"
                :label="`${colName.col_name}--${colName.col_alias}`"
                :value="colName.col_name">
              </el-option>
            </el-select> -->
          </el-col>
          <el-col :span="12">
            <div class="colBox">求和<i class="el-icon-delete" @click="delBindValue('0',index)"></i></div>
            <el-select size="small" v-model="item.type" placeholder="求和" clear>
              <el-option
                v-for="typeKey in typeOptions"
                :key="typeKey.type"
                :label="typeKey.colName"
                :value="typeKey.type">
              </el-option>
            </el-select>
          </el-col>
        </el-row>
        <el-button class="addBtn" size="small" type="primary" plain @click="addTableKey('0')">添加</el-button>
      </el-collapse-item>
    <!-- ================================= :gutter="20"-->
      <el-collapse-item title="列表展示字段" name="2">
        <el-row :gutter="20" v-for="items, indx in selectColNames" :key="indx">
          <el-col :span="12">
            <div>字段名称</div>
            <el-select size="small" v-model="items.colName" placeholder="字段名称" clear>
              <el-option
                v-for="clum in keyList"
                :key="clum.id"
                :label="`${clum.col_name}--${clum.col_alias}`"
                :value="clum.col_name">
              </el-option>
            </el-select>
          </el-col>
          <el-col :span="12">
            <div class="colBox">显示字段<i class="el-icon-delete" @click="delBindValue('1', indx)"></i></div>
            <el-input v-model="items.alias" size="small"></el-input>
          </el-col>
        </el-row>
        <el-button class="addBtn" size="small" type="primary" plain @click="addTableKey('1')">添加</el-button>
      </el-collapse-item>
    </el-collapse>
    <!-- ================================= :gutter="20"-->
    <div class="btnBox">
      <el-button size="middle" style="width: 120px" type="primary" @click="onFormLayoutChange">执行</el-button>
    </div>
  </div>
</template>

<script>
import { queryAssetById } from "../api/asset.js"
import Vue from 'vue';
import {
  Row,
  Col,
  Collapse,
  CollapseItem,
  Input,
  Select,
  Option,
  Button
} from 'element-ui';

Vue.use(Collapse);
Vue.use(CollapseItem);
Vue.use(Input);
Vue.use(Row);
Vue.use(Col);
Vue.use(Select);
Vue.use(Option);
Vue.use(Button);

export default {
  name: 'DesignConfiguration',

  props: {
    // 本地数据
    customConfig: Object,
    // 平台数据
    platformProps: Object
  },

  data() {
    return {
      activeNames: [],
      configForm: {},
      form: {
        assetId: "b49cd7dc-bcdd-6dcd-eaf6-74be5ddab274", // 资产id
        groupBy: "", // 分组
        aggParams: [],
        selectColNames: []
      },
      aggParams: [ // 聚合
        // {
        //   colName: "",
        //   type: "",
        // }
      ],
      selectColNames: [ // 展示字段
        // {
        //   colName: "",
        //   alias: "",
        // }
      ],
      typeOptions: [
        {
          colName: "计数",
          type: "count",
        },
        {
          colName: "求和",
          type: "sum",
        },
        {
          colName: "平均值",
          type: "avg",
        },
        {
          colName: "最大值",
          type: "max",
        },
        {
          colName: "最小值",
          type: "min",
        }
      ],// 类型：sum-求和、avg-平均值、max-最大值、min-最小值
      dataSource: [],
      keyList: []
    }
  },

  mounted() {
    // 配置项数据隔离
    if(this.platformProps) {
      this.form = JSON.parse(this.platformProps.configuration)
    } else {
      this.form = this.customConfig.configuration
    }
    this.aggParams = this.form.aggParams ? JSON.parse(JSON.stringify(this.form.aggParams)) : [];
    this.selectColNames = this.form.selectColNames ? JSON.parse(JSON.stringify(this.form.selectColNames)) : [];
    console.log('配置页-this.configForm', this.form);
  },
  methods: {
    onFormLayoutChange() {
      this.form.aggParams = this.aggParams;
      this.form.selectColNames = this.selectColNames;
      console.log(this.form);
      // return;
      this.platformProps?.changeConfiguration(JSON.stringify(this.form));
    },
    //添加
    addTableKey(val) {
      if(val == '0'){
        this.aggParams.push({
          colName: "",
          type: "",
        })
      }else{
        this.selectColNames.push({
          colName: "",
          alias: "",
        })
      }
    },
    // 变量删除
    delBindValue(val,ind) {
      if (val == "0") {
        this.aggParams.splice(ind, 1)
      } else {
        this.selectColNames.splice(ind, 1)
      }
    },
    queryData() {
      let id = this.form.assetId;
      queryAssetById(id).then(res=>{
        let { data } = res;
        this.keyList = data[0];
        let valueList = data[1];
        this.dataSource = valueList.map(x => {
          let obj = {};
          this.keyList.forEach((ele,ind)=> {
            if (typeof x[ind] == "number") {
              obj[ele.col_name] = x[ind]
            }
          });
          return obj;
        });
        console.log('this.dataSource', this.dataSource);
      }).catch(err=>{
        console.log(err);
      });
    },
  },
};
</script>

<style lang="less" scoped>
.configBox {
  padding: 0 10px;
  width: 100%;
  height: 100%;
  background: #FFFFFF;
  box-sizing: border-box;

  .queryBtn {
    margin-left: 10px;
  }

  .addBtn {
    margin-top: 10px;
  }
  .colBox {
    padding-right: 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    box-sizing: border-box;
    .el-icon-delete {
      cursor: pointer;
      font-size: 16px;
      color: red;
    }
  }

  .btnBox {
    margin-top: 15px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
