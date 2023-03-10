import request from "./request";

/**
 * 查询资产
 * @param id 资产ID
 *
 */
export const queryAssetById = (id, count = 200) =>
  request.post(`/asset/getAssetData?asset_id=${id}&count=${count}`, {
    filters: [],
  });
export const queryCountByOfficeId = () =>
  request.get(`/system/office/queryCountByOfficeId?OfficeId=123456789`);
