import request from "./request";

/**
 * 查询资产(新的)
 * @param {*} params
 */
export const getAssets = (cata, type, params2) =>
  request.post(`asset/queryList?cata=${cata}&type=${type}`, params2);

/**
 * 查询资产
 */
export const queryDataLSDL = (params) =>
  request.post("ext/LSDLineChart/queryData", params);
