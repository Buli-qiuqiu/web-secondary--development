import request from "./request";

/**
 * 查询资产
 * @param id 资产ID
 *
 */
export const requeryAddressByCoordinate = (params) => request.get(`/ext/locating/queryAddressByCoordinate?coordinate=${params.coordinate}`);
export const queryAddressByCoordinate = (params) => request.get(`/ext/locating/queryCoordinateByAddress?address=${params.address}`);
export const jsSdkConfig = (params) => request.get(`/ext/js-sdk?url=${params.url}`);
export const catalog = (params) => request.post(`/dataservice/test/api?api_id=ae2bb2c9-7c10-4270-8daf-688b9a01aa19`,{});
