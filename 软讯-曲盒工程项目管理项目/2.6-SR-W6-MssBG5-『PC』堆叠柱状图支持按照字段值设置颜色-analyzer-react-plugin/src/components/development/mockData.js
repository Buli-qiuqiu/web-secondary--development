export const dataSource = [
  // ["name", "任务状态", "num"],
  // ["深化", "已完成", "20"],
  // ["深化", "未完成", "20"],
  // ["数据中心", "未完成", ""],
  // ["数据中心", "已完成", "2"],
  // ["技术调试", "已完成", "5"],
  // ["技术调试", "待处理", "1"],
  ["name", "已完成", "未完成", "待执行"],
  ["深化", null, "20", "5"],
  ["综合管网", null, "20", "5"],
  ["数据中心", null, null, "5"],
  ["设备安装", null, "2", null],
  ["技术调试", null, "5", "5"],
];

const CUSTOM_PLUGIN_ID = process.env.CUSTOM_PLUGIN_ID;
let externalVariables =
  JSON.parse(localStorage.getItem(`analyzer-secondary-${CUSTOM_PLUGIN_ID}`))
    ?.options?.externalVariables || {};
let customConfig =
  JSON.parse(localStorage.getItem(`analyzer-secondary-${CUSTOM_PLUGIN_ID}`))
    ?.customConfig || {};
export let mockOptions = {
  externalVariables,
};
export let mockCustomConfig = customConfig;

export const mockChangeOptions = (options) => {
  const mockData =
    JSON.parse(
      localStorage.getItem(`analyzer-secondary-${CUSTOM_PLUGIN_ID}`)
    ) || {};
  mockData.options = options;
  localStorage.setItem(
    `analyzer-secondary-${CUSTOM_PLUGIN_ID}`,
    JSON.stringify(mockData)
  );
};

export const mockChangeCustomConfig = (customConfig) => {
  const mockData =
    JSON.parse(
      localStorage.getItem(`analyzer-secondary-${CUSTOM_PLUGIN_ID}`)
    ) || {};
  mockData.customConfig = customConfig;
  localStorage.setItem(
    `analyzer-secondary-${CUSTOM_PLUGIN_ID}`,
    JSON.stringify(mockData)
  );
};

export default {
  dataSource,
  mockCustomConfig,
  mockOptions,
  mockChangeOptions,
  mockChangeCustomConfig,
};
