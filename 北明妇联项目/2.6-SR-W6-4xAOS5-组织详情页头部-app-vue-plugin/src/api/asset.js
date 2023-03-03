import request from "./request";

/**
 * 查询资产
 * @param id 资产ID
 *
 */
export const queryAssetById = (id, count = 200) =>
  request.post(`/asset/getAssetData?asset_id=${id}&count=${count}`, { filters: [] });
//微信小程序 sdk
export const jsSdkConfig = (params) => request.get(`/ext/js-sdk?url=${params.url}`);
//查询详情
export const offieDetil = (params) => request.post(`service/dataapi/rest/9ca4a2bf-1614-4e5c-af3c-1be1f4406261`, params);
//关注加一
export const fllowAdd = (params) => request.post(`service/dataapi/rest/712b9077-8b0b-41b1-bf5a-279b8341973c`, params);
//关注数据插入关注表
export const fllowAddTable = (params) => request.post(`service/dataapi/rest/6d5ba9d4-433c-4fff-9d61-7cdc155c0b32`, params);
//取消关注
export const fllowDel = (params) => request.post(`service/dataapi/rest/7c715095-ba4a-4dd6-af38-92c0ea979344`, params);
//取消关注，删除关注表信息
export const fllowDelTable = (params) => request.post(`service/dataapi/rest/d344ba09-8650-4351-8bb2-8c7b12ed1924`, params);
//阅读浏览加一
export const browseAdd = (params) => request.post(`service/dataapi/rest/73ebeaba-81de-4a1d-893a-bfe01e29ed29`, params);


//查询当前用户
export const userQuery = () => request.get(`system/authority/user`);

//二维码生成
export const QrCode = (params) => request.post(`/ext/createwxaqrcode`, params, { responseType: 'blob' })

//匿名查询
export const offieDetilN = (params) => request.post(`service/dataapi/rest/ae380e04-e4b9-48a2-a020-87ce2b202d22`, params);

// http://10.15.110.25:18880/sdata/rest/service/dataapi/rest/9ca4a2bf-1614-4e5c-af3c-1be1f4406261