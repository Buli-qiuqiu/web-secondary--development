import request from "./request";

/**
 * 查询资产
 * @param id 资产ID
 *
 */
export const handClickRecord = (data) => request.post(`/lxcfRecord/handClickRecord`, data);
export const getAssetData = (params,data) => request.post(`/asset/getAssetData?asset_id=${params.assetId}&count=99999&pageNum=1&pageSize=100000`, data);
