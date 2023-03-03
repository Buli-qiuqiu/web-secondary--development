import request from "./request";

/**
 * 查询资产
 * @param id 资产ID
 */
export const queryAssetById = id =>
  request.post(`/asset/getAssetData?asset_id=${id}`, []);
export const getCode = params => request.get('systhirdapp/user/getCode', { params });


export const createAccount = (queryParams, params) =>
  request.post(`system/register/createAccount?code=${queryParams.code}&&authPicCode=${queryParams.imageCode}`, params);


export const loginAccount = (params) =>
  request.post(`/system/authority/loginAccount?authPicCode=${params.imageCode}&mobileOrWeb=web`, params);
// 获取用户信息
export const getUser = () => request.get(`system/authority/user`);
// 获取PDF链接
export const loginAccount4Application = params =>
  request.post(
    `system/authority/loginAccount4Application?mobileOrWeb=mobile`,
    params
  );
// web应用端登录
export const loginAccount4ApplicationWeb = params =>
  request.post(
    `system/authority/loginAccount4Application?mobileOrWeb=web`,
    params
  );

// 获取渠道
export const queryAllMsg = () => request.get(`ext/system/userMsg/queryAllMsg`);

// 提交留资
export const userMsgInsert = params =>
  request.post(`ext/system/userMsg/insert`, params);
//短信登录
export const loginByPhone = params =>
  request.post(`system/authority/loginByPhone?authPicCode=${params.imageCode}&mobileOrWeb=web`, params);

