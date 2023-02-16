import request from "./request";

/**
 * 查询资产
 * @param id 资产ID
 *
 */
export const loginAccount = (data) => request.post(`/ext/YBCYLoginInterFace/login`, data);
/**
 * 查询路由
 */
export const queryAll = () => request.get(`system/property/queryAll`);
