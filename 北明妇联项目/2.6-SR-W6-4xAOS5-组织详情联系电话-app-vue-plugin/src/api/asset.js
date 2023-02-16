import request from "./request";

/**
 * 查询资产
 * @param id 资产ID
 *
 */
export const queryAssetById = (id, count = 200) =>
  request.post(`/asset/getAssetData?asset_id=${id}&count=${count}`, { filters: [] });


/**
* 查询用户
*/
export const queryUser = () =>
  request.get(`/system/authority/user`);


/**
* 查询活动
* @param data_id 活动ID
* @param user_id 用户ID
*
*/
export const queryDianHua = (params) =>
  request.post(`/service/dataapi/rest/9ca4a2bf-1614-4e5c-af3c-1be1f4406261`, params);
