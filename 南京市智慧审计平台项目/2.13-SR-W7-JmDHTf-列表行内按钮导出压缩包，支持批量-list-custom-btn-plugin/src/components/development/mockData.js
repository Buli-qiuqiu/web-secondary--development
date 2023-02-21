const CONFIG_JSON_ID = process.env.CONFIG_JSON_ID;
let customConfig = JSON.parse(localStorage.getItem(`data-form-list-secondary-${CONFIG_JSON_ID}`))?.customConfig || {};
export let mockCustomConfig = customConfig;

export const mockChangeCustomConfig = (customConfig) => {
  const mockData = JSON.parse(localStorage.getItem(`data-form-list-secondary-${CONFIG_JSON_ID}`)) || {};
  mockData.customConfig = customConfig;
  localStorage.setItem(`data-form-list-secondary-${CONFIG_JSON_ID}`, JSON.stringify(mockData));
};

