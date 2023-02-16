import request from "./request";

/**
 * 查询资产
 * @param id 资产ID
 *
 */
export const queryAssetById = (id, count = 200) =>
  request.post(`/asset/getAssetData?asset_id=${id}&count=${count}`, { filters: [] });

/**
* 查询活动
*
*/
export const queryImgVio = (params) =>
  request.post(`/service/dataapi/rest/d1084fbf-21a7-493b-a84e-98f0a5a59658`, params);
