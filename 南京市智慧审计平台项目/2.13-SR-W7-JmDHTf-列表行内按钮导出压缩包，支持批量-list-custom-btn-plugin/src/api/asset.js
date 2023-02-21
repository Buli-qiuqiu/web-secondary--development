import request from "./request";

/**
 * 查询资产
 * @param id 资产ID
 *
 */
export const exportZip = (data) =>
  request.post(`/ZHSJExportZip/exportZip`, data, { responseType: "blob" });
