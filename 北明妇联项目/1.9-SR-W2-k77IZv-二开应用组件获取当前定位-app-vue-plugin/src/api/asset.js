import request from "./request";

/**
 * 查询资产
 * @param id 资产ID
 *
 */
 export const requeryAddressByCoordinate = (params) => request.get(`/ext/locating/queryAddressByCoordinate?coordinate=${params.coordinate}`);
 export const jsSdkConfig = (params) => request.get(`/ext/js-sdk?url=${params.url}`);
