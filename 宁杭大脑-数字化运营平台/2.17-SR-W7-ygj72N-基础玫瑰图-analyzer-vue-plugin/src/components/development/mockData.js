export const dataSource = [
  [
    "coder",
    "hours"
  ],
  [
    "18061608667",
    3
  ],
  [
    "20220707095503001",
    12
  ],
  [
    "18061608667",
    8
  ],
  [
    null,
    5
  ],
  [
    "刘畅",
    3
  ],
  [
    "13357808376",
    9
  ],
  [
    "拉登",
    2
  ],
  [
    "拉登",
    4
  ],
  [
    "数睿数据",
    2
  ],
  [
    "18061608667",
    13
  ],
  [
    "13770327992",
    2
  ]
];
import configJson from "../../../pluginTemp/config.json"
const CONFIG_JSON_ID = configJson.id
let externalVariables = JSON.parse(localStorage.getItem(`analyzer-secondary-${CONFIG_JSON_ID}`))?.options?.externalVariables || {};
let customConfig = JSON.parse(localStorage.getItem(`analyzer-secondary-${CONFIG_JSON_ID}`))?.customConfig || {};
export let mockOptions = {
  externalVariables
};
export let mockCustomConfig = customConfig;

export const mockChangeOptions = (options) => {
  const mockData = JSON.parse(localStorage.getItem(`analyzer-secondary-${CONFIG_JSON_ID}`)) || {};
  mockData.options = options;
  localStorage.setItem(`analyzer-secondary-${CONFIG_JSON_ID}`, JSON.stringify(mockData));
};

export const mockChangeCustomConfig = (customConfig) => {
  const mockData = JSON.parse(localStorage.getItem(`analyzer-secondary-${CONFIG_JSON_ID}`)) || {};
  mockData.customConfig = customConfig;
  localStorage.setItem(`analyzer-secondary-${CONFIG_JSON_ID}`, JSON.stringify(mockData));
};

export default {
  dataSource
};