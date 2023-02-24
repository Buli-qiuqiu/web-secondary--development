import request from "./request";

/**
 * 查询资产
 * @param id 资产ID
 *
 */
export const queryAssetById = (id, count = 200) =>
  request.post(`/asset/getAssetData?asset_id=${id}&count=${count}`, { filters: [] });

/**
* 查询用户是否登录
*/
export const isLogin = () => request.get(`system/authority/isLogin`);

/**
* 查询用户
*/
export const queryUser = () =>
  request.get(`/system/authority/user`);

/**
* 查询活动信息
* @param id 资产ID
*
*/
export const queryActiveInfo = (params) =>
  request.post(`/ext/home/queryDynamicData`, params);

/**
* 查询活动条数
* @param id 资产ID
*
*/
export const queryActiveLength = (params) => 
  request.post(`/service/dataapi/rest/441827da-fd2c-4053-8d0b-454515bc1662`, params);


/**
* 插入点赞表数据
* @param data_id 活动id
* @param user_id 用户id
*
*/
export const queryDianZanData = (params) =>
  request.post(`/service/dataapi/rest/985fcfdc-02bd-447b-92d4-1464cfd40302`, params);

/**
* 点赞次数+1
* @param data_id 活动id
* @param user_id 用户id
*
*/
export const queryAddDianZan = (params) =>
  request.post(`/service/dataapi/rest/6577c3bd-c005-42bc-bc1a-ff54aa3b1f94`, params);

/**
* 删除点赞信息
* @param data_id 活动id
* @param user_id 用户id
*
*/
export const queryDelDianZanData = (params) =>
  request.post(`/service/dataapi/rest/d47bc36b-1f45-4155-8e34-03668fa1cafd`, params);

/**
* 点赞信息-1
* @param data_id 活动id
* @param user_id 用户id
*
*/
export const queryDelDianZan = (params) =>
  request.post(`/service/dataapi/rest/407df7c9-0813-4ec0-840b-a6ce1389471d`, params);


/**
* 插入评论表数据
* @param data_id 活动id
* @param user_id 用户id
*
*/
export const queryPingData = (params) =>
  request.post(`/service/dataapi/rest/6f6848d4-bf86-49f6-8ae5-634dc648bf46`, params);

/**
* 评论次数+1
* @param data_id 活动id
* @param user_id 用户id
*
*/
export const queryAddPing = (params) =>
  request.post(`/service/dataapi/rest/9fd2e30e-2c78-4da5-a4c7-561af01e43a3`, params);

/**
* 删除评论信息
* @param data_id 活动id
* @param user_id 用户id
*
*/
export const queryDelPingData = (params) =>
  request.post(`/service/dataapi/rest/55ca36dc-b1c7-4aea-8eed-6a43f1e178c3`, params);

/**
* 评论信息-1
* @param data_id 活动id
* @param user_id 用户id
*
*/
export const queryDelPing = (params) =>
  request.post(`/service/dataapi/rest/1e50e007-bb0e-4cfa-8466-8aa18d9dce99`, params);

/**
* 评论表数据
* @param data_id 活动id
* @param user_id 用户id
*
*/
export const queryPingLunData = (params) =>
  request.post(`/service/dataapi/rest/a44032d2-89d9-4db6-8ede-aaafb634ec55`, params);