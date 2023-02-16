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
export const queryActiveTabs = (params) =>
  request.post(`/service/dataapi/rest/8d19d25d-f461-43ac-8ece-bfc637021b31`, params);