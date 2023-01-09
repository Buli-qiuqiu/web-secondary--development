export const dataSource = [
  ["aaa", "bbb", "ccc"],
  ["114.28590897394388", "30.569480438478557", "114.28590897394388"],
  ["114.27893240843595", "30.566033923596226", "114.28590897394388"],
  ["114.28279014079745", "30.56420130806063", "114.28590897394388"]
];
import configJson from "../../../pluginTemp/config.json"
const CUSTOM_PLUGIN_ID = configJson.id
let externalVariables = JSON.parse(localStorage.getItem(`analyzer-secondary-${CUSTOM_PLUGIN_ID}`))?.options?.externalVariables || {};
let customConfig = JSON.parse(localStorage.getItem(`analyzer-secondary-${CUSTOM_PLUGIN_ID}`))?.customConfig || {};
export let mockOptions = {
  externalVariables
};
export let mockCustomConfig = customConfig;

export const mockChangeOptions = (options) => {
  const mockData = JSON.parse(localStorage.getItem(`analyzer-secondary-${CUSTOM_PLUGIN_ID}`)) || {};
  mockData.options = options;
  localStorage.setItem(`analyzer-secondary-${CUSTOM_PLUGIN_ID}`, JSON.stringify(mockData));
};

export const mockChangeCustomConfig = (customConfig) => {
  const mockData = JSON.parse(localStorage.getItem(`analyzer-secondary-${CUSTOM_PLUGIN_ID}`)) || {};
  mockData.customConfig = customConfig;
  localStorage.setItem(`analyzer-secondary-${CUSTOM_PLUGIN_ID}`, JSON.stringify(mockData));
};

export default {
  dataSource
};