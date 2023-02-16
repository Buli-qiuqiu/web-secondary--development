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
export const update = (id) => request.get("panNeng/fullUpdate");
// 查询通知
export const queryList = (params) => request.post(`sysInfo/queryList`, params);
export const setCookie = (token) =>
  request.get("system/authority/setCookie?token=" + token);
// 已读通知
export const read = (id) => request.get(`sysInfo/read?id=${id}`);
export const isLogin = () => request.get("system/authority/isLogin");
export const user = () => request.get("/system/authority/user");
export const logout = () => request.get("/system/authority/logout");
export const login = (params) =>
  request.post(`/system/authority/loginAccount4Application`, params);
