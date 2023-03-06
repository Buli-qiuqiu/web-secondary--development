import request from "./request";

/**
 * 查询资产
 * @param id 资产ID
 *
 */
export const defalutListApi = (params) => request.get(`/ext/fagaiwei/retrieval/list/latest`, { params });
export const getHistoryList = (params) => request.get(`/ext/fagaiwei/retrieval/record/list`, { params });
export const getColletList = () => request.get(`/retrieval/favorites/list`);
export const searchListApi = (params, data) => request.post(`/ext/fagaiwei/retrieval/list/query?asset_id=${params.asset_id}`, data);
export const downloadWord = (params, data) => request.post(`/ext/fagaiwei/retrieval/list/download?asset_id=${params.asset_id}`, data);
export const addLook = (data) => request.post(`/ext/fagaiwei/retrieval/record/add`, data);
