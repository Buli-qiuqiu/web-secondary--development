import request from "./request";

/**
 * 查询资产
 * @param id 资产ID
 *
 */
export const requeryAddressByCoordinate = (params) => request.get(`/ext/locating/queryAddressByCoordinate?coordinate=${params.coordinate}`);
export const queryAddressByCoordinate = (params) => request.get(`/ext/locating/queryCoordinateByAddress?address=${params.address}`);
export const jsSdkConfig = (params) => request.get(`/ext/js-sdk?url=${params.url}`);
export const catalog = (params) => request.post(`/service/dataapi/rest/e2159396-d7c3-4115-95ab-3fdefa85c5be`,{});
