<template>
  <div class="listTable">
    <el-table
      v-if="tableShow"
      :data="tableData"
      style="width: 100%"
      :border="true"
    >
      <el-table-column
        type="index"
        width="50">
      </el-table-column>
      <el-table-column
        v-for="item,index in selectColNames"
        :key="index"
        :label="item.alias"
        :property="item.colName"
      >
      </el-table-column>
      <!-- <el-table-column label="操作">
        <template slot-scope="scope">
          <span class="handText" @click="handleEdit(scope.$index, scope.row)">明细</span>
        </template>
      </el-table-column> -->
    </el-table>
    <!-- 资产ID -->
    <!-- <el-input v-model="form.assetId" size="small" placeholder="列表页"></el-input> -->
  </div>
</template>

<script>
import moment from 'moment';
import Vue from 'vue';
// 引入接口
import { queryYibaoAsset } from '../api/asset'

import {
  Table,
  TableColumn,
} from 'element-ui';

Vue.use(Table);
Vue.use(TableColumn);

export default {
  name: 'List',
  props: {
    // 平台数据
    platformProps: Object,
    // 本地数据
    customConfig: Object,
  },
  data() {
    return {
      // 配置项数据
      tableShow: false,
      configForm: {
        assetId: ''
      },
      tableData: [],
      selectColNames: [
        {
          colName: "文本1",  // 聚合字段
          alias: "文本1",    // 类型：sum-求和、avg-平均值、max-最大值、min-最小值
        }
      ],// 展示字段
      aggParams: [  // 聚合查询参数
        {
          colName: "数字1",  // 聚合字段
          type: "sum",
        }
      ],
      selectColNameList: [],
      assetId: "", // 资产id
      groupBy: "文本1", // 分组
      queryParams: []
    }
  },
  mounted() {
    this.initData();
  },
  methods: {
    // 跳转
    handleEdit(index,row) {
      console.log(index, row);
    },
    // 初始化数据
    initData(){
      // 配置项数据隔离
      if (this.platformProps) {
        this.configForm = this.platformProps.pluginConfig;
        let queryList = this.platformProps.queryList ? this.platformProps.queryList : [];
        if (queryList.length < 0) return;
        this.queryParams = queryList.map(x=>{
          let obj = {
            colName: null,
            colValue: null
          }
          if (x.filterValue && x.filterValue.length > 0) {
            switch (x.showType) {
              case "date":
                obj.colValue = []
                x.filterValue.forEach(element => {
                  obj.colName = element.colName;
                  obj.colValue.push(moment(element.value).format('x'));
                });
              break;
              default:
                let ele = x.filterValue[0];
                obj.colName = ele.colName;
                obj.colValue = ele.value;
              break;
            }
          } else {
            obj = null
          }
          return obj;
        }).filter(Boolean);
        // console.log('queryParams', this.queryParams);
      } else {
        this.configForm = this.customConfig.configuration
      }
      console.log('预览页-this.configForm', this.configForm);
      console.log('预览页-this.platformProps', this.platformProps);
      this.selectColNames = this.configForm.selectColNames || [];
      this.selectColNameList = this.selectColNames.map( x => x.colName);
      this.aggParams = this.configForm.aggParams || [];
      this.assetId = this.configForm.assetId || "b49cd7dc-bcdd-6dcd-eaf6-74be5ddab274";
      this.groupBy = this.configForm.groupBy || "";
      this.tableShow = true;
      this.$nextTick(()=>{
        this.getYibaoAsset();
      })
    },
    // 请求
    async getYibaoAsset(){
      let params = {
        assetId: this.assetId,  // 资产id
        queryParams: this.queryParams,
        selectColNames: this.selectColNameList,   // 查询字段，聚合字段自动返回
        groupBy: this.groupBy, // 分组字段
        aggParams: this.aggParams
      }
      let { data: { dataList } } = await queryYibaoAsset(params);
      // console.log('data', dataList);
      this.tableData = dataList;
    }
  },
};
</script>

<style lang="less" scoped>
.listTable {
  width: 100% !important;
  height: 100%;
  /deep/.el-table {
    // border: 1px solid #efefef;
    box-sizing: border-box;
    .textClass {
      font-weight: 700;
    }
    th.el-table__cell {
      background: #f2f2f2;
      color: #000000;
      padding: 2px 12px;
      border-color: #e7e7e7;
    }
    .el-table__body td.el-table__cell {
      // &:first-child {
      //   background: #f8f8f8;
      // }
      padding: 7px 12px;
      color: #000000;
      border-color: #efefef;
    }
    .handText {
      cursor: pointer;
      color: #5cc1f4;
    }
  }
}
</style>
