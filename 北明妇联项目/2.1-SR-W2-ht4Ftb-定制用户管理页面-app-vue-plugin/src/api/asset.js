import request from "./request";

/**
 * 查询资产
 * @param id 资产ID
 *
 */
export const queryAssetById = (id) => request.post(`/asset/getAssetData?asset_id=${id}&count=${99999}`, { filters: [] });

// 获取个人信息
export const getDataApi = (dataForm) => request.post(`/service/dataapi/rest/78811857-b20f-4baf-86e6-52466ebdd2c1`, dataForm);

// 获取当前账户信息
export const user = () => request.get("/system/authority/user");

// 获取其他账号信息
export const getAccountList = (id) => request.get(`/system/account/queryUserByAccount?account_code=${id}`);

// 切换账户
export const loginByUser = (dataForm) => request.post("/system/authority/loginByUserAndCreateCookie", dataForm);
