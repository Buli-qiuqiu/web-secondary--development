import request from "./request";

/**
 * 查询资产
 * @param id 资产ID
 *
 */
export const queryAssetById = (id, count = 200) =>
  request.post(`/asset/getAssetData?asset_id=${id}&count=${count}`, {
    filters: [],
  });
//签到接口
export const checkIn = (params) =>
  request.post(
    `/service/dataapi/rest/2fdfe241-492f-4089-a6ad-5fefb27ea2a4`,
    params
  );
//查询签到接口
export const queryCheckIn = (params) =>
  request.post(
    `/service/dataapi/rest/51c07ec8-8393-4434-9cd6-fa464f7d8a35`,
    params
  );
//获取用户信息
export const getUser = () => request.get(`/system/authority/user`);
//查询连续天数
export const getContinuity = (params) =>
  request.post(
    `/service/dataapi/rest/749cbe5f-77ca-4363-9227-55e659ea0e68`,
    params
  );
