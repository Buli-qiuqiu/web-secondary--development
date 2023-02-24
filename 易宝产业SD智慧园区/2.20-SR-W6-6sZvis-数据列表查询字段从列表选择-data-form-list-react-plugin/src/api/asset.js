import request from "./request";

/**
 * 查询资产
 * @param id 资产ID
 *
 */
export const queryAssetById = (id, count = 200) =>
  request.post(`/asset/getAssetData?asset_id=${id}&count=${count}`, { filters: [] });

/**
* 筛选
* @param id 资产ID
*
*/
export const queryYibaoAsset = (params) =>
  request.post(`asset/yibao/list/queryData`, params);
