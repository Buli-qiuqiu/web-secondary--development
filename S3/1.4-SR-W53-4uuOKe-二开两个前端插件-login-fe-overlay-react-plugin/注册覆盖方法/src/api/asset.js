import request from "./request";

/**
 * 查询资产
 * @param id 资产ID
 */
export const queryAssetById = id =>
  request.post(`/asset/getAssetData?asset_id=${id}`, []);
export const getCode = params => request.get('systhirdapp/user/getCode', { params });


// 获取PDF链接
export const createAccount = (params, captcha, codeImage, imageCode) =>
  request.post(
    `system/register/createAccount?code=${captcha}${codeImage ? `&authPicCode=${imageCode}` : ''
    }`,
    params
  );


export const createAccount2 = (params, captcha, codeImage, imageCode) =>
  request.post(
    `system/register/createAccount?code=${captcha}${!codeImage ? `&authPicCode=${imageCode}` : ''
    }`,
    params
  );

export const loginAccount = (params) =>
  request.post(`/system/authority/loginAccount?authPicCode=${params.imageCode}&mobileOrWeb=web`, params);


// 获取用户信息
export const getUser = () => request.get(`system/authority/user`);


// 获取渠道
export const queryAllMsg = () => request.get(`ext/system/userMsg/queryAllMsg`);

// 提交留资
export const userMsgInsert = params =>
  request.post(`ext/system/userMsg/insert`, params);

export const createAccountWeb = (params) =>
  request.post(`datapp/authorized/create?datappId=${params.appid}&authPicCode=${params.authPicCode}`, params);
