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
* JS-SDK签名算法
*/
export const wxJsSdk = (message) =>
  request.get(`/ext/js-sdk?url=${message.url}`); 

/**
* 查询活动
* @param data_id 活动ID
* @param user_id 用户ID
*
*/
export const queryActiveMsg = (params) =>
  request.post(`/service/dataapi/rest/5c1e6c39-77b5-43d0-b14e-6ca6ba274222`, params);

/**
* 查询活动状态
* @param data_id 活动ID
*
*/
export const queryActiveType = (params) =>
  request.post(`/service/dataapi/rest/33f46ff8-f437-4699-a93d-ce603b3f803e`, params);

/**
* 查询活动总结表
* @param data_id 活动id
*
*/
export const queryActiveOver = (params) =>
  request.post(`/service/dataapi/rest/8be98e61-64a4-40d7-aa21-afc438f21182`, params);

/**
* 查询报名
* @param data_id 活动id
*
*/
export const queryBaoMing = (params) =>
  request.post(`/service/dataapi/rest/714cc1ca-ac73-442a-b6ec-18790a409e68`, params);

/**
* 插入报名信息
* @param data_id 活动id
* @param user_id 用户id
*
*/
export const queryAddBaoMing = (params) =>
  request.post(`/service/dataapi/rest/ef753750-a79d-4032-9b60-86d70dd5452b`, params);

/**
* 插入后报名人数+1
* @param data_id 活动id
* @param user_id 用户id
*
*/
export const queryAddBaoMingData = (params) =>
  request.post(`/service/dataapi/rest/5d9e0d5a-79c7-4a3e-9644-302bd0f59633`, params);

/**
* 删除报名信息
* @param data_id 活动id
* @param user_id 用户id
*
*/
export const queryDelBaoMing = (params) =>
  request.post(`/service/dataapi/rest/50ebf786-a5d0-4e32-a14f-4dc63aaa4706`, params);

/**
* 删除后报名人数-1
* @param data_id 活动id
* @param user_id 用户id
*
*/
export const queryDelBaoMingData = (params) =>
  request.post(`/service/dataapi/rest/0b4fe57f-1c8e-4ba4-a3d4-ad81bd59ec3f`, params);

/**
* 查询评论表
* @param pageNum 
* @param pageSize 
* @param data_id 活动id
*
*/
export const queryPingLun = (params) =>
  request.post(`/service/dataapi/rest/1fa005ee-c3e6-4658-845d-89ad5e51b855`, params);

/**
* 查询评论总数
* @param data_id 活动id
*
*/
export const queryPingLunNum = (params) =>
  request.post(`/service/dataapi/rest/45d13a8b-6ebf-4e13-babf-019b5c200636`, params);

/**
* 插入评论数据
* @param data_id 活动id
* @param user_id 用户id
* @param content 评论内容
*
*/
export const queryPingLunData = (params) =>
  request.post(`/service/dataapi/rest/6d117c1d-92b9-48c8-acb6-4eb853c43654`, params);

/**
* 插入收藏数据
* @param data_id 活动id
* @param user_id 活动id
*
*/
export const queryCollectData = (params) =>
  request.post(`/service/dataapi/rest/ad2c7965-3f37-4c43-9959-f1172fa6c9d4`, params);

/**
* 插入后收藏数+1
* @param data_id 活动id
* @param user_id 用户id
*
*/
export const queryAddCollect= (params) =>
  request.post(`/service/dataapi/rest/b6fce761-d9f9-4e3b-afd1-4ab8adcba8ac`, params);

/**
* 删除收藏信息
* @param data_id 活动id
* @param user_id 活动id
*
*/
export const queryDelCollectData = (params) =>
  request.post(`/service/dataapi/rest/ebb148b5-a013-4744-9c87-40e79b1096db`, params);

/**
* 收藏次数-1
* @param data_id 活动id
* @param user_id 用户id
*
*/
export const queryDelCollect = (params) =>
  request.post(`/service/dataapi/rest/84a2e8d2-f80c-4588-b499-f74dc3a772d3`, params);

/**
* 关注次数+1
* @param data_id 活动id
* @param user_id 用户id
*/
export const queryAddGuanZhu = (params) =>
  request.post(`/service/dataapi/rest/2d5eb37b-52be-48e3-a389-e3e36f65dd45`, params);

/**
* 插入关注数据
* @param data_id 活动id
* @param user_id 用户id
*
*/
export const queryAddGuanZhuData = (params) =>
  request.post(`/service/dataapi/rest/b8dd1dab-c95c-4dae-9a32-65f34e2b4f76`, params);

/**
* 删除关注信息
* @param data_id 活动id
* @param user_id 用户id
*/
export const queryDelGuanZhuData = (params) =>
  request.post(`/service/dataapi/rest/0a779ee6-e76b-448f-a3a9-1d885d276a67`, params);

/**
* 关注次数-1
* @param data_id 活动id
* @param user_id 用户id
*/
export const queryDelGuanZhu = (params) =>
  request.post(`/service/dataapi/rest/c6131b43-f3fc-477a-90af-7f7345651551`, params);

/**
* 点赞次数+1
* @param data_id 活动id
* @param user_id 用户id
*
*/
export const queryAddDianZan = (params) =>
  request.post(`/service/dataapi/rest/829a3793-718a-40e9-bea8-a5bfbb5c12b1`, params);

/**
* 插入点赞表数据
* @param data_id 活动id
* @param user_id 用户id
*
*/
export const queryDianZanData = (params) =>
  request.post(`/service/dataapi/rest/4d4450d9-4f6d-49f9-9a26-da1e3fd3ee33`, params);

/**
* 点赞信息-1
* @param data_id 活动id
* @param user_id 用户id
*
*/
export const queryDelDianZan = (params) =>
  request.post(`/service/dataapi/rest/ac8a858b-c49a-4865-a73c-fa8bd455e7ef`, params);

/**
* 删除点赞信息
* @param data_id 活动id
* @param user_id 用户id
*
*/
export const queryDelDianZanData = (params) =>
  request.post(`/service/dataapi/rest/1711619c-cff4-4b6e-bd74-075a7fc1ba7f`, params);

/**
* 浏览次数+1
* @param data_id 活动id
*/
export const queryLiuLanNum = (params) =>
  request.post(`/service/dataapi/rest/c2085f52-dd1a-45ed-800a-759d56fc8d44`, params);
