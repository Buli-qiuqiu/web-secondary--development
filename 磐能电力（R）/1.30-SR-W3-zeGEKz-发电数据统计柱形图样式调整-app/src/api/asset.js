import request from "./request";

/**
 * 查询资产
 * @param id 资产ID
 */
export const queryAssetById = id =>
  request.post(`/asset/getAssetData?asset_id=${id}`, []);

/**
 * 查询统计报表数据
 * @param id 资产ID
 * @param date 时间
 */
export const queryReportsData = param =>
  request.post(`/statisticalReport/queryDataList?ids=${param.id}&time=${param.date}`);
/**
 * 统计报表导出
 * @param id 资产ID
 * @param date 时间
 */
export const exportReports = param =>
  request.post(`/statisticalReport/exportExcel`, { ids: param.id, time: param.time, decode: param.decode },{ responseType: 'blob' });
