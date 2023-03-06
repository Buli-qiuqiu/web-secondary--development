import request from "./request";

/**
 * 查询资产(新的)
 * @param {*} params
 */
export const getAllData = (params) =>
  request.post(`panNeng/queryByCollectorId `, params);

/**
 * 查询资产
 */
export const update = (id) =>
  request.get("panNeng/fullUpdate");
