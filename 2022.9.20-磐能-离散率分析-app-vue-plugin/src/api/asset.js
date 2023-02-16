import request from "./request";

/**
 * 查询资产
 * @param id 资产ID
 */
export const queryAssetById = (id) => request.post(`/asset/getAssetData?asset_id=${id}`, []);

// 获取表格资产
export const queryAssetByTime = (ids, startTime, endTime, page, pageSize) =>
   request.post(`/DispersionRatio/queryDispersionRatio?ids=${ids}&startTime=${startTime}&endTime=${endTime}&page=${page}&pageSize=${pageSize}`);

// 获取图表资产
export const getEcharts = (ids, startTime, endTime) => request.get(`/DispersionRatio/queryColumnDiagramData?ids=${ids}&startTime=${startTime}&endTime=${endTime}`);

// 导出图表
export const exportEchartsExcel = (dataForm) => request.post(`/DispersionRatio/exportExcel`, dataForm, { responseType: "blob" });

// 获取提示数据
export const queryRemindInfo = (ids, startTime, endTime) => request.post(`/DispersionRatio/queryDispersionRatioErrorTip?ids=${ids}&startTime=${startTime}&endTime=${endTime}`);
