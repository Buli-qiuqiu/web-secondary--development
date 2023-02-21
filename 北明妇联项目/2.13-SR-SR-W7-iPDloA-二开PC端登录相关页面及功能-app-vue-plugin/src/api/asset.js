import request from "./request";

/**
 * 查询资产
 * @param id 资产ID
 *
 */
export const getAuthPic = () => request.get(`/system/authority/getAuthPic?module=loginPassword`, { responseType: "blob" });
export const queryUserRole = () => request.get(`/ext/queryUserRole`);
export const loginAccount = (data) => request.post(`/system/authority/loginAccount?authPicCode=${data.imageCode}&mobileOrWeb=web`, data);
export const dataapi = (data) => request.post(`/service/dataapi/rest/4b8ce57a-206a-4203-879d-d6a90a3200a4`,{});
