import request from "./request";

/**
 * 查询资产
 * @param id 资产ID
 *
 */
// export const queryAssetById = (id, count = 200) =>
//   request.post(`/asset/getAssetData?asset_id=${id}&count=${count}`, { filters: [] });

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
* 查询组织图片视频
* @param data_id 活动id
* @param user_id 用户id
*
*/
export const queryImgVio = (params) =>
  request.post(`/service/dataapi/rest/d1084fbf-21a7-493b-a84e-98f0a5a59658`, params);
