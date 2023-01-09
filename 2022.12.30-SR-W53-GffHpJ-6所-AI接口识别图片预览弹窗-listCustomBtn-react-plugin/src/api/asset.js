import request from "./request";

/**
 * 查询资产
 * @param id 资产ID
 *
 */
export const queryAssetById = (id, count = 200) =>
  request.post(`/asset/getAssetData?asset_id=${id}&count=${count}`, { filters: [] });

/**
 * 调用AI接口
 * @param id 资产ID
 *
 */
export const queryBoatDetectAnalysis = (imgSrc) =>
  request.get(`/analysis/boatDetectAnalysis?imgUrl=${imgSrc}`);