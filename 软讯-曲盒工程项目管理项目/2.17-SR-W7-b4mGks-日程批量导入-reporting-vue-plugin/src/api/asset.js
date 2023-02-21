import request from "./request";

/**
 * 查询资产
 * @param id 资产ID
 *
 */
export const queryAssetById = (id, count = 200) =>
  request.post(`/asset/getAssetData?asset_id=${id}&count=${count}`, { filters: [] });

/**
* 上传文件
* @param projectId 资产ID
* @param param 文件流
*
*/
export const postFile = (param) =>
  request.post(`/RXQHBatchInsert/importExcel?sub_system_id=${param.sub_system_id}&executor_id=${param.executor_id}&project_id=${param.project_id}`, param.formData);
