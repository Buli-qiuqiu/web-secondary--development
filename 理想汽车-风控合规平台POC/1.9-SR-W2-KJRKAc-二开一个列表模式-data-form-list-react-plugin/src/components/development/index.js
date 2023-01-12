import React, { useState, useEffect, useRef } from "react";
import "./development.less";
import NodeData from "./nodeData";
import MindMap from "../MindMap";

const pluginConfig = {
  assetId: "333",
  isOpenContextMenu: true,
  urlList: ["http://10.15.60.33/", "333", "4444", "", ""],
};

const lineButtons = [
  {
    id: "9407125b-bed7-41ef-a33b-18d2f8347740",
    title: "新增",
    iconStyle: {
      type: "icon-bianji2",
      status: "surface",
      fontSize: "14px",
    },
  },
  {
    id: "editData",
    title: "编辑",
    iconStyle: {
      type: "icon-bianji_xiugai",
      status: "surface",
      fontSize: "14px",
    },
  },
  {
    id: "deleteData",
    title: "删除",
    iconStyle: {
      type: "icon-shanchu8",
      status: "surface",
      fontSize: "14px",
    },
  },
];

const data = [
  [
    {
      label: "目录",
      columnId: "8399db05-bd97-462f-ab96-4aacae94d6cf",
      value: {
        value: "22",
        display: "22",
      },
      showType: "input",
    },
    {
      label: "单行文本",
      columnId: "430da522-2e1b-44c8-ad10-c455cbe345e4",
      value: {
        value: "22",
        display: "22",
      },
      showType: "input",
    },
    {
      label: "多行文本",
      columnId: "07a9d628-2f6f-4665-8d8d-42eca58964f7",
      value: {
        value: "1",
        display: "1",
      },
      showType: "textarea",
    },
    {
      label: "主键",
      columnId: "f776a95c-e88e-48ae-8f09-b43e336680d3",
      value: {
        value: "0736a87237984ca18d7b0b75251da1fe",
        display: "0736a87237984ca18d7b0b75251da1fe",
      },
      showType: "input",
    },
    {
      label: "创建人",
      columnId: "c3f01d5a-2a20-4440-aabd-ff8a96f59c6d",
      value: {
        value: "1234567890",
        display: "admin",
      },
      showType: "user",
    },
    {
      label: "创建时间",
      columnId: "d7138d52-2bbf-4980-814a-1d2a8b454f69",
      value: {
        value: 1673356248000,
        display: 1673356248000,
      },
      showType: "date",
    },
    {
      label: "创建人IP地址",
      columnId: "90566df2-da4d-40d1-b20f-92eac1d2c12a",
      value: {
        value: "10.15.30.2",
        display: "10.15.30.2",
      },
      showType: "input",
    },
    {
      label: "最后修改人",
      columnId: "d0c1e769-3b6b-4a99-8c1e-4d44127c88a0",
      value: {
        value: "1234567890",
        display: "admin",
      },
      showType: "user",
    },
    {
      label: "最后修改时间",
      columnId: "8ed62de6-f7dd-41c7-8b36-8ffb483d3cee",
      value: {
        value: 1673356248000,
        display: 1673356248000,
      },
      showType: "date",
    },
    {
      label: "最后修改人IP地址",
      columnId: "de9e98ec-eb3b-4df4-9fd5-e5efa0131e1d",
      value: {
        value: "10.15.30.2",
        display: "10.15.30.2",
      },
      showType: "input",
    },
    {
      label: "创建人部门",
      columnId: "718ef35c-a488-4e8e-9866-b0f837d30b99",
      value: {
        value: "123456789",
        display: "我的组织",
      },
      showType: "office",
    },
  ],
  [
    {
      label: "目录",
      columnId: "8399db05-bd97-462f-ab96-4aacae94d6cf",
      value: {
        value: "221",
        display: "221",
      },
      showType: "input",
    },
    {
      label: "单行文本",
      columnId: "430da522-2e1b-44c8-ad10-c455cbe345e4",
      value: {
        value: "221",
        display: "221",
      },
      showType: "input",
    },
    {
      label: "多行文本",
      columnId: "07a9d628-2f6f-4665-8d8d-42eca58964f7",
      value: {
        value: "22",
        display: "22",
      },
      showType: "textarea",
    },
    {
      label: "主键",
      columnId: "f776a95c-e88e-48ae-8f09-b43e336680d3",
      value: {
        value: "65bbc4a0bddb4158838e0bcc7ac8a204",
        display: "65bbc4a0bddb4158838e0bcc7ac8a204",
      },
      showType: "input",
    },
    {
      label: "创建人",
      columnId: "c3f01d5a-2a20-4440-aabd-ff8a96f59c6d",
      value: {
        value: "1234567890",
        display: "admin",
      },
      showType: "user",
    },
    {
      label: "创建时间",
      columnId: "d7138d52-2bbf-4980-814a-1d2a8b454f69",
      value: {
        value: 1673356294000,
        display: 1673356294000,
      },
      showType: "date",
    },
    {
      label: "创建人IP地址",
      columnId: "90566df2-da4d-40d1-b20f-92eac1d2c12a",
      value: {
        value: "10.15.30.2",
        display: "10.15.30.2",
      },
      showType: "input",
    },
    {
      label: "最后修改人",
      columnId: "d0c1e769-3b6b-4a99-8c1e-4d44127c88a0",
      value: {
        value: "1234567890",
        display: "admin",
      },
      showType: "user",
    },
    {
      label: "最后修改时间",
      columnId: "8ed62de6-f7dd-41c7-8b36-8ffb483d3cee",
      value: {
        value: 1673356294000,
        display: 1673356294000,
      },
      showType: "date",
    },
    {
      label: "最后修改人IP地址",
      columnId: "de9e98ec-eb3b-4df4-9fd5-e5efa0131e1d",
      value: {
        value: "10.15.30.2",
        display: "10.15.30.2",
      },
      showType: "input",
    },
    {
      label: "创建人部门",
      columnId: "718ef35c-a488-4e8e-9866-b0f837d30b99",
      value: {
        value: "123456789",
        display: "我的组织",
      },
      showType: "office",
    },
  ],
  [
    {
      label: "目录",
      columnId: "8399db05-bd97-462f-ab96-4aacae94d6cf",
      value: {
        value: "1",
        display: "1",
      },
      showType: "input",
    },
    {
      label: "单行文本",
      columnId: "430da522-2e1b-44c8-ad10-c455cbe345e4",
      value: {
        value: "1",
        display: "1",
      },
      showType: "input",
    },
    {
      label: "多行文本",
      columnId: "07a9d628-2f6f-4665-8d8d-42eca58964f7",
      value: {},
      showType: "textarea",
    },
    {
      label: "主键",
      columnId: "f776a95c-e88e-48ae-8f09-b43e336680d3",
      value: {
        value: "7254020e46954bae9f8c8c685f25a7ed",
        display: "7254020e46954bae9f8c8c685f25a7ed",
      },
      showType: "input",
    },
    {
      label: "创建人",
      columnId: "c3f01d5a-2a20-4440-aabd-ff8a96f59c6d",
      value: {
        value: "1234567890",
        display: "admin",
      },
      showType: "user",
    },
    {
      label: "创建时间",
      columnId: "d7138d52-2bbf-4980-814a-1d2a8b454f69",
      value: {
        value: 1673356226000,
        display: 1673356226000,
      },
      showType: "date",
    },
    {
      label: "创建人IP地址",
      columnId: "90566df2-da4d-40d1-b20f-92eac1d2c12a",
      value: {
        value: "10.15.30.2",
        display: "10.15.30.2",
      },
      showType: "input",
    },
    {
      label: "最后修改人",
      columnId: "d0c1e769-3b6b-4a99-8c1e-4d44127c88a0",
      value: {
        value: "1234567890",
        display: "admin",
      },
      showType: "user",
    },
    {
      label: "最后修改时间",
      columnId: "8ed62de6-f7dd-41c7-8b36-8ffb483d3cee",
      value: {
        value: 1673356226000,
        display: 1673356226000,
      },
      showType: "date",
    },
    {
      label: "最后修改人IP地址",
      columnId: "de9e98ec-eb3b-4df4-9fd5-e5efa0131e1d",
      value: {
        value: "10.15.30.2",
        display: "10.15.30.2",
      },
      showType: "input",
    },
    {
      label: "创建人部门",
      columnId: "718ef35c-a488-4e8e-9866-b0f837d30b99",
      value: {
        value: "123456789",
        display: "我的组织",
      },
      showType: "office",
    },
  ],
  [
    {
      label: "目录",
      columnId: "8399db05-bd97-462f-ab96-4aacae94d6cf",
      value: {
        value: "21",
        display: "21",
      },
      showType: "input",
    },
    {
      label: "单行文本",
      columnId: "430da522-2e1b-44c8-ad10-c455cbe345e4",
      value: {
        value: "21",
        display: "21",
      },
      showType: "input",
    },
    {
      label: "多行文本",
      columnId: "07a9d628-2f6f-4665-8d8d-42eca58964f7",
      value: {
        value: "1",
        display: "1",
      },
      showType: "textarea",
    },
    {
      label: "主键",
      columnId: "f776a95c-e88e-48ae-8f09-b43e336680d3",
      value: {
        value: "81faccde13e64145803faaae5513bdd3",
        display: "81faccde13e64145803faaae5513bdd3",
      },
      showType: "input",
    },
    {
      label: "创建人",
      columnId: "c3f01d5a-2a20-4440-aabd-ff8a96f59c6d",
      value: {
        value: "1234567890",
        display: "admin",
      },
      showType: "user",
    },
    {
      label: "创建时间",
      columnId: "d7138d52-2bbf-4980-814a-1d2a8b454f69",
      value: {
        value: 1673356239000,
        display: 1673356239000,
      },
      showType: "date",
    },
    {
      label: "创建人IP地址",
      columnId: "90566df2-da4d-40d1-b20f-92eac1d2c12a",
      value: {
        value: "10.15.30.2",
        display: "10.15.30.2",
      },
      showType: "input",
    },
    {
      label: "最后修改人",
      columnId: "d0c1e769-3b6b-4a99-8c1e-4d44127c88a0",
      value: {
        value: "1234567890",
        display: "admin",
      },
      showType: "user",
    },
    {
      label: "最后修改时间",
      columnId: "8ed62de6-f7dd-41c7-8b36-8ffb483d3cee",
      value: {
        value: 1673356239000,
        display: 1673356239000,
      },
      showType: "date",
    },
    {
      label: "最后修改人IP地址",
      columnId: "de9e98ec-eb3b-4df4-9fd5-e5efa0131e1d",
      value: {
        value: "10.15.30.2",
        display: "10.15.30.2",
      },
      showType: "input",
    },
    {
      label: "创建人部门",
      columnId: "718ef35c-a488-4e8e-9866-b0f837d30b99",
      value: {
        value: "123456789",
        display: "我的组织",
      },
      showType: "office",
    },
  ],
  [
    {
      label: "目录",
      columnId: "8399db05-bd97-462f-ab96-4aacae94d6cf",
      value: {
        value: "2111",
        display: "2111",
      },
      showType: "input",
    },
    {
      label: "单行文本",
      columnId: "430da522-2e1b-44c8-ad10-c455cbe345e4",
      value: {
        value: "2111",
        display: "2111",
      },
      showType: "input",
    },
    {
      label: "多行文本",
      columnId: "07a9d628-2f6f-4665-8d8d-42eca58964f7",
      value: {
        value: "211",
        display: "211",
      },
      showType: "textarea",
    },
    {
      label: "主键",
      columnId: "f776a95c-e88e-48ae-8f09-b43e336680d3",
      value: {
        value: "97a73687fb9144d6acbbbeff863c1058",
        display: "97a73687fb9144d6acbbbeff863c1058",
      },
      showType: "input",
    },
    {
      label: "创建人",
      columnId: "c3f01d5a-2a20-4440-aabd-ff8a96f59c6d",
      value: {
        value: "1234567890",
        display: "admin",
      },
      showType: "user",
    },
    {
      label: "创建时间",
      columnId: "d7138d52-2bbf-4980-814a-1d2a8b454f69",
      value: {
        value: 1673356393000,
        display: 1673356393000,
      },
      showType: "date",
    },
    {
      label: "创建人IP地址",
      columnId: "90566df2-da4d-40d1-b20f-92eac1d2c12a",
      value: {
        value: "10.15.30.2",
        display: "10.15.30.2",
      },
      showType: "input",
    },
    {
      label: "最后修改人",
      columnId: "d0c1e769-3b6b-4a99-8c1e-4d44127c88a0",
      value: {
        value: "1234567890",
        display: "admin",
      },
      showType: "user",
    },
    {
      label: "最后修改时间",
      columnId: "8ed62de6-f7dd-41c7-8b36-8ffb483d3cee",
      value: {
        value: 1673356401000,
        display: 1673356401000,
      },
      showType: "date",
    },
    {
      label: "最后修改人IP地址",
      columnId: "de9e98ec-eb3b-4df4-9fd5-e5efa0131e1d",
      value: {
        value: "10.15.30.2",
        display: "10.15.30.2",
      },
      showType: "input",
    },
    {
      label: "创建人部门",
      columnId: "718ef35c-a488-4e8e-9866-b0f837d30b99",
      value: {
        value: "123456789",
        display: "我的组织",
      },
      showType: "office",
    },
  ],
  [
    {
      label: "目录",
      columnId: "8399db05-bd97-462f-ab96-4aacae94d6cf",
      value: {
        value: "212",
        display: "212",
      },
      showType: "input",
    },
    {
      label: "单行文本",
      columnId: "430da522-2e1b-44c8-ad10-c455cbe345e4",
      value: {
        value: "212",
        display: "212",
      },
      showType: "input",
    },
    {
      label: "多行文本",
      columnId: "07a9d628-2f6f-4665-8d8d-42eca58964f7",
      value: {
        value: "21",
        display: "21",
      },
      showType: "textarea",
    },
    {
      label: "主键",
      columnId: "f776a95c-e88e-48ae-8f09-b43e336680d3",
      value: {
        value: "a062bac5769b4a948233e56bee2c8ea1",
        display: "a062bac5769b4a948233e56bee2c8ea1",
      },
      showType: "input",
    },
    {
      label: "创建人",
      columnId: "c3f01d5a-2a20-4440-aabd-ff8a96f59c6d",
      value: {
        value: "1234567890",
        display: "admin",
      },
      showType: "user",
    },
    {
      label: "创建时间",
      columnId: "d7138d52-2bbf-4980-814a-1d2a8b454f69",
      value: {
        value: 1673356276000,
        display: 1673356276000,
      },
      showType: "date",
    },
    {
      label: "创建人IP地址",
      columnId: "90566df2-da4d-40d1-b20f-92eac1d2c12a",
      value: {
        value: "10.15.30.2",
        display: "10.15.30.2",
      },
      showType: "input",
    },
    {
      label: "最后修改人",
      columnId: "d0c1e769-3b6b-4a99-8c1e-4d44127c88a0",
      value: {
        value: "1234567890",
        display: "admin",
      },
      showType: "user",
    },
    {
      label: "最后修改时间",
      columnId: "8ed62de6-f7dd-41c7-8b36-8ffb483d3cee",
      value: {
        value: 1673356276000,
        display: 1673356276000,
      },
      showType: "date",
    },
    {
      label: "最后修改人IP地址",
      columnId: "de9e98ec-eb3b-4df4-9fd5-e5efa0131e1d",
      value: {
        value: "10.15.30.2",
        display: "10.15.30.2",
      },
      showType: "input",
    },
    {
      label: "创建人部门",
      columnId: "718ef35c-a488-4e8e-9866-b0f837d30b99",
      value: {
        value: "123456789",
        display: "我的组织",
      },
      showType: "office",
    },
  ],
  [
    {
      label: "目录",
      columnId: "8399db05-bd97-462f-ab96-4aacae94d6cf",
      value: {
        value: "2121",
        display: "2121",
      },
      showType: "input",
    },
    {
      label: "单行文本",
      columnId: "430da522-2e1b-44c8-ad10-c455cbe345e4",
      value: {
        value: "2121",
        display: "2121",
      },
      showType: "input",
    },
    {
      label: "多行文本",
      columnId: "07a9d628-2f6f-4665-8d8d-42eca58964f7",
      value: {
        value: "212",
        display: "212",
      },
      showType: "textarea",
    },
    {
      label: "主键",
      columnId: "f776a95c-e88e-48ae-8f09-b43e336680d3",
      value: {
        value: "a1fe7dbb917940c5b866e716e6d9712f",
        display: "a1fe7dbb917940c5b866e716e6d9712f",
      },
      showType: "input",
    },
    {
      label: "创建人",
      columnId: "c3f01d5a-2a20-4440-aabd-ff8a96f59c6d",
      value: {
        value: "1234567890",
        display: "admin",
      },
      showType: "user",
    },
    {
      label: "创建时间",
      columnId: "d7138d52-2bbf-4980-814a-1d2a8b454f69",
      value: {
        value: 1673356356000,
        display: 1673356356000,
      },
      showType: "date",
    },
    {
      label: "创建人IP地址",
      columnId: "90566df2-da4d-40d1-b20f-92eac1d2c12a",
      value: {
        value: "10.15.30.2",
        display: "10.15.30.2",
      },
      showType: "input",
    },
    {
      label: "最后修改人",
      columnId: "d0c1e769-3b6b-4a99-8c1e-4d44127c88a0",
      value: {
        value: "1234567890",
        display: "admin",
      },
      showType: "user",
    },
    {
      label: "最后修改时间",
      columnId: "8ed62de6-f7dd-41c7-8b36-8ffb483d3cee",
      value: {
        value: 1673356356000,
        display: 1673356356000,
      },
      showType: "date",
    },
    {
      label: "最后修改人IP地址",
      columnId: "de9e98ec-eb3b-4df4-9fd5-e5efa0131e1d",
      value: {
        value: "10.15.30.2",
        display: "10.15.30.2",
      },
      showType: "input",
    },
    {
      label: "创建人部门",
      columnId: "718ef35c-a488-4e8e-9866-b0f837d30b99",
      value: {
        value: "123456789",
        display: "我的组织",
      },
      showType: "office",
    },
  ],
  [
    {
      label: "目录",
      columnId: "8399db05-bd97-462f-ab96-4aacae94d6cf",
      value: {
        value: "2221",
        display: "2221",
      },
      showType: "input",
    },
    {
      label: "单行文本",
      columnId: "430da522-2e1b-44c8-ad10-c455cbe345e4",
      value: {
        value: "2221",
        display: "2221",
      },
      showType: "input",
    },
    {
      label: "多行文本",
      columnId: "07a9d628-2f6f-4665-8d8d-42eca58964f7",
      value: {
        value: "222",
        display: "222",
      },
      showType: "textarea",
    },
    {
      label: "主键",
      columnId: "f776a95c-e88e-48ae-8f09-b43e336680d3",
      value: {
        value: "a6137188659349b69964fb07d3291e83",
        display: "a6137188659349b69964fb07d3291e83",
      },
      showType: "input",
    },
    {
      label: "创建人",
      columnId: "c3f01d5a-2a20-4440-aabd-ff8a96f59c6d",
      value: {
        value: "1234567890",
        display: "admin",
      },
      showType: "user",
    },
    {
      label: "创建时间",
      columnId: "d7138d52-2bbf-4980-814a-1d2a8b454f69",
      value: {
        value: 1673356415000,
        display: 1673356415000,
      },
      showType: "date",
    },
    {
      label: "创建人IP地址",
      columnId: "90566df2-da4d-40d1-b20f-92eac1d2c12a",
      value: {
        value: "10.15.30.2",
        display: "10.15.30.2",
      },
      showType: "input",
    },
    {
      label: "最后修改人",
      columnId: "d0c1e769-3b6b-4a99-8c1e-4d44127c88a0",
      value: {
        value: "1234567890",
        display: "admin",
      },
      showType: "user",
    },
    {
      label: "最后修改时间",
      columnId: "8ed62de6-f7dd-41c7-8b36-8ffb483d3cee",
      value: {
        value: 1673356415000,
        display: 1673356415000,
      },
      showType: "date",
    },
    {
      label: "最后修改人IP地址",
      columnId: "de9e98ec-eb3b-4df4-9fd5-e5efa0131e1d",
      value: {
        value: "10.15.30.2",
        display: "10.15.30.2",
      },
      showType: "input",
    },
    {
      label: "创建人部门",
      columnId: "718ef35c-a488-4e8e-9866-b0f837d30b99",
      value: {
        value: "123456789",
        display: "我的组织",
      },
      showType: "office",
    },
  ],
  [
    {
      label: "目录",
      columnId: "8399db05-bd97-462f-ab96-4aacae94d6cf",
      value: {
        value: "211",
        display: "211",
      },
      showType: "input",
    },
    {
      label: "单行文本",
      columnId: "430da522-2e1b-44c8-ad10-c455cbe345e4",
      value: {
        value: "211",
        display: "211",
      },
      showType: "input",
    },
    {
      label: "多行文本",
      columnId: "07a9d628-2f6f-4665-8d8d-42eca58964f7",
      value: {
        value: "21",
        display: "21",
      },
      showType: "textarea",
    },
    {
      label: "主键",
      columnId: "f776a95c-e88e-48ae-8f09-b43e336680d3",
      value: {
        value: "c8c01dc472464fd6bdf8729df6fc9107",
        display: "c8c01dc472464fd6bdf8729df6fc9107",
      },
      showType: "input",
    },
    {
      label: "创建人",
      columnId: "c3f01d5a-2a20-4440-aabd-ff8a96f59c6d",
      value: {
        value: "1234567890",
        display: "admin",
      },
      showType: "user",
    },
    {
      label: "创建时间",
      columnId: "d7138d52-2bbf-4980-814a-1d2a8b454f69",
      value: {
        value: 1673356263000,
        display: 1673356263000,
      },
      showType: "date",
    },
    {
      label: "创建人IP地址",
      columnId: "90566df2-da4d-40d1-b20f-92eac1d2c12a",
      value: {
        value: "10.15.30.2",
        display: "10.15.30.2",
      },
      showType: "input",
    },
    {
      label: "最后修改人",
      columnId: "d0c1e769-3b6b-4a99-8c1e-4d44127c88a0",
      value: {
        value: "1234567890",
        display: "admin",
      },
      showType: "user",
    },
    {
      label: "最后修改时间",
      columnId: "8ed62de6-f7dd-41c7-8b36-8ffb483d3cee",
      value: {
        value: 1673356263000,
        display: 1673356263000,
      },
      showType: "date",
    },
    {
      label: "最后修改人IP地址",
      columnId: "de9e98ec-eb3b-4df4-9fd5-e5efa0131e1d",
      value: {
        value: "10.15.30.2",
        display: "10.15.30.2",
      },
      showType: "input",
    },
    {
      label: "创建人部门",
      columnId: "718ef35c-a488-4e8e-9866-b0f837d30b99",
      value: {
        value: "123456789",
        display: "我的组织",
      },
      showType: "office",
    },
  ],
  [
    {
      label: "目录",
      columnId: "8399db05-bd97-462f-ab96-4aacae94d6cf",
      value: {
        value: "2211",
        display: "2211",
      },
      showType: "input",
    },
    {
      label: "单行文本",
      columnId: "430da522-2e1b-44c8-ad10-c455cbe345e4",
      value: {
        value: "2211",
        display: "2211",
      },
      showType: "input",
    },
    {
      label: "多行文本",
      columnId: "07a9d628-2f6f-4665-8d8d-42eca58964f7",
      value: {
        value: "221",
        display: "221",
      },
      showType: "textarea",
    },
    {
      label: "主键",
      columnId: "f776a95c-e88e-48ae-8f09-b43e336680d3",
      value: {
        value: "da0027fc708b4a38bd0bfc828a0e641b",
        display: "da0027fc708b4a38bd0bfc828a0e641b",
      },
      showType: "input",
    },
    {
      label: "创建人",
      columnId: "c3f01d5a-2a20-4440-aabd-ff8a96f59c6d",
      value: {
        value: "1234567890",
        display: "admin",
      },
      showType: "user",
    },
    {
      label: "创建时间",
      columnId: "d7138d52-2bbf-4980-814a-1d2a8b454f69",
      value: {
        value: 1673356431000,
        display: 1673356431000,
      },
      showType: "date",
    },
    {
      label: "创建人IP地址",
      columnId: "90566df2-da4d-40d1-b20f-92eac1d2c12a",
      value: {
        value: "10.15.30.2",
        display: "10.15.30.2",
      },
      showType: "input",
    },
    {
      label: "最后修改人",
      columnId: "d0c1e769-3b6b-4a99-8c1e-4d44127c88a0",
      value: {
        value: "1234567890",
        display: "admin",
      },
      showType: "user",
    },
    {
      label: "最后修改时间",
      columnId: "8ed62de6-f7dd-41c7-8b36-8ffb483d3cee",
      value: {
        value: 1673356431000,
        display: 1673356431000,
      },
      showType: "date",
    },
    {
      label: "最后修改人IP地址",
      columnId: "de9e98ec-eb3b-4df4-9fd5-e5efa0131e1d",
      value: {
        value: "10.15.30.2",
        display: "10.15.30.2",
      },
      showType: "input",
    },
    {
      label: "创建人部门",
      columnId: "718ef35c-a488-4e8e-9866-b0f837d30b99",
      value: {
        value: "123456789",
        display: "我的组织",
      },
      showType: "office",
    },
  ],
  [
    {
      label: "目录",
      columnId: "8399db05-bd97-462f-ab96-4aacae94d6cf",
      value: {
        value: "222",
        display: "222",
      },
      showType: "input",
    },
    {
      label: "单行文本",
      columnId: "430da522-2e1b-44c8-ad10-c455cbe345e4",
      value: {
        value: "222",
        display: "222",
      },
      showType: "input",
    },
    {
      label: "多行文本",
      columnId: "07a9d628-2f6f-4665-8d8d-42eca58964f7",
      value: {
        value: "22",
        display: "22",
      },
      showType: "textarea",
    },
    {
      label: "主键",
      columnId: "f776a95c-e88e-48ae-8f09-b43e336680d3",
      value: {
        value: "e8d37374246b4bc584a5561b7023a0ea",
        display: "e8d37374246b4bc584a5561b7023a0ea",
      },
      showType: "input",
    },
    {
      label: "创建人",
      columnId: "c3f01d5a-2a20-4440-aabd-ff8a96f59c6d",
      value: {
        value: "1234567890",
        display: "admin",
      },
      showType: "user",
    },
    {
      label: "创建时间",
      columnId: "d7138d52-2bbf-4980-814a-1d2a8b454f69",
      value: {
        value: 1673356310000,
        display: 1673356310000,
      },
      showType: "date",
    },
    {
      label: "创建人IP地址",
      columnId: "90566df2-da4d-40d1-b20f-92eac1d2c12a",
      value: {
        value: "10.15.30.2",
        display: "10.15.30.2",
      },
      showType: "input",
    },
    {
      label: "最后修改人",
      columnId: "d0c1e769-3b6b-4a99-8c1e-4d44127c88a0",
      value: {
        value: "1234567890",
        display: "admin",
      },
      showType: "user",
    },
    {
      label: "最后修改时间",
      columnId: "8ed62de6-f7dd-41c7-8b36-8ffb483d3cee",
      value: {
        value: 1673356310000,
        display: 1673356310000,
      },
      showType: "date",
    },
    {
      label: "最后修改人IP地址",
      columnId: "de9e98ec-eb3b-4df4-9fd5-e5efa0131e1d",
      value: {
        value: "10.15.30.2",
        display: "10.15.30.2",
      },
      showType: "input",
    },
    {
      label: "创建人部门",
      columnId: "718ef35c-a488-4e8e-9866-b0f837d30b99",
      value: {
        value: "123456789",
        display: "我的组织",
      },
      showType: "office",
    },
  ],
];

const showButtons = [["9407125b-bed7-41ef-a33b-18d2f8347740"]];

const Development = () => {
  return (
    <MindMap
      nodeData={NodeData}
      pluginConfig={pluginConfig}
      lineButtons={lineButtons}
      data={data}
      showButtons={showButtons}
      handleClick={(id, record) => {
        console.log(id, record);
      }}
      dataSource={[{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}]}
    />
  );
};

Development.propTypes = {};

export default Development;
